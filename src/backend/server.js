// const express = require('express');
// const app = express();
// const cors = require('cors');
// const axios = require('axios');
//
// // Enable CORS
// app.use(cors());
//
// // Function to fetch weather data for a specific city and filter it by date
// async function getWeatherData(city, date) {
//     try {
//         // Fetch weather forecast data from API
//         const response = await axios.get(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`);
//         const forecastData = response.data;
//
//         // Convert date to ISO string for comparison
//         const selectedDate = new Date(date).toISOString();
//
//         // Find the forecast for the selected date
//         const forecast = forecastData.forecastTimestamps.find(item => {
//             return item.forecastTimeUtc.startsWith(selectedDate.substring(0, 10)); // Match the date (year-month-day)
//         });
//
//         if (forecast) {
//             return {
//                 temperature: forecast.airTemperature,
//                 condition: forecast.conditionCode,
//                 time: new Date(forecast.forecastTimeUtc).toLocaleString(),
//                 feelsLike: forecast.feelsLikeTemperature,
//                 windSpeed: forecast.windSpeed,
//                 windGust: forecast.windGust,
//                 humidity: forecast.relativeHumidity,
//                 pressure: forecast.seaLevelPressure,
//                 precipitation: forecast.totalPrecipitation,
//                 cloudCover: forecast.cloudCover
//             };
//         } else {
//             throw new Error("No forecast data available for the selected date.");
//         }
//     } catch (error) {
//         console.error("Error fetching weather data: ", error);
//         throw new Error("Failed to fetch weather data.");
//     }
// }
//
// // API route to get weather data for a city and date
// app.get('/weather', async (req, res) => {
//     const { city, date } = req.query;
//
//     if (!city || !date) {
//         return res.status(400).send('City and date are required.');
//     }
//
//     try {
//         const weather = await getWeatherData(city, date);
//         res.json(weather);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });
//
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
