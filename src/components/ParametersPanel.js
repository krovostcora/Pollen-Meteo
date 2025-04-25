import React, { useState } from 'react';
import SelectParams from './SelectParams';
import WeatherGraph from './WeatherGraph';
import './ParametersPanel.css';

const ParametersPanel = ({ selectedDate }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');

    const handleShowGraph = async () => {
        if (!selectedCity) return;

        try {
            const res = await fetch("http://localhost:3001/weather", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stationCode: selectedCity.code })
            });
            const data = await res.json();
            setWeatherData(data);
            setError('');
        } catch (err) {
            setError('Failed to load weather data');
            console.error(err);
        }
    };

    return (
        <div className="parameters-panel">
            <SelectParams
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedGraph={selectedGraph}
                setSelectedGraph={setSelectedGraph}
                selectedParams={selectedParams}
                setSelectedParams={setSelectedParams}
            />

            <button className="show-button" onClick={handleShowGraph}>
                Show Graph
            </button>

            {error && <div className="error">{error}</div>}

            <WeatherGraph
                weatherData={weatherData}
                selectedGraph={selectedGraph}
                selectedParams={selectedParams}
            />
        </div>
    );
};

export default ParametersPanel;
