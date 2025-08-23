import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { mt5BrokerService } from '../services/mt5BrokerService';

interface MT5AccountData {
  login: number;
  name: string;
  server: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  leverage: number;
  profit: number;
  currency: string;
  company: string;
  last_update?: string;
}

interface MT5AccountCardProps {
  accountData: MT5AccountData;
  connectionInfo: {
    login: string;
    server: string;
    connected: boolean;
    last_update: string;
  };
  onRefresh: () => void;
  onDisconnect: () => void;
}

export default function MT5AccountCard({ 
  accountData, 
  connectionInfo, 
  onRefresh, 
  onDisconnect 
}: MT5AccountCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await mt5BrokerService.getAccountInfo(connectionInfo.login, connectionInfo.server);
      onRefresh();
    } catch (error) {
      console.error('Failed to refresh account:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await mt5BrokerService.disconnectAccount(connectionInfo.login, connectionInfo.server);
      onDisconnect();
    } catch (error) {
      console.error('Failed to disconnect account:', error);
    } finally {
      setDisconnecting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: accountData.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-700 rounded-lg p-6 border border-gray-600"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">MT5</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{accountData.name}</h3>
            <p className="text-sm text-gray-400">
              {accountData.login} • {accountData.server}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {connectionInfo.connected ? (
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" />
          )}
          <span className={`text-sm ${connectionInfo.connected ? 'text-green-400' : 'text-red-400'}`}>
            {connectionInfo.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Balance</p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(accountData.balance)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Equity</p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(accountData.equity)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Free Margin</p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(accountData.free_margin)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Profit</p>
          <p className={`text-lg font-semibold ${
            accountData.profit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(accountData.profit)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
        <span>Leverage: 1:{accountData.leverage}</span>
        <span>Company: {accountData.company}</span>
      </div>

      {accountData.last_update && (
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {formatDateTime(accountData.last_update)}
        </p>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
          {disconnecting ? '...' : ''}
        </button>
      </div>
    </motion.div>
  );
}