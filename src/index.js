import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import 'dayjs/locale/en';
import './i18n';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/lt';
import 'dayjs/locale/uk';

dayjs.locale('en');


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider defaultColorScheme="light">
            <DatesProvider
                settings={{
                    locale: 'en',
                    firstDayOfWeek: 1,
                    timezone: 'Europe/Vilnius',
                }}
            >
                <App />
            </DatesProvider>
        </MantineProvider>
    </React.StrictMode>
);
