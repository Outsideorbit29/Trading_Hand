//+------------------------------------------------------------------+
//|                                                ExnessDataBridge.mq5 |
//|                        MT5 to Website Data Bridge for Exness      |
//+------------------------------------------------------------------+
#property copyright "MT5 to Website Data Bridge"
#property version   "1.00"
#property script_show_inputs

//--- Input parameters
input string   WebhookUrl = "https://your-project.supabase.co/functions/v1/mt5-webhook";
input string   AuthToken = "your-supabase-anon-key";
input string   UserId = "your-user-id";
input string   BrokerId = "exness-mt5";
input int      UpdateInterval = 30; // seconds
input bool     SendOpenPositions = true;
input bool     SendTradeHistory = true;

//+------------------------------------------------------------------+
//| Script program start function                                    |
//+------------------------------------------------------------------+
void OnStart()
{
   Print("Exness MT5 Data Bridge started");
   
   while(!IsStopped())
   {
      if(SendAccountData())
      {
         Print("Account data sent successfully");
      }
      else
      {
         Print("Failed to send account data, error: ", GetLastError());
      }
      
      Sleep(UpdateInterval * 1000);
   }
}

//+------------------------------------------------------------------+
//| Prepare and send account data                                    |
//+------------------------------------------------------------------+
bool SendAccountData()
{
   string json_data = PrepareJsonData();
   
   char post_data[];
   StringToCharArray(json_data, post_data);
   
   string headers = "Content-Type: application/json\r\n";
   headers += "Authorization: Bearer " + AuthToken + "\r\n";
   
   ResetLastError();
   int result = WebRequest("POST", WebhookUrl, headers, 10000, post_data, ArraySize(post_data), headers, 0);
   
   if(result == -1)
   {
      Print("WebRequest error: ", GetLastError());
      return false;
   }
   
   return true;
}

//+------------------------------------------------------------------+
//| Prepare JSON data                                                |
//+------------------------------------------------------------------+
string PrepareJsonData()
{
   string json = "{";
   
   // Account information
   json += "\"account_data\": {";
   json += "\"account_number\": " + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + ",";
   json += "\"balance\": " + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2) + ",";
   json += "\"equity\": " + DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2) + ",";
   json += "\"margin\": " + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN), 2) + ",";
   json += "\"free_margin\": " + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_FREE), 2) + ",";
   json += "\"leverage\": " + IntegerToString(AccountInfoInteger(ACCOUNT_LEVERAGE)) + ",";
   json += "\"profit\": " + DoubleToString(AccountInfoDouble(ACCOUNT_PROFIT), 2) + ",";
   json += "\"server\": \"" + AccountInfoString(ACCOUNT_SERVER) + "\"";
   json += "},";
   
   // User and broker info
   json += "\"user_id\": \"" + UserId + "\",";
   json += "\"broker_id\": \"" + BrokerId + "\"";
   
   json += "}";
   
   return json;
}

//+------------------------------------------------------------------+
//| Prepare positions data                                           |
//+------------------------------------------------------------------+
string GetOpenPositions()
{
   string positions = "[";
   
   for(int i = 0; i < PositionsTotal(); i++)
   {
      if(PositionGetSymbol(i) != "")
      {
         if(i > 0) positions += ",";
         
         positions += "{";
         positions += "\"symbol\": \"" + PositionGetString(POSITION_SYMBOL) + "\",";
         positions += "\"type\": " + IntegerToString(PositionGetInteger(POSITION_TYPE)) + ",";
         positions += "\"volume\": " + DoubleToString(PositionGetDouble(POSITION_VOLUME), 2) + ",";
         positions += "\"price_open\": " + DoubleToString(PositionGetDouble(POSITION_PRICE_OPEN), 5) + ",";
         positions += "\"price_current\": " + DoubleToString(PositionGetDouble(POSITION_PRICE_CURRENT), 5) + ",";
         positions += "\"profit\": " + DoubleToString(PositionGetDouble(POSITION_PROFIT), 2) + ",";
         positions += "\"ticket\": " + IntegerToString(PositionGetTicket(i));
         positions += "}";
      }
   }
   
   positions += "]";
   return positions;
}
