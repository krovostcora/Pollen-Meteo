import React, { useState, useEffect } from 'react';
import SelectParams from '../components/SelectParams';
import WeatherGraph from '../components/WeatherGraph';
import '../styles/ParametersPanel.css';
import CalendarExample from "../components/calendar";
import LocationSelector from "../components/parameters/LocationSelector";



const MainView = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
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
        <div className="section">
            <div className="parameters-panel">
                {/* Ліва колонка: Локація + Календар */}
                <div className="block">
                    <LocationSelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    <CalendarExample onDateSelect={setSelectedDate} />
                </div>

                {/* Середня колонка: Morphotypes */}
                <div className="block">
                    <h3 className="section-title">Morphotypes</h3>
                    <SelectParams
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        selectedGraph={selectedGraph}
                        setSelectedGraph={setSelectedGraph}
                        selectedParams={selectedParams}
                        setSelectedParams={setSelectedParams}
                    />
                </div>

                {/* Права колонка: Weather та Graph Type */}
                <div className="block">
                    <h3 className="section-title">Meteorological Conditions</h3>
                    {/* Сюди встав, якщо будеш робити погодні параметри */}

                    <h3 className="section-title" style={{ marginTop: '20px' }}>Type of Graph</h3>
                    {/* Якщо є окремий вибір типу графіку — встав сюди */}
                </div>
            </div>

            <div className="buttons-container">
                <button className="show-button" onClick={handleShowGraph}>
                    Show Graph
                </button>

                <button
                    className={`reset-button visible`}
                    onClick={() => {
                        setSelectedCity(null);
                        setSelectedGraph('');
                        setSelectedParams([]);
                        setSelectedDate('');
                        setWeatherData([]);
                        setError('');
                    }}
                >
                    Reset
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="graph-section">
                <WeatherGraph
                    weatherData={weatherData}
                    selectedGraph={selectedGraph}
                    selectedParams={selectedParams}
                />
            </div>
        </div>
    );

};

export default MainView;
