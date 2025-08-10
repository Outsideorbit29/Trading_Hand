# Exness MT5 to Website Connection Guide

## Overview
This guide explains how to connect your Exness MT5 account data to your website using the provided solution.

## Components Created

### 1. Backend API
- **File**: `project/supabase/functions/mt5-webhook/index.ts`
- **Purpose**: Receives MT5 data via webhook and stores it in Supabase
- **Endpoint**: `https://your-project.supabase.co/functions/v1/mt5-webhook`

### 2. MQL5 Script
- **File**: `project/mt5-scripts/ExnessDataBridge.mq5`
- **Purpose**: Runs in MT5 to fetch account data and send to your website
- **Features**: 
  - Real-time account balance, equity, margin
  - Open positions
  - Trade history
  - Configurable update interval

### 3. Database Schema
- **File**: `project/supabase/migrations/20250729170000_add_mt5_account_data.sql`
- **Purpose**: Stores MT5 account data, positions, and trades

### 4. Frontend Service
- **File**: `project/src/services/mt5Service.ts`
- **Purpose**: React service to fetch and display MT5 data

### 5. Dashboard Component
- **File**: `project/src/components/MT5Dashboard.tsx`
- **Purpose**: React component to display MT5 account data

## Setup Instructions

### Step 1: Deploy Supabase Functions
```bash
cd project/supabase/functions/mt5-webhook
supabase functions deploy mt5-webhook
```

### Step 2: Run Database Migration
```bash
supabase db reset
supabase db push
```

### Step 3: Configure MQL5 Script
1. Open MT5 platform
2. Open MetaEditor (F4)
3. Create new script: `ExnessDataBridge.mq5`
4. Copy the content from `project/mt5-scripts/ExnessDataBridge.mq5`
5. Update these parameters:
   - `WebhookUrl`: Your Supabase function URL
   - `AuthToken`: Your Supabase anon key
   - `UserId`: Your user ID
   - `BrokerId`: 'exness-mt5'

### Step 4: Install MQL5 Script
1. Compile the script in MetaEditor
2. Run the script in MT5
3. The script will automatically send data every 30 seconds

### Step 5: Configure Environment Variables
Add to your `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 6: Use in React Components
```tsx
import { MT5Dashboard } from './components/MT5Dashboard';

// In your component
<MT5Dashboard brokerId="exness-mt5" />
```

## API Endpoints

### Webhook Endpoint
- **URL**: `POST /api/mt5/webhook`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body**:
```json
{
  "user_id": "user-uuid",
  "broker_id": "exness-mt5",
  "account_data": {
    "account_number": 123456,
    "balance": 10000.00,
    "equity": 10500.00,
    "margin": 1000.00,
    "free_margin": 9500.00,
    "leverage": 100,
    "profit": 500.00,
    "server": "Exness-MT5"
  }
}
```

## Security Considerations
1. Use HTTPS for all communications
2. Implement proper authentication
3. Validate all incoming data
4. Use environment variables for sensitive data
5. Implement rate limiting on webhooks

## Testing
1. Run the MQL5 script in MT5
2. Check Supabase dashboard for incoming data
3. Verify data display in React components
4. Test error handling

## Troubleshooting
- Check MT5 logs for script errors
- Verify webhook URL is accessible
- Check Supabase logs for function errors
- Ensure proper authentication tokens

## Support
For issues or questions, please check the troubleshooting section or create an issue in the project repository.
