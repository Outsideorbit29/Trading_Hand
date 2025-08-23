import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { mt5BrokerService, MT5ConnectionData } from '../services/mt5BrokerService';

interface MT5ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accountData: any) => void;
}

export default function MT5ConnectionModal({ isOpen, onClose, onSuccess }: MT5ConnectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<MT5ConnectionData>({
    login: '',
    password: '',
    server: '',
  });

  const commonServers = [
    'Exness-MT5Real',
    'Exness-MT5Demo',
    'MetaQuotes-Demo',
    'Alpari-MT5-Demo',
    'FXTM-Demo',
    'XM-Demo',
    'IC Markets-Demo01',
    'Pepperstone-Demo',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const accountData = await mt5BrokerService.connectAccount(formData);
      onSuccess(accountData);
      onClose();
      setFormData({ login: '', password: '', server: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to connect to MT5 account');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof MT5ConnectionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                <span className="text-2xl">📈</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">Connect MT5 Account</h2>
                  <p className="text-sm text-gray-400">Connect to your MetaTrader 5 account</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Server
                </label>
                <select
                  required
                  value={formData.server}
                  onChange={(e) => handleInputChange('server', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select server</option>
                  {commonServers.map((server) => (
                    <option key={server} value={server}>
                      {server}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or enter custom server"
                  value={formData.server}
                  onChange={(e) => handleInputChange('server', e.target.value)}
                  className="w-full px-3 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Login ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.login}
                  onChange={(e) => handleInputChange('login', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your MT5 login number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your MT5 password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>🔒 Secure:</strong> Your credentials are used only to establish a direct connection to MT5. 
                  Make sure MetaTrader 5 is installed and running on your system.
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}