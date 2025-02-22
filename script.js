const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDataTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = 'a85deecdc3fe1122c97d13660154abd0';

// Fetch Weather Data
const fetchWeatherData = async (city) => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        updateWeatherInfo(currentData, forecastData);
        showWeatherInfo();
    } catch (error) {
        showError();
    }
};

// Update Weather Info in the DOM
const updateWeatherInfo = (currentData, forecastData) => {
    const { name, sys, main, weather, wind } = currentData;
    const { country } = sys;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];
    const { speed: windSpeed } = wind;

    // Update current weather
    countryTxt.textContent = `${name}, ${country}`;
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${windSpeed} m/s`;
    weatherSummaryImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    currentDataTxt.textContent = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    // Update forecast
    const forecastItems = forecastData.list.filter((_, index) => index % 8 === 7); // Get one forecast per day starting from the next day
    forecastItemsContainer.innerHTML = '';

    forecastItems.forEach((item) => {
        const forecastDate = new Date(item.dt_txt).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        });
        const forecastTemp = `${Math.round(item.main.temp)} °C`;
        const forecastIcon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${forecastDate}</h5>
            <img src="${forecastIcon}" class="forecast-item-img" alt="Weather Icon">
            <h5 class="forecast-item-temp">${forecastTemp}</h5>
        `;

        forecastItemsContainer.appendChild(forecastItem);
    });
};

// Show Weather Info Section
const showWeatherInfo = () => {
    weatherInfoSection.style.display = 'flex';
    notFoundSection.style.display = 'none';
    searchCitySection.style.display = 'none';
};

// Show Error Section
const showError = () => {
    weatherInfoSection.style.display = 'none';
    notFoundSection.style.display = 'flex';
    searchCitySection.style.display = 'none';
};

// Search Button Event Listener
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

// Enter Key Event Listener
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});