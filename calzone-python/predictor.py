from flask import Flask, request, jsonify
from flask_cors import CORS
from twelvedata import TDClient
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout, Dense
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from math import sqrt
import numpy as np
import pandas as pd
import datetime
import requests

app = Flask(__name__)
CORS(app, resources={
    r"/predict/*": {"origins": "http://localhost:3000"},
    r"/strategies": {"origins": "http://localhost:3000"}
})


# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")

def fetch_piotroski_f_score(ticker):
    url = "https://piotrosky-f-score.p.rapidapi.com/PiotriskyScore"
    headers = {
        "X-RapidAPI-Key": "59ad997aa7msh3a76f64d1250d9bp17bed5jsne2f1eedea251",
        "X-RapidAPI-Host": "piotrosky-f-score.p.rapidapi.com"
    }
    params = {"ticker": str(ticker).upper()}

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            piotroski_score = data.get('FScore', {}).get('Current')
            return piotroski_score
        else:
            print("Failed to fetch data:", response.status_code, response.text)
            return None
    except requests.RequestException as e:
        print("HTTP Request failed:", e)
        return None
    
def calculate_bollinger_bands(prices, window_size=20, num_std_dev=2):
    """Calculate Bollinger Bands for given prices."""
    rolling_mean = prices.rolling(window=window_size).mean()
    rolling_std = prices.rolling(window=window_size).std()
    upper_band = (rolling_mean + (rolling_std * num_std_dev)).fillna(method='pad').astype(float)
    lower_band = (rolling_mean - (rolling_std * num_std_dev)).fillna(method='pad').astype(float)
    mean_line = rolling_mean.fillna(method='pad').astype(float)

    return mean_line, upper_band, lower_band


def generate_market_hours_datetimes(start_datetime, num_intervals, interval_length=30):
    market_open = datetime.time(9, 0, 0)
    market_close = datetime.time(15, 30, 0)

    current_datetime = start_datetime
    future_datetimes = []

    for _ in range(num_intervals):
        if market_open <= current_datetime.time() < market_close:
            future_datetimes.append(current_datetime)
        else:
            if current_datetime.time() >= market_close:
                current_datetime = (current_datetime + datetime.timedelta(days=1)).replace(hour=9, minute=0, second=0, microsecond=0)
            else:
                current_datetime = current_datetime.replace(hour=9, minute=0, second=0, microsecond=0)
            future_datetimes.append(current_datetime)
        
        current_datetime = current_datetime + datetime.timedelta(minutes=interval_length)
    
    return future_datetimes

def fetch_and_prepare_data(symbol, interval="1day", outputsize=5000):
    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize, timezone="America/New_York")
    df = ts.as_pandas()
    df = df.iloc[::-1]  # Ensure chronological order

    df.index = pd.to_datetime(df.index)
    dates = df.index.strftime('%Y-%m-%d').tolist()

    # Keep a copy of the original closing prices for Bollinger Bands calculation
    original_close_prices = df['close'].copy()

    features = df[['close', 'volume']].fillna(0)  # Fill any NaNs with 0
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(features)


    return scaled_data, scaler, dates, original_close_prices

sequence_length = 100

