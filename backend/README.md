# Trading Hand Backend

The Trading Hand backend is a Flask-powered automation system that connects the React frontend to the MetaTrader 5 (MT5) terminal. It handles real-time data fetching, AI signal generation via XGBoost, and automated trade execution.

## 📂 Project Structure

- **`main.py`**: The Flask entry point. Handles HTTP requests from the frontend.
- **`core/`**:
  - `bot_script.py`: The main trading loop, MT5 management, and position syncing.
  - `mo_engine.ipynb`: Interactive research and prediction logic (shifted from ml_engine.py).
- **`models/`**: Stores trained `.joblib` models and feature scalers.
- **`.env`**: Configuration for MT5 credentials and server settings.

## 🚀 Setup & Execution

### 1. Prerequisites
- Python 3.10+
- MetaTrader 5 Terminal installed and logged in.

### 2. Environment Setup
Create and activate a virtual environment:
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

Install requirements:
```bash
pip install -r requirements.txt
```

### 3. Configuration
Copy the credentials template into a `.env` file (if not already present):
```ini
MT5_LOGIN=your_login
MT5_PASSWORD=your_password
MT5_SERVER=your_server
FLASK_PORT=5000
```

### 4. Running the Server
```bash
python main.py
```

## 🧠 Machine Learning Model
The bot uses an **XGBoost Classifier** trained with technical indicators (EMA, RSI, ATR, MACD). The training process includes:
1. **Triple Barrier Labeling**: Advanced trade outcome assessment.
2. **SMOTE**: Handling class imbalance for high-precision signals.
3. **Automated Retraining**: The bot can refresh its model with the latest market data directly.

For research or manual retraining, explore **`notebooks/ml_engine.ipynb`**.
