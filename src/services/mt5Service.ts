import { supabase } from '../lib/supabase';

export interface MT5AccountData {
  id: string;
  account_number: number;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  leverage: number;
  profit: number;
  server: string;
  last_updated: string;
}

export interface MT5Position {
  id: string;
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  price_open: number;
  price_current: number;
  profit: number;
}

export interface MT5Trade {
  id: string;
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  price_open: number;
  price_close?: number;
  profit: number;
  open_time: string;
  close_time?: string;
}

export class MT5Service {
  // Get MT5 account data for current user
  async getAccountData(userId: string): Promise<MT5AccountData[]> {
    const { data, error } = await supabase
      .from('mt5_account_data')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Error fetching MT5 account data:', error);
      throw error;
    }

    return data || [];
  }

  // Get open positions
  async getOpenPositions(userId: string): Promise<MT5Position[]> {
    const { data, error } = await supabase
      .from('mt5_positions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching MT5 positions:', error);
      throw error;
    }

    return data || [];
  }

  // Get trade history
  async getTradeHistory(userId: string, limit = 50): Promise<MT5Trade[]> {
    const { data, error } = await supabase
      .from('mt5_trades')
      .select('*')
      .eq('user_id', userId)
      .order('open_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching MT5 trades:', error);
      throw error;
    }

    return data || [];
  }

  // Update MT5 account data (called from webhook)
  async updateAccountData(data: {
    user_id: string;
    broker_id: string;
    account_data: any;
  }) {
    const { error } = await supabase
      .from('mt5_account_data')
      .upsert({
        user_id: data.user_id,
        broker_id: data.broker_id,
        account_number: data.account_data.account_number,
        balance: data.account_data.balance,
        equity: data.account_data.equity,
        margin: data.account_data.margin,
        free_margin: data.account_data.free_margin,
        leverage: data.account_data.leverage,
        profit: data.account_data.profit,
        server: data.account_data.server,
        last_updated: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating MT5 account data:', error);
      throw error;
    }
  }
}

export const mt5Service = new MT5Service();
