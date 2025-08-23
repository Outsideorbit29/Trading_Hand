import MetaTrader5 as mt5
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from datetime import datetime
import threading
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class MT5BrokerService:
    def __init__(self):
        self.connected_accounts = {}
        self.account_data_cache = {}
        
    def initialize_mt5(self):
        """Initialize MT5 connection"""
        try:
            if not mt5.initialize():
                error = mt5.last_error()
                logger.error(f"MT5 initialization failed: {error}")
                return False, f"MT5 initialization failed: {error}"
            
            logger.info("MT5 initialized successfully")
            return True, "MT5 initialized successfully"
        except Exception as e:
            logger.error(f"Exception during MT5 initialization: {str(e)}")
            return False, f"Exception during MT5 initialization: {str(e)}"
    
    def connect_account(self, login, password, server):
        """Connect to MT5 account"""
        try:
            # Initialize MT5 if not already done
            success, message = self.initialize_mt5()
            if not success:
                return False, message, None
            
            # Attempt to login
            authorized = mt5.login(login=int(login), password=password, server=server)
            
            if not authorized:
                error = mt5.last_error()
                logger.error(f"Login failed for account {login}: {error}")
                return False, f"Login failed: {error}", None
            
            # Get account info
            account_info = mt5.account_info()
            if account_info is None:
                error = mt5.last_error()
                logger.error(f"Failed to get account info: {error}")
                return False, f"Failed to get account info: {error}", None
            
            # Convert account info to dict
            account_data = {
                'login': account_info.login,
                'name': account_info.name,
                'server': account_info.server,
                'balance': float(account_info.balance),
                'equity': float(account_info.equity),
                'margin': float(account_info.margin),
                'free_margin': float(account_info.margin_free),
                'leverage': account_info.leverage,
                'profit': float(account_info.profit),
                'currency': account_info.currency,
                'company': account_info.company,
                'connected_at': datetime.now().isoformat()
            }
            
            # Store connection info
            account_key = f"{login}_{server}"
            self.connected_accounts[account_key] = {
                'login': login,
                'server': server,
                'connected': True,
                'last_update': datetime.now().isoformat()
            }
            
            self.account_data_cache[account_key] = account_data
            
            logger.info(f"Successfully connected to account {login} on {server}")
            return True, "Account connected successfully", account_data
            
        except Exception as e:
            logger.error(f"Exception during account connection: {str(e)}")
            return False, f"Connection failed: {str(e)}", None
    
    def get_account_info(self, login, server):
        """Get current account information"""
        try:
            account_key = f"{login}_{server}"
            
            if account_key not in self.connected_accounts:
                return False, "Account not connected", None
            
            # Get fresh account info
            account_info = mt5.account_info()
            if account_info is None:
                error = mt5.last_error()
                return False, f"Failed to get account info: {error}", None
            
            account_data = {
                'login': account_info.login,
                'name': account_info.name,
                'server': account_info.server,
                'balance': float(account_info.balance),
                'equity': float(account_info.equity),
                'margin': float(account_info.margin),
                'free_margin': float(account_info.margin_free),
                'leverage': account_info.leverage,
                'profit': float(account_info.profit),
                'currency': account_info.currency,
                'company': account_info.company,
                'last_update': datetime.now().isoformat()
            }
            
            # Update cache
            self.account_data_cache[account_key] = account_data
            
            return True, "Account info retrieved", account_data
            
        except Exception as e:
            logger.error(f"Exception getting account info: {str(e)}")
            return False, f"Failed to get account info: {str(e)}", None
    
    def disconnect_account(self, login, server):
        """Disconnect from MT5 account"""
        try:
            account_key = f"{login}_{server}"
            
            if account_key in self.connected_accounts:
                del self.connected_accounts[account_key]
            
            if account_key in self.account_data_cache:
                del self.account_data_cache[account_key]
            
            # If no more accounts connected, shutdown MT5
            if not self.connected_accounts:
                mt5.shutdown()
                logger.info("MT5 shutdown - no more connected accounts")
            
            return True, "Account disconnected successfully"
            
        except Exception as e:
            logger.error(f"Exception during disconnect: {str(e)}")
            return False, f"Disconnect failed: {str(e)}"
    
    def get_all_connected_accounts(self):
        """Get all connected accounts with their data"""
        result = []
        for account_key, connection_info in self.connected_accounts.items():
            account_data = self.account_data_cache.get(account_key, {})
            result.append({
                'connection_info': connection_info,
                'account_data': account_data
            })
        return result

# Initialize service
mt5_service = MT5BrokerService()

@app.route('/api/mt5/connect', methods=['POST'])
def connect_mt5_account():
    """Connect to MT5 account"""
    try:
        data = request.get_json()
        login = data.get('login')
        password = data.get('password')
        server = data.get('server')
        
        if not all([login, password, server]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: login, password, server'
            }), 400
        
        success, message, account_data = mt5_service.connect_account(login, password, server)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'account_data': account_data
            })
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        logger.error(f"API error in connect_mt5_account: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/mt5/account-info', methods=['GET'])
def get_account_info():
    """Get account information"""
    try:
        login = request.args.get('login')
        server = request.args.get('server')
        
        if not all([login, server]):
            return jsonify({
                'success': False,
                'error': 'Missing required parameters: login, server'
            }), 400
        
        success, message, account_data = mt5_service.get_account_info(login, server)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'account_data': account_data
            })
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        logger.error(f"API error in get_account_info: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/mt5/disconnect', methods=['POST'])
def disconnect_mt5_account():
    """Disconnect from MT5 account"""
    try:
        data = request.get_json()
        login = data.get('login')
        server = data.get('server')
        
        if not all([login, server]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: login, server'
            }), 400
        
        success, message = mt5_service.disconnect_account(login, server)
        
        return jsonify({
            'success': success,
            'message': message
        })
        
    except Exception as e:
        logger.error(f"API error in disconnect_mt5_account: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/mt5/accounts', methods=['GET'])
def get_all_accounts():
    """Get all connected accounts"""
    try:
        accounts = mt5_service.get_all_connected_accounts()
        return jsonify({
            'success': True,
            'accounts': accounts
        })
        
    except Exception as e:
        logger.error(f"API error in get_all_accounts: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/mt5/status', methods=['GET'])
def get_mt5_status():
    """Get MT5 connection status"""
    try:
        # Check if MT5 is initialized
        terminal_info = mt5.terminal_info()
        if terminal_info is None:
            return jsonify({
                'success': True,
                'status': 'disconnected',
                'message': 'MT5 not initialized'
            })
        
        return jsonify({
            'success': True,
            'status': 'connected',
            'terminal_info': {
                'name': terminal_info.name,
                'version': terminal_info.version,
                'build': terminal_info.build,
                'connected': terminal_info.connected,
                'company': terminal_info.company
            }
        })
        
    except Exception as e:
        logger.error(f"API error in get_mt5_status: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting MT5 Broker Service...")
    print("Make sure MetaTrader 5 is installed and running")
    app.run(host='0.0.0.0', port=5001, debug=True)