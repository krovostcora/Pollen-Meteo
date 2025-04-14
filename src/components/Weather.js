// import React, { useState } from 'react';
// import axios from 'axios';
//
// function Weather() {
//     const [city, setCity] = useState('');
//     const [date, setDate] = useState('');
//     const [weather, setWeather] = useState(null);
//     const [error, setError] = useState('');
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setWeather(null);
//
//         try {
//             const response = await axios.post('http://localhost:3001/weather', {
//                 city,
//                 date,
//             });
//             setWeather(response.data);
//         } catch (err) {
//             setError('Error fetching weather data');
//         }
//     };
//
//     return (
//         <div>
//             <h1>Weather History</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>City:</label>
//                     <input
//                         type="text"
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label>Date:</label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit">Get Weather</button>
//             </form>
//
//             {error && <div>{error}</div>}
//
//             {weather && (
//                 <div>
//                     <h2>Weather Data</h2>
//                     <p>Date: {weather.date}</p>
//                     <p>Temperature: {weather.temperature}°C</p>
//                     <p>Humidity: {weather.humidity}%</p>
//                     <p>Precipitation: {weather.precipitation} mm</p>
//                     <p>Wind Direction: {weather.wind_direction}</p>
//                     <p>Wind Speed: {weather.wind_speed} km/h</p>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default Weather;
