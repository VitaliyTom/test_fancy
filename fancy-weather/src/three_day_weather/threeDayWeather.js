import Weather from '../weather_today/weatherObj.js';
const apikey = 'Kt54Fx3bkNTsFKsyh2GoZY8jwKfANf6e';

function url() {
	const lat = localStorage.hasOwnProperty('lat') ? localStorage.getItem('lat') : 53.902334;
	const lon = localStorage.hasOwnProperty('lon') ? localStorage.getItem('lon') : 27.5618791;

	return `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${lon}&unit_system=${localStorage.getItem(
		'degree'
	) === 'C'
		? 'si'
		: 'us'}&start_time=now&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=${apikey}`;
}

async function getThreeWeather() {
	try {
		const response = await fetch(url());
		const parsed = await response.json();
		const weatherObjArray = [];

		parsed.slice(1, 4).forEach((element) => {
			const weatherObj = new Weather(
				element.lat,
				element.lon,
				element.temp,
				element.feels_like,
				element.humidity,
				element.wind_speed,
				element.observation_time.value,
				element.weather_code.value
			);
			weatherObjArray.push(weatherObj);
		});
		localStorage.setItem('averageTemp', (parsed[0].temp[0].min.value + parsed[0].temp[1].max.value) / 2);
		localStorage.setItem(
			'averageFeelsLike',
			(parsed[0].feels_like[0].min.value + parsed[0].feels_like[1].max.value) / 2
		);
		localStorage.setItem(
			'averageHumidity',
			(parsed[0].humidity[0].min.value + parsed[0].humidity[1].max.value) / 2
		);
		localStorage.setItem(
			'averageWind',
			(parsed[0].wind_speed[0].min.value + parsed[0].wind_speed[1].max.value) / 2
		);
		localStorage.setItem('weatherCode', parsed[0].weather_code.value);
		return weatherObjArray;
	} catch (error) {
		console.log('Превышен лимит запросов на погоду, обновите страницу позже');
	}
}

export default getThreeWeather;
