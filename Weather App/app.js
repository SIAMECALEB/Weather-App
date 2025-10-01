const API_KEY = "J5JZWGAETSF6CWNCPX24BJVMY";

const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const loading = document.getElementById('loading');
const weatherCard = document.getElementById('weatherCard');
const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const toggleBtn = document.getElementById('toggle-temp');

let currentTempC = null;
let isCelsius = true;

searchBtn.addEventListener('click', () => {
  const location = locationInput.value.trim();
  if (!location) return;
  fetchWeather(location);
});

toggleBtn.addEventListener('click', () => {
  if (currentTempC === null) return;
  isCelsius = !isCelsius;
  updateTemperature();
});

async function fetchWeather(location) {
  loading.classList.remove('hidden');
  weatherCard.classList.add('hidden');

  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&contentType=json&key=${API_KEY}`);
    
    if (!response.ok) throw new Error('Failed to fetch weather');

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert('Could not fetch weather. Try another location.');
    console.error(error);
  } finally {
    loading.classList.add('hidden');
  }
}

function displayWeather(data) {
  currentTempC = data.currentConditions.temp;
  isCelsius = true;

  locationName.textContent = data.resolvedAddress;
  condition.textContent = data.currentConditions.conditions;
  updateTemperature();
  changeBackground(data.currentConditions.conditions);

  weatherCard.classList.remove('hidden');
}

function updateTemperature() {
  if (isCelsius) {
    temperature.textContent = `${currentTempC.toFixed(1)} °C`;
  } else {
    const tempF = (currentTempC * 9/5) + 32;
    temperature.textContent = `${tempF.toFixed(1)} °F`;
  }
}

function changeBackground(condition) {
  let bg = 'linear-gradient(135deg, #74ebd5 0%, #9face6 100%)';

  if (condition.includes('Rain')) bg = 'linear-gradient(135deg, #a0c4ff 0%, #6c5ce7 100%)';
  else if (condition.includes('Cloud')) bg = 'linear-gradient(135deg, #d3d3d3 0%, #a9a9a9 100%)';
  else if (condition.includes('Sunny') || condition.includes('Clear')) bg = 'linear-gradient(135deg, #ffe066 0%, #ff8c42 100%)';

  document.body.style.background = bg;
}