def train_and_predict(scaled_data, scaler, dates, future_days):
    x_data = []
    y_data = []

    for i in range(sequence_length, len(scaled_data)):
        x_data.append(scaled_data[i - sequence_length:i])
        y_data.append(scaled_data[i, 0]) 

    x_data, y_data = np.array(x_data), np.array(y_data)
    splitting_len = int(len(x_data) * 0.7)

    x_train = x_data[:splitting_len]
    y_train = y_data[:splitting_len]
    x_test = x_data[splitting_len:]
    y_test = y_data[splitting_len:]

    model = Sequential([
        LSTM(100, return_sequences=True, input_shape=(sequence_length, 2)),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(x_train, y_train, epochs=20, batch_size=64, validation_split=0.1)

    predictions = model.predict(x_test)
    dummy_volume = scaled_data[splitting_len + sequence_length:, 1].reshape(-1, 1)
    predictions_combined = np.hstack([predictions, dummy_volume])
    inv_predictions = scaler.inverse_transform(predictions_combined)[:, 0]

    inv_y_test = scaler.inverse_transform(np.hstack([y_test.reshape(-1, 1), dummy_volume]))[:, 0]

    # Future Predictions
    future_predictions = []
    last_scaled_data = scaled_data[-sequence_length:]
    for i in range(future_days):
        current_sequence = last_scaled_data.reshape((1, sequence_length, 2))
        next_close_price_scaled = model.predict(current_sequence)[0][0]
        next_sequence = np.array([[next_close_price_scaled, last_scaled_data[-1, 1]]])
        last_scaled_data = np.vstack((last_scaled_data[1:], next_sequence))
        future_predictions.append(next_close_price_scaled)

    future_predictions_scaled = np.array(future_predictions).reshape(-1, 1)
    dummy_future_volume = np.full((len(future_predictions), 1), last_scaled_data[-1, 1])
    future_predictions_combined = np.hstack([future_predictions_scaled, dummy_future_volume])
    inv_future_predictions = scaler.inverse_transform(future_predictions_combined)[:, 0]

    future_dates = [pd.to_datetime(dates[-1]) + pd.Timedelta(days=i + 1) for i in range(future_days)]
    future_dates_formatted = [date.strftime('%Y-%m-%d') for date in future_dates]

    extended_dates = dates[splitting_len + sequence_length:] + future_dates_formatted
    extended_predictions = np.concatenate((inv_predictions, inv_future_predictions))

    latest_historical_price = float(inv_y_test[-1])
    latest_predicted_price = float(inv_future_predictions[-1])

    return extended_predictions.tolist(), inv_y_test.tolist(), extended_dates, latest_historical_price, latest_predicted_price


#######################    PREDICTION     #############################

@app.route('/predict/new-model')
def predict_with_new_model():
    symbol = request.args.get('symbol')
    timeframe = request.args.get('timeframe')  # Get the timeframe parameter from the request
    if not symbol or not timeframe:
        return jsonify({"error": "Stock symbol and timeframe must be provided"}), 400
    
    # Convert the timeframe parameter to number of days
    time_frame_mapping = {
        "1 week": 5,
        "2 weeks": 10,
        "1 month": 20
    }
    future_days = time_frame_mapping.get(timeframe.lower())
    if future_days is None:
        return jsonify({"error": "Invalid timeframe"}), 400
    
    # Fetch and prepare data
    scaled_data, scaler, dates, original_close_prices = fetch_and_prepare_data(symbol)
    # Correctly call the train_and_predict function and capture its results
    predictions, actuals, test_dates, latest_historical_price, latest_predicted_price = train_and_predict(scaled_data, scaler, dates, future_days)

    # Calculation for percentage change should directly use the last historical and predicted prices
    percentage_change = ((latest_predicted_price - latest_historical_price) / latest_historical_price) * 100

    # Fetch Piotroski score
    piotroski_score = fetch_piotroski_f_score(symbol)
    # Ensure piotroski_score is not None before comparison
    if piotroski_score is None:
        return jsonify({"error": "Failed to fetch Piotroski Score"}), 500

    # Calculate Bollinger Bands
    mean_line, upper_band, lower_band = calculate_bollinger_bands(original_close_prices)
    upper_band_latest = upper_band.iloc[-1]
    lower_band_latest = lower_band.iloc[-1]

    # RECCOMENDATION AND EXPLANATION
    recommendation = "HOLD"
    explanations = []

    # Check Piotroski score
    if piotroski_score > 6:
        explanations.append(f"Piotroski score is strong at {piotroski_score}.")
    elif piotroski_score < 3:
        explanations.append(f"Piotroski score is weak at {piotroski_score}.")

    # Check Bollinger Bands
    if latest_predicted_price > upper_band_latest:
        explanations.append("Price is above the upper Bollinger Band, suggesting the stock may be overbought.")
        recommendation = "SELL"
    elif latest_predicted_price < lower_band_latest:
        explanations.append("Price is below the lower Bollinger Band, suggesting the stock may be oversold.")
        recommendation = "BUY"

    # Consider percentage changes last to allow override
    if percentage_change > 5:
        explanations.append("Significant recent increase in stock price may indicate an overbought condition.")
        recommendation = "SELL"
    elif percentage_change < -5:
        explanations.append("Significant recent decrease in stock price may indicate an oversold condition.")
        recommendation = "BUY"

    explanation_str = " ".join(explanations)


    # Prepare response data incorporating the evaluation and recommendation
    response_data = {
        "dates": test_dates,
        "original_test_data": actuals,
        "predictions": predictions,
        "evaluation": {
            "latest_historical_price": latest_historical_price,
            "latest_predicted_price": latest_predicted_price,
            "change_in_percent": percentage_change,
            "recommendation": recommendation,
            "explanation": explanation_str,
            "pitroski_score": piotroski_score,
            "bollinger_bands": {
                "mean": mean_line.iloc[-1],
                "upper_band": upper_band_latest,
                "lower_band": lower_band_latest
            },
        }
    }

    return jsonify(response_data)


#######################    STRATEGIES     #############################

@app.route('/strategies')
def simulate_strategies():
    symbol = request.args.get('symbol')
    timeframe = request.args.get('timeframe')
    investment = float(request.args.get('investment', 0))
    if not symbol or not timeframe or investment <= 0:
        return jsonify({"error": "Stock symbol, timeframe, and investment must be provided"}), 400

    
    # Convert the timeframe parameter to number of days
    time_frame_mapping = {
        "3 months": 60,
        "6 months": 120,
        "1 year": 240
    }
    future_days = time_frame_mapping.get(timeframe.lower())
    if future_days is None:
        return jsonify({"error": "Invalid timeframe"}), 400

    # Fetch and prepare data
    scaled_data, scaler, dates, original_close_prices = fetch_and_prepare_data(symbol)
    full_predictions, actuals, test_dates, latest_historical_price, latest_predicted_price = train_and_predict(scaled_data, scaler, dates, future_days)

    # Calculation for percentage change should directly use the last historical and predicted prices
    percentage_change = ((latest_predicted_price - latest_historical_price) / latest_historical_price) * 100

    # Isolate only future predictions
    future_predictions = full_predictions[-future_days:]

    weekly_total_investment = 0
    monthly_total_investment = 0

    weekly_periods = future_days // 5  # Every week has 5 trading days
    monthly_periods = future_days // 20  # Assuming roughly 20 trading days in a month

    # Calculate the investment amount per period
    weekly_investment_amount = investment / (weekly_periods if weekly_periods > 0 else 1)
    monthly_investment_amount = investment / (monthly_periods if monthly_periods > 0 else 1)

    # Apply investment strategies using the calculated investment amounts
    weekly_investment_predictions, weekly_total_investment = modify_predictions(
        future_predictions, 5, weekly_investment_amount
    )
    monthly_investment_predictions, monthly_total_investment = modify_predictions(
        future_predictions, 20, monthly_investment_amount
    )

    # Calculate the value of the investment at the latest predicted price
    latest_weekly_value = weekly_investment_predictions[-1]
    latest_monthly_value = monthly_investment_predictions[-1]

    # Calculate the percentage change in investment value
    weekly_investment_change = ((latest_weekly_value - weekly_total_investment) / weekly_total_investment) * 100
    monthly_investment_change = ((latest_monthly_value - monthly_total_investment) / monthly_total_investment) * 100

    # Prepare response data focusing only on future predictions and their strategies
    future_dates = test_dates[-future_days:]  # Dates corresponding to the future predictions
    response_data = {
        "dates": future_dates,
        "future_predictions": future_predictions,
        "weekly_investment_predictions": weekly_investment_predictions,
        "monthly_investment_predictions": monthly_investment_predictions,
         "evaluation": {
            "latest_historical_price": latest_historical_price,
            "latest_predicted_price": latest_predicted_price,
            "change_in_percent": percentage_change,
            "weekly_total_investment": weekly_total_investment,
            "latest_weekly_value":latest_weekly_value,
            "weekly_investment_change": weekly_investment_change,
            "monthly_total_investment": monthly_total_investment,
            "monthly_investment_change": monthly_investment_change,
            "latest_monthly_value": latest_monthly_value,
        }
    }

    return jsonify(response_data)

def modify_predictions(predictions, investment_interval, investment_amount):
    """
    Simulate an investment strategy by purchasing more shares at regular intervals.
    """
    modified_predictions = predictions.copy()
    total_investment = 0
    shares_owned = 0

    for i in range(len(modified_predictions)):
        if i % investment_interval == 0:
            # Calculate how many shares we can buy with the investment amount
            shares_bought = investment_amount / modified_predictions[i]
            shares_owned += shares_bought
            total_investment += investment_amount
        # Update the value of the investment
        modified_predictions[i] = shares_owned * modified_predictions[i]

    return modified_predictions, total_investment

#######################    MODEL EVALUATION     #############################


@app.route('/predict/evaluate')
def evaluate_model():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({"error": "Stock symbol must be provided"}), 400
        
    
    future_days = 0
    # Fetch and prepare data
    scaled_data, scaler, dates, _ = fetch_and_prepare_data(symbol)
    # Train the model and get predictions
    predictions, actuals, test_dates, latest_historical_price, latest_predicted_price = train_and_predict(scaled_data, scaler, dates, future_days)
    # Ensure predictions and actuals are of equal length
    predictions_adjusted = predictions[:len(actuals)]

    # Calculate evaluation metrics
    mae = mean_absolute_error(actuals, predictions_adjusted)
    mse = mean_squared_error(actuals, predictions_adjusted)
    rmse = sqrt(mse)
    r2 = r2_score(actuals, predictions_adjusted)

    # Prepare and return the evaluation data
    evaluation_data = {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2,
    }

    return jsonify(evaluation_data)

if __name__ == "__main__":
    app.run(debug=True, port=5001)