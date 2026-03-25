from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os
import sys

# Ensure the core directory is in the path so we can import modules from it
sys.path.append(os.path.join(os.path.dirname(__file__), 'core'))
import bot_script

# Initialize Flask app with CORS
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Bot behavior is provided by `bot_script`. MT5 connection and bot state
# are initialized only when the bot is started via the frontend.

# Server delegates all bot/MT5 logic to `bot_script`.

# === Flask Routes ===

@app.route('/status', methods=['GET'])
def get_status():
    """Get current bot status"""
    return jsonify(bot_script.get_status())

@app.route('/trades', methods=['GET'])
def get_trades():
    """Get all trades (bot trades + MT5 positions + closed deals)"""
    trades = bot_script.get_trades()
    return jsonify({'trades': trades})

@app.route('/trades/history', methods=['GET'])
def get_trade_history():
    """Get closed trades from MT5"""
    # Delegate to bot_script
    trades = bot_script.get_trade_history(datetime(2025, 1, 1))
    return jsonify({'trades': trades})

@app.route('/risk-analysis', methods=['GET'])
def get_risk_analysis():
    """Get risk analysis metrics"""
    timeframe = request.args.get('timeframe', 'all')
    analysis = bot_script.get_risk_analysis(timeframe=timeframe)
    return jsonify(analysis)

@app.route('/model-metadata', methods=['GET'])
def get_model_metadata():
    """Get ML model training metadata"""
    return jsonify(bot_script.get_model_metadata())

@app.route('/start', methods=['POST'])
def start_bot():
    """Start the trading bot"""
    ok, message = bot_script.start()
    if not ok:
        return jsonify({'message': message, 'status': 'stopped'}), 400
    return jsonify({'message': message, 'status': 'running'})

@app.route('/stop', methods=['POST'])
def stop_bot():
    """Stop the trading bot"""
    ok, message = bot_script.stop()
    if not ok:
        return jsonify({'message': message, 'status': 'running'}), 400
    return jsonify({'message': message, 'status': 'stopped'})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

from dotenv import load_dotenv

# Load env variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Flask server on http://{host}:{port}")
    app.run(debug=debug, host=host, port=port, threaded=True)