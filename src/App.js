import React from "react";
import "./App.css";
import CalendarExample from "./components/calendar";


export default function App() {
  return (
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            Pollen<br />&<br />Meteo
          </div>
        </header>

        {/* Main Content Placeholder */}
        <main className="main">

            <CalendarExample />


          {/* Button */}
          <button className="show-button">
            Show Graph
          </button>
        </main>

        {/* Footer */}
        <footer className="footer">
          Pollen&Meteo 2025
        </footer>
      </div>
  );
}
