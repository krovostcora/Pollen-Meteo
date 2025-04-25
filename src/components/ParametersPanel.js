import React, { useState, useEffect } from 'react';
import SelectParams from './SelectParams';
import WeatherGraph from './WeatherGraph';
import './ParametersPanel.css';


const ParametersPanel = ({ selectedDate }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedCity && selectedDate?.length === 2) {
            handleShowGraph();
        }
    }, [selectedCity, selectedDate]);

    const handleShowGraph = async () => {
        if (!selectedCity || !selectedDate?.length === 2) return;

        const [startDate, endDate] = selectedDate;
        const dates = [];
        let date = new Date(startDate);

        while (date <= endDate) {
            dates.push(new Date(date).toISOString().split('T')[0]);
            date.setDate(date.getDate() + 1);
        }

        try {
            const allWeatherData = [];

            for (const day of dates) {
                const res = await fetch("http://localhost:3001/weather", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        stationCode: selectedCity.code,
                        date: day,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    allWeatherData.push(...data);
                }
            }

            setWeatherData(allWeatherData);
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
