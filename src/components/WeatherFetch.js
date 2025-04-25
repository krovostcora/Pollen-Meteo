import React, { useState } from "react";

const WeatherFetch = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://api.meteo.lt/v1/places/vilnius/forecasts/long-term");
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={fetchWeather}
            >
                Get Weather Forecast
            </button>

            {loading && <p className="mt-4">Loading...</p>}

            {weatherData && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">{weatherData.place.name} Forecast</h2>
                    <ul className="mt-2 space-y-1">
                        {weatherData.forecastTimestamps.slice(0, 5).map((timestamp) => (
                            <li key={timestamp.forecastTimeUtc}>
                                {timestamp.forecastTimeUtc}: {timestamp.airTemperature}°C, {timestamp.conditionCode}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WeatherFetch;
