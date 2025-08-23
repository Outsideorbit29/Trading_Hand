import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { account_data, user_id, broker_id } = await req.json()

    // Validate required fields
    if (!account_data || !user_id || !broker_id) {
      throw new Error('Missing required fields')
    }

    // Validate account data structure
    if (!account_data.account_number || !account_data.balance === undefined) {
      throw new Error('Invalid account data structure: missing required fields');
    }

    // Store MT5 account data
    const { data, error } = await supabaseClient
      .from('mt5_account_data')
      .upsert({
        user_id,
        broker_id,
        account_number: account_data.account_number,
        balance: account_data.balance || 0,
        equity: account_data.equity || 0,
        margin: account_data.margin || 0,
        free_margin: account_data.free_margin || 0,
        leverage: account_data.leverage || 1,
        profit: account_data.profit || 0,
        server: account_data.server || 'unknown',
        last_updated: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('❌ Database error in MT5 webhook:', {
        error,
        user_id,
        broker_id,
        account_number: account_data.account_number,
        error_code: error.code,
        error_details: error.details
      });
      
      if (error.code === '42P01') {
        throw new Error('MT5 account data table does not exist. Please run database migrations');
      } else if (error.code === '42501') {
        throw new Error('Permission denied. Check database row-level security policies');
      } else if (error.code === '23505') {
        throw new Error('Duplicate account data entry');
      }
      
      throw new Error(`Database operation failed: ${error.message || 'Unknown error'}`);
    }

    console.log('✅ MT5 account data saved successfully:', {
      user_id,
      broker_id,
      account_number: account_data.account_number,
      record_count: data?.length || 0
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'MT5 account data saved successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('❌ Error in MT5 webhook:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        details: 'Check server logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
