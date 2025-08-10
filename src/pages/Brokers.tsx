import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, LinkIcon } from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';
import BrokerList from '../components/BrokerList';
import BrokerAuthModal from '../components/BrokerAuthModal';

export default function Brokers() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const { brokers, loading } = usePortfolio();
  const { isGuest } = useAuth();

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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
    </div>
  );
}