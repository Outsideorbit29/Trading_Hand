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

    // Store MT5 account data
    const { data, error } = await supabaseClient
      .from('mt5_account_data')
      .upsert({
        user_id,
        broker_id,
        account_number: account_data.account_number,
        balance: account_data.balance,
        equity: account_data.equity,
        margin: account_data.margin,
        free_margin: account_data.free_margin,
        leverage: account_data.leverage,
        profit: account_data.profit,
        server: account_data.server,
        last_updated: new Date().toISOString(),
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
