import React from 'react';

type Page = 'home' | 'dashboard' | 'history' | 'analytics' | 'profile' | 'features' | 'pricing';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

// Simple Social Icons
const FacebookIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-2.313-.278-4.369-.278-4.814 0-8.121 2.755-8.121 7.835v2.443z"/>
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"/>
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
  </svg>
);

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', page: 'features' as Page },
      { label: 'Pricing', page: 'pricing' as Page },
      { label: 'Dashboard', page: 'dashboard' as Page },
      { label: 'Trade History', page: 'history' as Page }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Video Tutorials', href: '#tutorials' },
      { label: 'Community Forum', href: '#forum' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Risk Disclosure', href: '#risk' },
      { label: 'Compliance', href: '#compliance' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <LinkedInIcon />, url: 'https://linkedin.com' },
    { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com' }
  ];

  const contactInfo = [
    { label: 'Email', value: 'support@tradinghand.com', icon: '📧' },
    { label: 'Phone', value: '+1 (555) TRADE-1', icon: '📞' },
    { label: 'Address', value: '123 Trading Street, New York, NY 10001', icon: '📍' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-700 text-gray-300">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Logo and Description */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-xl font-bold text-white">Trading Hand</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Automate your trading with AI-powered strategies and real-time analytics. Trade smarter, not harder.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    title={social.name}
                    className="w-10 h-10 bg-gray-800 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500/50 rounded-lg flex items-center justify-center transition text-cyan-400 hover:text-cyan-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-gray-400 hover:text-cyan-400 transition text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-800">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">{info.label}</p>
                    <p className="text-white font-medium">{info.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-8 mb-12 border border-cyan-500/20">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Get the latest trading tips and platform updates delivered to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} Trading Hand. All rights reserved.</p>
              <p className="mt-2">Designed and developed with ❤️ for traders worldwide.</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 md:justify-end">
              {footerLinks.legal.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-800/50 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm text-gray-400 hover:text-cyan-400 transition flex items-center gap-2"
          >
            <span>↑</span> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
