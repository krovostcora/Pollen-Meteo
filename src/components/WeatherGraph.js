import React, { useRef } from 'react';
import '../styles/WeatherGraph.css';
import {
    LineChart, Line,
    BarChart, Bar,
    ScatterChart, Scatter,
    XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, Brush
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
        }}>
            <p style={{ margin: 0, color: 'black', fontWeight: 'bold' }}>{label}</p>
            {payload.map((entry, index) => (
                <p
                    key={index}
                    style={{
                        margin: 0,
                        color: entry.color,
                    }}
                >
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
};

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams }) => {
    const graphRef = useRef();

    if (!weatherData.length || !selectedParams.length) return null;

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

    const handleDownloadPDF = async () => {
        const canvas = await html2canvas(graphRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('weather-graph.pdf');
    };

    const renderChartContent = () => {
        return Object.entries(paramKeys)
            .filter(([label]) => selectedParams.includes(label))
            .map(([label, key]) => {
                const color = graphColors[key];
                const name = paramLabels[key];

                switch (selectedGraph) {
                    case 'line':
                        return (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                name={name}
                                dot={false} // вимкнемо крапки для збереження
                                isAnimationActive={false} // вимкнемо анімацію при збереженні
                            />
                        );
                    case 'bar':
                        return (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={color}
                                name={name}
                            />
                        );
                    case 'scatter':
                        const formattedData = weatherData.map(d => ({ x: d.time, y: d[key] }));
                        return (
                            <Scatter
                                key={key}
                                name={name}
                                data={formattedData}
                                fill={color}
                            />
                        );
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
        const axisStyle = {
            stroke: 'var(--axis-color)',
            tick: { fill: 'var(--axis-color)' },
        };

        switch (selectedGraph) {
            case 'line':
                return (
                    <LineChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={formatTick} {...axisStyle} />
                        <YAxis {...axisStyle} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="time" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={weatherData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" tickFormatter={formatTick} {...axisStyle} />
                        <YAxis {...axisStyle} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="time" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="x" name="Time" tickFormatter={formatTick} {...axisStyle} />
                        <YAxis {...axisStyle} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {renderChartContent()}
                        <Brush dataKey="x" tickFormatter={formatTick} height={30} stroke="#8884d8" />
                    </ScatterChart>
                );
            default:
                return null;
        }
    };

    return (
        <div className="weather-graph-container">
            <div className="weather-graph" ref={graphRef}>
                {renderChart()}
            </div>
            <button className="download-button" onClick={handleDownloadPDF}>
                Download PDF
            </button>
        </div>
    );

};

export default WeatherGraph;
