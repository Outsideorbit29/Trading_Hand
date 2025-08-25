import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, LinkIcon, ServerIcon } from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';
import BrokerList from '../components/BrokerList';
import BrokerAuthModal from '../components/BrokerAuthModal';
import MT5ConnectionModal from '../components/MT5ConnectionModal';
import MT5AccountCard from '../components/MT5AccountCard';
import { mt5BrokerService } from '../services/mt5BrokerService';

export default function Brokers() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMT5ModalOpen, setIsMT5ModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [mt5Accounts, setMT5Accounts] = useState<any[]>([]);
  const [mt5Loading, setMt5Loading] = useState(false);
  const [mt5ServiceError, setMt5ServiceError] = useState<string | null>(null);
  const { brokers, loading } = usePortfolio();
  const { isGuest } = useAuth();

  React.useEffect(() => {
    if (!isGuest) {
      loadMT5Accounts();
    }
  }, [isGuest]);

  const loadMT5Accounts = async () => {
    try {
      setMt5Loading(true);
      setMt5ServiceError(null);
      
      const accounts = await mt5BrokerService.getAllConnectedAccounts();
      setMT5Accounts(accounts);
      setMt5ServiceError(null);
    } catch (error) {
      console.error('Failed to load MT5 accounts:', error);
      setMt5ServiceError('MT5 service is not running. Please start the Python Flask server by running: python mt5_broker_service.py');
      setMT5Accounts([]);
    } finally {
      setMt5Loading(false);
    }
  };

  const handleMT5Success = (accountData: any) => {
    loadMT5Accounts();
  };

  const handleMT5Disconnect = () => {
    loadMT5Accounts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleConnectBroker = (brokerType: string) => {
    if (isGuest) return;
    setSelectedBroker(brokerType);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Broker Connections</h1>
          <p className="text-gray-400">Connect and manage your trading brokers</p>
        </div>
        {isGuest && (
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              <strong>Demo Mode:</strong> Sign up to connect real brokers
            </p>
          </div>
        )}
      </motion.div>

      {!isGuest && (
        <>
          {mt5ServiceError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4"
            >
              <h3 className="text-red-400 font-medium mb-2">⚠️ MT5 Service Unavailable</h3>
              <p className="text-red-300 text-sm mb-3">
                {mt5ServiceError}
              </p>
              <div className="text-red-300 text-xs space-y-1">
                <p><strong>To fix this:</strong></p>
                <p>1. Open a terminal in your project directory</p>
                <p>2. Install dependencies: <code className="bg-red-900 px-1 rounded">pip install -r requirements.txt</code></p>
                <p>3. Start the service: <code className="bg-red-900 px-1 rounded">python mt5_broker_service.py</code></p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mt5ServiceError ? 0.1 : 0.05 }}
            className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4"
          >
            <h3 className="text-green-400 font-medium mb-2">🚀 Direct MT5 Connection</h3>
            <p className="text-green-300 text-sm mb-3">
              Connect directly to your MT5 terminal for real-time account data and trading.
            </p>
            <button
              onClick={() => setIsMT5ModalOpen(true)}
              disabled={!!mt5ServiceError}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                mt5ServiceError 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ServerIcon className="w-4 h-4 mr-2" />
              {mt5ServiceError ? 'Service Unavailable' : 'Connect MT5 Terminal'}
            </button>
          </motion.div>
        </>
      )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mt5ServiceError ? 0.15 : 0.1 }}
          className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4"
        >
          <h3 className="text-blue-400 font-medium mb-2">🚀 Quick Connect</h3>
          <p className="text-blue-300 text-sm mb-3">
            Connect your Exness MT5 account to automatically import your trades and track performance.
          </p>
          <button
            onClick={() => handleConnectBroker('exness-mt5')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span className="mr-2">🟢</span>
            Connect Exness MT5
          </button>
        </motion.div>

      {/* MT5 Connected Accounts */}
      {mt5Accounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white">Connected MT5 Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mt5Accounts.map((account, index) => (
              <MT5AccountCard
                key={`${account.connection_info.login}_${account.connection_info.server}`}
                accountData={account.account_data}
                connectionInfo={account.connection_info}
                onRefresh={loadMT5Accounts}
                onDisconnect={handleMT5Disconnect}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-xl shadow-xl p-6"
      >
        <BrokerList brokers={brokers} onConnectBroker={handleConnectBroker} />
      </motion.div>

      <BrokerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setSelectedBroker('');
        }}
        brokerType={selectedBroker}
      />

      <MT5ConnectionModal
        isOpen={isMT5ModalOpen}
        onClose={() => setIsMT5ModalOpen(false)}
        onSuccess={handleMT5Success}
      />
    </div>
  );
}