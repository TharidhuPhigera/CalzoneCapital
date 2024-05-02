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
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)
CORS(app, resources={r"/predict/*": {"origins": "http://localhost:3000"}})

# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")


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

    features = df[['close', 'volume']].fillna(0)  # Fill any NaNs with 0
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(features)

    return scaled_data, scaler, dates

def train_and_predict_arima(train_data):
    # Fit ARIMA model
    arima_model = pm.auto_arima(train_data, seasonal=False, trace=True, error_action='ignore', suppress_warnings=True)
    arima_fitted_values = arima_model.predict_in_sample()
    arima_residuals = train_data - arima_fitted_values
    return arima_model, arima_residuals

def train_and_predict_lstm(residual_data, scaler, sequence_length=100, epochs=20, batch_size=64):
    # Prepare the LSTM training and test sets
    x_data, y_data = [], []

    for i in range(sequence_length, len(scaled_data)):
        x_data.append(scaled_data[i - sequence_length:i])
        y_data.append(scaled_data[i, 0])

    x_data, y_data = np.array(x_data), np.array(y_data)
    splitting_len = int(len(x_data) * 0.7)

    x_train = x_data[:splitting_len]
    y_train = y_data[:splitting_len]

    # LSTM model structure
    model = Sequential([
        LSTM(100, return_sequences=True, input_shape=(sequence_length, scaled_data.shape[1])),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train LSTM
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, validation_split=0.1)
    
    return model, x_train, y_train, x_data[splitting_len:], y_data[splitting_len:]

def train_arima_model(close_prices):
    arima_model = auto_arima(close_prices, seasonal=False, trace=True, error_action='ignore', suppress_warnings=True)
    # Saving the model
    arima_model.save('arima_model.pkl')
    return arima_model

def load_arima_model(filepath='arima_model.pkl'):
    return SARIMAXResults.load(filepath)

def create_lstm_model(sequence_length, features):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(sequence_length, features)),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_lstm_model(model, x_train, y_train, epochs=20, batch_size=64):
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, validation_split=0.1)
    # You can save your model here
    model.save('lstm_model.h5')

def load_lstm_model(filepath='lstm_model.h5'):
    return load_model(filepath)

@app.route('/predict/hybrid-model', methods=['GET'])
def predict_with_hybrid_model():
    symbol = request.args.get('symbol')
    timeframe = request.args.get('timeframe')

    if not symbol or not timeframe:
        return jsonify({"error": "Stock symbol and timeframe must be provided"}), 400
    
    # Convert the timeframe parameter to number of days
    time_frame_mapping = {
        "1 week": 5,
        "2 weeks": 10,
        "1 month": 20,
        "3 months": 60,
        "6 months": 120,
        "1 year": 240
    }
    future_days = time_frame_mapping.get(timeframe.lower())
    if future_days is None:
        return jsonify({"error": "Invalid timeframe"}), 400
    
    # Fetch and prepare data
    scaled_data, scaler, dates = fetch_and_prepare_data(symbol)
    close_prices = scaled_data[:, 0] # Assuming close prices is the first column
    
    # Load ARIMA model and make predictions
    arima_model = load_arima_model()
    arima_predictions = arima_model.predict(n_periods=len(close_prices))
    
    # Calculate residuals
    residuals = close_prices - arima_predictions
    
    # Prepare the LSTM model input
    x_data, y_data = [], []

    for i in range(sequence_length, len(scaled_data)):
        x_data.append(scaled_data[i - sequence_length:i])
        y_data.append(scaled_data[i, 0])

    x_data, y_data = np.array(x_data), np.array(y_data)
    splitting_len = int(len(x_data) * 0.7)

    x_train = x_data[:splitting_len]
    y_train = y_data[:splitting_len]

    # LSTM model structure
    model = Sequential([
        LSTM(100, return_sequences=True, input_shape=(sequence_length, scaled_data.shape[1])),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train LSTM
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, validation_split=0.1)

    # Load LSTM model and make predictions on residuals
    lstm_model = load_lstm_model()
    lstm_predictions = lstm_model.predict(X)
    
    # Combine ARIMA and LSTM predictions
    combined_predictions = arima_predictions + lstm_predictions.flatten()


    # Determine the recommendation based on the percentage change
    if percentage_change > 5:
        recommendation = "BUY"
    elif percentage_change < -5:
        recommendation = "SELL"
    else:
        recommendation = "HOLD"

    # Prepare response data incorporating the evaluation and recommendation
    response_data = {
        "dates": test_dates,
        "original_test_data": actuals,
        "predictions": predictions,
        "evaluation": {
            "latest_historical_price": latest_historical_price,
            "latest_predicted_price": latest_predicted_price,
            "change_in_percent": percentage_change,
            "recommendation": recommendation
        }
    }

    return jsonify(response_data)


@app.route('/predict/evaluate')
def evaluate_model():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({"error": "Stock symbol must be provided"}), 400
        
    
    # Fetch and prepare data
    scaled_data, scaler, dates = fetch_and_prepare_data(symbol)
    # Train the model and get predictions
    predictions, actuals, _, _, _ = train_and_predict(scaled_data, scaler, dates)

    # Adjust the length of predictions to match actuals
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