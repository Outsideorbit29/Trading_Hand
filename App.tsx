
import React, { useState } from 'react';
import { DashboardIcon, HistoryIcon, AnalyticsIcon, ProfileIcon } from './components/shared/Icons';
import Home from './components/Home';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import TradeHistory from './components/TradeHistory';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Toast from './components/shared/Toast';
import { TradeInsightProvider } from './components/TradeInsightProvider';
import ChatBot from './components/ChatBot';

type Page = 'home' | 'features' | 'pricing' | 'dashboard' | 'history' | 'analytics' | 'profile';
type ToastMessage = { message: string, type: 'success' | 'error' };

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={(page: Page) => setActivePage(page)} />;
      case 'features':
        return <Features onNavigate={(page: Page) => setActivePage(page)} />;
      case 'pricing':
        return <Pricing onNavigate={(page: Page) => setActivePage(page)} />;
      case 'dashboard':
        return <Dashboard showToast={showToast} />;
      case 'history':
        return <TradeHistory />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onNavigate={(page: Page) => setActivePage(page)} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <DashboardIcon /> },
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'history', label: 'Trade History', icon: <HistoryIcon /> },
    { id: 'analytics', label: 'Learning & Analysis', icon: <AnalyticsIcon /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Fixed Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setActivePage('home'); setNavOpen(false); }}>
            <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <h1 className="text-xl font-bold text-white">Trading Hand</h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => { setActivePage(item.id as Page); setNavOpen(false); }}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activePage === item.id ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 text-cyan-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {navOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 p-4">
            <ul className="flex flex-col space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => { setActivePage(item.id as Page); setNavOpen(false); }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activePage === item.id ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content with top padding to account for fixed navbar */}
      <TradeInsightProvider>
        <main className="flex-1 overflow-y-auto pt-20 md:pt-20">
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          {(activePage === 'home' || activePage === 'features' || activePage === 'pricing') ? renderPage() : <div className="p-4 sm:p-6 lg:p-8">{renderPage()}</div>}
        </main>

        {/* ChatBot floating UI (listens for trade-insight-open events) */}
        <ChatBot />
      </TradeInsightProvider>
    </div>
  );
};

export default App;