import MetaTrader5 as mt5
from datetime import datetime
import pandas as pd
import time
import threading
import logging

logging.basicConfig(level=logging.INFO)

# MT5 credentials (kept here so the server only starts the bot when requested)
LOGIN = 279539215
PASSWORD = 'Anish@123'
SERVER = 'Exness-MT5Trial8'

# Bot state
bot_state = {
	'is_running': False,
	'status': 'stopped',
	'last_trade': None,
	'trades_executed': 0,
	'current_direction': None,
	'error': None,
	'trades': []
}

_bot_thread = None
_mt5_connected = False

def initialize_mt5():
	global _mt5_connected
	try:
		if not mt5.initialize():
			logging.info('Initializing MT5 failed, attempting initialize()')
		logged_in = mt5.login(LOGIN, PASSWORD, SERVER)
		if not logged_in:
			logging.error('MT5 login failed')
			_mt5_connected = False
			return False
		logging.info('✅ MT5 Connected')
		_mt5_connected = True
		return True
	except Exception as e:
		logging.error(f'❌ MT5 Connection Failed: {e}')
		_mt5_connected = False
		return False


def sync_mt5_positions():
	try:
		positions = mt5.positions_get()
		if positions:
				for pos in positions:
					pos_id = f"mt5-{pos.ticket}"
					existing = any(t['id'] == pos_id for t in bot_state['trades'])
					if not existing:
						trade = {
							'id': pos_id,
							'symbol': pos.symbol,
							'direction': 'buy' if pos.type == mt5.ORDER_TYPE_BUY else 'sell',
							'entryPrice': float(pos.price_open),
							'quantity': pos.volume,
							'timestamp': datetime.fromtimestamp(pos.time).isoformat(),
							'status': 'open',
							'source': 'mt5',
							'ticket': pos.ticket,
							'currentPrice': float(pos.price_current),
							'profit': float(pos.profit)
						}
						bot_state['trades'].append(trade)
		return True
	except Exception as e:
		logging.error(f'Error syncing MT5 positions: {e}')
		return False


def sync_mt5_deals():
	try:
		deals = mt5.history_deals_get(datetime(2020, 1, 1), datetime.now())
		if deals:
			for deal in deals:
				if deal.entry in [mt5.DEAL_ENTRY_OUT, mt5.DEAL_ENTRY_INOUT]:
					trade_id = f"mt5-closed-{deal.ticket}"
					existing = any(t['id'] == trade_id for t in bot_state['trades'])
					if not existing:
						closed_trade = {
							'id': trade_id,
							'symbol': deal.symbol,
							'direction': 'buy' if deal.type == mt5.DEAL_TYPE_BUY else 'sell',
							'entryPrice': float(deal.price),
							'exitPrice': float(deal.price),
							'quantity': deal.volume,
							'timestamp': datetime.fromtimestamp(deal.time).isoformat(),
							'status': 'closed',
							'source': 'bot',
							'pnl': float(deal.profit),
							'commission': float(deal.commission)
						}
						bot_state['trades'].append(closed_trade)
		return True
	except Exception as e:
		logging.error(f'Error syncing MT5 deals: {e}')
		return False


# Bot parameters
symbol = "BTCUSD"
lot = 1.0


def get_ema_status():
	try:
		rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M15, 0, 50)
		df = pd.DataFrame(rates)
		df['ema9'] = df['close'].ewm(span=9).mean()
		df['ema15'] = df['close'].ewm(span=15).mean()
		latest = df.iloc[-1]
		if latest['ema9'] > latest['ema15']:
			return "buy"
		elif latest['ema9'] < latest['ema15']:
			return "sell"
		return None
	except Exception as e:
		logging.error(f'Error in get_ema_status: {e}')
		return None


def get_5min_confirmation(direction):
	try:
		rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M5, 0, 3)
		df = pd.DataFrame(rates)
		prev = df.iloc[-2]
		curr = df.iloc[-1]

		if direction == "buy" and curr['close'] > prev['high']:
			return True, curr['close'], prev['low']
		elif direction == "sell" and curr['close'] < prev['low']:
			return True, curr['close'], prev['high']
		return False, None, None
	except Exception as e:
		logging.error(f'Error in get_5min_confirmation: {e}')
		return False, None, None


