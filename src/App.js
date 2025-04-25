import React, {useState} from "react";
import "./App.css";
import CalendarExample from "./components/calendar";
import ParametersPanel from "./components/ParametersPanel";


export default function App() {
    const [selectedDate, setSelectedDate] = useState('');
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
            <div className="panel-wrapper">
                <CalendarExample onDateSelect={setSelectedDate} />
                <ParametersPanel selectedDate={selectedDate} />


            </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          Pollen&Meteo 2025
        </footer>
      </div>
  );
}
