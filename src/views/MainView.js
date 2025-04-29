import React, { useState } from 'react';
import WeatherGraph from '../components/WeatherGraph';
import CalendarExample from '../components/calendar';
import LocationSelector from '../components/parameters/LocationSelector';
import MorphotypesSelector from '../components/parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from '../components/parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from '../components/parameters/GraphTypeSelector';
import '../styles/MainView.css';
import { useTranslation } from 'react-i18next';

const MainView = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const { t } = useTranslation();

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
                    <h3 className="section-title">{t('location')}</h3>
                    <LocationSelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    <CalendarExample onDateSelect={setSelectedDate} />
                </div>

                <div className="block middle-col">
                    <h3 className="section-title">{t('morphotypes')}</h3>
                    <MorphotypesSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                </div>

                <div className="block right-col">
                    <h3 className="section-title">{t('meteorologicalConditions')}</h3>
                    <MeteorologicalConditionsSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                    <h3 className="section-title" style={{ marginTop: '20px' }}> {t('typeOfGraph')}</h3>
                    <GraphTypeSelector selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                </div>
            </div>

            <div className="buttons-container">
                <div className="button-wrapper">
                    <button className="show-button" onClick={handleShowGraph}>
                        {t('showGraph')}
                    </button>
                </div>
                <div className="button-wrapper">
                    {isAnyFilterSelected && (
                        <button className="reset-button visible" onClick={handleReset}>
                            {t('reset')}
                        </button>
                    )}
                </div>
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
