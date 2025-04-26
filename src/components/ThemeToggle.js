import React from "react";
import "./ThemeToggle.css";

export default function ThemeToggle({ isDarkMode, toggleDarkMode }) {
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
