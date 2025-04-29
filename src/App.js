import React, { useState } from "react";
import "./App.css";
import MainView from "./views/MainView";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
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
                <div className="header-controls">
                    <LanguageSwitcher />
                    <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div>
            </header>

            {/* Main */}
            <main className={`main ${isDarkMode ? 'dark' : ''}`}>
                <div className="panel-wrapper">
                    <MainView />
                </div>
            </main>

            {/* Footer */}
            <footer className={`footer ${isDarkMode ? 'dark' : ''}`}>
                Pollen&Meteo 2025
            </footer>
        </div>
    );
}
