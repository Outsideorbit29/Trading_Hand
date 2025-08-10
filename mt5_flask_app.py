from flask import Flask, jsonify
import MetaTrader5 as mt5

app = Flask(__name__)

@app.route('/connect', methods=['GET'])
def connect_mt5():
    # Initialize MT5 connection
    if not mt5.initialize():
        return jsonify({'success': False, 'error': mt5.last_error()}), 500

    # Get account info
    account_info = mt5.account_info()
    if account_info is None:
        mt5.shutdown()
        return jsonify({'success': False, 'error': 'Failed to get account info'}), 500

    # Prepare account info dictionary
    info_dict = {
        'login': account_info.login,
        'name': account_info.name,
        'server': account_info.server,
        'balance': account_info.balance,
        'equity': account_info.equity,
        'margin': account_info.margin,
        'free_margin': account_info.margin_free,
        'leverage': account_info.leverage,
        'profit': account_info.profit,
    }

    mt5.shutdown()
    return jsonify({'success': True, 'account_info': info_dict})

if __name__ == '__main__':
    app.run(debug=True)
