from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

#API openweather key
API_KEY = "06195abc40dda6654bc679929c391bbe"  

@app.route("/api/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    # 1. Get current weather
    current_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    current_res = requests.get(current_url)

    if current_res.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    current_data = current_res.json()

    lat = current_data["coord"]["lat"]
    lon = current_data["coord"]["lon"]

    # 2. Get UV and humidity data from One Call API
    onecall_url = f"https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    onecall_res = requests.get(onecall_url)
    onecall_data = onecall_res.json()

    # 3. Get 5-day forecast (every 3 hours)
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    forecast_res = requests.get(forecast_url)
    forecast_data = forecast_res.json()

    forecast_list = forecast_data["list"][:5]  # First 5 periods (~15 hrs)

    forecast = [
        {
            "time": item["dt_txt"],
            "temp": item["main"]["temp"],
            "description": item["weather"][0]["description"],
            "icon": item["weather"][0]["icon"]
        }
        for item in forecast_list
    ]

    return jsonify({
        "city": current_data["name"],
        "temperature": current_data["main"]["temp"],
        "description": current_data["weather"][0]["description"],
        "icon": current_data["weather"][0]["icon"],
        "humidity": current_data["main"]["humidity"],
        "uv_index": onecall_data.get("current", {}).get("uvi", "N/A"),
        "forecast": forecast
    })

if __name__ == "__main__":
    app.run(debug=True)