def place_trade(direction, entry_price, sl_price, tp_price):
	try:
		order_type = mt5.ORDER_TYPE_BUY if direction == "buy" else mt5.ORDER_TYPE_SELL
		request_obj = {
			"action": mt5.TRADE_ACTION_DEAL,
			"symbol": symbol,
			"volume": lot,
			"type": order_type,
			"price": mt5.symbol_info_tick(symbol).ask if direction == "buy" else mt5.symbol_info_tick(symbol).bid,
			"sl": sl_price,
			"tp": tp_price,
			"deviation": 20,
			"magic": 234000,
			"comment": f"{direction} trade",
			"type_time": mt5.ORDER_TIME_GTC,
			"type_filling": mt5.ORDER_FILLING_IOC,
		}
		result = mt5.order_send(request_obj)
		if result.retcode != mt5.TRADE_RETCODE_DONE:
			logging.error(f"❌ Order Failed: {result.retcode}")
			return False
		else:
			logging.info(f"✅ {direction.capitalize()} Order Placed: Entry={entry_price}, SL={sl_price}, TP={tp_price}")
			bot_state['trades_executed'] += 1
			bot_state['last_trade'] = {
				'direction': direction,
				'entry': entry_price,
				'sl': sl_price,
				'tp': tp_price,
				'timestamp': datetime.now().isoformat()
			}
			bot_state['trades'].append({
				'id': f"bot-{bot_state['trades_executed']}",
				'symbol': symbol,
				'direction': direction,
				'entryPrice': float(entry_price),
				'quantity': lot,
				'timestamp': datetime.now().isoformat(),
				'status': 'open',
				'source': 'bot'
			})
			return True
	except Exception as e:
		logging.error(f"Error placing trade: {e}")
		bot_state['error'] = str(e)
		return False


def bot_loop():
	logging.info("📈 Starting Trend-Based Bot...")
	last_trade_time = None
	cooldown_minutes = 1

	while bot_state['is_running']:
		try:
			now = datetime.now()
			direction = get_ema_status()
			bot_state['current_direction'] = direction
			logging.info(f"[{now.strftime('%H:%M:%S')}] Trend Direction (15m): {direction}")

			if direction:
				if last_trade_time and (now - last_trade_time).total_seconds() < cooldown_minutes * 60:
					logging.info("⏳ Waiting for cooldown...")
				else:
					confirmed, entry, stop = get_5min_confirmation(direction)
					logging.info(f"Confirmation: {confirmed}, Entry={entry}, SL={stop}")
					if confirmed:
						risk = abs(entry - stop)
						tp = entry + 2 * risk if direction == "buy" else entry - 3 * risk
						if place_trade(direction, entry, stop, tp):
							last_trade_time = now

			time.sleep(15)
		except Exception as e:
			logging.error(f"Error in bot loop: {e}")
			bot_state['error'] = str(e)
			time.sleep(5)


def start():
	global _bot_thread, _mt5_connected
	if bot_state['is_running']:
		return False, 'Bot is already running'

	# Initialize MT5 connection when starting the bot
	if not _mt5_connected:
		ok = initialize_mt5()
		if not ok:
			return False, 'Failed to connect to MT5'

	bot_state['is_running'] = True
	bot_state['status'] = 'running'
	bot_state['error'] = None
	_bot_thread = threading.Thread(target=bot_loop, daemon=True)
	_bot_thread.start()
	return True, 'Bot started successfully'


def stop():
	if not bot_state['is_running']:
		return False, 'Bot is already stopped'
	bot_state['is_running'] = False
	bot_state['status'] = 'stopped'
	return True, 'Bot stopped successfully'


def get_status():
	return {
		'status': 'running' if bot_state['is_running'] else 'stopped',
		'trades_executed': bot_state['trades_executed'],
		'current_direction': bot_state['current_direction'],
		'last_trade': bot_state['last_trade'],
		'error': bot_state['error']
	}


def get_trades():
	bot_state['trades'].clear()
	# Sync open positions
	try:
		sync_mt5_positions()
		sync_mt5_deals()
	except Exception:
		pass
	return bot_state['trades']


