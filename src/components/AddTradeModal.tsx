import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { marketDataService, ALL_SYMBOLS } from '../services/marketDataService';
import TradingViewWidget from './TradingViewWidget';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTradeModal({ isOpen, onClose }: AddTradeModalProps) {
  const { addTrade, brokers } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'buy' as 'buy' | 'sell',
    quantity: '',
    entry_price: '',
    exit_price: '',
    market_type: 'forex' as 'forex' | 'crypto',
    status: 'open' as 'open' | 'closed',
    broker_id: '',
  });

  // Update entry price when symbol changes
  useEffect(() => {
    if (!formData.symbol) return;

    const updatePrice = (data: any) => {
      setFormData((prev) => ({
        ...prev,
        entry_price: data.price.toFixed(5),
      }));
    };

    // Subscribe to market data updates for the symbol
    marketDataService.subscribe(formData.symbol, updatePrice);

    // Set initial price if available
    const initialPrice = marketDataService.getPrice(formData.symbol);
    if (initialPrice) {
      setFormData((prev) => ({
        ...prev,
        entry_price: initialPrice.price.toFixed(5),
      }));
    }

    return () => {
      marketDataService.unsubscribe(formData.symbol, updatePrice);
    };
  }, [formData.symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const exitPrice = formData.exit_price ? parseFloat(formData.exit_price) : null;
      const entryPrice = parseFloat(formData.entry_price);
      const quantity = parseFloat(formData.quantity);

      let profitLoss = 0;
      if (exitPrice && formData.status === 'closed') {
        profitLoss = formData.side === 'buy'
          ? (exitPrice - entryPrice) * quantity
          : (entryPrice - exitPrice) * quantity;
      }

      await addTrade({
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        quantity,
        entry_price: entryPrice,
        exit_price: exitPrice,
        profit_loss: profitLoss,
        status: formData.status,
        market_type: formData.market_type,
        broker_id: formData.broker_id || brokers[0]?.id || '',
        closed_at: formData.status === 'closed' ? new Date().toISOString() : null,
      });

      setFormData({
        symbol: '',
        side: 'buy',
        quantity: '',
        entry_price: '',
        exit_price: '',
        market_type: 'forex',
        status: 'open',
        broker_id: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl shadow-2xl grid grid-cols-2 gap-6"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Trade</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Symbol
                    </label>
                    <select
                      required
                      value={formData.symbol}
                      onChange={(e) => {
                        const selectedSymbol = e.target.value;
                        const marketType = ALL_SYMBOLS.find(s => s.symbol === selectedSymbol)?.market || 'forex';
                        setFormData({ ...formData, symbol: selectedSymbol, market_type: marketType });
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select symbol</option>
                      {ALL_SYMBOLS.map((symbol) => (
                        <option key={symbol.symbol} value={symbol.symbol}>
                          {symbol.symbol} - {symbol.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Market Type
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.market_type}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Side
                    </label>
                    <select
                      value={formData.side}
                      onChange={(e) => setFormData({ ...formData, side: e.target.value as 'buy' | 'sell' })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Entry Price
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      required
                      value={formData.entry_price}
                      onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Exit Price
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      value={formData.exit_price}
                      onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.1250"
                      disabled={formData.status === 'open'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'closed' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
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
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Trade'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <TradingViewWidget symbol={formData.symbol || 'EURUSD'} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
