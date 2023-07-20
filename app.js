const apiKey = '8a31c8c82a83b46429b8db56260e667e';
let searchHistory = JSON.parse(localStorage.getItem('search')) || [];

function getWeather(cityName) {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data);
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(urlForecast)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        });
    });

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('search', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

function displayCurrentWeather(data) {
    let currentWeatherContent = document.querySelector("#current-weather-content");
    currentWeatherContent.innerHTML = "";
  
    let cityName = document.createElement("h3");
    cityName.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";

    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    );

    let temp = document.createElement("p");
    temp.textContent = "Temperature: " + data.main.temp;

    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + data.main.humidity;

    let windSpeed = document.createElement("p");
    windSpeed.textContent = "Wind Speed: " + data.wind.speed;

    currentWeatherContent.append(cityName, weatherIcon, temp, humidity, windSpeed);
}

function displayForecast(data) {
    let forecastWeatherContent = document.querySelector("#forecast-weather-content");
    forecastWeatherContent.innerHTML = "";

    let forecastTitle = document.createElement("h3");
    forecastTitle.textContent = "5-Day Forecast:";
    forecastWeatherContent.appendChild(forecastTitle);

    for (let i = 0; i < data.list.length; i+=8) {
        let forecastDay = document.createElement("div");

        let date = document.createElement("h4");
        date.textContent = new Date(data.list[i].dt_txt).toLocaleDateString();

        let icon = document.createElement("img");
        icon.setAttribute(
            "src",
            `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
        );

        let temp = document.createElement("p");
        temp.textContent = "Temp: " + data.list[i].main.temp;

        let humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + data.list[i].main.humidity;

        let windSpeed = document.createElement("p");
        windSpeed.textContent = "Wind Speed: " + data.list[i].wind.speed;

        forecastDay.append(date, icon, temp, humidity, windSpeed);
        forecastWeatherContent.appendChild(forecastDay);
    }
}


function renderSearchHistory() {
    let searchHistoryEl = document.querySelector("#search-history");
    searchHistoryEl.innerHTML = "";

    for(let i=0; i < searchHistory.length; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = searchHistory[i];
        searchHistoryEl.appendChild(listItem);
    }
}

document.querySelector('#search-button').addEventListener('click', function () {
    let cityName = document.querySelector('#search-input').value;
    getWeather(cityName);
});

document.querySelector('#search-history').addEventListener('click', function (event) {
    let cityName = event.target.textContent;
    getWeather(cityName);
});

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}
