import { supabase } from './supabase';

export interface BrokerCredentials {
  server?: string;
  login?: string;
  password?: string;
  investor_password?: string;
  api_key?: string;
  api_secret?: string;
  request_token?: string;
  username?: string;
  account_id?: string;
}

export const saveBrokerConnection = async (
  userId: string,
  brokerName: string,
  credentials: BrokerCredentials
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  try {
    // Encrypt sensitive credentials before storing (in a real app, use proper encryption)
    const encryptedCredentials = btoa(JSON.stringify(credentials));
    
    const { error } = await supabase
      .from('brokers')
      .insert({
        user_id: userId,
        name: brokerName,
        api_key: credentials.api_key || credentials.login || '',
        api_secret: credentials.password || credentials.api_secret || '',
        is_active: true,
      });

    if (error) {
      console.error('Error saving broker connection:', error);
      throw new Error(error.message || 'Failed to save broker connection');
    }
  } catch (error) {
    console.error('Error in saveBrokerConnection:', error);
    throw error;
  }
};

// Utility function to get all broker connections for a user
export const getBrokerConnections = async (userId: string) => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching broker connections:', error);
    throw new Error(error.message || 'Failed to fetch broker connections');
  }

  return data || [];
};

// Utility function to delete a broker connection
export const deleteBrokerConnection = async (brokerId: string) => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { error } = await supabase
    .from('brokers')
    .delete()
    .eq('id', brokerId);

  if (error) {
    console.error('Error deleting broker connection:', error);
    throw new Error(error.message || 'Failed to delete broker connection');
  }
};

// Utility function to update a broker connection
export const updateBrokerConnection = async (
  brokerId: string,
  updates: Partial<{
    name: string;
    api_key: string;
    api_secret: string;
    is_active: boolean;
  }>
) => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { error } = await supabase
    .from('brokers')
    .update(updates)
    .eq('id', brokerId);

  if (error) {
    console.error('Error updating broker connection:', error);
    throw new Error(error.message || 'Failed to update broker connection');
  }
};
