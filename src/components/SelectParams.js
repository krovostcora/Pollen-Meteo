import React from 'react';
import Select from 'react-select';
import { lithuanianCities } from './cities';

const SelectParams = ({ selectedCity, setSelectedCity, selectedGraph, setSelectedGraph, selectedParams, setSelectedParams }) => {
    const weatherParameters = [
        "Temperature",
        "Humidity",
        "Precipitation",
        "Wind direction",
        "Wind speed",
    ];

    const morphotypes = [
        "Alnus", "Artemisia", "Ambrosia", "Corylus", "Betula", "Quercus", "Pinus", "Poaceae",
    ];

    const handleCheckboxChange = (param, setter, values) => {
        setter((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param]
        );
    };

    return (
        <div className="section">
            <h2 className="section-title">Select Data Parameters</h2>
            <div className="block">
                <label className="block-label">Location</label>
                <Select
                    options={lithuanianCities}
                    placeholder="Start typing..."
                    className="block-select"
                    onChange={setSelectedCity}
                    value={selectedCity}
                />
            </div>

            <div className="block">
                <label className="block-label">Morphotypes</label>
                <div className="checkbox-list">
                    {morphotypes.map((type) => (
                        <label key={type} className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={selectedParams.includes(type)}
                                onChange={() => handleCheckboxChange(type, setSelectedParams, morphotypes)}
                            /> {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className="block">
                <label className="block-label">Meteorological Conditions</label>
                <div className="checkbox-list">
                    {weatherParameters.map((cond) => (
                        <label key={cond} className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={selectedParams.includes(cond)}
                                onChange={() => handleCheckboxChange(cond, setSelectedParams, weatherParameters)}
                            /> {cond}
                        </label>
                    ))}
                </div>
            </div>

            <div className="block">
                <label className="block-label">Type of graph</label>
                <select
                    className="block-select"
                    value={selectedGraph}
                    onChange={(e) => setSelectedGraph(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="line">Line graph</option>
                    <option value="bar">Bar chart</option>
                    <option value="scatter">Scatter plot</option>
                </select>
            </div>
        </div>
    );
};

export default SelectParams;
