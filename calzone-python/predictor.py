from flask import Flask, request, jsonify
from flask_cors import CORS
from twelvedata import TDClient
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/predict/*": {"origins": "http://localhost:3000"}})

# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")

def build_lstm_model(data):
    data = np.array(data).reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_normalized = scaler.fit_transform(data)
    X = data_normalized[:-1]
    y = data_normalized[1:]
    X = np.reshape(X, (X.shape[0], 1, X.shape[1]))

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=100, batch_size=32, validation_split=0.1)

    return model, scaler

@app.route('/predict/short-term')
def predict_short_term():
    symbol = request.args.get('symbol')
    interval = '30min'
    outputsize = 500
    future_intervals = 250
   
    if not symbol:
        return jsonify({"error": "Stock symbol must be provided"}), 400

    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize + future_intervals)
    historical_data = ts.as_json()
    closing_prices = [float(data_point['close']) for data_point in historical_data]

    # Use only the first 500 for training
    train_data = closing_prices[:outputsize]
    lstm_model, scaler = build_lstm_model(train_data)

    # Prepare data for future prediction
    last_datapoints = np.array(train_data[-1:]).reshape(-1, 1)
    future_predictions = []

    # Generate future predictions
    for _ in range(future_intervals):
        scaled_last_datapoint = scaler.transform(last_datapoints[-1].reshape(-1, 1))
        predicted_normalized = lstm_model.predict(scaled_last_datapoint.reshape(1, 1, 1))
        predicted_value = scaler.inverse_transform(predicted_normalized)
        future_predictions.append(float(predicted_value[0, 0])) 
        last_datapoints = np.append(last_datapoints, predicted_value).reshape(-1, 1)

    # Combine historical and predicted data
    combined_data = train_data + future_predictions

    # Convert to JSON-serializable format
    response_data = [{"interval": i, "price": float(price)} for i, price in enumerate(combined_data)]

    return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
