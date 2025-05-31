import React, { useState } from 'react';
import WeatherGraph from '../components/WeatherGraph';
import CalendarExample from '../components/calendar';
import LocationSelector from '../components/parameters/LocationSelector';
import MorphotypesSelector from '../components/parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from '../components/parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from '../components/parameters/GraphTypeSelector';
import '../styles/MainView.css';
import { useTranslation } from 'react-i18next';

const paramKeys = {
    "Temperature": "temperature",
    "Humidity": "humidity",
    "Precipitation": "precipitation",
    "Wind speed": "wind_speed",
    "Wind direction": "wind_direction"
};

const morphotypeNameToCode = {
    Alnus: "ALNU",
    Artemisia: "ARTE",
    Ambrosia: "AMBR",
    Corylus: "CORY",
    Betula: "BETU",
    Quercus: "QUER",
    Pinus: "PINA",
    Poaceae: "POAC",
    Salix: "SALI",
    Populus: "POPU",
    Acer: "ACER"
};

const pollenDateFieldMap = {
    Vilnius: "LTVILN",
    Siauliai: "LTSIAU",
    Klaipeda: "LTKLAI"
};

// Helper to add days to a YYYY-MM-DD string
function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

const MainView = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleShowGraph = async () => {
        if (!selectedCity || !selectedDate || selectedDate.length !== 2) {
            setError('Please select city and date range');
            return;
        }
        setLoading(true);
        setError('');
        setIsGraphVisible(false);

        try {
            const [startDate, endDate] = selectedDate;
            // Adjust dates for API requests
            const pollenStartDate = addDays(startDate, -1);
            const pollenEndDate = addDays(endDate, 1);

            // Prepare date strings for weather fetch
            const dates = [];
            let current = pollenStartDate;
            while (current <= pollenEndDate) {
                dates.push(current);
                current = addDays(current, 1);
            }

            // Fetch weather data
            const allWeatherData = [];
            for (const day of dates) {
                const response = await fetch('http://localhost:3001/weather', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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

            // Prepare morphotype codes for pollen fetch
            const morphotypes = selectedParams
                .filter(p => !Object.values(paramKeys).includes(p) && !paramKeys[p])
                .map(name => morphotypeNameToCode[name])
                .filter(Boolean);

            // Fetch pollen data if morphotypes are selected
            let pollenData = [];
            if (morphotypes.length > 0) {
                const pollenResponse = await fetch('http://localhost:3001/pollen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stationName: selectedCity.label,
                        startDate: pollenStartDate,
                        endDate: pollenEndDate,
                        morphotypes: morphotypes,
                    }),
                });
                pollenData = pollenResponse.ok ? await pollenResponse.json() : [];
            }

            // Merge pollen data into weather data using correct date field
            const pollenDateField = pollenDateFieldMap[selectedCity.label];
            if (!pollenDateField) {
                console.error('Invalid city label:', selectedCity.label);
                return;
            }

            const mergedData = allWeatherData.map(wd => {
                const merged = { ...wd };
                morphotypes.forEach(morph => {
                    const pollen = pollenData.find(
                        pd =>
                            pd[pollenDateField]?.slice(0, 10) === wd.time?.slice(0, 10) &&
                            pd.Particle === morph
                    );
                    const value = pollen
                        ? (
                            pollen['00-02'] ?? pollen['02-04'] ?? pollen['04-06'] ?? pollen['06-08'] ??
                            pollen['08-10'] ?? pollen['10-12'] ?? pollen['12-14'] ?? pollen['14-16'] ??
                            pollen['16-18'] ?? pollen['18-20'] ?? pollen['20-22'] ?? pollen['22-24'] ??
                            pollen['Daily Total'] ?? 0
                        )
                        : 0;
                    merged[morph] = value ?? 0;
                });
                return merged;
            });

            // Filter merged data to only include entries within the original selected date range
            const filteredData = mergedData.filter(d => {
                const dateStr = d.time?.slice(0, 10);
                return dateStr >= startDate && dateStr <= endDate;
            });

            setWeatherData(filteredData);
            setIsGraphVisible(true);
        } catch (err) {
            setError('Failed to load data');
            setIsGraphVisible(false);
            console.error(err);
        } finally {
            setLoading(false);
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
                    <CalendarExample onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                </div>
                <div className="block middle-col">
                    <h3 className="section-title">{t('morphotypes')}</h3>
                    <MorphotypesSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                </div>
                <div className="block right-col">
                    <h3 className="section-title">{t('meteorologicalConditions')}</h3>
                    <MeteorologicalConditionsSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                    <h3 className="section-title" style={{ marginTop: '20px' }}>{t('typeOfGraph')}</h3>
                    <GraphTypeSelector selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                </div>
            </div>
            <div className="buttons-container">
                <div className="button-wrapper">
                    <button className="show-button" onClick={handleShowGraph} disabled={loading}>
                        {loading ? t('loading') : t('showGraph')}
                    </button>
                </div>
                <div className="button-wrapper">
                    {isAnyFilterSelected && (
                        <button className="reset-button visible" onClick={handleReset} disabled={loading}>
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