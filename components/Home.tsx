import React, { useState } from 'react';
import { ZapIcon, HistoryIcon, BrainIcon, GlobeIcon, TrendingUpIcon, BarChart3Icon } from './shared/Icons';
import { generateDocumentation } from '../services/documentationService';
import Footer from './Footer';

type Page = 'home' | 'dashboard' | 'history' | 'analytics' | 'profile' | 'features' | 'pricing';

interface HomeProps {
  onNavigate?: (page: Page) => void;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  benefits: string[];
  image: React.ReactNode;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [selectedImpFeature, setSelectedImpFeature] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: <ZapIcon />,
      title: "Automated Trading Bot",
      description: "Intelligent algorithms that execute trades 24/7 based on technical analysis and market conditions.",
      details: "Our advanced trading bot uses machine learning and technical indicators to analyze market trends in real-time. It executes trades automatically based on your predefined strategies, eliminating emotional decisions and maximizing profit opportunities.",
      benefits: ["24/7 market monitoring", "EMA crossover strategy", "Auto stop-loss & take-profit", "Real-time trade execution"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="20" y="20" width="160" height="160" fill="url(#grad1)" rx="10" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <path d="M 50 150 L 75 100 L 100 120 L 125 60 L 150 90" stroke="#06b6d4" strokeWidth="3" fill="none" />
          <circle cx="50" cy="150" r="4" fill="#06b6d4" />
          <circle cx="75" cy="100" r="4" fill="#06b6d4" />
          <circle cx="100" cy="120" r="4" fill="#06b6d4" />
          <circle cx="125" cy="60" r="4" fill="#06b6d4" />
          <circle cx="150" cy="90" r="4" fill="#06b6d4" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Automated Trading</text>
        </svg>
      )
    },
    {
      icon: <HistoryIcon />,
      title: "Complete Trade History",
      description: "Track all your trades with detailed records, timestamps, and profit/loss calculations.",
      details: "Access comprehensive records of every trade executed on your account. View detailed metrics including entry/exit prices, trade duration, profit/loss, and commission details. Export reports for tax and analysis purposes.",
      benefits: ["Detailed trade logs", "Profit/loss tracking", "CSV/PDF exports", "Date range filtering"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="30" y="30" width="140" height="140" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <line x1="35" y1="50" x2="165" y2="50" stroke="#06b6d4" strokeWidth="1" />
          <line x1="35" y1="70" x2="165" y2="70" stroke="#06b6d4" strokeWidth="1" />
          <line x1="35" y1="90" x2="165" y2="90" stroke="#06b6d4" strokeWidth="1" />
          <line x1="35" y1="110" x2="165" y2="110" stroke="#06b6d4" strokeWidth="1" />
          <line x1="35" y1="130" x2="165" y2="130" stroke="#06b6d4" strokeWidth="1" />
          <rect x="40" y="35" width="8" height="135" fill="#0ea5e9" opacity="0.5" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Trade History</text>
        </svg>
      )
    },
    {
      icon: <BrainIcon />,
      title: "AI-Powered Insights",
      description: "Advanced analysis of your trades with actionable insights and performance metrics.",
      details: "Leverage artificial intelligence to gain deep insights into your trading patterns. Get personalized recommendations based on your historical performance, market trends, and risk profile. Identify strengths and weaknesses in your strategy.",
      benefits: ["Pattern recognition", "Performance recommendations", "Risk assessment", "Market sentiment analysis"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="60" fill="url(#grad2)" opacity="0.3" />
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r="8" fill="#a855f7" />
          <circle cx="130" cy="70" r="8" fill="#a855f7" />
          <circle cx="100" cy="130" r="8" fill="#a855f7" />
          <circle cx="100" cy="100" r="6" fill="#0ea5e9" />
          <line x1="70" y1="70" x2="100" y2="100" stroke="#06b6d4" strokeWidth="2" />
          <line x1="130" y1="70" x2="100" y2="100" stroke="#06b6d4" strokeWidth="2" />
          <line x1="100" y1="130" x2="100" y2="100" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">AI Insights</text>
        </svg>
      )
    },
    {
      icon: <GlobeIcon />,
      title: "Multiple Markets",
      description: "Trade across Forex, Stocks, and Cryptocurrencies on major exchanges.",
      details: "Access global markets from one unified platform. Trade forex pairs, equities, cryptocurrencies, and commodities simultaneously. Diversify your portfolio across different asset classes and geographical regions.",
      benefits: ["Global market access", "4+ asset classes", "Real-time pricing", "Cross-market analysis"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="60" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
          <circle cx="100" cy="60" r="6" fill="#0ea5e9" />
          <circle cx="140" cy="100" r="6" fill="#0ea5e9" />
          <circle cx="100" cy="140" r="6" fill="#0ea5e9" />
          <circle cx="60" cy="100" r="6" fill="#0ea5e9" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Multiple Markets</text>
        </svg>
      )
    },
    {
      icon: <BarChart3Icon />,
      title: "1000+ Symbols",
      description: "Access forex pairs, stocks, commodities, and crypto assets all in one place.",
      details: "Trade over 1000 financial instruments including major currency pairs, blue-chip stocks, cryptocurrencies, precious metals, and energy commodities. Access liquidity from the world's largest exchanges.",
      benefits: ["1000+ tradeable symbols", "Low spreads", "High liquidity", "24/5 market coverage"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="40" y="60" width="15" height="80" fill="#06b6d4" opacity="0.7" />
          <rect x="65" y="40" width="15" height="100" fill="#0ea5e9" opacity="0.7" />
          <rect x="90" y="50" width="15" height="90" fill="#06b6d4" opacity="0.7" />
          <rect x="115" y="30" width="15" height="110" fill="#0ea5e9" opacity="0.7" />
          <rect x="140" y="70" width="15" height="70" fill="#06b6d4" opacity="0.7" />
          <line x1="35" y1="145" x2="160" y2="145" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">1000+ Symbols</text>
        </svg>
      )
    },
    {
      icon: <TrendingUpIcon />,
      title: "Advanced Analytics",
      description: "Beautiful charts and dashboards to visualize your trading progress.",
      details: "Interactive charts with advanced technical indicators. Customizable dashboards showing real-time P&L, performance metrics, equity curves, and portfolio allocation. Export reports in multiple formats.",
      benefits: ["Real-time charts", "Technical indicators", "Custom dashboards", "Performance reports"],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polyline points="30,140 60,100 90,110 120,60 150,80" fill="none" stroke="#0ea5e9" strokeWidth="3" />
          <circle cx="30" cy="140" r="3" fill="#0ea5e9" />
          <circle cx="60" cy="100" r="3" fill="#0ea5e9" />
          <circle cx="90" cy="110" r="3" fill="#0ea5e9" />
          <circle cx="120" cy="60" r="3" fill="#0ea5e9" />
          <circle cx="150" cy="80" r="3" fill="#0ea5e9" />
          <line x1="25" y1="150" x2="160" y2="150" stroke="#06b6d4" strokeWidth="2" />
          <line x1="25" y1="150" x2="25" y2="40" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Analytics</text>
        </svg>
      )
    }
  ];

  interface Market {
    name: string;
    description: string;
    emoji: string;
    pairs: string;
    details: string;
    benefits: string[];
    tradingHours: string;
    image: React.ReactNode;
  }

  const markets: Market[] = [
    {
      name: "Forex Market",
      description: "Trade major currency pairs with low spreads and high liquidity.",
      emoji: "💱",
      pairs: "EUR/USD, GBP/USD, USD/JPY, AUD/USD",
      details: "The Forex market is the largest and most liquid financial market in the world. Trade currency pairs with minimal spreads and leverage up to 1:100. Benefit from 24/5 market availability and execute trades instantly.",
      benefits: ["0.1 pip spreads", "24/5 market access", "High leverage available", "Global liquidity"],
      tradingHours: "Sunday - Friday, 24 hours",
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="70" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <text x="40" y="105" fontSize="20" fontWeight="bold" fill="#0ea5e9">EUR</text>
          <text x="140" y="105" fontSize="20" fontWeight="bold" fill="#0ea5e9">USD</text>
          <line x1="70" y1="100" x2="130" y2="100" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="100" cy="100" r="4" fill="#06b6d4" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Forex</text>
        </svg>
      )
    },
    {
      name: "Stock Market",
      description: "Invest in blue-chip stocks and ETFs from global exchanges.",
      emoji: "📈",
      pairs: "AAPL, GOOGL, TSLA, SPY, MSFT, AMZN",
      details: "Access major stock exchanges including NYSE, NASDAQ, and LSE. Trade blue-chip stocks, ETFs, and indices with real-time data. Invest in technology, finance, healthcare, and other sectors with fractional shares available.",
      benefits: ["Major exchanges", "Fractional shares", "Dividend tracking", "Real-time data"],
      tradingHours: "Monday - Friday, 9:30 AM - 4:00 PM EST",
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="40" y="50" width="120" height="100" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <polyline points="50,130 70,90 90,100 110,70 130,85 150,60" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <circle cx="50" cy="130" r="2" fill="#0ea5e9" />
          <circle cx="70" cy="90" r="2" fill="#0ea5e9" />
          <circle cx="90" cy="100" r="2" fill="#0ea5e9" />
          <circle cx="110" cy="70" r="2" fill="#0ea5e9" />
          <circle cx="130" cy="85" r="2" fill="#0ea5e9" />
          <circle cx="150" cy="60" r="2" fill="#0ea5e9" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Stocks</text>
        </svg>
      )
    },
    {
      name: "Crypto Market",
      description: "Trade Bitcoin, Ethereum, and other digital assets.",
      emoji: "₿",
      pairs: "BTC/USD, ETH/USD, BNB/USD, ADA/USD, SOL/USD",
      details: "Trade major cryptocurrencies and altcoins 24/7 with instant settlement. Access spot trading and leverage trading with advanced order types. Benefit from low fees and high market volatility for profitable trading.",
      benefits: ["24/7 trading", "100+ cryptocurrencies", "Instant settlement", "Leverage trading"],
      tradingHours: "24/7, 365 days",
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="50" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <path d="M 100 60 L 130 85 L 120 100 L 135 110 L 100 135 L 65 110 L 80 100 L 70 85 Z" fill="#06b6d4" opacity="0.7" />
          <circle cx="100" cy="100" r="25" fill="#06b6d4" opacity="0.3" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Crypto</text>
        </svg>
      )
    },
    {
      name: "Commodities",
      description: "Trade precious metals, energy, and agricultural products.",
      emoji: "🏆",
      pairs: "Gold, Oil, Silver, Natural Gas, Wheat",
      details: "Trade physical commodities and commodity indices with leverage. Access precious metals (Gold, Silver), energy (Crude Oil, Natural Gas), and agricultural products (Wheat, Corn). Hedge your portfolio with commodity exposure.",
      benefits: ["Safe-haven assets", "Hedge your portfolio", "Low correlation", "Global demand"],
      tradingHours: "Monday - Friday, 23:00 - 22:00 UTC",
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="50" y="40" width="30" height="90" fill="#fbbf24" opacity="0.7" />
          <rect x="90" y="60" width="30" height="70" fill="#06b6d4" opacity="0.7" />
          <rect x="130" y="50" width="30" height="80" fill="#9333ea" opacity="0.7" />
          <line x1="40" y1="135" x2="160" y2="135" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Commodities</text>
        </svg>
      )
    }
  ];

  interface ImportantFeature {
    title: string;
    description: string;
    details: string;
    stats: { label: string; value: string }[];
    image: React.ReactNode;
  }

  const importantFeatures: ImportantFeature[] = [
    {
      title: "24/7 Automated Trading",
      description: "Trade while you sleep with our intelligent bot running continuously.",
      details: "Our automated trading bot runs 24/7 monitoring market conditions and executing trades based on your configured strategies. The bot uses advanced technical analysis including EMA crossovers, support/resistance levels, and momentum indicators to identify profitable trading opportunities without emotion or delays.",
      stats: [
        { label: "Uptime", value: "99.9%" },
        { label: "Response Time", value: "<100ms" },
        { label: "Daily Trades", value: "100+" },
        { label: "Win Rate", value: "65%" }
      ],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="60" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 100 50 A 50 50 0 0 1 150 100" fill="none" stroke="#0ea5e9" strokeWidth="3" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <circle cx="100" cy="100" r="5" fill="#0ea5e9" />
          <circle cx="100" cy="55" r="3" fill="#06b6d4" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">24/7 Trading</text>
        </svg>
      )
    },
    {
      title: "Risk Management",
      description: "Protect your capital with advanced stop-loss and take-profit orders.",
      details: "Every trade is protected with automatic risk management. Set your risk parameters and let the system enforce them. Our trailing stop-loss feature protects profits while allowing trades to run. Position sizing is automatically adjusted based on account equity and volatility.",
      stats: [
        { label: "Max Drawdown", value: "-15%" },
        { label: "Stop-Loss", value: "Auto" },
        { label: "Take-Profit", value: "Trailing" },
        { label: "Position Sizing", value: "Dynamic" }
      ],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="40" y="50" width="120" height="100" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <line x1="100" y1="50" x2="100" y2="150" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <line x1="40" y1="100" x2="160" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <rect x="60" y="85" width="80" height="30" fill="#10b981" opacity="0.3" />
          <rect x="50" y="75" width="100" height="50" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Risk Management</text>
        </svg>
      )
    },
    {
      title: "Real-time Analytics",
      description: "Monitor your trades with powerful dashboards and detailed reports.",
      details: "Access comprehensive analytics with real-time dashboards showing your trading performance. Track win rate, profit factor, equity curve, and drawdown in real-time. Generate detailed reports for tax purposes or performance analysis. Export data in multiple formats.",
      stats: [
        { label: "Dashboard", value: "Real-time" },
        { label: "Reports", value: "Monthly" },
        { label: "Export Formats", value: "5+" },
        { label: "Data Points", value: "1000+" }
      ],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="25" y="40" width="150" height="120" fill="none" stroke="#06b6d4" strokeWidth="2" rx="5" />
          <rect x="30" y="45" width="140" height="20" fill="#06b6d4" opacity="0.3" />
          <rect x="35" y="75" width="30" height="70" fill="#0ea5e9" opacity="0.6" />
          <rect x="75" y="55" width="30" height="90" fill="#0ea5e9" opacity="0.7" />
          <rect x="115" y="85" width="30" height="60" fill="#0ea5e9" opacity="0.5" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Analytics</text>
        </svg>
      )
    },
    {
      title: "Expert Support",
      description: "Get help from our trading experts via email, chat, or phone.",
      details: "Our dedicated support team is here to help you 24/7. Get assistance with strategy setup, account optimization, or technical questions. Access extensive documentation, video tutorials, and community forums. Priority support available with Professional and Enterprise plans.",
      stats: [
        { label: "Support", value: "24/7" },
        { label: "Response Time", value: "<1hr" },
        { label: "Languages", value: "10+" },
        { label: "Satisfaction", value: "98%" }
      ],
      image: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="80" cy="80" r="25" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="140" cy="100" r="25" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 95 90 L 130 105" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 80 110 Q 80 130 60 140" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <path d="M 140 130 Q 140 150 160 160" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">Support</text>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-24">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <svg className="w-16 h-16 mx-auto mb-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Trading Hand
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            Your Complete Automated Trading Solution Powered by AI & Technical Analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition transform hover:scale-105"
            >
              Get Started
            </button>
            <button 
              onClick={() => onNavigate?.('features')}
              className="px-8 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Everything you need to automate and optimize your trading</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setSelectedFeature(index)}
                className="p-6 bg-gray-800 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition transform hover:scale-105 cursor-pointer pop-on-click text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <p className="text-cyan-400 text-sm mt-3 font-semibold">Click to learn more →</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedFeature(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-3xl font-bold text-white">{features[selectedFeature].title}</h2>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Feature Image */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 mb-6 h-64 flex items-center justify-center border border-cyan-500/20">
                {features[selectedFeature].image}
              </div>

              {/* Detailed Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{features[selectedFeature].details}</p>
              </div>

              {/* Benefits List */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Key Benefits</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {features[selectedFeature].benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-gray-700/30 p-3 rounded-lg border border-cyan-500/20">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedFeature(null);
                    onNavigate?.('dashboard');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition"
                >
                  Try Now
                </button>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="flex-1 px-6 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Markets Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Multiple Markets</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Trade across different asset classes and markets</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {markets.map((market, index) => (
              <button
                key={index}
                onClick={() => setSelectedMarket(index)}
                className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition transform hover:scale-105 cursor-pointer pop-on-click text-left"
              >
                <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                  <span className="text-3xl">{market.emoji}</span>
                  {market.name}
                </h3>
                <p className="text-gray-400 mb-4">{market.description}</p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm mb-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  {market.pairs}
                </div>
                <p className="text-cyan-400 text-sm font-semibold">Click to learn more →</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Detail Modal */}
      {selectedMarket !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedMarket(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{markets[selectedMarket].emoji}</span>
                {markets[selectedMarket].name}
              </h2>
              <button
                onClick={() => setSelectedMarket(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Market Image */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 mb-6 h-64 flex items-center justify-center border border-cyan-500/20">
                {markets[selectedMarket].image}
              </div>

              {/* Details */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Market Overview</h3>
                <p className="text-gray-300 leading-relaxed">{markets[selectedMarket].details}</p>
              </div>

              {/* Trading Hours */}
              <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-cyan-500/20">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">Trading Hours</h3>
                <p className="text-gray-300">{markets[selectedMarket].tradingHours}</p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Key Benefits</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {markets[selectedMarket].benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-gray-700/30 p-3 rounded-lg border border-cyan-500/20">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instruments */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">Popular Instruments</h3>
                <p className="text-gray-300">{markets[selectedMarket].pairs}</p>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMarket(null);
                    onNavigate?.('dashboard');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition"
                >
                  Trade Now
                </button>
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="flex-1 px-6 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Important Features</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Essential capabilities that set us apart</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {importantFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setSelectedImpFeature(index)}
                className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 hover:border-cyan-500/50 rounded-xl transition transform hover:scale-105 cursor-pointer pop-on-click text-left"
              >
                <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <p className="text-cyan-400 text-sm mt-3 font-semibold">Click to explore →</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Important Feature Detail Modal */}
      {selectedImpFeature !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedImpFeature(null)}>
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-3xl font-bold text-white">{importantFeatures[selectedImpFeature].title}</h2>
              <button
                onClick={() => setSelectedImpFeature(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Feature Image */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 mb-6 h-64 flex items-center justify-center border border-cyan-500/20">
                {importantFeatures[selectedImpFeature].image}
              </div>

              {/* Detailed Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{importantFeatures[selectedImpFeature].details}</p>
              </div>

              {/* Stats Grid */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {importantFeatures[selectedImpFeature].stats.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30 text-center">
                      <p className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedImpFeature(null);
                    onNavigate?.('dashboard');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setSelectedImpFeature(null)}
                  className="flex-1 px-6 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "24/7 Trading", value: "Automated" },
              { label: "Markets", value: "4+" },
              { label: "Symbols", value: "1000+" },
              { label: "Execution", value: "Instant" }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg text-center">
                <p className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">Join traders using automated strategies to maximize profits</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate?.('pricing')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button 
              onClick={generateDocumentation}
              className="px-8 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
            >
              View Docs
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Home;


