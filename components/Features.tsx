import React, { useState } from 'react';
import { ZapIcon, HistoryIcon, BrainIcon, GlobeIcon, TrendingUpIcon, BarChart3Icon, CheckCircleIcon } from './shared/Icons';

type Page = 'home' | 'dashboard' | 'history' | 'analytics' | 'profile' | 'features';

interface FeaturesProps {
  onNavigate?: (page: Page) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', query: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  const detailedFeatures = [
    {
      icon: <ZapIcon />,
      title: "Automated Trading Bot",
      description: "Our intelligent trading bot executes trades 24/7 without manual intervention.",
      benefits: [
        "24/7 automated trading coverage",
        "Technical analysis-based entry and exit signals",
        "Real-time market monitoring",
        "Customizable trading parameters",
        "Risk management with stop-loss and take-profit",
        "Multi-timeframe analysis support"
      ]
    },
    {
      icon: <HistoryIcon />,
      title: "Complete Trade History",
      description: "Track every single trade with comprehensive historical data and analytics.",
        benefits: [
        "Detailed trade records with timestamps",
        "Entry and exit price tracking",
        "Profit/loss calculations",
        "Trade duration and timeframes",
        "MT5 vs automated trade classification",
        "Export trade data to CSV or PDF"
      ]
    },
    {
      icon: <BrainIcon />,
      title: "AI-Powered Insights",
      description: "Advanced AI algorithms analyze your trading patterns and provide actionable insights.",
      benefits: [
        "Pattern recognition and trend analysis",
        "Performance metrics and statistics",
        "Risk/reward ratio optimization",
        "Win rate calculations",
        "Trading behavior analysis",
        "Personalized recommendations"
      ]
    },
    {
      icon: <GlobeIcon />,
      title: "Multiple Markets",
      description: "Trade across diverse asset classes on major global exchanges.",
      benefits: [
        "Forex trading (100+ currency pairs)",
        "Stock market access (US, EU, Asia)",
        "Cryptocurrency trading (Bitcoin, Ethereum, etc.)",
        "Commodity trading (Gold, Oil, Silver)",
        "Low spreads and commissions",
        "Real-time price feeds"
      ]
    },
    {
      icon: <BarChart3Icon />,
      title: "Advanced Analytics Dashboard",
      description: "Beautiful and intuitive dashboards to visualize all your trading metrics.",
      benefits: [
        "Real-time performance charts",
        "Cumulative P&L tracking",
        "Win/loss ratio visualization",
        "Equity curve analysis",
        "Monthly and yearly statistics",
        "Customizable chart indicators"
      ]
    },
    {
      icon: <TrendingUpIcon />,
      title: "1000+ Trading Symbols",
      description: "Access thousands of tradeable instruments across all major asset classes.",
      benefits: [
        "Major forex pairs and exotics",
        "Blue-chip stocks and ETFs",
        "Crypto assets and altcoins",
        "Precious metals and commodities",
        "Index futures",
        "Real-time quotes and depth"
      ]
    }
  ];

  const benefits = [
    {
      title: "Save Time & Effort",
      description: "Let the bot handle repetitive trading tasks while you focus on strategy development.",
      icon: "⏱️"
    },
    {
      title: "Emotion-Free Trading",
      description: "Automated execution eliminates emotional decisions and impulsive trades.",
      icon: "🧠"
    },
    {
      title: "24/7 Market Coverage",
      description: "Trade while you sleep across different time zones and markets.",
      icon: "🌍"
    },
    {
      title: "Data-Driven Decisions",
      description: "Make decisions based on comprehensive analytics and historical performance data.",
      icon: "📊"
    },
    {
      title: "Risk Management",
      description: "Built-in stop-loss and take-profit mechanisms protect your capital.",
      icon: "🛡️"
    },
    {
      title: "Scalability",
      description: "Manage multiple trading strategies and accounts simultaneously.",
      icon: "📈"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Features & Benefits
          </h1>
          <p className="text-xl text-gray-300">
            Discover how Trading Hand can revolutionize your trading experience
          </p>
        </div>
      </div>

      {/* Detailed Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Comprehensive Features</h2>
          
          {detailedFeatures.map((feature, index) => (
            <div key={index} className="mb-16 p-8 bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-cyan-500/50">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-6 text-lg">{feature.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircleIcon />
                        </div>
                        <span className="text-gray-200">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Key Benefits</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Why traders choose Trading Hand</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition transform hover:scale-105">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Trading Hand?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: "50,000+", label: "Active Traders" },
              { stat: "$100M+", label: "Trading Volume" },
              { stat: "99.9%", label: "Uptime" },
              { stat: "24/7", label: "Support Available" }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg text-center">
                <p className="text-4xl font-bold text-cyan-400 mb-2">{item.stat}</p>
                <p className="text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-t border-cyan-500/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Have questions or need assistance? We're here to help!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Query Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Your Query *</label>
              <textarea
                name="query"
                value={formData.query}
                onChange={handleInputChange}
                required
                placeholder="Tell us how we can help..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold text-white transition transform hover:scale-105"
            >
              {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                ✗ Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-700">
        <button
          onClick={() => onNavigate?.('home')}
          className="px-8 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Features;
