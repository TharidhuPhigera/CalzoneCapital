from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId, InvalidId
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/userInfo*": {"origins": "*"}})

app.config['MONGO_URI'] = "mongodb+srv://supervisor:9KA6zgDE4WQaxHIG@cluster0.s8fqejr.mongodb.net/CalzoneCapital?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

@app.route('/')
def home():
    print("Home route accessed")
    users_collection = mongo.db.users
    users = users_collection.find()
    users_list = list(users)
    print(users_list)
    return {'users': str(users_list)}


@app.route('/userInfo', methods=['GET'])
def get_user_info():
    email = request.args.get('email')

    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "email": user.get("email", ""),
        "firstName": user.get("firstName", ""),
        "lastName": user.get("lastName", ""),
        "dob": user.get("dob", "").isoformat() if user.get("dob", None) else "",
        "phoneNumber": user.get("phoneNumber", ""),
        "stockWishlist": user.get("stockWishlist", []),
        "balance": user.get("balance", "")
    }

    return jsonify(user_data)


@app.route('/balance', methods=['POST'])
def update_balance():
    data = request.get_json()
    email = data.get('email')
    amount_to_add = data.get('amount')

    if not email or amount_to_add is None:
        return jsonify({"error": "Missing email or amount"}), 400

    try:
        # Convert the amount to float and ensure it's positive
        amount_to_add = max(0, float(amount_to_add))
    except ValueError:
        return jsonify({"error": "Invalid amount format"}), 400

    # Update the user's balance atomically
    updated_user = mongo.db.users.find_one_and_update(
        {"email": email},
        {"$inc": {"balance": amount_to_add}},
    )

    if not updated_user:
        return jsonify({"error": "User not found or update failed"}), 404

    return jsonify({"balance": updated_user["balance"]}), 200


if __name__ == '__main__':
    app.run(debug=True)