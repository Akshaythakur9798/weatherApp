document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "b70ed7910f1bbdfef1f54cafceae5cab";
  const weatherDataEl = document.getElementById("weather-data");
  const cityInputEl = document.getElementById("city-input");
  const formEl = document.querySelector("form");

  function displayErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;

    weatherDataEl.innerHTML = ""; // Clearing might not be necessary

    // Append the error message
    weatherDataEl.appendChild(errorMessage);
  }

  let debounceTimeout;

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value.trim();
    if (cityValue === "") {
      displayErrorMessage("Please enter a city name.");
      return;
    }
    getWeatherData(cityValue);
  });

  cityInputEl.addEventListener("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(function () {
      const cityValue = cityInputEl.value.trim();
      if (cityValue === "") {
        displayErrorMessage("Please enter a city name.");
        return;
      }
      getWeatherData(cityValue);
    }, 500);
  });

async function getWeatherData(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found. Please try again.");
    }

    const data = await response.json();

    // Extracting data
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const visibility = data.visibility;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // Get the container element
    const weatherContainer = document.getElementById("weather-data");

    if (weatherContainer) {
      // Update or create the elements with new data
      updateOrCreateElement(weatherContainer, ".icon", "div");
      updateOrCreateElement(weatherContainer, ".city-name", "div");
      updateOrCreateElement(weatherContainer, ".temperature", "div");
      updateOrCreateElement(weatherContainer, ".description", "div");
      updateOrCreateElement(weatherContainer, ".humidity", "div");
      updateOrCreateElement(weatherContainer, ".visibility", "div");
      updateOrCreateElement(weatherContainer, ".sunrise", "div");
      updateOrCreateElement(weatherContainer, ".sunset", "div");

      weatherContainer.querySelector(
        ".icon"
      ).innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
      weatherContainer.querySelector(
        ".city-name"
      ).textContent = `City: ${cityName}`;
      weatherContainer.querySelector(
        ".temperature"
      ).textContent = `Temperature: ${temperature}°C`;
      weatherContainer.querySelector(
        ".description"
      ).textContent = `Weather Status: ${description}`;
      weatherContainer.querySelector(
        ".humidity"
      ).textContent = `Humidity: ${humidity}%`;
      weatherContainer.querySelector(
        ".visibility"
      ).textContent = `Visibility: ${visibility} meters`;
      weatherContainer.querySelector(
        ".sunrise"
      ).textContent = `Sunrise: ${sunrise}`;
      weatherContainer.querySelector(
        ".sunset"
      ).textContent = `Sunset: ${sunset}`;
    } else {
      throw new Error("Weather container not found.");
    }
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

function updateOrCreateElement(container, selector, elementType) {
  let element = container.querySelector(selector);
  if (!element) {
    element = document.createElement(elementType);
    element.className = selector.substring(1); // Remove the dot from the selector for class name
    container.appendChild(element);
  }
}


});
