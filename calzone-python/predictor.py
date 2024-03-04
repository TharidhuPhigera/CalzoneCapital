from flask import Flask, request, jsonify
from twelvedata import TDClient

app = Flask(__name__)

# Initialize Twelve Data client
td = TDClient(apikey="7b5861f61d974edeb58bd9da0cc76789")

@app.route('/predict/short-term')
def predict_short_term():
    symbol = 'AAPL'
    interval = '30min' 
    outputsize = 500


    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize)
    historical_data = ts.as_json()


    return jsonify(historical_data)

@app.route('/predict/medium-term')
def predict_medium_term():
    symbol = 'AAPL'
    interval = '1h' 
    outputsize = 1000
    
    ts = td.time_series(symbol=symbol, interval=interval, outputsize=outputsize)
    historical_data = ts.as_json()


if __name__ == "__main__":
    app.run(debug=True)
