from flask import Flask, request, jsonify
from twelvedata import TDClient
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np

app = Flask(__name__)

# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")

# Define LSTM model function
def build_lstm_model(data):
    # Convert data to numpy array
    data = np.array(data)

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_normalized = scaler.fit_transform(data)

    # Split data into input and output
    X = data_normalized[:-1]  # Use all but the last data point as input
    y = data_normalized[1:]   # Predict the next data point

    # Reshape input data for LSTM (samples, timesteps, features)
    X = np.reshape(X, (X.shape[0], 1, X.shape[1]))

    # Define LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    # Compile model
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train model
    model.fit(X, y, epochs=100, batch_size=32, validation_split=0.1)

    return model

@app.route('/predict/short-term')
def predict_short_term():
    symbol = 'AAPL'
    interval = '30min' 
    outputsize = 500

    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize)
    historical_data = ts.as_json()

    # Extract closing prices from historical data
    closing_prices = [float(data_point['close']) for data_point in historical_data]

    # Build and train LSTM model
    lstm_model = build_lstm_model(closing_prices)

    # Predict future stock prices
    predicted_data_normalized = lstm_model.predict(X[-1].reshape(1, 1, X.shape[2]))
    predicted_data = scaler.inverse_transform(predicted_data_normalized)

    return jsonify(predicted_data.tolist())

@app.route('/predict/medium-term')
def predict_medium_term():
    symbol = 'AAPL'
    interval = '1h' 
    outputsize = 1000
    
    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize)
    historical_data = ts.as_json()

    # Extract closing prices from historical data
    closing_prices = [float(data_point['close']) for data_point in historical_data]

    # Build and train LSTM model
    lstm_model = build_lstm_model(closing_prices)

    # Predict future stock prices
    predicted_data_normalized = lstm_model.predict(X[-1].reshape(1, 1, X.shape[2]))
    predicted_data = scaler.inverse_transform(predicted_data_normalized)

    return jsonify(predicted_data.tolist())

if __name__ == "__main__":
    app.run(debug=True)

from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np

# Generate dummy data for demonstration purposes
# Replace this with your actual data retrieval code
def generate_dummy_data():
    # Generate dummy data (replace this with your actual data)
    data = np.random.rand(100, 1)  # 100 data points
    return data

# Define LSTM model function
def build_lstm_model(data):
    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_normalized = scaler.fit_transform(data)

    # Split data into input and output
    X = data_normalized[:-1]  # Use all but the last data point as input
    y = data_normalized[1:]   # Predict the next data point

    # Reshape input data for LSTM (samples, timesteps, features)
    X = np.reshape(X, (X.shape[0], 1, X.shape[1]))

    # Define LSTM model
    model = Sequential()
    model.add(LSTM(units=10, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dense(units=1))

    # Compile model
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train model
    model.fit(X, y, epochs=10, batch_size=1)

    return model

# Generate dummy data
data = generate_dummy_data()

# Build LSTM model
lstm_model = build_lstm_model(data)

# Generate dummy data for demonstration purposes
print("Generating dummy data...")
data = generate_dummy_data()
print("Dummy data generated successfully.")

# Build LSTM model
print("Building LSTM model...")
lstm_model = build_lstm_model(data)
print("LSTM model built successfully.")

# Print model summary
print("LSTM model summary:")
print(lstm_model.summary())

# Train LSTM model
print("Training LSTM model...")
lstm_model.fit(X, y, epochs=10, batch_size=1)
print("LSTM model training completed.")

