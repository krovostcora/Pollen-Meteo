import Select from "react-select";
import {lithuanianCities} from "../cities";
import React from 'react';


const LocationSelector = ({ selectedCity, setSelectedCity }) => {
    return (
        <div className="block">
        <label className="block-label">Location</label>
        <Select
            options={lithuanianCities}
            placeholder="Start typing..."
            className="block-select"
            onChange={setSelectedCity}
            value={selectedCity}
            // styles={customStyles(isDarkTheme)}
        />
    </div>
    );
}
export default LocationSelector;