import React, { useEffect, useState } from 'react';
import MorphotypesSelector from './parameters/MorphotypesSelector';
import MeteorologicalConditionsSelector from './parameters/MeteorologicalConditionsSelector';
import GraphTypeSelector from './parameters/GraphTypeSelector';

const SelectParams = ({ selectedCity, setSelectedCity, selectedGraph, setSelectedGraph, selectedParams, setSelectedParams }) => {
    const [setIsDarkTheme] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            setIsDarkTheme(document.body.classList.contains('dark'));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

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

            <button
                className={`reset-button ${(selectedCity || selectedGraph || selectedParams.length > 0) ? 'visible' : ''}`}
                onClick={handleReset}
            >
                Reset filters
            </button>
        </div>
    );
};

export default SelectParams;
