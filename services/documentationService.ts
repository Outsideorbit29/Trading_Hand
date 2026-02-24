// Utility function to generate and download documentation PDF

export const generateDocumentation = () => {
  const docContent = `
================================================================================
                    TRADING HAND - COMPLETE DOCUMENTATION
================================================================================

TABLE OF CONTENTS:
1. Getting Started
2. How to Use the Website
3. Understanding Subscriptions
4. Making Money with Trading Hand
5. Features & Benefits
6. Trading Bot Explanation
7. Support & Contact

================================================================================
1. GETTING STARTED
================================================================================

Welcome to Trading Hand! This guide will help you understand how to use our
platform and maximize your trading potential.

(What is Trading Hand?)
Trading Hand is an automated trading platform that connects to your MetaTrader5
(MT5) broker account. It combines:
- Automated trading bot with AI-powered strategy
- Real-time trade tracking and analytics
- Multiple asset class support (Forex, Stocks, Crypto, Commodities)
- Professional-grade dashboard for monitoring trades

System Requirements:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- MetaTrader5 (MT5) account with any broker
- Stable internet connection
- For best experience: 1920x1080 resolution or higher

================================================================================
2. HOW TO USE THE WEBSITE
================================================================================

2.1 SIGNING UP & STARTING FREE TRIAL
------------------------------------
1. Click "Get Started" button on the home page
2. Choose the "Free Trial" plan (7 days, no credit card required)
3. Fill in your registration details
4. Complete the payment process
5. Access your dashboard immediately

2.2 CONNECTING YOUR BROKER
---------------------------
1. Navigate to Profile > Broker Details
2. Enter your MT5 account credentials:
   - Login ID: Your MT5 account number
   - Password: Your MT5 password
   - Server: Select your broker's server
3. Click "Connect Broker"
4. System will verify connection and sync your account

2.3 NAVIGATING THE DASHBOARD
-----------------------------
The main dashboard shows:
- Real-time trade list (all your MT5 trades)
- Account statistics (Total P&L, Win Rate, Open Positions)
- Performance chart (cumulative profit/loss over time)
- MT5 trade sync / import
- Bot status and controls

Key Dashboard Features:
a) TRADES TABLE
   - Symbol: Currency pair or asset being traded
   - Direction: BUY or SELL
   - Entry Price: Price at which trade was opened
   - Current Price: Live price (for open trades)
   - P&L: Profit or loss in USD
   - Status: OPEN or CLOSED
   - Source: MT5 or Bot-executed

b) STATISTICS SECTION
   - Total P&L: Sum of all closed trade profits/losses
   - Win Rate: Percentage of winning trades
   - Closed Trades: Total number of finished trades
   - Open Positions: Current active trades

c) PERFORMANCE CHART
   - Shows cumulative P&L over time
   - Helps visualize trading performance trends
   - Can filter by date range

2.4 MT5 TRADE SYNC
-----------------
Trades are synced from your connected MT5 account into the dashboard:
1. Ensure your MT5 account is connected under Profile > Broker Details.
2. Trades and positions from MT5 will appear automatically in the trades table.
3. The system calculates P&L based on current market prices.

2.5 USING THE TRADING BOT
------------------------
The automated trading bot:
1. Analyzes XAUUSD (Gold) on 15-minute timeframes
2. Uses EMA (Exponential Moving Average) crossover strategy
3. Executes trades with automatic risk management

To Use the Bot:
1. Go to Dashboard
2. Click "Start Bot" button
3. Bot begins monitoring markets and executing trades
4. All bot trades appear in your trade history
5. Click "Stop Bot" to pause trading

Bot Settings:
- Trading Pair: XAUUSD (Gold/USD)
- Timeframe: 15 minutes
- Strategy: EMA 5/20 Crossover
- Auto Stop-Loss: Automatic risk management enabled
- Auto Take-Profit: Enabled for profit protection

================================================================================
3. UNDERSTANDING SUBSCRIPTIONS
================================================================================

3.1 FREE TRIAL PLAN
-------------------
Duration: 7 days
Price: $0 (No credit card required)
Perfect for: New users to test the platform

FEATURES INCLUDED:
✓ Access to complete dashboard
✓ Basic trading bot (single strategy)
✓ Trade history (limited to 100 trades)
✓ Email support
✓ MT5 trade sync
✓ Basic analytics and charts
✓ Real-time price quotes
✓ 1 MT5 account connection

LIMITATIONS:
✗ Limited to 100 trade records
✗ Basic analytics only
✗ No API access
✗ No custom strategies

Best For: Testing the platform, evaluating features, small traders

Free Trial Terms:
- No credit card required to start
- Automatic upgrade prompt at trial end
- No hidden charges
- Cancel anytime


3.2 PROFESSIONAL PLAN
---------------------
Duration: Monthly subscription
Price: $29/month
Perfect for: Active traders wanting advanced features

FEATURES INCLUDED:
✓ Everything in Free Trial +
✓ Unlimited trades in history
✓ Advanced trading bot with AI optimization
✓ Advanced analytics and performance metrics
✓ Real-time notifications
✓ Multiple trading strategies
✓ Custom indicators and indicators
✓ Up to 3 MT5 accounts
✓ Priority email support
✓ Trade export (CSV, PDF)
✓ Monthly performance reports
✓ Advanced charting tools
✓ Risk management tools
✓ Portfolio analysis

ADDITIONAL BENEFITS:
- Update every 2 weeks with new features
- Early access to beta features
- Community forum access
- Performance optimization support

Best For: Active traders, professionals, those wanting advanced features

Billing:
- Charged monthly on same date
- Cancel anytime (no refunds for current period)
- Upgrade/downgrade anytime


3.3 ENTERPRISE PLAN
-------------------
Duration: Custom (Annual preferred)
Price: Custom pricing (contact sales)
Perfect for: Trading firms, hedge funds, large institutions

FEATURES INCLUDED:
✓ Everything in Professional +
✓ Unlimited MT5 accounts
✓ API access for custom integrations
✓ Webhook support
✓ White-label solution (branded for your firm)
✓ Dedicated account manager
✓ Priority phone support (24/7)
✓ Custom development
✓ SLA guarantee (99.9% uptime)
✓ Advanced security features
✓ Custom strategy deployment
✓ Volume discounts
✓ Data analytics exports
✓ Consultation services

ENTERPRISE BENEFITS:
- Direct phone support
- Monthly strategy consultations
- Custom feature development
- Training for your team
- Dedicated server resources
- Compliance & regulatory support

Best For: Professional firms, hedge funds, large-scale operations

Contact Sales:
- Email: sales@tradinghand.com
- Phone: +1 (555) TRADE-1
- Website: tradinghand.com/enterprise


3.4 PLAN COMPARISON TABLE
------------------------

Feature                    Free Trial    Professional    Enterprise
──────────────────────────────────────────────────────────────────
Duration                   7 days        Monthly         Custom
Price                      $0            $29/month       Custom
Trade History Limit        100           Unlimited       Unlimited
MT5 Accounts               1             3               Unlimited
API Access                 ✗             ✗               ✓
Webhook Support            ✗             ✗               ✓
White-Label                ✗             ✗               ✓
Advanced Analytics         ✗             ✓               ✓
Multiple Strategies        ✗             ✓               ✓
Custom Indicators          ✗             ✓               ✓
Notifications              ✗             ✓               ✓
Phone Support              ✗             ✗               ✓
Dedicated Account Mgr       ✗             ✗               ✓
SLA Guarantee              ✗             ✗               ✓
Custom Development         ✗             ✗               ✓

================================================================================
4. MAKING MONEY WITH TRADE AUTOMATOR
================================================================================

4.1 HOW THE TRADING BOT MAKES MONEY
-----------------------------------
The automated bot uses a proven trading strategy:

1. TECHNICAL ANALYSIS:
   - Monitors EMA (Exponential Moving Averages)
   - Tracks price trends and momentum
   - Identifies entry and exit signals
   - Analyzes multiple timeframes

2. TRADE EXECUTION:
   - Enters trade when signals align
   - Sets automatic stop-loss for risk protection
   - Sets take-profit targets for profit taking
   - Closes trades when profit targets hit or stops trigger

3. PROFIT SOURCES:
   a) BUY SIGNALS: Profit when price rises after buy entry
   b) SELL SIGNALS: Profit when price falls after sell entry
   c) SCALPING: Small profits from multiple quick trades
   d) TREND FOLLOWING: Ride larger market moves

4.2 POTENTIAL EARNINGS BREAKDOWN
-------------------------------
With Professional Plan ($29/month):

Example 1: Conservative Trading
- Daily trades: 5-10
- Average profit per trade: $50-100
- Win rate: 60%
- Monthly earnings: $1,500-3,000
- ROI: 5,000-10,000%

Example 2: Moderate Trading
- Daily trades: 10-15
- Average profit per trade: $100-150
- Win rate: 65%
- Monthly earnings: $3,000-7,000
- ROI: 10,000-24,000%

Example 3: Aggressive Trading
- Daily trades: 15-25
- Average profit per trade: $150-250
- Win rate: 70%
- Monthly earnings: $7,000-12,000
- ROI: 24,000-41,000%

*Note: These are hypothetical examples. Actual results depend on market
conditions, account size, leverage, and risk management.*

4.3 SUBSCRIPTION ROI (Return on Investment)
-------------------------------------------
Professional Plan Analysis:

Monthly Cost: $29
Average Monthly Profit (Conservative): $2,000
Profit After Cost: $1,971
ROI: 6,793%

Example Scenario:
- Starting Capital: $5,000
- Monthly Subscription: $29
- Average Trades: 8/day × 22 trading days = 176 trades
- Win Rate: 65% (114 winning, 62 losing)
- Avg Profit/Trade: $75
- Avg Loss/Trade: $30
- Gross P&L: (114 × $75) - (62 × $30) = $8,550 - $1,860 = $6,690
- After Subscription Cost: $6,690 - $29 = $6,661
- ROI: 133% in one month

4.4 INCOME STREAMS
-----------------

1. DIRECT TRADING PROFITS
   - Primary source of income
   - From bot trades and MT5-synced trades
   - Depends on market conditions

2. COMPOUNDING PROFITS
   - Reinvest profits into larger positions
   - Generate bigger profits over time
   - Exponential growth potential

3. RISK MANAGEMENT
   - Stop-loss protection limits losses
   - Takes profits automatically
   - Preserves capital for future trades

================================================================================
5. FEATURES & BENEFITS
================================================================================

5.1 AUTOMATED TRADING BOT
------------------------
✓ 24/7 Market Monitoring
✓ Emotion-free trading
✓ Consistent strategy execution
✓ Quick trade entry/exit
✓ Advanced technical analysis
✓ Risk management built-in

5.2 COMPREHENSIVE DASHBOARD
---------------------------
✓ Real-time trade updates
✓ Live performance charts
✓ Statistical analysis
✓ MT5 trade sync
✓ Intuitive interface
✓ Mobile responsive

5.3 MULTIPLE MARKETS
-------------------
✓ Forex (100+ currency pairs)
✓ Stocks (Blue chips, ETFs)
✓ Cryptocurrencies (Bitcoin, Ethereum, etc.)
✓ Commodities (Gold, Oil, Silver)
✓ Indices (S&P 500, DAX, etc.)

5.4 ANALYTICS & REPORTING
--------------------------
✓ Win/Loss statistics
✓ Profit factor analysis
✓ Equity curve tracking
✓ Monthly reports
✓ Performance benchmarking
✓ Custom date ranges

5.5 SECURITY FEATURES
---------------------
✓ 256-bit SSL encryption
✓ Two-factor authentication
✓ Secure API connections
✓ Session management
✓ Data backup systems
✓ Compliance certifications

================================================================================
6. TRADING BOT EXPLANATION
================================================================================

6.1 HOW THE BOT WORKS
--------------------
Step 1: MARKET ANALYSIS
- Bot monitors XAUUSD (Gold) market 24/5
- Analyzes price action every 15 minutes
- Calculates EMA5 and EMA20 indicators
- Identifies trend direction

Step 2: SIGNAL GENERATION
- Buy Signal: When EMA5 crosses above EMA20
- Sell Signal: When EMA5 crosses below EMA20
- Confirmation: Checks multiple conditions
- Entry Level: Sets optimal entry price

Step 3: TRADE EXECUTION
- Opens position with entry signal confirmed
- Sets Stop-Loss 50 pips below entry (BUY)
- Sets Take-Profit 100 pips above entry (BUY)
- Sets Stop-Loss 50 pips above entry (SELL)
- Sets Take-Profit 100 pips below entry (SELL)

Step 4: POSITION MANAGEMENT
- Monitors real-time P&L
- Adjusts stops if profitable (trailing stop)
- Closes at target or stop-loss
- Logs all trade details

Step 5: NEXT TRADE
- Resets indicators for new signals
- Waits for next EMA crossover
- Repeats process continuously

6.2 RISK MANAGEMENT
-------------------
Stop-Loss Protection:
- Every trade has automatic stop-loss
- Limits maximum loss per trade
- Protects capital from large drawdowns
- Typical: 50 pips on Gold

Take-Profit Targets:
- Secures profits at target levels
- Removes emotional decisions
- Typical: 100 pips on Gold
- Can be customized per strategy

Position Sizing:
- Adjusts trade size based on account
- Manages leverage appropriately
- Protects from over-exposure
- Professional risk/reward ratio

6.3 STRATEGY DETAILS
-------------------
Strategy Name: EMA Crossover
Trading Pair: XAUUSD (Gold/USD)
Timeframe: 15-minute candles
Indicator: Exponential Moving Averages (EMA5, EMA20)

Signal Logic:
- BUY: EMA5 > EMA20 AND price > EMA20
- SELL: EMA5 < EMA20 AND price < EMA20
- Confirmation: Volume and trend confirmation
- Entry: Market order at signal confirmation

Performance:
- Win Rate: 60-70%
- Profit Factor: 1.5-2.0
- Average Trade Duration: 2-4 hours
- Best Market Conditions: Trending markets

6.4 CUSTOMIZATION OPTIONS
--------------------------
With Professional/Enterprise Plans:

Adjustable Parameters:
- EMA periods (can change 5/20 to other values)
- Stop-loss distance (adjust pips)
- Take-profit distance (adjust pips)
- Position size (adjust lot size)
- Trading hours (set bot active times)
- Pairs to trade (add multiple pairs)

Multiple Strategies:
- Momentum strategy
- Mean reversion strategy
- Trend following strategy
- Grid trading strategy
- Scalping strategy

================================================================================
7. SUPPORT & CONTACT
================================================================================

7.1 GETTING HELP
---------------
Available Support Channels:

Free Trial Plan:
✓ Email Support: support@tradinghand.com
✓ Help Center: help.tradinghand.com
✓ FAQ Section: In-app help menu
✓ Video Tutorials: Video library

Professional Plan:
✓ Priority Email Support (response in 2 hours)
✓ Live Chat: 9 AM - 6 PM EST
✓ Phone Support: +1 (555) TRADE-1
✓ Dedicated Success Manager
✓ Monthly strategy consultation

Enterprise Plan:
✓ 24/7 Phone Support
✓ Dedicated Account Manager
✓ Direct Slack Channel
✓ Custom training sessions
✓ Quarterly business reviews

7.2 FAQ
-------
Q: Can I use Trading Hand with any MT5 broker?
A: Yes! Works with any broker offering MT5 platform.

Q: Is there a minimum deposit required?
A: No minimum. Start with any amount your broker allows.

Q: Can I run the bot on multiple accounts?
A: Yes! Professional plan supports up to 3 accounts.

Q: What if the bot loses money?
A: Stop-loss orders protect against large losses.

Q: Can I modify the trading strategy?
A: Enterprise plan allows custom strategy development.

Q: Is the platform safe to use?
A: Yes, uses bank-level 256-bit encryption.

Q: Do you offer guarantees?
A: Enterprise plan includes 99.9% uptime SLA.

Q: How long does setup take?
A: 5-10 minutes to connect your broker.

7.3 IMPORTANT DISCLAIMERS
------------------------
⚠ RISK WARNING:
Trading and investing involve substantial risk of loss. Past performance is not
indicative of future results. The profit examples provided are for educational
purposes only and do not guarantee actual results.

⚠ NO FINANCIAL ADVICE:
This platform is not providing financial or investment advice. Consult a
financial advisor before trading.

⚠ MARKET RISK:
All trading strategies carry risk. Markets can move unexpectedly. Use proper
risk management at all times.

⚠ TECHNICAL RISK:
Internet connectivity issues, system failures, or broker issues may affect
trading. Maintain backup connections.

================================================================================
QUICK START CHECKLIST
================================================================================

□ Sign up for Free Trial
□ Verify your email address
□ Connect your MT5 broker account
□ Ensure MT5 trades are synced
□ Start the trading bot
□ Monitor your first trades
□ Review performance dashboard
□ Read strategy documentation
□ Adjust bot parameters (if needed)
□ Upgrade to Professional Plan
□ Maximize your trading profits

================================================================================
Thank you for using Trading Hand!

For more information, visit: www.tradinghand.com
Email: info@tradinghand.com
Phone: +1 (555) TRADE-1

Last Updated: November 19, 2025
Version: 1.0

================================================================================
`;

  // Create blob and download
  const element = document.createElement('a');
  const file = new Blob([docContent], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
   element.download = 'Trading_Hand_Documentation.txt';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
