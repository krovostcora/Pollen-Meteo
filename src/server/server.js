const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
    const { stationCode, date } = req.body;

    const url = date
        ? `https://api.meteo.lt/v1/stations/${stationCode}/observations/${date}`
        : `https://api.meteo.lt/v1/stations/${stationCode}/observations/latest`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Data not found for this date' });
        }

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
