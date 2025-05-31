import React, { useRef, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Brush
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Parameter mappings
const morphotypeNameToCode = {
    Alnus: "ALNU", Artemisia: "ARTE", Ambrosia: "AMBR", Corylus: "CORY",
    Betula: "BETU", Quercus: "QUER", Pinus: "PINA", Poaceae: "POAC",
    Salix: "SALI", Populus: "POPU", Acer: "ACER"
};
const paramKeys = {
    "Temperature": "temperature", "Humidity": "humidity",
    "Precipitation": "precipitation", "Wind speed": "wind_speed",
    "Wind direction": "wind_direction"
};
const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6699"
];

// Utility: ensure every day in range has a 00:00 tick
function ensureMidnightTicks(data) {
    if (!data || data.length === 0) return [];
    const byDay = {};
    data.forEach(d => {
        const day = d.time.slice(0, 10);
        const hour = new Date(d.time).getHours();
        if (!byDay[day]) byDay[day] = {};
        byDay[day][hour] = d;
    });

    // Find all days in the range
    const first = new Date(data[0].time.slice(0, 10));
    const last = new Date(data[data.length - 1].time.slice(0, 10));
    const days = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
        days.push(d.toISOString().slice(0, 10));
    }

    // Insert 00:00 if missing
    let result = [...data];
    days.forEach(day => {
        if (!byDay[day] || !byDay[day][0]) {
            result.push({
                ...data[0],
                time: `${day}T00:00:00.000Z`
            });
        }
    });

    // Sort by time
    result.sort((a, b) => new Date(a.time) - new Date(b.time));
    return result;
}

// Format X-axis ticks
function formatTick(tick, granularity) {
    if (!tick) return '';
    const d = new Date(tick);
    if (isNaN(d)) return tick;
    if (granularity === 'hourly') {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toISOString().slice(0, 10);
}

// Custom XAxis tick for daily/hourly granularity
const CustomDateTick = ({ x, y, payload, index, data, granularity }) => {
    const current = new Date(payload.value);
    if (granularity === 'hourly') {
        const hour = current.getHours();
        return (
            <g>
                <text
                    x={x}
                    y={y + 18}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#555"
                >
                    {current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </text>
                {hour === 0 && (
                    <text
                        x={x}
                        y={y + 34}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight="bold"
                        fill="#222"
                    >
                        {current.toISOString().slice(0, 10)}
                    </text>
                )}
            </g>
        );
    }
    // For daily, show only if date changes
    const currentDate = formatTick(payload.value, 'daily');
    const prevDate = index > 0 ? formatTick(data[index - 1].time, 'daily') : null;
    if (currentDate !== prevDate) {
        return (
            <text x={x} y={y + 18} textAnchor="middle" fontSize={12}>
                {currentDate}
            </text>
        );
    }
    return null;
};

// Tooltip with only color/style changes
const CustomTooltip = ({ active, payload, label, granularity }) => {
    if (active && payload && payload.length) {
        return (
            <div className="weather-graph-tooltip">
                <p>{formatTick(label, granularity)}</p>
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

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams, granularity }) => {
    const graphRef = useRef();

    // Build param list with keys and display names
    const paramList = useMemo(() =>
        selectedParams.map((name) => {
            if (morphotypeNameToCode[name]) return { key: morphotypeNameToCode[name], name };
            if (paramKeys[name]) return { key: paramKeys[name], name };
            return null;
        }).filter(Boolean), [selectedParams]
    );

    // Preprocess data for hourly granularity
    const processedData = useMemo(() =>
            granularity === 'hourly'
                ? ensureMidnightTicks(weatherData)
                : weatherData,
        [weatherData, granularity]
    );

    // Chart common props
    const commonProps = {
        width: 1200,
        height: 600,
        margin: { top: 20, right: 80, left: -20, bottom: 70 }
    };

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
                const formattedData = processedData.map(d => ({
                    x: d.time,
                    y: d[key]
                }));
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

    // Render the selected chart type
    const renderChart = () => {
        const xAxisProps = {
            minTickGap: 10,
            height: granularity === 'hourly' ? 70 : 40,
            tick: props =>
                <CustomDateTick
                    {...props}
                    data={processedData}
                    granularity={granularity}
                />
        };

        switch (selectedGraph) {
            case 'line':
                return (
                    <LineChart data={processedData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            {...xAxisProps}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip granularity={granularity} />} />
                        <Legend verticalAlign="bottom" height={50} />
                        {renderChartContent()}
                        <Brush
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            height={30}
                            stroke="#8884d8"
                        />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={processedData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            {...xAxisProps}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip granularity={granularity} />} />
                        <Legend verticalAlign="bottom" height={50} />
                        {renderChartContent()}
                        <Brush
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            height={30}
                            stroke="#8884d8"
                        />
                    </BarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="x"
                            name="Time"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            {...xAxisProps}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip granularity={granularity} />} />
                        <Legend verticalAlign="bottom" height={50} />
                        {renderChartContent()}
                        <Brush
                            dataKey="x"
                            tickFormatter={tick => formatTick(tick, granularity)}
                            height={30}
                            stroke="#8884d8"
                        />
                    </ScatterChart>
                );
            default:
                return null;
        }
    };

    // PDF download handler
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

    if (!processedData || processedData.length === 0) return null;

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