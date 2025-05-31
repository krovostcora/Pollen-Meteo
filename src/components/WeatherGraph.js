import React, { useRef, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Brush
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6699"
];

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

function ensureMidnightTicks(data) {
    if (!data || data.length === 0) return [];
    const byDay = {};
    data.forEach(d => {
        const day = d.time.slice(0, 10);
        const hour = new Date(d.time).getHours();
        if (!byDay[day]) byDay[day] = {};
        byDay[day][hour] = d;
    });
    const first = new Date(data[0].time.slice(0, 10));
    const last = new Date(data[data.length - 1].time.slice(0, 10));
    const days = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
        days.push(d.toISOString().slice(0, 10));
    }
    let result = [...data];
    days.forEach(day => {
        if (!byDay[day] || !byDay[day][0]) {
            result.push({
                ...data[0],
                time: `${day}T00:00:00.000Z`
            });
        }
    });
    result.sort((a, b) => new Date(a.time) - new Date(b.time));
    return result;
}

function formatTick(tick, granularity, t) {
    if (!tick) return '';
    const d = new Date(tick);
    if (isNaN(d)) return tick;
    if (granularity === 'hourly') {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toISOString().slice(0, 10);
}

const CustomDateTick = ({ x, y, payload, index, data, granularity, t }) => {
    const current = new Date(payload.value);
    if (granularity === 'hourly') {
        const hour = current.getHours();
        return (
            <g>
                <text x={x} y={y + 18} textAnchor="middle" fontSize={12} fill="#555">
                    {current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </text>
                {hour === 0 && (
                    <text x={x} y={y + 34} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#222">
                        {current.toISOString().slice(0, 10)}
                    </text>
                )}
            </g>
        );
    }
    const currentDate = formatTick(payload.value, 'daily', t);
    const prevDate = index > 0 ? formatTick(data[index - 1].time, 'daily', t) : null;
    if (currentDate !== prevDate) {
        return (
            <text x={x} y={y + 18} textAnchor="middle" fontSize={12}>
                {currentDate}
            </text>
        );
    }
    return null;
};

const CustomTooltip = ({ active, payload, label, granularity, t }) => {
    if (active && payload && payload.length) {
        let dateStr = '';
        if (granularity === 'hourly') {
            const date = new Date(label);
            dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            dateStr = formatTick(label, granularity, t);
        }
        return (
            <div className="weather-graph-tooltip">
                <p>{dateStr}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {t(entry.name) || entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const WeatherGraph = ({ weatherData, selectedGraph, selectedParams, granularity }) => {
    const { t } = useTranslation();
    const graphRef = useRef();

    const paramList = useMemo(() =>
        selectedParams.map((name) => {
            const match = name.match(/^([A-Za-z]+)(Temperature|Humidity|Precipitation|Wind speed|Wind direction)$/);
            if (match) {
                const morphotype = match[1];
                const param = match[2];
                return {
                    key: morphotypeNameToCode[morphotype] + '_' + paramKeys[param],
                    name: `${t(morphotype)} ${t(param)}`
                };
            }
            if (morphotypeNameToCode[name]) return { key: morphotypeNameToCode[name], name: t(name) };
            if (paramKeys[name]) return { key: paramKeys[name], name: t(name) };
            return null;
        }).filter(Boolean), [selectedParams, t]
    );

    const processedData = useMemo(() =>
            granularity === 'hourly'
                ? ensureMidnightTicks(weatherData)
                : weatherData,
        [weatherData, granularity]
    );

    const commonProps = {
        width: 1200,
        height: 600,
        margin: { top: 20, right: 80, left: -20, bottom: 70 }
    };

    const renderChartContent = () => {
        switch (selectedGraph) {
            case 'line':
                return paramList.map(({ key, name }, idx) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[idx % COLORS.length]}
                        name={t(name)}
                        dot={false}
                        isAnimationActive={false}
                    />
                ));
            case 'bar':
                return paramList.map(({ key, name }, idx) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={COLORS[idx % COLORS.length]}
                        name={t(name)}
                    />
                ));
            default:
                return null;
        }
    };

    const renderChart = () => {
        const xAxisProps = {
            minTickGap: 10,
            height: granularity === 'hourly' ? 70 : 40,
            tick: props =>
                <CustomDateTick
                    {...props}
                    data={processedData}
                    granularity={granularity}
                    t={t}
                />
        };

        switch (selectedGraph) {
            case 'line':
                return (
                    <LineChart data={processedData} {...commonProps}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity, t)}
                            {...xAxisProps}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip granularity={granularity} t={t} />} />
                        <Legend verticalAlign="bottom" height={50} />
                        {renderChartContent()}
                        <Brush
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity, t)}
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
                            tickFormatter={tick => formatTick(tick, granularity, t)}
                            {...xAxisProps}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip granularity={granularity} t={t} />} />
                        <Legend verticalAlign="bottom" height={50} />
                        {renderChartContent()}
                        <Brush
                            dataKey="time"
                            tickFormatter={tick => formatTick(tick, granularity, t)}
                            height={30}
                            stroke="#8884d8"
                        />
                    </BarChart>
                );
            default:
                return null;
        }
    };

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
                {t('downloadPDF')}
            </button>
        </div>
    );
};

export default WeatherGraph;