from flask import Flask, request, jsonify
from twelvedata import TDClient
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np

app = Flask(__name__)

# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")

def build_lstm_model(data):
    # Convert data to numpy array
    data = np.array(data)
    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_normalized = scaler.fit_transform(data)
    X = data_normalized[:-1]  
    y = data_normalized[1:] 
    X = np.reshape(X, (X.shape[0], 1, X.shape[1]))

    # Define LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=100, batch_size=32, validation_split=0.1)

    return model

@app.route('/predict/short-term')
def predict_short_term():
    symbol = 'AAPL'
    interval = '30min' 
    outputsize = 500

    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize)
    historical_data = ts.as_json()

    closing_prices = [float(data_point['close']) for data_point in historical_data]
    lstm_model = build_lstm_model(closing_prices)
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

    closing_prices = [float(data_point['close']) for data_point in historical_data]
    lstm_model = build_lstm_model(closing_prices)
    predicted_data_normalized = lstm_model.predict(X[-1].reshape(1, 1, X.shape[2]))
    predicted_data = scaler.inverse_transform(predicted_data_normalized)

    return jsonify(predicted_data.tolist())

if __name__ == "__main__":
    app.run(debug=True)
