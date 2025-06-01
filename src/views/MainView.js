import React, { useState } from 'react';
import WeatherGraph from '../components/WeatherGraph';
import Calendar from '../components/Calendar';
import LocationSelector from '../components/parameters/LocationSelector';
import MorphotypesSelector from '../components/parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from '../components/parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from '../components/parameters/GraphTypeSelector';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import '../styles/MainView.css';
import '../styles/responsive.css';

const paramKeys = {
    Temperature: 'temperature',
    Humidity: 'humidity',
    Precipitation: 'precipitation',
    'Wind speed': 'wind_speed',
    'Wind direction': 'wind_direction',
};

const cityLabelToBackend = {
    Vilnius: 'Vilnius',
    Šiauliai: 'Siauliai',
    Klaipėda: 'Klaipeda',
};

const morphotypeNameToCode = {
    Alnus: 'ALNU',
    Artemisia: 'ARTE',
    Ambrosia: 'AMBR',
    Corylus: 'CORY',
    Betula: 'BETU',
    Quercus: 'QUER',
    Pinus: 'PINA',
    Poaceae: 'POAC',
    Salix: 'SALI',
    Populus: 'POPU',
    Acer: 'ACER',
};

const pollenDateFieldMap = {
    Vilnius: 'LTVILN',
    Siauliai: 'LTSIAU',
    Klaipeda: 'LTKLAI',
};

const MainView = () => {
    const { t } = useTranslation();
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState([null, null]);
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShowGraph = async () => {
        if (!selectedCity || !selectedDate[0] || !selectedDate[1]) {
            setError(t('Please select city and date range'));
            return;
        }
        setLoading(true);
        setError('');
        setIsGraphVisible(false);

        try {
            const [startDate, endDate] = selectedDate;
            const startStr = dayjs(startDate).format('YYYY-MM-DD');
            const endStr = dayjs(endDate).format('YYYY-MM-DD');
            const dates = [];
            let current = new Date(startStr);
            const end = new Date(endStr);
            while (current <= end) {
                dates.push(current.toISOString().slice(0, 10));
                current.setDate(current.getDate() + 1);
            }
            const allWeatherData = [];
            for (const day of dates) {
                const response = await fetch('/weather', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stationCode: selectedCity.code,
                        date: day,
                        granularity: 'hourly',
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    allWeatherData.push(...data);
                }
            }
            const morphotypes = selectedParams
                .filter(p => !Object.values(paramKeys).includes(p) && !paramKeys[p])
                .map(name => morphotypeNameToCode[name])
                .filter(Boolean);
            const backendCity = cityLabelToBackend[selectedCity.label];
            const pollenDateField = pollenDateFieldMap[backendCity];
            if (!pollenDateField) {
                setError(t('Invalid city selection'));
                setLoading(false);
                return;
            }
            let pollenData = [];
            if (morphotypes.length > 0) {
                const pollenResponse = await fetch('/pollen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stationName: backendCity,
                        startDate: startStr,
                        endDate: endStr,
                        morphotypes,
                        granularity: 'hourly',
                    }),
                });
                pollenData = pollenResponse.ok ? await pollenResponse.json() : [];
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
            setWeatherData(mergedData);
            setIsGraphVisible(true);
        } catch {
            setError(t('Failed to load data'));
            setIsGraphVisible(false);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedCity(null);
        setSelectedGraph('');
        setSelectedParams([]);
        setSelectedDate([null, null]);
        setWeatherData([]);
        setError('');
        setIsGraphVisible(false);
    };

    const isAnyFilterSelected =
        selectedCity || selectedGraph || selectedParams.length > 0 || (selectedDate && (selectedDate[0] || selectedDate[1]));

    return (
        <div className="main-view">
            <div className="parameters-panel">
                <div className="light-blue-container left-col">
                    <h3 className="section-title">{t('location')}</h3>
                    <LocationSelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    <Calendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        error={error}
                        setError={setError}
                    />
                </div>
                <div className="light-blue-container block-morphotypes middle-col">
                    <h3 className="section-title">{t('morphotypes')}</h3>
                    <MorphotypesSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                </div>
                <div className="light-blue-container right-col">
                    <h3 className="section-title">{t('meteorologicalConditions')}</h3>
                    <MeteorologicalConditionsSelector selectedParams={selectedParams} setSelectedParams={setSelectedParams} />
                    <h3 className="section-title" style={{ marginTop: 20 }}>{t('typeOfGraph')}</h3>
                    <GraphTypeSelector selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
                </div>
            </div>
            <div className="buttons-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 100 }}>
                    <button
                        className="show-button"
                        onClick={handleShowGraph}
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('showGraph')}
                    </button>
                    {isAnyFilterSelected && (
                        <button
                            className="reset-button"
                            onClick={handleReset}
                            disabled={loading}
                        >
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
                        granularity="hourly"
                    />
                </div>
            )}
        </div>
    );
};

export default MainView;