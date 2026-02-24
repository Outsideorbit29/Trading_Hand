# Backend Server for Trading Hand

This directory contains the Python backend required to connect the web frontend to your local MetaTrader 5 script. The server listens for commands (start/stop) from the web UI and executes the trading bot script on your machine.

## One-Time Setup

You need Python 3 installed on your computer.

### 1. Create a Virtual Environment

Open a terminal or command prompt in this `backend` directory and run the following command to create an isolated Python environment:

```bash
python -m venv venv
```

### 2. Activate the Virtual Environment

- **On Windows:**
  ```cmd
  .\venv\Scripts\activate
  ```
- **On macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

Your terminal prompt should now be prefixed with `(venv)`.

### 3. Install Dependencies

With the virtual environment active, install the required Python libraries:

```bash
pip install Flask Flask-Cors MetaTrader5 pandas
```

## How to Run

**Before using the web dashboard**, you must start this server.

1.  Make sure your virtual environment is active (you see `(venv)` in your terminal prompt).
2.  Run the server using the following command:

    ```bash
    python server.py
    ```

3.  The server will start, and you will see output like this:
    ```
     * Running on http://127.0.0.1:5000
    ```

**Keep this terminal window open while you use the web application.** The bot's log messages (e.g., "Trend Direction...", "Order Placed...") will be printed here.

You can now go to the web dashboard, and the "Start Bot" button will work correctly.
