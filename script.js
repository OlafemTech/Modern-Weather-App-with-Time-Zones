const input = document.getElementById("search-input");
const description = document.getElementById("description-text");
const img = document.getElementById("description-img");
const locBtn = document.getElementById("loc-btn");
const section = document.querySelector("section");
const form = document.querySelector("form");
const timezoneBar = document.querySelector(".timezone-bar");
const timezoneName = document.getElementById("timezone-name");
const localTime = document.getElementById("local-time");

function getData(e) {
  e.preventDefault();

  if (!input.value) {
    alert("Please Enter a city name");
    return;
  } else {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=ca695dcbc66c5fa3d0cb955033fd918f`
    )
      .then((res) => res.json())
      .then((data) => {
        displayWeather(data);
        document.getElementById("city").style.display = "block";
        // Fetch timezone data for the location
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        fetchTimezoneData(lat, lon);
      });
  }
}

function getLocationData() {
  if (!navigator.geolocation) {
    alert("geolocation is not supported!");
    return;
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=ca695dcbc66c5fa3d0cb955033fd918f`
      )
        .then((res) => res.json())
        .then((data) => {
          displayWeather(data);
          document.querySelector("header h5").style.display = "none";
          document.getElementById("city").textContent = "current location";
          fetchTimezoneData(position.coords.latitude, position.coords.longitude);
        });
    });
  }
}

function fetchTimezoneData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ca695dcbc66c5fa3d0cb955033fd918f`)
    .then(res => res.json())
    .then(data => {
      const timezoneOffset = data.timezone; // Timezone offset in seconds
      displayTimezone(data.name, timezoneOffset);
    });
}

function displayTimezone(cityName, timezoneOffset) {
  // Convert timezone offset to hours and minutes
  const hours = Math.floor(Math.abs(timezoneOffset) / 3600);
  const minutes = Math.floor((Math.abs(timezoneOffset) % 3600) / 60);
  const sign = timezoneOffset >= 0 ? '+' : '-';
  
  // Format the timezone string
  const timezoneStr = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // Calculate local time in the timezone
  const localDate = new Date();
  const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
  const cityTime = new Date(utc + (timezoneOffset * 1000));
  
  // Display the timezone information
  timezoneName.textContent = `${cityName} (${timezoneStr})`;
  localTime.textContent = cityTime.toLocaleTimeString();
  
  // Show the timezone bar
  timezoneBar.classList.add('show');
  
  // Update time every second
  setInterval(() => {
    const newCityTime = new Date(Date.now() + (timezoneOffset * 1000));
    localTime.textContent = newCityTime.toLocaleTimeString();
  }, 1000);
}

function displayWeather(data) {
  document.querySelector("header h5").style.display = "block";

  const temp = (data.main.temp - 273.15).toFixed(1);
  console.log(temp);

  document.getElementById("temperature-degree").textContent = temp + "°";
  document.getElementById("city").textContent = input.value;

  document.getElementById("humidity-degree").textContent =
    data.main.humidity + " %";
  document.getElementById("feelslike-degree").textContent =
    (data.main.feels_like - 273.15).toFixed(1) + " °";

  description.textContent = data.weather[0].description;

  img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  section.style.display = "block";
  section.classList.add("test");
  document.getElementById("city").style.display = "block";
  locBtn.style.display = "none";

  // console.log(document.getElementById("city"));
}

form.addEventListener("submit", getData);

addEventListener("load", () => {
  const date = document.getElementById("date");

  const d = new Date();
  let currentDate = d.toString().slice(4, 15);

  date.innerHTML = currentDate;
});
