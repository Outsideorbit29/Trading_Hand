import React, { useState } from 'react';
import { CheckCircleIcon } from './shared/Icons';

type Page = 'home' | 'dashboard' | 'history' | 'analytics' | 'profile' | 'features' | 'pricing';

interface PricingProps {
  onNavigate?: (page: Page) => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'plan-selection' | 'payment'>('plan-selection');
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0',
      period: '7 days',
      description: 'Get started with our platform risk-free',
        features: [
        'Access to dashboard',
        'Basic trading bot',
        'Limited trade history (100 trades)',
        'Email support',
        'MT5 trade sync',
        'Basic analytics'
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      color: 'cyan'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Perfect for active traders',
      features: [
        'Unlimited trades',
        'Advanced trading bot with AI',
        'Unlimited trade history',
        'Priority email support',
        'Advanced analytics',
        'Multiple strategies',
        'Real-time notifications',
        'Custom indicators'
      ],
      cta: 'Upgrade to Pro',
      highlighted: false,
      color: 'blue'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For professional trading firms',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'API access',
        'Webhook integration',
        'White-label solution',
        '24/7 phone support',
        'Custom development',
        'Volume discounts'
      ],
      cta: 'Contact Sales',
      highlighted: false,
      color: 'purple'
    }
  ];

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      setSelectedPlan(planId);
      setPaymentStep('payment');
    } else {
      setSelectedPlan(planId);
      setPaymentStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    alert(`Payment for ${plans.find(p => p.id === selectedPlan)?.name} plan submitted successfully!\n\nCard: ${paymentData.cardNumber.slice(-4)}\nEmail: ${paymentData.email}`);
    
    // Reset form
    setPaymentData({ cardName: '', cardNumber: '', expiryDate: '', cvv: '', email: '' });
    setSelectedPlan(null);
    setPaymentStep('plan-selection');
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300">
            Choose the plan that fits your trading needs
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          {paymentStep === 'plan-selection' ? (
            <>
              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-8 rounded-xl border transition transform hover:scale-105 ${
                      plan.highlighted
                        ? `border-${plan.color}-500/50 bg-gradient-to-br from-${plan.color}-500/10 to-purple-500/10 ring-2 ring-${plan.color}-500/30`
                        : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-6 text-sm">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>

                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 mb-8 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'border-2 border-cyan-400 hover:bg-cyan-400/10 text-cyan-400'
                      }`}
                    >
                      {plan.cta}
                    </button>

                    <div className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircleIcon />
                          </div>
                          <span className="text-gray-200 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-24">
                <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

                <div className="max-w-3xl mx-auto space-y-6">
                  {[
                    {
                      q: 'Can I cancel my subscription anytime?',
                      a: 'Yes! You can cancel your subscription at any time from your account settings. No questions asked.'
                    },
                    {
                      q: 'Is there a credit card required for the free trial?',
                      a: 'No credit card is required for the 7-day free trial. You can upgrade anytime during or after the trial.'
                    },
                    {
                      q: 'Do you offer refunds?',
                      a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
                    },
                    {
                      q: 'Can I upgrade or downgrade my plan?',
                      a: 'Absolutely! You can change your plan at any time. Changes take effect on your next billing cycle.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition">
                      <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                      <p className="text-gray-300">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Payment Form */}
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <h2 className="text-2xl font-bold text-white mb-2">Payment for {selectedPlanData?.name}</h2>
                  <p className="text-cyan-400 text-lg">
                    {selectedPlanData?.price} {selectedPlanData?.period}
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={paymentData.email}
                      onChange={handlePaymentChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label className="block text-white font-semibold mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-white font-semibold mb-2">CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        required
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-white transition transform hover:scale-105"
                    >
                      Complete Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('plan-selection')}
                      className="flex-1 px-6 py-3 border-2 border-cyan-400 hover:bg-cyan-400/10 rounded-lg font-bold text-cyan-400 transition"
                    >
                      Back
                    </button>
                  </div>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </>
          )}
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

export default Pricing;
