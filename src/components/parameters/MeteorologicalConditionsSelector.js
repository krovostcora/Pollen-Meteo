import React from 'react';

const weatherParametersOptions = [
    { value: "Temperature", label: "Temperature" },
    { value: "Humidity", label: "Humidity" },
    { value: "Precipitation", label: "Precipitation" },
    { value: "Wind direction", label: "Wind direction" },
    { value: "Wind speed", label: "Wind speed" },
];

const MeteorologicalConditionsSelector = ({ selectedParams, setSelectedParams }) => {
    const handleCheckboxChange = (param) => {
        setSelectedParams((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param]
        );
    };

    return (
        <div className="block-1">
            <div className="checkbox-list">
                {weatherParametersOptions.map((cond) => (
                    <label key={cond.value} className="checkbox-label">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedParams.includes(cond.value)}
                            onChange={() => handleCheckboxChange(cond.value)}
                        />
                        {cond.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default MeteorologicalConditionsSelector;
