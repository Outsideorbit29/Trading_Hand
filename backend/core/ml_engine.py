import MetaTrader5 as mt5
import pandas as pd
import numpy as np
import pandas_ta as ta
import joblib
import os
import logging

# Path configuration
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'bot_model_v2.joblib')

class MLEngine:
    def __init__(self):
        self.model_data = None
        self.features_list = []
        self._load_model()
        self.structures = {}

    def analyze_structure(self, df):
        """Identifies HH, HL, LH, LL and BOS/CHOCH."""
        df['hh'] = (df['high'] > df['high'].shift(1)) & (df['high'] > df['high'].shift(-1))
        df['ll'] = (df['low'] < df['low'].shift(1)) & (df['low'] < df['low'].shift(-1))
        
        # Simple BOS/CHOCH logic based on recent swings
        last_high = df[df['hh']]['high'].tail(2).values
        last_low = df[df['ll']]['low'].tail(2).values
        
        trend = "Neutral"
        if len(last_high) >= 2 and last_high[1] > last_high[0]: trend = "Bullish"
        if len(last_low) >= 2 and last_low[1] < last_low[0]: trend = "Bearish"
        
        return trend

    def detect_fvg(self, df):
        """Identifies Fair Value Gaps (Imbalance)."""
        fvg = []
        if len(df) < 3: return fvg
        
        # Check gap between candle 1 high and candle 3 low (Bullish FVG)
        # Check gap between candle 1 low and candle 3 high (Bearish FVG)
        for i in range(len(df)-2):
            if df['high'].iloc[i] < df['low'].iloc[i+2]:
                fvg.append({"type": "bullish", "top": df['low'].iloc[i+2], "bottom": df['high'].iloc[i], "index": i+1})
            if df['low'].iloc[i] > df['high'].iloc[i+2]:
                fvg.append({"type": "bearish", "top": df['low'].iloc[i], "bottom": df['high'].iloc[i+2], "index": i+1})
        return fvg

    def get_candle_strength(self, candle):
        """Analyzes raw candle strength and wicks."""
        body = abs(candle['close'] - candle['open'])
        full_range = candle['high'] - candle['low']
        if full_range == 0: return "weak"
        
        upper_wick = candle['high'] - max(candle['open'], candle['close'])
        lower_wick = min(candle['open'], candle['close']) - candle['low']
        
        if body / full_range > 0.6: return "strong"
        if upper_wick / full_range > 0.4: return "selling_pressure"
        if lower_wick / full_range > 0.4: return "buying_pressure"
        return "choppy"

    def detect_liquidity_sweep(self, df):
        """Detects if recent price swept a previous swing but failed to close beyond."""
        if len(df) < 10: return None
        prev_high = df['high'].iloc[-10:-1].max()
        prev_low = df['low'].iloc[-10:-1].min()
        
        curr = df.iloc[-1]
        if curr['high'] > prev_high and curr['close'] < prev_high:
            return "BSL_Sweep"
        if curr['low'] < prev_low and curr['close'] > prev_low:
            return "SSL_Sweep"
        return None

    def analyze_smc_setup(self, symbol, timeframe=mt5.TIMEFRAME_M15):
        """Master logic for SMC + Price Action confirmation following 14-step framework."""
        try:
            # 11. Multi-Timeframe Logic (HTF Trend Bias)
            htf_rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_H1, 0, 50)
            if htf_rates is None: return None
            htf_trend = self.analyze_structure(pd.DataFrame(htf_rates))
            
            # LTF Execution
            mt5.symbol_select(symbol, True)
            rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, 100)
            if rates is None or len(rates) < 50: return None
            
            df = pd.DataFrame(rates)
            ltf_trend = self.analyze_structure(df)
            fvg_zones = self.detect_fvg(df)
            sweep = self.detect_liquidity_sweep(df)
            
            # 2. Price Action Foundation
            last_three = df.tail(3)
            strength = self.get_candle_strength(last_three.iloc[-1])
            
            # Engulfing Detect
            is_bullish_engulfing = (last_three.iloc[-1]['close'] > last_three.iloc[-2]['open']) and (last_three.iloc[-2]['close'] < last_three.iloc[-2]['open'])
            is_bearish_engulfing = (last_three.iloc[-1]['close'] < last_three.iloc[-2]['open']) and (last_three.iloc[-2]['close'] > last_three.iloc[-2]['open'])
            
            # Confluence Logic
            confidence = 0
            if ltf_trend == htf_trend: confidence += 15 # HTF Alignment
            if sweep: confidence += 30
            if any(f['type'] == 'bullish' for f in fvg_zones[-10:]) and ltf_trend == "Bullish": confidence += 15
            if is_bullish_engulfing or is_bearish_engulfing: confidence += 20
            if strength == "strong": confidence += 10
            
            signal = None
            if sweep == "SSL_Sweep" and (is_bullish_engulfing or strength == "buying_pressure"): 
                if htf_trend != "Bearish": signal = "buy"
            if sweep == "BSL_Sweep" and (is_bearish_engulfing or strength == "selling_pressure"):
                if htf_trend != "Bullish": signal = "sell"
            
            if signal and confidence > 75:
                return {
                    "htf_trend": htf_trend,
                    "ltf_structure": ltf_trend,
                    "liquidity_zone": sweep,
                    "poi": f"FVG Detected" if fvg_zones else "Order Block",
                    "signal_type": "Engulfing" if (is_bullish_engulfing or is_bearish_engulfing) else strength,
                    "entry_type": "Reversal" if sweep else "Continuation",
                    "sl": df['low'].iloc[-5:].min() - (df['close'].iloc[-1]*0.001) if signal == "buy" else df['high'].iloc[-5:].max() + (df['close'].iloc[-1]*0.001),
                    "tp": df['close'].iloc[-1] + (abs(df['close'].iloc[-1] - df['low'].iloc[-5:].min()) * 2) if signal == "buy" else df['close'].iloc[-1] - (abs(df['high'].iloc[-5:].max() - df['close'].iloc[-1]) * 2),
                    "rr": "1:2",
                    "confidence": confidence,
                    "signal": signal
                }
            return None
        except Exception as e:
            logging.error(f"SMC Framework Error: {e}")
            return None

    def get_detailed_report(self, symbol):
        """Returns the final formatted performance output."""
        setup = self.analyze_smc_setup(symbol)
        if not setup: return "NO TRADE – LOW PROBABILITY"
        
        return f"""
===========================
SMC + PRICE ACTION REPORT
===========================
HTF Trend: {setup['htf_trend']}
LTF Structure: {setup['ltf_structure']}
Liquidity Zones: {setup['liquidity_zone']}
POI: {setup['poi']}
Price Action Signal: {setup['signal_type']}
Entry Type: {setup['entry_type']}
Stop Loss: {setup['sl']:.5f}
Take Profit: {setup['tp']:.5f}
Risk/Reward: {setup['rr']}
Confidence Score: {setup['confidence']}
==========================="""
    
    def _load_model(self):
        """Loads the trained universal model."""
        if os.path.exists(MODEL_PATH):
            try:
                self.model_data = joblib.load(MODEL_PATH)
                self.features_list = self.model_data['features']
                logging.info(f"✅ Universal Neural Model Loaded! (Target Assets: {len(self.features_list)} Features)")
            except Exception as e:
                logging.error(f"❌ Error loading model: {e}")
        else:
            logging.warning("⚠️ No model found in /models. Universal signals will be unavailable.")

    def prepare_features(self, df):
        """Prepares technical indicators for prediction."""
        df['ema9'] = ta.ema(df['close'], length=9)
        df['ema15'] = ta.ema(df['close'], length=15)
        df['rsi'] = ta.rsi(df['close'], length=14)
        df['atr'] = ta.atr(df['high'], df['low'], df['close'], length=14)
        macd = ta.macd(df['close'])
        df['macd'] = macd['MACD_12_26_9']
        df['macd_signal'] = macd['MACDs_12_26_9']
        df['ema_diff'] = df['ema9'] - df['ema15']
        df['ema_cross'] = np.where(df['ema9'] > df['ema15'], 1, -1)
        df['volatility'] = df['close'].rolling(20).std() / df['close']
        df['ema9_slope'] = df['ema9'].diff(3)
        df['ema15_slope'] = df['ema15'].diff(3)
        
        df['time_dt'] = pd.to_datetime(df['time'], unit='s')
        df['hour'] = df['time_dt'].dt.hour
        df['day_of_week'] = df['time_dt'].dt.dayofweek
        
        return df.dropna()

    def predict_signal(self, symbol, timeframe=mt5.TIMEFRAME_M15):
        """Uses combined SMC + Neural Prediction for highest probability."""
        smc_setup = self.analyze_smc_setup(symbol, timeframe)
        
        if smc_setup:
            logging.info(f"💎 SMC SETUP DETECTED for {symbol}: {smc_setup['signal'].upper()} (Conf: {smc_setup['confidence']})")
            return smc_setup['signal']
            
        # Fallback to Neural if no clear SMC trap is found
        if not self.model_data:
            return None
        
        try:
            mt5.symbol_select(symbol, True)
            rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, 100)
            if rates is None or len(rates) < 50: return None
            
            df = pd.DataFrame(rates)
            df = self.prepare_features(df)
            
            if df.empty: return None
            
            latest_features = df[self.features_list].iloc[-1:].values
            prediction = self.model_data['model'].predict(latest_features)[0]
            
            if prediction == 2: return "buy"
            elif prediction == 0: return "sell"
            return None
            
        except Exception as e:
            logging.error(f"❌ Prediction error for {symbol}: {e}")
            return None

# Global instance
engine = MLEngine()
