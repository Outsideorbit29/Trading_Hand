import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { saveBrokerConnection } from '../lib/brokerUtils';

interface BrokerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerType: string;
}

const brokerConfigs = {
  'exness-mt5': {
    name: 'Exness MT5',
    fields: [
      { name: 'server', label: 'Server', type: 'text', placeholder: 'Exness-MT5Real, Exness-MT5Demo, etc.' },
      { name: 'login', label: 'Login ID', type: 'text', placeholder: 'Your MT5 login number' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your MT5 password' },
    ],
    icon: '🟢',
    description: 'Connect to your Exness MetaTrader 5 account'
  },
  'mt5-general': {
    name: 'MetaTrader 5',
    fields: [
      { name: 'server', label: 'Server', type: 'text', placeholder: 'Your broker server name' },
      { name: 'login', label: 'Login ID', type: 'text', placeholder: 'Your MT5 login number' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your MT5 password' },
    ],
    icon: '📈',
    description: 'Connect to any MetaTrader 5 account'
  },
  'MetaTrader 5': {
    name: 'MetaTrader 5',
    fields: [
      { name: 'server', label: 'Server', type: 'text', placeholder: 'MetaQuotes-Demo' },
      { name: 'login', label: 'Login ID', type: 'text', placeholder: '12345678' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your MT5 password' },
    ],
    icon: '📈',
    description: 'Connect to your MetaTrader 5 account'
  },
  'Zerodha Kite': {
    name: 'Zerodha Kite',
    fields: [
      { name: 'api_key', label: 'API Key', type: 'text', placeholder: 'Your Kite API key' },
      { name: 'api_secret', label: 'API Secret', type: 'password', placeholder: 'Your Kite API secret' },
      { name: 'request_token', label: 'Request Token', type: 'text', placeholder: 'Request token from login' },
    ],
    icon: '🔷',
    description: 'Connect to your Zerodha Kite account'
  },
  'Binance': {
    name: 'Binance',
    fields: [
      { name: 'api_key', label: 'API Key', type: 'text', placeholder: 'Your Binance API key' },
      { name: 'api_secret', label: 'API Secret', type: 'password', placeholder: 'Your Binance API secret' },
    ],
    icon: '🟡',
    description: 'Connect to your Binance account'
  },
  'Interactive Brokers': {
    name: 'Interactive Brokers',
    fields: [
      { name: 'username', label: 'Username', type: 'text', placeholder: 'Your IB username' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Your IB password' },
      { name: 'account_id', label: 'Account ID', type: 'text', placeholder: 'Your account ID' },
    ],
    icon: '🏦',
    description: 'Connect to your Interactive Brokers account'
  }
};

export default function BrokerAuthModal({ isOpen, onClose, brokerType }: BrokerAuthModalProps) {
  const { user } = useAuth();
  const { refreshData } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});

  const config = brokerConfigs[brokerType as keyof typeof brokerConfigs];

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateConnection = async (brokerType: string, credentials: Record<string, string>) => {
    console.debug('Validating connection for broker:', brokerType, credentials);
    // Simulate API validation - in real implementation, this would call broker APIs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation logic
    if (brokerType === 'MetaTrader 5') {
      if (!credentials.server || !credentials.login || !credentials.password) {
        throw new Error('All fields are required for MetaTrader 5');
      }
      if (credentials.login.length < 6) {
        throw new Error('Invalid login ID format');
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.debug('Submitting broker connection form for:', brokerType, formData);
    e.preventDefault();
    if (!user || !config) return;

    setLoading(true);
    setError('');

    try {
      // Validate connection with broker
      await validateConnection(brokerType, formData);

      // Save broker connection with profile check
      await saveBrokerConnection(user.id, config.name, formData);

      setSuccess(true);
      await refreshData();
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({});
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to connect to broker');
    } finally {
      setLoading(false);
    }
  };


  if (!config) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">{config.name}</h2>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connected Successfully!</h3>
                <p className="text-gray-400">Your {config.name} account has been connected.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPasswords[field.name] ? 'password' : 'text'}
                        required
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder={field.placeholder}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.name)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords[field.name] ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">
                    <strong>🔒 Secure:</strong> Your credentials are encrypted and stored securely. 
                    We recommend using read-only API keys when available.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
