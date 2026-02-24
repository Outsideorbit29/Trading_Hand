from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
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

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=False, host='127.0.0.1', port=5000, threaded=True)