# TradeTracker Pro

A comprehensive portfolio management platform for tracking and analyzing trading performance across multiple brokers and markets.

## Features

- **Portfolio Dashboard**: Real-time overview of your trading performance with key metrics
- **Trade Management**: Add, track, and manage trades across forex and crypto markets
- **Advanced Analytics**: Detailed performance metrics, charts, and insights
- **Broker Integration**: Connect multiple brokers and manage API credentials securely
- **Guest Mode**: Try the platform with sample data without creating an account
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Framer Motion animations
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Chart.js and Recharts
- **Icons**: Heroicons and Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tradetracker-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
Run the migrations in your Supabase project to create the required tables and functions.

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Setup

The application requires the following database tables:

### Tables
- `profiles` - User profile information
- `brokers` - Connected broker accounts
- `trades` - Individual trade records

### Key Features
- Row Level Security (RLS) enabled on all tables
- Automatic profile creation on user registration
- Profit/loss calculation triggers
- Proper foreign key relationships

### Migrations
All database migrations are located in `supabase/migrations/`. Make sure to run them in your Supabase project:

1. `20250728142527_restless_base.sql` - Initial schema setup
2. `20250729164726_black_lab.sql` - Additional schema updates
3. `fix_user_registration_trigger.sql` - User registration trigger fix

## Usage

### Authentication
- **Sign Up**: Create a new account with email and password
- **Sign In**: Log in with existing credentials
- **Guest Mode**: Try the platform with sample data

### Managing Trades
1. Navigate to the Trades page
2. Click "Add Trade" to record a new trade
3. Fill in trade details (symbol, side, quantity, prices)
4. Track open trades and view closed trade performance

### Broker Integration
1. Go to the Brokers page
2. Click "Add Broker" to connect a new broker
3. Enter broker name and API credentials
4. Manage broker connections and sync data

### Analytics
View comprehensive analytics including:
- Win/loss distribution
- Market type breakdown
- Monthly P&L trends
- Performance metrics

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── pages/              # Main application pages
├── lib/                # Utility libraries and configurations
├── utils/              # Helper functions
└── types/              # TypeScript type definitions
```

## Key Components

- **AuthContext**: Manages user authentication state
- **PortfolioContext**: Handles trade and broker data
- **Layout**: Main application layout with navigation
- **Dashboard**: Portfolio overview and key metrics
- **TradeList**: Comprehensive trade management interface
- **AnalyticsCharts**: Advanced charting and visualizations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key | Yes |

## Security Features

- Row Level Security (RLS) on all database tables
- Encrypted API credential storage
- User-specific data isolation
- Secure authentication with Supabase Auth

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier formatting (configured in ESLint)

## Troubleshooting

### Common Issues

1. **Missing Supabase environment variables**
   - Ensure `.env` file exists with correct Supabase credentials
   - Check that variables are prefixed with `VITE_`

2. **Database error saving new user**
   - Run the `fix_user_registration_trigger.sql` migration
   - Ensure all database migrations have been applied

3. **Authentication issues**
   - Verify Supabase project settings
   - Check that email confirmation is disabled in Supabase Auth settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.