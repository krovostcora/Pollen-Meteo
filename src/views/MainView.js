import React, { useState } from 'react';
import WeatherGraph from '../components/WeatherGraph';
import CalendarExample from '../components/calendar';
import LocationSelector from '../components/parameters/LocationSelector';
import MorphotypesSelector from '../components/parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from '../components/parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from '../components/parameters/GraphTypeSelector';
import '../styles/MainView.css';

const MainView = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');
    const [isGraphVisible, setIsGraphVisible] = useState(false);

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
                const response = await fetch("http://localhost:3001/weather", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        stationCode: selectedCity.code,
                        date: day,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    allWeatherData.push(...data);
                }
            }

            setWeatherData(allWeatherData);
            setError('');
            setIsGraphVisible(true);
        } catch (err) {
            setError('Failed to load weather data');
            console.error(err);
        }
    };

    const handleReset = () => {
        setSelectedCity(null);
        setSelectedGraph('');
        setSelectedParams([]);
        setSelectedDate('');
        setWeatherData([]);
        setError('');
        setIsGraphVisible(false);
    };

    const isAnyFilterSelected = selectedCity || selectedGraph || selectedParams.length > 0 || selectedDate;

    return (
        <div className="section">
            <div className="parameters-panel">
                <div className="block left-col">
                    <h3 className="section-title">Location</h3>
                    <LocationSelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    <CalendarExample onDateSelect={setSelectedDate} />
                </div>

                <div className="block middle-col">
                    <h3 className="section-title">Morphotypes</h3>
                    <MorphotypesSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                </div>

                <div className="block right-col">
                    <h3 className="section-title">Meteorological Conditions</h3>
                    <MeteorologicalConditionsSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                    <h3 className="section-title" style={{ marginTop: '20px' }}>Type of Graph</h3>
                    <GraphTypeSelector selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                </div>
            </div>

            <div className="buttons-container">
                <button className="show-button" onClick={handleShowGraph}>
                    Show Graph
                </button>
                {isAnyFilterSelected && (
                    <button className="reset-button visible" onClick={handleReset}>
                        Reset
                    </button>
                )}
            </div>

            {error && <div className="error">{error}</div>}

            {isGraphVisible && (
                <div className="graph-section">
                    <WeatherGraph
                        weatherData={weatherData}
                        selectedGraph={selectedGraph}
                        selectedParams={selectedParams}
                    />
                </div>
            )}
        </div>
    );
};

export default MainView;
