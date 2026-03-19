import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import TradingBackground from './components/TradingBackground';
import Home from './components/Home';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import TradeHistory from './components/TradeHistory';
import Analytics from './components/Analytics';
import RiskAnalysis from './components/RiskAnalysis';
import Profile from './components/Profile';
import Toast from './components/shared/Toast';
import { TradeInsightProvider } from './components/TradeInsightProvider';
import ChatBot from './components/ChatBot';

type Page = 'home' | 'features' | 'pricing' | 'dashboard' | 'history' | 'analytics' | 'risk' | 'profile';
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
      case 'risk':
        return <RiskAnalysis />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onNavigate={(page: Page) => setActivePage(page)} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'Trade History' },
    { id: 'analytics', label: 'Learning & Analysis' },
    { id: 'risk', label: 'Risk Analysis' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className="relative min-h-screen bg-cyber-bg text-gray-200 font-rajdhani selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* HUD Background Elements */}
      <div className="cyber-bg-overlay">
        <div className="cyber-grid"></div>
        <div className="scanning-line"></div>
      </div>

      {/* Futuristic 3D Grid & Particle Background */}
      <TradingBackground />

      {/* Extreme Edges Professional Navbar - Hide on Scroll Down */}
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-8 left-0 right-0 z-[100] w-full px-8"
      >
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center py-2"
        >
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-900 border border-white/10 rounded-lg flex items-center justify-center shadow-2xl relative group cursor-pointer" onClick={() => setActivePage('home')}>
              <div className="absolute inset-0 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
              <svg className="w-6 h-6 text-cyan-400 relative" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <span className="text-xl font-bold font-orbitron text-white tracking-tight">Trading Hand</span>
          </div>

          {/* Center: Navigation Pill */}
          <div className="hidden lg:flex items-center">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-2xl">
              {navItems.filter(item => item.id !== 'profile').map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as Page)}
                  className={`relative px-5 py-1.5 rounded-full text-xs font-medium font-orbitron uppercase tracking-[0.1em] transition-all duration-300 ${
                    activePage === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activePage === item.id && (
                    <motion.div
                      layoutId="pill-active"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center space-x-4">
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
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 10 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-black/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-3xl"
            >
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => { setActivePage(item.id as Page); setNavOpen(false); }}
                      className={`w-full text-left px-5 py-3 rounded-xl font-orbitron text-[10px] uppercase tracking-widest transition-all ${
                        activePage === item.id ? 'bg-white/10 text-white' : 'text-gray-400'
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
      </motion.nav>

      {/* Main Content with top padding to account for fixed navbar */}
      <TradeInsightProvider>
        <main className="relative z-10 flex-1 overflow-y-auto pt-24 pb-12">
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          <div className="w-full px-4 md:px-8">
            {renderPage()}
          </div>
        </main>

        {/* ChatBot floating UI */}
        <ChatBot />
      </TradeInsightProvider>
    </div>
  );
};

export default App;