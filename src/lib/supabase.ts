import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are properly configured
const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
    return false;
  }
  
  if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-anon-key')) {
    console.error('❌ Supabase configuration contains placeholders. Please update your .env file with actual credentials');
    console.error('📝 Visit your Supabase dashboard -> Settings -> API to get your credentials');
    return false;
  }
  
  return true;
};

// Create Supabase client with proper error handling
let supabaseClient: any = null;

try {
  if (isSupabaseConfigured()) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('✅ Supabase client initialized successfully');
  } else {
    // Create a mock client for development with better error messages
    supabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
          }),
          insert: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
          update: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
          delete: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
          upsert: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
        }),
      }),
      auth: {
        signIn: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
        signUp: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
        signOut: () => Promise.reject(new Error('Supabase not configured. Please check your .env file')),
      },
    };
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  // Fallback to mock client
  supabaseClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.reject(new Error('Supabase initialization failed')),
        }),
        insert: () => Promise.reject(new Error('Supabase initialization failed')),
        update: () => Promise.reject(new Error('Supabase initialization failed')),
        delete: () => Promise.reject(new Error('Supabase initialization failed')),
        upsert: () => Promise.reject(new Error('Supabase initialization failed')),
      }),
    }),
  };
}

export const supabase = supabaseClient;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          updated_at?: string;
        };
      };
      brokers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          api_key: string;
          api_secret: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          api_key: string;
          api_secret: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          api_key?: string;
          api_secret?: string;
          is_active?: boolean;
        };
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          broker_id: string;
          symbol: string;
          side: 'buy' | 'sell';
          quantity: number;
          entry_price: number;
          exit_price: number | null;
          profit_loss: number;
          status: 'open' | 'closed';
          market_type: 'forex' | 'crypto';
          created_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          broker_id: string;
          symbol: string;
          side: 'buy' | 'sell';
          quantity: number;
          entry_price: number;
          exit_price?: number | null;
          profit_loss?: number;
          status?: 'open' | 'closed';
          market_type: 'forex' | 'crypto';
          created_at?: string;
          closed_at?: string | null;
        };
        Update: {
          exit_price?: number | null;
          profit_loss?: number;
          status?: 'open' | 'closed';
          closed_at?: string | null;
        };
      };
    };
  };
};