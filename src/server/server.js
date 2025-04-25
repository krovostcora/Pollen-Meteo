const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/weather', (req, res) => {
    const { city, date } = req.body;

    // Це тимчасова відповідь (заглушка). Тут має бути реальна логіка або доступ до бази/зовнішнього API.
    const dummyWeather = {
        city,
        date,
        temperature: 21,
        humidity: 60,
        precipitation: 2,
        wind_direction: 'NW',
        wind_speed: 15
    };

    res.json(dummyWeather);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
