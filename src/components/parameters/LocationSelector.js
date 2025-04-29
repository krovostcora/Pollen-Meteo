import Select from "react-select";
import {lithuanianCities} from "../cities";
import React from 'react';
import { useTranslation } from 'react-i18next';

const LocationSelector = ({ selectedCity, setSelectedCity }) => {
    const { t } = useTranslation();
    return (
            <Select
                options={lithuanianCities}
                placeholder={t('startTyping')}
                className="block-select-location"
                onChange={setSelectedCity}
                value={selectedCity}
            />

    );
}
export default LocationSelector;