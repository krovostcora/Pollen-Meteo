import React, { useEffect, useState } from 'react';
import { DatePicker, DatesProvider } from '@mantine/dates';
import '../styles/Calendar.css';
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import 'dayjs/locale/lt';
import 'dayjs/locale/en';
import 'dayjs/locale/uk';
import { useMediaQuery } from '@mantine/hooks';


dayjs.extend(utc);
dayjs.extend(timezone);

const localeMap = {
    en: 'en',
    ua: 'uk',
    lt: 'lt',
};

function CalendarExample({ onDateSelect, selectedDate }) {
    const [value, setValue] = useState([null, null]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (value[0] && value[1]) {
            onDateSelect(value);
        }
    }, [value, onDateSelect]);

    useEffect(() => {
        dayjs.locale(localeMap[i18n.language] || 'en');
    }, [i18n.language]);

    // Sync with parent if needed
    useEffect(() => {
        if (
            selectedDate &&
            Array.isArray(selectedDate) &&
            (selectedDate[0] !== value[0] || selectedDate[1] !== value[1])
        ) {
            setValue(selectedDate);
        }
    }, [selectedDate]);

    const handleChange = (range) => {
        setValue(range); // Do NOT add +1 day here
    };
    const isMobile = useMediaQuery('(max-width: 900px)');

    return (
        <div className="calendar-container">
            <div className="selected-range">
                <div className="date-column">
                    <span className="label">{t('start')}</span>
                    <span className="date">
                        {value[0]
                            ? dayjs(value[0]).format('ddd, MMM D, YYYY')
                            : <span className="placeholder">{t('notSelected')}</span>}
                    </span>
                </div>
                <div className="date-column">
                    <span className="label">{t('end')}</span>
                    <span className="date">
                        {value[1]
                            ? dayjs(value[1]).format('ddd, MMM D, YYYY')
                            : <span className="placeholder">{t('notSelected')}</span>}
                    </span>
                </div>
            </div>
            <DatesProvider settings={{
                timezone: 'Europe/Vilnius',
                locale: localeMap[i18n.language] || 'en',
                firstDayOfWeek: 1,
                weekendDays: [0, 6]
            }}>
                {isMobile ? (
                    <DatePicker
                        className="custom-datepicker"
                        type="default" // простий одноденний вибір
                        value={value[0]}
                        onChange={(date) => handleChange([date, date])}
                        locale={localeMap[i18n.language] || 'en'}
                    />
                ) : (
                    <DatePicker
                        className="custom-datepicker"
                        type="range"
                        value={value}
                        onChange={handleChange}
                        locale={localeMap[i18n.language] || 'en'}
                    />
                )}

            </DatesProvider>
        </div>
    );
}

export default CalendarExample;