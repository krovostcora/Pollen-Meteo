import React, { useRef } from 'react';
import {
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Brush
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mapping for morphotype display names to codes
const morphotypeNameToCode = {
    Alnus: "ALNU",
    Artemisia: "ARTE",
    Ambrosia: "AMBR",
    Corylus: "CORY",
    Betula: "BETU",
    Quercus: "QUER",
    Pinus: "PINA",
    Poaceae: "POAC",
    Salix: "SALI",
    Populus: "POPU",
    Acer: "ACER"
};

// Weather parameter display names to DB keys
const paramKeys = {
    "Temperature": "temperature",
    "Humidity": "humidity",
    "Precipitation": "precipitation",
    "Wind speed": "wind_speed",
    "Wind direction": "wind_direction"
};

// Color palette for lines/bars
const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6699"
];

// Format tick for X axis
function formatTick(tick) {
    if (!tick) return '';
    // Try to format as date
    const d = new Date(tick);
    if (!isNaN(d)) {
        return d.toISOString().slice(0, 10);
    }
    return tick;
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}>
                <p>{formatTick(label)}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams }) => {
    const graphRef = useRef();

    // Map selectedParams to data keys and display names
    const paramList = selectedParams.map((name) => {
        if (morphotypeNameToCode[name]) {
            return { key: morphotypeNameToCode[name], name };
        }
        if (paramKeys[name]) {
            return { key: paramKeys[name], name };
        }
        return null;
    }).filter(Boolean);

    // Render chart content (lines, bars, scatters)
    const renderChartContent = () => paramList.map(({ key, name }, idx) => {
        const color = COLORS[idx % COLORS.length];
        switch (selectedGraph) {
            case 'line':
                return (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        name={name}
                        dot={false}
                        isAnimationActive={false}
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

    const commonProps = {
        width: 1200,
        height: 600,
        margin: { top: 20, right: 30, left: 0, bottom: 30 },
    };

    const axisStyle = {
        stroke: 'var(--axis-color)',
        tick: { fill: 'var(--axis-color)' },
    };

    // Render the appropriate chart
    const renderChart = () => {
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

    // Download as PDF
    const handleDownloadPDF = async () => {
        if (!graphRef.current) return;
        const canvas = await html2canvas(graphRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('weather-graph.pdf');
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