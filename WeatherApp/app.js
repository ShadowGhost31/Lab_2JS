const express = require('express');
const app = express();
const hbs = require('hbs');
const fs = require('fs');
const fetch = require('node-fetch');

const PORT = 3000;

app.use(express.static(__dirname + '/public')); // Serve static files

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

const citiesData = JSON.parse(fs.readFileSync('cities.json', 'utf8'));

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Головна', cities: citiesData });
});


app.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = '8324916fe567baa3e81b58cd678bf2fb';
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const weather = {
            description: data.weather[0].description,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        };
        res.render('weather', { pageTitle: 'Погода', city, weather });
    } catch (error) {
        console.error('Помилка при отриманні погодних даних:', error);
        res.status(500).send('Помилка при отриманні погодних даних');
    }
});

app.get('/weather', (req, res) => {
    res.render('weatherSelect', { pageTitle: 'Вибір міста', cities: citiesData });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
