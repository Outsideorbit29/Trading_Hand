-- Create mt5_account_data table
CREATE TABLE IF NOT EXISTS public.mt5_account_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_id TEXT NOT NULL,
    account_number INTEGER NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    equity DECIMAL(15,2) NOT NULL DEFAULT 0,
    margin DECIMAL(15,2) NOT NULL DEFAULT 0,
    free_margin DECIMAL(15,2) NOT NULL DEFAULT 0,
    leverage INTEGER NOT NULL DEFAULT 1,
    profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    server TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, broker_id, account_number)
);

-- Create mt5_positions table
CREATE TABLE IF NOT EXISTS public.mt5_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_id TEXT NOT NULL,
    account_number INTEGER NOT NULL,
    ticket INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    type INTEGER NOT NULL, -- 0 = buy, 1 = sell
    volume DECIMAL(10,2) NOT NULL,
    price_open DECIMAL(10,5) NOT NULL,
    price_current DECIMAL(10,5) NOT NULL,
    profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    swap DECIMAL(15,2) NOT NULL DEFAULT 0,
    commission DECIMAL(15,2) NOT NULL DEFAULT 0,
    magic_number INTEGER,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mt5_trades table
CREATE TABLE IF NOT EXISTS public.mt5_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_id TEXT NOT NULL,
    account_number INTEGER NOT NULL,
    ticket INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    type INTEGER NOT NULL, -- 0 = buy, 1 = sell
    volume DECIMAL(10,2) NOT NULL,
    price_open DECIMAL(10,5) NOT NULL,
    price_close DECIMAL(10,5),
    profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    swap DECIMAL(15,2) NOT NULL DEFAULT 0,
    commission DECIMAL(15,2) NOT NULL DEFAULT 0,
    magic_number INTEGER,
    comment TEXT,
    open_time TIMESTAMP WITH TIME ZONE,
    close_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mt5_account_data_user_id ON public.mt5_account_data(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_account_data_broker_id ON public.mt5_account_data(broker_id);
CREATE INDEX IF NOT EXISTS idx_mt5_positions_user_id ON public.mt5_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_positions_account_number ON public.mt5_positions(account_number);
CREATE INDEX IF NOT EXISTS idx_mt5_trades_user_id ON public.mt5_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_trades_account_number ON public.mt5_trades(account_number);

-- Enable Row Level Security
ALTER TABLE public.mt5_account_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mt5_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mt5_trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own MT5 account data" ON public.mt5_account_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MT5 account data" ON public.mt5_account_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own MT5 account data" ON public.mt5_account_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own MT5 positions" ON public.mt5_positions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own MT5 trades" ON public.mt5_trades
    FOR SELECT USING (auth.uid() = user_id);
