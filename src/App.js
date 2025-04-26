import React, { useState } from "react";
import "./App.css";
import CalendarExample from "./components/calendar";
import ParametersPanel from "./components/ParametersPanel";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

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
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
