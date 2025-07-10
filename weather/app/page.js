"use client";

import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const getWeather = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/weather?city=${city}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWeather(data);
      setError('');
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 to-indigo-500 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center text-black">
        <h1 className="text-4xl font-bold mb-6">🌦 Weather App</h1>

        <div className="flex space-x-2 mb-6">
          <input
            className="flex-grow p-3 border border-gray-300 rounded-lg text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button
            onClick={getWeather}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        {weather && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">{weather.city}</h2>
            <p className="text-4xl">{weather.temperature}°C</p>
            <p className="capitalize">{weather.description}</p>
            <p className="text-sm mt-2">
              💧 Humidity: {weather.humidity}% | 🔆 UV Index: {weather.uv_index}
            </p>
            <img
              className="mx-auto mt-3"
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Weather icon"
            />

            <div className="mt-8 text-left">
              <h3 className="text-xl font-semibold mb-3">🔮 5-Period Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {weather.forecast.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow text-center text-black">
                    <p className="text-sm">{item.time}</p>
                    <img
                      className="mx-auto"
                      src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                      alt="icon"
                    />
                    <p className="font-semibold">{item.temp}°C</p>
                    <p className="text-sm capitalize">{item.description}a</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
