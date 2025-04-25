import {useEffect, useState} from 'react';
import { DatePicker } from '@mantine/dates';
import './Calendar.css';

function CalendarExample({ onDateSelect }) {
    // Initialize state with an array of two elements or null
    const [value, setValue] = useState([null, null]);

    useEffect(() => {
        // sending the first date to the parent component
        if (value[0]) {
            onDateSelect(value[0].toISOString().split('T')[0]); // yyyy-mm-dd
        }
    }, [value, onDateSelect]);

    return (
        <div className="calendar-container">
            {/* Always visible selected range */}
            <div className="selected-range">
                <div className="date-column">
                    <span className="label">Start</span>
                    <span className="date">
            {value[0]
                ? value[0].toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
                : <span className="placeholder">Not selected</span>}
          </span>
                </div>
                <div className="date-column">
                    <span className="label">End</span>
                    <span className="date">
            {value[1]
                ? value[1].toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
                : <span className="placeholder">Not selected</span>}
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
