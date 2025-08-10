import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mt5Service } from '../services/mt5Service';

interface MT5DashboardProps {
  brokerId?: string;
}

export const MT5Dashboard: React.FC<MT5DashboardProps> = ({ brokerId = 'exness-mt5' }) => {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMT5Data();
    }
  }, [user, brokerId]);

  const loadMT5Data = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [accountData, positionsData] = await Promise.all([
        mt5Service.getAccountData(user.id),
        mt5Service.getOpenPositions(user.id)
      ]);
      
      setAccountData(accountData);
      setPositions(positionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MT5 data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const latestAccount = accountData[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            {latestAccount ? formatCurrency(latestAccount.balance) : '$0.00'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Equity</h3>
          <p className="text-2xl font-bold text-gray-900">
            {latestAccount ? formatCurrency(latestAccount.equity) : '$0.00'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Free Margin</h3>
          <p className="text-2xl font-bold text-gray-900">
            {latestAccount ? formatCurrency(latestAccount.free_margin) : '$0.00'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Profit</h3>
          <p className={`text-2xl font-bold ${latestAccount?.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {latestAccount ? formatCurrency(latestAccount.profit) : '$0.00'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Open Positions</h3>
        </div>
        <div className="border-t border-gray-200">
          {positions.length === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-500">No open positions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {positions.map((position) => (
                    <tr key={position.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {position.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {position.type === 0 ? 'Buy' : 'Sell'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {position.volume}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${position.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(position.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
