import Weather from './weatherObj.js';

const apikey = 'vuRjVVld9hdH7Zu2pJbcd5H0A9RVpd7O';

function url() {
	const lat = localStorage.hasOwnProperty('lat') ? localStorage.getItem('lat') : 53.902334;
	const lon = localStorage.hasOwnProperty('lon') ? localStorage.getItem('lon') : 27.5618791;

	return `https://api.climacell.co/v3/weather/realtime/daily?lat=${lat}&lon=${lon}&unit_system=${localStorage.getItem(
		'degree'
	) === 'C'
		? 'si'
		: 'us'}&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=${apikey}`;
}

async function getWeather() {
	try {
		const response = await fetch(url());
		const parsed = await response.json();

		const weatherObj = new Weather(
			parsed.lat,
			parsed.lon,
			parsed.temp,
			parsed.feels_like,
			parsed.humidity,
			parsed.wind_speed,
			parsed.observation_time.value,
			parsed.weather_code.value
		);
		return weatherObj;
	} catch (error) {
		console.log('Превышен лимит запросов на погоду, обновите страницу позже');
	}
}

export default getWeather;
