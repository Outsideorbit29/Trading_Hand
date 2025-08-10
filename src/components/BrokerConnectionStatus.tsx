import React from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function BrokerConnectionStatus() {
  const { connectedBroker, brokerConnectionStatus } = usePortfolio();

  const getStatusIcon = () => {
    switch (brokerConnectionStatus) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'disconnected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'connecting':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-400 animate-pulse" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (brokerConnectionStatus) {
      case 'connected':
        return connectedBroker?.name || 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'No Broker';
    }
  };

  const getStatusColor = () => {
    switch (brokerConnectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-red-400';
      case 'connecting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700 bg-opacity-50 rounded-lg backdrop-blur-sm">
      {getStatusIcon()}
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {connectedBroker && brokerConnectionStatus === 'connected' && (
          <span className="text-xs text-gray-400">
            {connectedBroker.type || 'MT5'}
          </span>
        )}
      </div>
    </div>
  );
}
