import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import TradingBackground from './components/layout/TradingBackground';
import Home from './components/layout/Home';
import Features from './components/layout/Features';
import Pricing from './components/layout/Pricing';
import Dashboard from './components/dashboard/Dashboard';
import TradeHistory from './components/dashboard/TradeHistory';
import Analytics from './components/analytics/Analytics';
import ModelPerformance from './components/analytics/ModelPerformance';
import Profile from './components/layout/Profile';
import { TradeInsightProvider } from './components/layout/TradeInsightProvider';
import ChatBot from './components/layout/ChatBot';
import NewsTracker from './components/news/NewsTracker';
import Toast from './components/shared/Toast';
import RiskAnalysis from './components/risk/RiskAnalysis';

type Page = 'home' | 'features' | 'pricing' | 'dashboard' | 'history' | 'analytics' | 'profile' | 'news' | 'model' | 'risk';
type ToastMessage = { message: string, type: 'success' | 'error' };

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Standard UX: Hide when scrolling down, show when scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const showToast = React.useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

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
      case 'model':
        return <ModelPerformance />;
      case 'news':
        return <NewsTracker />;
      case 'profile':
        return <Profile />;
      case 'risk':
        return <RiskAnalysis />;
      default:
        return <Home onNavigate={(page: Page) => setActivePage(page)} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'Trade History' },
    { id: 'analytics', label: 'Learning & Analysis' },
    { id: 'model', label: 'Intelligence' },
    { id: 'news', label: 'Live News' },
    { id: 'risk', label: 'Risk Matrix' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className="relative min-h-screen bg-cyber-bg text-gray-200 font-rajdhani selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="cyber-bg-overlay">
        <div className="cyber-grid"></div>
        <div className="scanning-line"></div>
      </div>
      <TradingBackground />

      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed top-4 md:top-8 left-0 right-0 z-[100] w-full px-4"
      >
        <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex justify-between items-center py-2"
            >
              {/* Left: Brand Identity */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 bg-gray-900 border border-white/10 rounded-lg flex items-center justify-center shadow-2xl relative group cursor-pointer" onClick={() => setActivePage('home')}>
                  <div className="absolute inset-0 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  <svg className="w-6 h-6 text-cyan-400 relative" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <span className="text-lg md:text-xl font-bold font-orbitron text-white tracking-tight">Trading Hand</span>
              </div>

              {/* Center: Navigation Pill */}
              <div className="hidden xl:flex items-center">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-2xl">
                  {navItems.filter(item => item.id !== 'profile').map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id as Page)}
                      className={`relative px-4 py-1.5 rounded-full text-xs font-medium font-orbitron uppercase tracking-[0.1em] transition-all duration-300 ${
                        activePage === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {activePage === item.id && (
                        <motion.div
                          layoutId="pill-active"
                          className="absolute inset-0 bg-white/10 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Action Button */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePage('profile')}
                  className="hidden md:block bg-white text-black px-7 py-2.5 rounded-full font-bold text-xs font-orbitron uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-white/30 transition-shadow"
                >
                  Profile
                </motion.button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setNavOpen(!navOpen)}
                  className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {navOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 10 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="xl:hidden bg-black/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-3xl absolute left-4 right-4"
                >
                  <ul className="space-y-1">
                    {navItems.map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => { setActivePage(item.id as Page); setNavOpen(false); }}
                          className={`w-full text-left px-5 py-3 rounded-xl font-orbitron text-[10px] uppercase tracking-widest transition-all ${
                            activePage === item.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </motion.nav>

      {/* Main Content with top padding to account for fixed navbar */}
      <TradeInsightProvider>
        <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto pt-24 md:pt-32 pb-24">
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activePage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {renderPage()}
                </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <ChatBot />
      </TradeInsightProvider>
    </div>
  );
};

export default App;