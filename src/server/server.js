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

        const latest = data.observations[data.observations.length - 1];

        const result = {
            temperature: latest.airTemperature,
            humidity: latest.relativeHumidity,
            precipitation: latest.precipitation,
            wind_speed: latest.windSpeed,
            wind_direction: latest.windDirection,
            timestamp: latest.observationTimeUtc
        };

        res.json(result);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
