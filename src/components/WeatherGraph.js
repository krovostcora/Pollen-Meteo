import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams }) => {
    const formatData = (data, param) => data.map(d => ({ x: d.time, y: d[param] }));

    return (
        <>
            {selectedGraph === 'line' && weatherData.length > 0 && (
                <LineChart width={600} height={300} data={weatherData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedParams.includes("Temperature") && <Line type="monotone" dataKey="temperature" stroke="#8884d8" />}
                    {selectedParams.includes("Humidity") && <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />}
                    {selectedParams.includes("Precipitation") && <Line type="monotone" dataKey="precipitation" stroke="#ff7300" />}
                    {selectedParams.includes("Wind speed") && <Line type="monotone" dataKey="wind_speed" stroke="#387908" />}
                </LineChart>
            )}

            {selectedGraph === 'bar' && weatherData.length > 0 && (
                <BarChart width={600} height={300} data={weatherData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedParams.includes("Temperature") && <Bar dataKey="temperature" fill="#8884d8" />}
                    {selectedParams.includes("Humidity") && <Bar dataKey="humidity" fill="#82ca9d" />}
                    {selectedParams.includes("Precipitation") && <Bar dataKey="precipitation" fill="#ff7300" />}
                    {selectedParams.includes("Wind speed") && <Bar dataKey="wind_speed" fill="#387908" />}
                </BarChart>
            )}

            {selectedGraph === 'scatter' && weatherData.length > 0 && (
                <ScatterChart width={600} height={300}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedParams.includes("Temperature") && (
                        <Scatter name="Temperature (°C)" data={formatData(weatherData, 'temperature')} fill="#8884d8" />
                    )}
                    {selectedParams.includes("Humidity") && (
                        <Scatter name="Humidity (%)" data={formatData(weatherData, 'humidity')} fill="#82ca9d" />
                    )}
                    {selectedParams.includes("Precipitation") && (
                        <Scatter name="Precipitation (mm)" data={formatData(weatherData, 'precipitation')} fill="#ff7300" />
                    )}
                    {selectedParams.includes("Wind speed") && (
                        <Scatter name="Wind speed (km/h)" data={formatData(weatherData, 'wind_speed')} fill="#387908" />
                    )}
                </ScatterChart>
            )}
        </>
    );
};

export default WeatherGraph;