# Manual trades removed. Manual trade support is no longer available.


def get_trade_history(start_date=None):
	try:
		start = start_date or datetime(2020, 1, 1)
		deals = mt5.history_deals_get(start, datetime.now())
		closed_trades = []
		if deals:
			for deal in deals:
				if deal.entry == mt5.DEAL_ENTRY_OUT:
					trade_id = f"mt5-closed-{deal.ticket}"
					if not any(t['id'] == trade_id for t in closed_trades):
						closed_trade = {
							'id': trade_id,
							'symbol': deal.symbol,
							'direction': 'buy' if deal.type == mt5.DEAL_TYPE_BUY else 'sell',
							'entryPrice': float(deal.price),
							'exitPrice': float(deal.price),
							'quantity': deal.volume,
							'timestamp': datetime.fromtimestamp(deal.time).isoformat(),
							'status': 'closed',
							'source': 'bot',
							'pnl': float(deal.profit),
							'commission': float(deal.commission)
						}
						closed_trades.append(closed_trade)
		return closed_trades
	except Exception as e:
		logging.error(f"Error fetching trade history: {e}")
		return []


def get_risk_analysis():
	"""Calculate risk metrics based on trade history"""
	try:
		trades = get_trade_history()
		if not trades:
			return {
				'win_rate': 0,
				'profit_factor': 0,
				'expected_value': 0,
				'max_drawdown': 0,
				'sharpe_ratio': 0,
				'consecutive_losses': 0,
				'prob_profitable_100': 0,
				'avg_win': 0,
				'avg_loss': 0
			}

		pnls = [t['pnl'] for t in trades]
		wins = [p for p in pnls if p > 0]
		losses = [abs(p) for p in pnls if p < 0]

		win_rate = len(wins) / len(pnls) if pnls else 0
		total_profit = sum(wins)
		total_loss = sum(losses)
		profit_factor = total_profit / total_loss if total_loss > 0 else (total_profit if total_profit > 0 else 0)

		avg_win = sum(wins) / len(wins) if wins else 0
		avg_loss = sum(losses) / len(losses) if losses else 0

		# Expected Value
		ev = (win_rate * avg_win) - ((1 - win_rate) * avg_loss)

		# Max Drawdown
		cumulative = 0
		peak = 0
		max_dd = 0
		for p in pnls:
			cumulative += p
			if cumulative > peak:
				peak = cumulative
			dd = peak - cumulative
			if dd > max_dd:
				max_dd = dd

		# Sharpe Ratio (Simplified)
		df = pd.Series(pnls)
		sharpe = (df.mean() / df.std()) if len(df) > 1 and df.std() != 0 else 0

		# Consecutive losses
		max_consecutive_losses = 0
		current_consecutive_losses = 0
		for p in pnls:
			if p < 0:
				current_consecutive_losses += 1
				max_consecutive_losses = max(max_consecutive_losses, current_consecutive_losses)
			else:
				current_consecutive_losses = 0

		# Simple Probability of being profitable after 100 trades (using Normal Distribution approximation)
		# Mean of 100 trades = 100 * EV
		# Std dev of 100 trades = sqrt(100) * std(pnls)
		import math
		from scipy.stats import norm
		
		prob_profitable = 0
		if len(pnls) > 1:
			mean_100 = 100 * ev
			std_100 = math.sqrt(100) * df.std()
			if std_100 > 0:
				# Probability that sum > 0 is 1 - CDF(0)
				prob_profitable = 1 - norm.cdf(0, loc=mean_100, scale=std_100)
			else:
				prob_profitable = 1.0 if mean_100 > 0 else 0.0

		return {
			'win_rate': round(win_rate * 100, 2),
			'profit_factor': round(profit_factor, 2),
			'expected_value': round(ev, 2),
			'max_drawdown': round(max_dd, 2),
			'sharpe_ratio': round(sharpe, 2),
			'consecutive_losses': max_consecutive_losses,
			'prob_profitable_100': round(prob_profitable * 100, 2),
			'avg_win': round(avg_win, 2),
			'avg_loss': round(avg_loss, 2),
			'total_trades': len(pnls)
		}
	except Exception as e:
		logging.error(f"Error in risk analysis: {e}")
		return {}






