import React, { useState, useEffect } from 'react';
import WeatherGraph from '../components/WeatherGraph';
import CalendarExample from '../components/calendar';
import LocationSelector from '../components/parameters/LocationSelector';
import MorphotypesSelector from '../components/parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from '../components/parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from '../components/parameters/GraphTypeSelector';
import '../styles/MainView.css';
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import '../styles/responsive.css'

const paramKeys = {
    "Temperature": "temperature",
    "Humidity": "humidity",
    "Precipitation": "precipitation",
    "Wind speed": "wind_speed",
    "Wind direction": "wind_direction"
};

const cityLabelToBackend = {
    'Vilnius': 'Vilnius',
    'Šiauliai': 'Siauliai',
    'Klaipėda': 'Klaipeda'
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

const MainView = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedParams, setSelectedParams] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [granularity, setGranularity] = useState('hourly'); // always hourly
    const { t } = useTranslation();

    useEffect(() => {
        if (!isGraphVisible) return;
        fetchData(granularity);
        // eslint-disable-next-line
    }, [granularity, isGraphVisible]);

    const handleCalendarSelect = (dateRange) => {
        setSelectedDate(dateRange);
    };

    const fetchData = async (gran) => {
        if (!selectedCity || !selectedDate || selectedDate.length !== 2) {
            setError('Please select city and date range');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const [userStartDate, userEndDate] = selectedDate || [];
            const startStr = userStartDate ? dayjs(userStartDate).format('YYYY-MM-DD') : '';
            const endStr = userEndDate ? dayjs(userEndDate).format('YYYY-MM-DD') : '';

            // Prepare date strings for weather fetch (inclusive)
            const dates = [];
            let current = new Date(startStr);
            const end = new Date(endStr);
            while (current <= end) {
                dates.push(current.toISOString().slice(0, 10));
                current.setDate(current.getDate() + 1);
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
                        granularity: gran,
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

            // Always use backend city name for pollen request and field lookup
            const backendCity = cityLabelToBackend[selectedCity.label];
            const pollenDateField = pollenDateFieldMap[backendCity];
            if (!pollenDateField) {
                setError('Invalid city selection');
                setLoading(false);
                return;
            }

            // Fetch pollen data if morphotypes are selected
            let pollenData = [];
            if (morphotypes.length > 0) {
                const pollenResponse = await fetch('http://localhost:3001/pollen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stationName: backendCity,
                        startDate: startStr,
                        endDate: endStr,
                        morphotypes: morphotypes,
                        granularity: gran,
                    }),
                });
                pollenData = pollenResponse.ok ? await pollenResponse.json() : [];
            }

            // Merge pollen data into weather data using correct date field
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

            // Filter merged data to only include entries within the user-selected date range
            const startObj = new Date(startStr);
            const endObj = new Date(endStr);
            const filteredData = mergedData.filter(d => {
                const dt = new Date(d.time);
                return dt >= startObj && dt <= endObj;
            });

            setWeatherData(filteredData);
        } catch (err) {
            setError('Failed to load data');
            setWeatherData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowGraph = async () => {
        setGranularity('hourly'); // always start with hourly
        setIsGraphVisible(true);
        await fetchData('hourly');
    };

    // No handleSwitchGranularity needed, as we never switch to daily

    const handleReset = () => {
        setSelectedCity(null);
        setSelectedGraph('');
        setSelectedParams([]);
        setSelectedDate('');
        setWeatherData([]);
        setError('');
        setIsGraphVisible(false);
        setGranularity('hourly');
    };

    const isAnyFilterSelected = selectedCity || selectedGraph || selectedParams.length > 0 || selectedDate;

    return (
        <div className="section">
            <div className="parameters-panel">
                <div className="block left-col">
                    <h3 className="section-title">{t('location')}</h3>
                    <LocationSelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    <CalendarExample onDateSelect={handleCalendarSelect} selectedDate={selectedDate} />
                </div>
                <div className="block block-morphotypes middle-col">
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
                <>
                    <div className="graph-section">
                        <WeatherGraph
                            weatherData={weatherData}
                            selectedGraph={selectedGraph}
                            selectedParams={selectedParams}
                            granularity={granularity}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MainView;