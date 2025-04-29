import React, {useEffect, useState} from 'react';
import { DatePicker } from '@mantine/dates';
import '../styles/Calendar.css';
import { useTranslation } from 'react-i18next';

function CalendarExample({ onDateSelect }) {
    // Initialize state with an array of two elements or null
    const [value, setValue] = useState([null, null]);
    const { t } = useTranslation();

    useEffect(() => {
        if (value[0] && value[1]) {
            onDateSelect(value); // [start, end]
        }
    }, [value, onDateSelect]);


    return (

        <div className="calendar-container">
            {/* Always visible selected range */}
            <div className="selected-range">
                <div className="date-column">
                    <span className="label">{t('start')}</span>
                    <span className="date">
            {value[0]
                ? value[0].toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
                : <span className="placeholder">{t('notSelected')}</span>}
          </span>
                </div>
                <div className="date-column">
                    <span className="label">{t('end')}</span>
                    <span className="date">
            {value[1]
                ? value[1].toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
                : <span className="placeholder">{t('notSelected')}</span>}
          </span>
                </div>
            </div>

            <DatePicker
                className="custom-datepicker"
                type="range"
                value={value}
                onChange={setValue}
            />
        </div>
    );
}

export default CalendarExample;
