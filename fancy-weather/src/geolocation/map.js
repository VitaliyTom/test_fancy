import RegionObj from './regionObj.js';
import getWeather from '../weather_today/weatherToDay.js';
import replaceImg from '../control_block/control.js';
import getThreeWeather from '../three_day_weather/threeDayWeather.js';
import addElementWeather from '../weather_today/addElementWeather.js';
import addElementThreeWeather from '../three_day_weather/addElementThreeWeather.js';

// export async function geolocation(coordinates) {

// 	document.querySelector('.spinner').classList.add('active');

	// if (coordinates !== undefined) {
	// 	allRequest(coordinates);
	// } else {

		// geolocation
		// var options = {
		// 	enableHighAccuracy: true,
		// 	timeout: 5000,
		// 	maximumAge: 0
		// };

		// function success(pos) {
		// 	var crd = pos.coords;
			// const coordinates = {
			// 	lat: crd.latitude,
			// 	lon: crd.longitude
			// };

			// localStorage.setItem('lat', crd.latitude);
			// localStorage.setItem('lon', crd.longitude);

			// allRequest(coordinates);
		// }

		// function error(err) {
		// 	console.warn(`Доступ к автоопределению местоположения заблокирован! ERROR(${err.code}): ${err.message}`);
		// 	// const coordinates = {
		// 	// 	lat: 53.902334,
		// 	// 	lon: 27.5618791
		// 	// };

		// 	localStorage.setItem('lat', 53.902334),
		// 	localStorage.setItem('lon', 27.5618791)
		// 	// allRequest(coordinates);
		// }
		// navigator.geolocation.getCurrentPosition(success, error, options);
	// }
// }

export function map(coordinates) {
	mapboxgl.accessToken = 'pk.eyJ1IjoibGluLTIwMjAiLCJhIjoiY2thczhsejFvMHFoYzJ6cHIyajNvbjRpOCJ9.mBTGilwu0MZbcP1hyQ1dJA';
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
		center: [ localStorage.getItem('lon'), localStorage.getItem('lat') ], // starting position [lng, lat]
		zoom: 13 // starting zoom
	});

	var marker = new mapboxgl.Marker({
		draggable: false
	})
		.setLngLat([ localStorage.getItem('lon'), localStorage.getItem('lat') ])
		.addTo(map);
}

		// map();

// export async function nameRegion(coordinates) {
// 	try {
// 		const response = await fetch(
// 			`https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat}+${coordinates.lon}&key=c6b6da0f80f24b299e08ee1075f81aa5`
// 		); //a44c8192d43e4d77a0f8297834df2a12
// 		const parsed = await response.json();
// 		const parsedResult = parsed.results[0].components;
// 		const nameCity = parsed.results[0].formatted;

// 		const region = new RegionObj(
// 			parsedResult['ISO_3166-1_alpha-3'],
// 			parsedResult.city === undefined
// 				? parsedResult.town === undefined ? nameCity.slice(0, nameCity.indexOf(',')) : parsedResult.town
// 				: parsedResult.city,
// 			parsedResult.city_district,
// 			parsedResult.continent,
// 			parsedResult.country,
// 			parsedResult['ISO_3166-1_alpha-2'],
// 			parsedResult.postcode,
// 			parsedResult.residential,
// 			parsedResult.suburb,
// 			parsed.results[0].annotations.timezone.offset_sec
// 		);

// 		localStorage.setItem('regionCity', region.city);
// 		localStorage.setItem('country', region.country);
// 		localStorage.setItem('residential', region.residential);
// 		localStorage.setItem('DMS_lat', parsed.results[0].annotations.DMS.lat);
// 		localStorage.setItem('DMS_lon', parsed.results[0].annotations.DMS.lng);
// 		localStorage.setItem('timezone', region.timezone);
// 		return region;
// 	} catch (error) {
// 		console.log('Превышен лимит запросов на поиск города, обновите страницу позже');
// 	}
// }



// function addElement(weatherObj, region, weatherObjArray) {
// 	addElementWeather(weatherObj, region);
// 	addElementThreeWeather(weatherObjArray);
// 	const coordinates = {
// 		lat: localStorage.getItem('lat'),
// 		lon: localStorage.getItem('lon')
// 	};
// 	map(coordinates);
// }
