import React from "react";
import Select from "react-select";
import { lithuanianCities } from "./cities";

import "./ParametersPanel.css";

function ParametersPanel() {
    return (
        <div className="parameters-panel">
            <div className="section">
                <h2 className="section-title">Select Data Parameters</h2>

                <div className="block">
                    <label className="block-label">Location</label>
                    <Select
                        options={lithuanianCities}
                        placeholder="Start typing..."
                        className="block-select"
                    />
                </div>

                <div className="block">
                    <label className="block-label">Morphotypes</label>
                    <div className="checkbox-list">
                        {[
                            "Alnus",
                            "Artemisia",
                            "Ambrosia",
                            "Corylus",
                            "Betula",
                            "Quercus",
                            "Pinus",
                            "Poaceae",
                        ].map((type) => (
                            <label key={type} className="checkbox-label">
                                <input type="checkbox" className="checkbox" /> {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <label className="block-label">Meteorological Conditions</label>
                    <div className="checkbox-list">
                        {[
                            "Temperature",
                            "Humidity",
                            "Precipitation",
                            "Wind direction",
                            "Wind speed",
                        ].map((cond) => (
                            <label key={cond} className="checkbox-label">
                                <input type="checkbox" className="checkbox" /> {cond}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <label className="block-label">Type of graph</label>
                    <select className="block-select">
                        <option value="">Select</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default ParametersPanel;
