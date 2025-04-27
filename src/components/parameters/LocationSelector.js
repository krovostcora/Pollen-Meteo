import Select from "react-select";
import {lithuanianCities} from "../cities";
import React from 'react';


const LocationSelector = ({ selectedCity, setSelectedCity }) => {
    return (
            <Select
                options={lithuanianCities}
                placeholder="Start typing..."
                className="block-select-location"
                onChange={setSelectedCity}
                value={selectedCity}
            />

    );
}
export default LocationSelector;