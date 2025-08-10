import React from 'react';
import { ExternalLink, Check, Plus } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  logo?: string;
  connected: boolean;
  accountId?: string;
}

interface BrokerListProps {
  brokers: Broker[];
  onConnectBroker: (brokerId: string) => void;
}

// Available brokers that can be connected
const availableBrokerTypes = [
  {
    id: 'exness-mt5',
    name: 'Exness MT5',
    logo: null,
    description: 'Connect your Exness MetaTrader 5 account',
    connected: false
  },
  {
    id: 'mt5-general',
    name: 'MetaTrader 5',
    logo: null,
    description: 'Connect any MetaTrader 5 account',
    connected: false
  }
];

export default function BrokerList({ brokers, onConnectBroker }: BrokerListProps) {
  const connectedBrokers = brokers.filter(broker => broker.connected);
  
  // Filter out already connected broker types
  const connectedBrokerNames = connectedBrokers.map(b => b.name.toLowerCase());
  const availableBrokers = availableBrokerTypes.filter(broker => 
    !connectedBrokerNames.includes(broker.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Connected Brokers */}
      {connectedBrokers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Brokers</h3>
          <div className="grid gap-4">
            {connectedBrokers.map((broker) => (
              <div
                key={broker.id}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {broker.logo ? (
                    <img src={broker.logo} alt={broker.name} className="w-8 h-8 rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {broker.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{broker.name}</h4>
                    {broker.accountId && (
                      <p className="text-sm text-gray-600">Account: {broker.accountId}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Brokers */}
      {availableBrokers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Brokers</h3>
          <div className="grid gap-4">
            {availableBrokers.map((broker) => (
              <div
                key={broker.id}
                className="flex items-center justify-between p-4 bg-gray-700 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {broker.logo ? (
                    <img src={broker.logo} alt={broker.name} className="w-8 h-8 rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {broker.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-white">{broker.name}</h4>
                    <p className="text-sm text-gray-400">{broker.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onConnectBroker(broker.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {connectedBrokers.length === 0 && availableBrokers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">All available brokers are already connected.</p>
        </div>
      )}
    </div>
  );
}