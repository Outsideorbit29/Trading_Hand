import React, { useState } from 'react';
import Card from './shared/Card';

type ProfileTab = 'overview' | 'personal' | 'broker' | 'payment' | 'security';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [editMode, setEditMode] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Alex',
    lastName: 'Doe',
    email: 'alex.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    city: 'New York',
    dateOfBirth: '1995-03-15',
    occupation: 'Professional Trader'
  });

  const [brokerInfo] = useState({
    brokerName: 'Exness',
    accountNumber: '279332342',
    serverName: 'Exness-MT5Trial8',
    accountType: 'Trial',
    leverage: '1:30',
    balance: '$10,000.00',
    equity: '$9,850.00',
    margin: '$500.00',
    freeMargin: '$9,350.00',
    marginLevel: '1970%',
    connectionStatus: 'Connected',
    lastSyncTime: '2 minutes ago'
  });

  const [paymentInfo] = useState({
    paymentMethod: 'Credit Card',
    cardLast4: '4242',
    cardBrand: 'Visa',
    expiryDate: '12/25',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Professional',
    billingCycle: 'Monthly',
    nextBillingDate: 'December 18, 2024',
    billingEmail: 'alex.doe@example.com'
  });

  const [securitySettings] = useState({
    twoFactorAuth: 'Enabled',
    lastLogin: 'Today at 10:45 AM',
    loginDevices: [
      { device: 'Windows PC', lastActive: 'Today' },
      { device: 'iPhone 14 Pro', lastActive: 'Yesterday' }
    ],
    passwordLastChanged: '45 days ago',
    apiKeyConfigured: true
  });

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'personal', label: 'Personal Info', icon: '📋' },
    { id: 'broker', label: 'Broker Details', icon: '🔗' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔐' }
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    setEditMode(false);
    alert('Personal information updated successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>

      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:border-b border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 md:border-b-2 border-cyan-500 bg-cyan-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Header - Always Visible */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center text-center">
            <img 
              src="https://picsum.photos/seed/tradeprofile/200/200" 
              alt="Profile" 
              className="w-40 h-40 rounded-full border-4 border-cyan-500 object-cover"
            />
            <h2 className="mt-6 text-2xl font-bold text-white">{personalInfo.firstName} {personalInfo.lastName}</h2>
            <p className="text-cyan-400 font-semibold mt-2">{personalInfo.email}</p>
            <span className="mt-3 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full">Professional Member</span>
            <p className="text-gray-400 text-sm mt-4">Member since January 15, 2022</p>
          </Card>
        </div>

        {/* Quick Stats - Always Visible */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Trades', value: '247', color: 'cyan' },
              { label: 'Win Rate', value: '68%', color: 'green' },
              { label: 'Total P&L', value: '$12,450', color: 'blue' },
              { label: 'Subscription', value: 'Pro', color: 'purple' }
            ].map((stat, idx) => (
              <Card key={idx} className="text-center">
                <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-l-4 border-l-cyan-500">
              <h3 className="text-2xl font-bold text-white mb-4">Welcome Back, {personalInfo.firstName}! 👋</h3>
              <p className="text-gray-300 mb-6">Here's a summary of your trading account and activities.</p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Account Status</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Account Status', value: 'Active', icon: '✓' },
                      { label: 'Broker Connection', value: 'Connected', icon: '🔗' },
                      { label: 'Trading Bot', value: 'Running', icon: '▶' },
                      { label: 'Last Activity', value: '5 minutes ago', icon: '⏱' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="flex items-center gap-2 text-cyan-400 font-semibold">
                          <span className="text-xl">{item.icon}</span>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Performance Overview</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'This Month P&L', value: '+$2,450', color: 'green' },
                      { label: 'This Week P&L', value: '+$450', color: 'green' },
                      { label: 'Largest Win', value: '$1,200', color: 'cyan' },
                      { label: 'Largest Loss', value: '-$350', color: 'red' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">{item.label}</span>
                        <span className={`text-${item.color}-400 font-bold`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="animate-fadeIn">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      placeholder="First Name"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      placeholder="Last Name"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="Email"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="Phone"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={personalInfo.country}
                      onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                      placeholder="Country"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={personalInfo.city}
                      onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                      placeholder="City"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={personalInfo.occupation}
                      onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                      placeholder="Occupation"
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={handleSavePersonalInfo}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-bold transition"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-gray-300">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: personalInfo.firstName },
                      { label: 'Last Name', value: personalInfo.lastName },
                      { label: 'Email', value: personalInfo.email },
                      { label: 'Phone', value: personalInfo.phone },
                      { label: 'Country', value: personalInfo.country },
                      { label: 'City', value: personalInfo.city },
                      { label: 'Date of Birth', value: personalInfo.dateOfBirth },
                      { label: 'Occupation', value: personalInfo.occupation }
                    ].map((item, idx) => (
                      <div key={idx} className="pb-3 border-b border-gray-700">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-white font-semibold mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Broker Details Tab */}
        {activeTab === 'broker' && (
          <div className="animate-fadeIn space-y-6">
            <Card className="border-l-4 border-l-cyan-500">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Connected Broker Details
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: 'Broker Name', value: brokerInfo.brokerName },
                    { label: 'Account Number', value: brokerInfo.accountNumber },
                    { label: 'Server', value: brokerInfo.serverName },
                    { label: 'Account Type', value: brokerInfo.accountType },
                    { label: 'Leverage', value: brokerInfo.leverage },
                    { label: 'Connection Status', value: brokerInfo.connectionStatus, highlight: true }
                  ].map((item, idx) => (
                    <div key={idx} className="pb-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className={`font-semibold mt-1 ${item.highlight ? 'text-green-400' : 'text-white'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h4 className="text-lg font-bold text-white mb-4">Account Balance Overview</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { label: 'Balance', value: brokerInfo.balance, color: 'cyan' },
                      { label: 'Equity', value: brokerInfo.equity, color: 'blue' },
                      { label: 'Margin Used', value: brokerInfo.margin, color: 'orange' },
                      { label: 'Free Margin', value: brokerInfo.freeMargin, color: 'green' }
                    ].map((item, idx) => (
                      <Card key={idx} className="text-center bg-gray-700/50">
                        <p className={`text-2xl font-bold text-${item.color}-400`}>{item.value}</p>
                        <p className="text-gray-400 text-sm mt-2">{item.label}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-400">Last Synced:</span>
                  <span className="text-cyan-400 font-semibold">{brokerInfo.lastSyncTime}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Payment Information Tab */}
        {activeTab === 'payment' && (
          <div className="animate-fadeIn">
            <Card className="border-l-4 border-l-blue-500">
              <h3 className="text-2xl font-bold text-white mb-6">Payment Information</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Payment Method</h4>
                  {[
                    { label: 'Payment Method', value: paymentInfo.paymentMethod },
                    { label: 'Card Brand', value: paymentInfo.cardBrand },
                    { label: 'Card Last 4 Digits', value: paymentInfo.cardLast4 },
                    { label: 'Expiry Date', value: paymentInfo.expiryDate }
                  ].map((item, idx) => (
                    <div key={idx} className="pb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-white font-semibold mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Subscription Details</h4>
                  {[
                    { label: 'Subscription Status', value: paymentInfo.subscriptionStatus, color: 'green' },
                    { label: 'Subscription Plan', value: paymentInfo.subscriptionPlan },
                    { label: 'Billing Cycle', value: paymentInfo.billingCycle },
                    { label: 'Next Billing Date', value: paymentInfo.nextBillingDate }
                  ].map((item, idx) => (
                    <div key={idx} className="pb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className={`font-semibold mt-1 ${item.color ? `text-${item.color}-400` : 'text-white'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition">
                  Update Payment Method
                </button>
                <button className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition">
                  View Invoices
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="animate-fadeIn">
            <Card className="border-l-4 border-l-purple-500">
              <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="pb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Two-Factor Authentication</p>
                    <p className="text-green-400 font-semibold mt-1">{securitySettings.twoFactorAuth}</p>
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Last Login</p>
                    <p className="text-white font-semibold mt-1">{securitySettings.lastLogin}</p>
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Password Last Changed</p>
                    <p className="text-white font-semibold mt-1">{securitySettings.passwordLastChanged}</p>
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">API Key</p>
                    <p className={`font-semibold mt-1 ${securitySettings.apiKeyConfigured ? 'text-green-400' : 'text-red-400'}`}>
                      {securitySettings.apiKeyConfigured ? 'Configured' : 'Not Configured'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Active Devices</h4>
                  <div className="space-y-3">
                    {securitySettings.loginDevices.map((device, idx) => (
                      <div key={idx} className="p-4 bg-gray-700/50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{device.device}</p>
                          <p className="text-gray-400 text-sm">Last active: {device.lastActive}</p>
                        </div>
                        <button className="px-3 py-1 text-red-400 hover:bg-red-500/10 rounded transition text-sm">
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition">
                    Change Password
                  </button>
                  <button className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition">
                    Download Security Report
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;
