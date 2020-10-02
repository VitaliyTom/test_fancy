import { getLanguage } from '../general/lng.js';
import { translateCommonWords } from '../general/translateCommonWords.js';
import { weatherConditions } from '../general/weatherConditions.js';
import { dayNameAbbreviat } from '../general/day.js';
import { monthName } from '../general/month.js';
import { wetherIconSvg } from '../svg/svg.js';

function localDate() {
	const locDate = document.querySelector('.date');
	setInterval(() => {
		const options = {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};

		let nowDate = new Date().getTime();
		let date = new Date(1970, 0, 1, 0, 0, localStorage.getItem('timezone'), nowDate);

		const day = date.getDay();
		const month = date.getMonth();
		const monthDay = date.getDate();
		const setHtmlDate = `${getNameDay(day)} ${monthDay} ${getNameMonth(month)} ${localStorage.getItem('lang') ===
			'Eng'
			? date.toLocaleString('en-US', options)
			: date.toLocaleString('ru', options)}`;

		locDate.innerText = `${setHtmlDate}`;
	}, 1000);
}

function addElementWeather(weatherObj, regionCity) {
	const searchInput = document.querySelector('.search_input');
	const searchBtn = document.querySelector('.search_btn');
	const cityName = document.querySelector('.city_name');
	const tempValue = document.querySelector('.temp_value');
	const temperatureImg = document.querySelector('.temperature_img');
	const weatherCondition = document.querySelector('.weather_conditions');
	const weatherFeelslike = document.querySelector('.weather_feelslike');
	const weatherWind = document.querySelector('.weather_wind');
	const weather_humidity = document.querySelector('.weather_humidity');
	const coordinatesLat = document.querySelector('.lat');
	const coordinatesLon = document.querySelector('.lon');

	localDate();

	searchInput.setAttribute('placeholder', translateCommonWords.search[getLanguage()]);
	searchBtn.innerText = `${translateCommonWords.searchBtn[getLanguage()]}`;
	cityName.innerHTML = `${regionCity.country}, ${regionCity.city} 	
	${regionCity.residential === undefined || regionCity.residential === 'undefined' ? '' : regionCity.residential}`;

	tempValue.innerHTML = `${weatherObj.temp.value === null
		? Math.round(localStorage.getItem('averageTemp'))
		: Math.round(weatherObj.temp.value)}°`;

	if (wetherIconSvg.has(weatherObj.weather_code)) {
		temperatureImg.innerHTML = wetherIconSvg.get(weatherObj.weather_code);
	} else {
		temperatureImg.innerHTML = localStorage.getItem('weatherCode');
	}
	// temperatureImg.innerHTML = wetherIconSvg.get('snow');
	weatherCondition.innerText = `${weatherConditions[
		weatherObj.weather_code === null ? localStorage.getItem('weatherCode') : weatherObj.weather_code
	][getLanguage()]}`;

	weatherFeelslike.innerText = `${translateCommonWords.feelslike[getLanguage()]}: ${Math.round(
		weatherObj.feelslike.value === null ? localStorage.getItem('averageFeelsLike') : weatherObj.feelslike.value
	)}°`;
	weatherWind.innerText = `${translateCommonWords.wind[getLanguage()]}: ${Math.round(
		weatherObj.wind.value === null ? localStorage.getItem('averageWind') : weatherObj.wind.value
	)}  ${weatherObj.wind.units === 'mph' ? translateCommonWords.windUnits[1][getLanguage()] :
		translateCommonWords.windUnits[0][getLanguage()]}`;
	weather_humidity.innerText = `${translateCommonWords.humidity[getLanguage()]}: ${Math.round(
		weatherObj.humidity.value === null ? localStorage.getItem('averageHumidity') : weatherObj.humidity.value
	)}%`;

	coordinatesLat.innerText = `${translateCommonWords.latitude[getLanguage()]}: ${localStorage.getItem('DMS_lat')}`;
	coordinatesLon.innerText = `${translateCommonWords.longitude[getLanguage()]}: ${localStorage.getItem('DMS_lon')}`;

	const backGroundBar = document.querySelector('.wrapper_progress_bar');
	backGroundBar.classList.remove('active');
}

function getNameDay(params) {
	return dayNameAbbreviat[params][getLanguage()];
}

function getNameMonth(params) {
	return monthName[params][getLanguage()];
}

export default addElementWeather;
