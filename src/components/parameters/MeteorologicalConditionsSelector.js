import React from 'react';
import { useTranslation } from 'react-i18next';

const WeatherParametersCheckboxes = ({ selectedParams, setSelectedParams }) => {
    const { t } = useTranslation();

    const weatherParametersOptions = [
        { value: "Temperature", label: t('temperature') },
        { value: "Humidity", label: t('humidity') },
        { value: "Precipitation", label: t('precipitation') },
        { value: "Wind direction", label: t('windDirection') },
        { value: "Wind speed", label: t('windSpeed') },
    ];

    const handleChange = (value) => {
        if (selectedParams.includes(value)) {
            setSelectedParams(selectedParams.filter((v) => v !== value));
        } else {
            setSelectedParams([...selectedParams, value]);
        }
    };

    return (
        <div className="checkbox-list">
            {weatherParametersOptions.map((param) => (
                <label key={param.value} className="checkbox-label">
                    <input
                        type="checkbox"
                        value={param.value}
                        checked={selectedParams.includes(param.value)}
                        onChange={() => handleChange(param.value)}
                        className="checkbox-input"
                    />
                    {param.label}
                </label>
            ))}
        </div>
    );
};

export default WeatherParametersCheckboxes;
