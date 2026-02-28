// Your OpenWeatherMap API Key
const API_KEY = '46afaa58f682138cbed61c2ff347f197';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get references
const weatherDisplay = document.getElementById('weather-display');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// ==============================
// 🌤 Async Weather Function
// ==============================
async function getWeather(city) {

    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    // Disable button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        const response = await axios.get(url);
        console.log("Weather Data:", response.data);

        displayWeather(response.data);

    } catch (error) {
        console.error("Error:", error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check the spelling and try again.");
        } else {
            showError("Something went wrong. Please try again later.");
        }

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// ==============================
// 🌡 Display Weather
// ==============================
function displayWeather(data) {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

    // Focus back to input for better UX
    cityInput.focus();
}

// ==============================
// ❌ Error Message
// ==============================
function showError(message) {

    const errorHTML = `
        <div class="error-message">
            <h3>⚠️ Oops!</h3>
            <p>${message}</p>
        </div>
    `;

    weatherDisplay.innerHTML = errorHTML;
}

// ==============================
// ⏳ Loading State
// ==============================
function showLoading() {

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}

// ==============================
// 🔍 Search Button Event
// ==============================
searchBtn.addEventListener('click', function () {

    const city = cityInput.value.trim();

    // Validation
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

// ==============================
// ⌨ Enter Key Support
// ==============================
cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// ==============================
// 🏠 Initial Welcome Message
// ==============================
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h3>🌍 Welcome to SkyFetch</h3>
        <p>Enter a city name to get started!</p>
    </div>
`;
