interface MT5ConnectionData {
  login: string;
  password: string;
  server: string;
}

interface MT5AccountData {
  login: number;
  name: string;
  server: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  leverage: number;
  profit: number;
  currency: string;
  company: string;
  connected_at?: string;
  last_update?: string;
}

interface MT5ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  account_data?: MT5AccountData;
  accounts?: Array<{
    connection_info: {
      login: string;
      server: string;
      connected: boolean;
      last_update: string;
    };
    account_data: MT5AccountData;
  }>;
}

class MT5BrokerService {
  private baseUrl = 'http://localhost:5001/api/mt5';

  async connectAccount(connectionData: MT5ConnectionData): Promise<MT5AccountData> {
    try {
      const response = await fetch(`${this.baseUrl}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      const data: MT5ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to connect to MT5 account');
      }

      return data.account_data!;
    } catch (error) {
      console.error('MT5 connection error:', error);
      throw error;
    }
  }

  async getAccountInfo(login: string, server: string): Promise<MT5AccountData> {
    try {
      const response = await fetch(`${this.baseUrl}/account-info?login=${login}&server=${server}`);
      const data: MT5ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get account info');
      }

      return data.account_data!;
    } catch (error) {
      console.error('MT5 account info error:', error);
      throw error;
    }
  }

  async disconnectAccount(login: string, server: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, server }),
      });

      const data: MT5ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to disconnect account');
      }
    } catch (error) {
      console.error('MT5 disconnect error:', error);
      throw error;
    }
  }

  async getAllConnectedAccounts(): Promise<Array<{
    connection_info: {
      login: string;
      server: string;
      connected: boolean;
      last_update: string;
    };
    account_data: MT5AccountData;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`);
      const data: MT5ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get connected accounts');
      }

      return data.accounts || [];
    } catch (error) {
      console.error('MT5 get accounts error:', error);
      throw error;
    }
  }

  async getMT5Status(): Promise<{
    status: 'connected' | 'disconnected';
    terminal_info?: any;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get MT5 status');
      }

      return {
        status: data.status,
        terminal_info: data.terminal_info,
      };
    } catch (error) {
      console.error('MT5 status error:', error);
      return { status: 'disconnected' };
    }
  }
}

export const mt5BrokerService = new MT5BrokerService();
export type { MT5ConnectionData, MT5AccountData };