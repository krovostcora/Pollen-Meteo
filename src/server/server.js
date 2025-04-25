const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
    const { stationCode } = req.body;

    try {
        const response = await fetch(`https://api.meteo.lt/v1/stations/${stationCode}/observations/latest`);
        const data = await response.json();

        const observations = data.observations.map(obs => ({
            time: obs.observationTimeUtc,
            temperature: obs.airTemperature,
            humidity: obs.relativeHumidity,
            precipitation: obs.precipitation,
            wind_speed: obs.windSpeed,
            wind_direction: obs.windDirection
        }));

        res.json(observations);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
