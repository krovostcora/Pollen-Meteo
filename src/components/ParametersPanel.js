import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { lithuanianCities } from './cities';
import './ParametersPanel.css';

function ParametersPanel({ selectedDate }) {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedParams, setSelectedParams] = useState([]);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [selectedGraph, setSelectedGraph] = useState('');
    const [selectedMorphotypes, setSelectedMorphotypes] = useState([]);

    const weatherParameters = [
        "Temperature",
        "Humidity",
        "Precipitation",
        "Wind direction",
        "Wind speed",
    ];

    const morphotypes = [
        "Alnus",
        "Artemisia",
        "Ambrosia",
        "Corylus",
        "Betula",
        "Quercus",
        "Pinus",
        "Poaceae",
    ];

    const handleCheckboxChange = (param, setter, values) => {
        setter((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param]
        );
    };

    const handleShowGraph = async () => {
        setError('');
        setWeather(null);

        if (!selectedCity || !selectedDate) {
            setError('Please select city and date');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/weather', {
                city: selectedCity.value,
                date: selectedDate,
            });
            setWeather(response.data);
        } catch (err) {
            setError('Error fetching weather data');
        }
    };

    return (
        <div className="parameters-panel">
            <div className="section">
                <h2 className="section-title">Select Data Parameters</h2>

                <div className="block">
                    <label className="block-label">Location</label>
                    <Select
                        options={lithuanianCities}
                        placeholder="Start typing..."
                        className="block-select"
                        onChange={setSelectedCity}
                        value={selectedCity}
                    />
                </div>

                <div className="block">
                    <label className="block-label">Morphotypes</label>
                    <div className="checkbox-list">
                        {morphotypes.map((type) => (
                            <label key={type} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={selectedMorphotypes.includes(type)}
                                    onChange={() =>
                                        handleCheckboxChange(type, setSelectedMorphotypes, morphotypes)
                                    }
                                /> {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <label className="block-label">Meteorological Conditions</label>
                    <div className="checkbox-list">
                        {weatherParameters.map((cond) => (
                            <label key={cond} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={selectedParams.includes(cond)}
                                    onChange={() =>
                                        handleCheckboxChange(cond, setSelectedParams, weatherParameters)
                                    }
                                /> {cond}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <label className="block-label">Type of graph</label>
                    <select
                        className="block-select"
                        value={selectedGraph}
                        onChange={(e) => setSelectedGraph(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="line">Line graph</option>
                        <option value="bar">Bar chart</option>
                        <option value="scatter">Scatter plot</option>
                    </select>
                </div>

                <button className="show-button" onClick={handleShowGraph}>
                    Show Graph
                </button>

                {error && <div className="error">{error}</div>}

                {weather && (
                    <div className="weather-data">
                        <h2>Weather Data</h2>
                        {selectedParams.includes("Temperature") && (
                            <p>Temperature: {weather.temperature}°C</p>
                        )}
                        {selectedParams.includes("Humidity") && (
                            <p>Humidity: {weather.humidity}%</p>
                        )}
                        {selectedParams.includes("Precipitation") && (
                            <p>Precipitation: {weather.precipitation} mm</p>
                        )}
                        {selectedParams.includes("Wind direction") && (
                            <p>Wind Direction: {weather.wind_direction}</p>
                        )}
                        {selectedParams.includes("Wind speed") && (
                            <p>Wind Speed: {weather.wind_speed} km/h</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ParametersPanel;
