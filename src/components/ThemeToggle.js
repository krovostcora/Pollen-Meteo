import React, { useEffect, useState } from "react";
import "../styles/ThemeToggle.css";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
        document.body.classList.toggle('dark', isDark);
    }, []);

    return (
        <div>
            <input
                type="checkbox"
                className="theme-toggle-checkbox"
                id="theme-toggle"
                checked={isDarkMode}
                onChange={toggleDarkMode}
            />
            <label htmlFor="theme-toggle" className="theme-toggle-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
            </label>
        </div>
    );
}
