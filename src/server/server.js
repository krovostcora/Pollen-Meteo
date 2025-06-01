const express = require('express');
const cors = require('cors');
const path = require('path');
const pollenRouter = require('./pollen');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001;
app.use(express.static(path.join(__dirname, '../../build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.use(cors());
app.use(express.json());
app.use('/', pollenRouter);

app.post('/weather', async (req, res) => {
    const { stationCode, date, granularity } = req.body;

    const url = date
        ? `https://api.meteo.lt/v1/stations/${stationCode}/observations/${date}`
        : `https://api.meteo.lt/v1/stations/${stationCode}/observations/latest`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Data not found for this date' });
        }

        const data = await response.json();

        let observations = data.observations.map(obs => ({
            time: obs.observationTimeUtc,
            temperature: obs.airTemperature,
            humidity: obs.relativeHumidity,
            precipitation: obs.precipitation,
            wind_speed: obs.windSpeed,
            wind_direction: obs.windDirection
        }));

        if (granularity === 'daily' && observations.length > 0) {
            const day = observations[0].time.slice(0, 10);
            const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
            observations = [{
                time: day,
                temperature: avg(observations.map(o => o.temperature)),
                humidity: avg(observations.map(o => o.humidity)),
                precipitation: avg(observations.map(o => o.precipitation)),
                wind_speed: avg(observations.map(o => o.wind_speed)),
                wind_direction: avg(observations.map(o => o.wind_direction))
            }];
        }

        res.json(observations);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});