import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { lithuanianCities } from './cities';
import LocationSelector from './parameters/LocationSelector';

const customStyles = (isDarkTheme: boolean) => ({
    control: (provided: any) => ({
        ...provided,
        backgroundColor: isDarkTheme ? '#333333' : '#EFF1F5',
        borderColor: isDarkTheme ? '#555555' : '#ccc',
        color: isDarkTheme ? '#FFFFFF' : '#000000',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: isDarkTheme ? '#333333' : '#FFFFFF',
        color: isDarkTheme ? '#FFFFFF' : '#000000',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused
            ? (isDarkTheme ? '#444444' : '#f0f0f0')
            : (isDarkTheme ? '#333333' : '#FFFFFF'),
        color: isDarkTheme ? '#FFFFFF' : '#000000',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: isDarkTheme ? '#FFFFFF' : '#000000',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: isDarkTheme ? '#CCCCCC' : '#888888',
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        backgroundColor: isDarkTheme ? '#555555' : '#cccccc',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: isDarkTheme ? '#CCCCCC' : '#555555',
    }),
});

const SelectParams = ({ selectedCity, setSelectedCity, selectedGraph, setSelectedGraph, selectedParams, setSelectedParams }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            setIsDarkTheme(document.body.classList.contains('dark'));
        };

        updateTheme(); // check theme on load

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

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
    const handleReset = () => {
        setSelectedCity(null);
        setSelectedGraph('');
        setSelectedParams([]);
        localStorage.removeItem('selectedCity');
        localStorage.removeItem('selectedGraph');
        localStorage.removeItem('selectedParams');
    };



    return (
        <div className="section">
            <h2 className="section-title">Select Data Parameters</h2>

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

                <button
                    className={`reset-button ${(selectedCity || selectedGraph || selectedParams.length > 0) ? 'visible' : ''}`}
                    onClick={handleReset}
                >
                    Reset filters
                </button>
            </div>



        </div>
    );
};

export default SelectParams;
