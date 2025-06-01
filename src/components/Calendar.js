import React, { useEffect } from 'react';
import { DatePicker } from '@mantine/dates';
import '../styles/Calendar.css';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

function Calendar({ selectedDate, setSelectedDate, error, setError }) {
    const { t, i18n } = useTranslation();

    // Block future dates
    const maxDate = new Date();
    maxDate.setHours(23, 59, 59, 999);

    // Handle date change
    const handleChange = (range) => {
        if (!range || range.length !== 2) {
            setSelectedDate([null, null]);
            return;
        }
        const [start, end] = range;
        if ((start && dayjs(start).isAfter(dayjs())) || (end && dayjs(end).isAfter(dayjs()))) {
            setError(t('You can only select past or current dates.'));
            setSelectedDate([null, null]);
            return;
        }
        setError('');
        setSelectedDate(range);
    };

    // Sync locale for dayjs
    useEffect(() => {
        dayjs.locale(i18n.language);
    }, [i18n.language]);

    const localeMap = {
        en: 'en-US',
        ua: 'uk-UK',
        lt: 'lt-LT',
    };

    return (
        <div className="calendar-container">
            <div className="selected-range">
                <div className="date-column">
                    <span className="label">{t('start')}</span>
                    <span className="date">
                        {selectedDate[0]
                            ? selectedDate[0].toLocaleDateString(localeMap[i18n.language], {
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
                        {selectedDate[1]
                            ? selectedDate[1].toLocaleDateString(localeMap[i18n.language], {
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
                value={selectedDate}
                onChange={handleChange}
                maxDate={maxDate}
                locale={i18n.language}
            />
            {error && <div className="calendar-error">{error}</div>}
        </div>
    );
}

export default Calendar;