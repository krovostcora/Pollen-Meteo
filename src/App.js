import React, { useState } from "react";
import "./App.css";
import CalendarExample from "./components/calendar";
import ParametersPanel from "./components/ParametersPanel";

export default function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false); // Стан для темної теми

    // Функція для перемикання теми
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <div className={`container ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <header className={`header ${isDarkMode ? 'dark' : ''}`}>
                <div className="logo">
                    Pollen<br />&<br />Meteo
                </div>
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </header>

            {/* Main Content Placeholder */}
            <main className={`main ${isDarkMode ? 'dark' : ''}`}>
                <div className="panel-wrapper">
                    <ParametersPanel selectedDate={selectedDate} />
                    <CalendarExample onDateSelect={setSelectedDate} />
                </div>
            </main>

            {/* Footer */}
            <footer className={`footer ${isDarkMode ? 'dark' : ''}`}>
                Pollen&Meteo 2025
            </footer>
        </div>
    );
}
