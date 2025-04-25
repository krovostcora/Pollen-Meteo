import React from 'react';
import './WeatherGraph.css';

import {
    LineChart, Line,
    BarChart, Bar,
    ScatterChart, Scatter,
    XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from 'recharts';

const graphColors = {
    temperature: '#8884d8',
    humidity: '#82ca9d',
    precipitation: '#ff7300',
    wind_speed: '#387908',
};

const paramLabels = {
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    precipitation: 'Precipitation (mm)',
    wind_speed: 'Wind speed (km/h)',
};

const paramKeys = {
    "Temperature": "temperature",
    "Humidity": "humidity",
    "Precipitation": "precipitation",
    "Wind speed": "wind_speed",
};

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams }) => {
    if (!weatherData.length || !selectedParams.length) return null;

    const renderChartContent = () => {
        return Object.entries(paramKeys)
            .filter(([label]) => selectedParams.includes(label))
            .map(([label, key]) => {
                const color = graphColors[key];
                const name = paramLabels[key];

                switch (selectedGraph) {
                    case 'line':
                        return <Line key={key} type="monotone" dataKey={key} stroke={color} name={name} />;
                    case 'bar':
                        return <Bar key={key} dataKey={key} fill={color} name={name} />;
                    case 'scatter':
                        const formattedData = weatherData.map(d => ({ x: d.time, y: d[key] }));
                        return <Scatter key={key} name={name} data={formattedData} fill={color} />;
                    default:
                        return null;
                }
            });
    };

    const commonProps = {
        width: 1000,
        height: 500,
        margin: { top: 5, right: 5, left: -40, bottom: 5 }
    };

    const renderChart = () => {
        switch (selectedGraph) {
            case 'line':
                return (
                    <LineChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="x" name="Time" tickFormatter={(t) => t.slice(11, 16)} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                    </ScatterChart>
                );
            default:
                return null;
        }
    };

    return <>{renderChart()}</>;
};

export default WeatherGraph;
