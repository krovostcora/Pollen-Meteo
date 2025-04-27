import React from 'react';
import '../styles/WeatherGraph.css';
import {
    LineChart, Line,
    BarChart, Bar,
    ScatterChart, Scatter,
    XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, Brush
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

    // Визначаємо, як форматувати вісь X
    const isShortRange = () => {
        const dates = [...new Set(weatherData.map(d => d.time.slice(0, 10)))];
        return dates.length <= 2;
    };

    const formatTick = (tick) => {
        if (isShortRange()) {
            return tick.slice(11, 16);
        } else {
            return tick.slice(5, 10);
        }
    };

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
        width: 1200,
        height: 600,
        margin: { top: 20, right: 30, left: 0, bottom: 30 },
    };

    const renderChart = () => {
        switch (selectedGraph) {
            case 'line':
                return (
                    <LineChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={formatTick} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="time" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={formatTick} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="time" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="x" name="Time" tickFormatter={formatTick} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="x" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </ScatterChart>
                );
            default:
                return null;
        }
    };

    return <div className="weather-graph">{renderChart()}</div>;
};

export default WeatherGraph;
