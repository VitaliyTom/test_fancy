import getWeather from '../weather_today/weatherToDay.js';
import RegionObj from '../geolocation/regionObj.js';
import getThreeWeather from '../three_day_weather/threeDayWeather.js';
import addElementWeather from '../weather_today/addElementWeather.js';
import addElementThreeWeather from '../three_day_weather/addElementThreeWeather.js';
import { geolocation } from '../geolocation/geolacation.js';
import { map } from '../geolocation/map.js';
import { translateCommonWords } from '../general/translateCommonWords.js';
import { getLanguage } from '../general/lng.js';

// const client_id = 'YcOZjTnZyaoo2rVD0K3ZYSlVYGwpyJxwhqZMzc-R5to';
const client_id = 'e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
const controlBlock = document.querySelector('.control_block');
const backGroundBar = document.querySelector('.wrapper_progress_bar');
const spinner = document.querySelector('.spinner');
const degreeCelsiusBtn = document.querySelector('.degree_сelsius_btn');
const degreeFahrenheitBtn = document.querySelector('.degree_fahrenheit_btn');
const languageLiAll = document.querySelectorAll('.language li');
const searchInput = document.querySelector('.search_input');
const wrapperLanguage = document.querySelector('.wrapper_language');

// -------------------------  theme  -------------------------
const themeDay = document.querySelector('.theme_day_btn');
const themeNight = document.querySelector('.theme_night_btn');
const weatherToday = document.querySelector('.weather_today');
const weatherThreeDay = document.querySelector('.weather_three_day');
const wrapperMap = document.querySelector('.wrapper_map');
const body = document.querySelector('body');
const mapElement = document.getElementById('map');
const wrapperProgressBar = document.querySelector('.wrapper_progress_bar');
const containerButton = document.querySelector('.container_button');
const burgerSwitch = document.querySelector('.burger_switch');
const containerSearch = document.querySelector('.container_search');

backGroundBar.classList.add('active');
searchInput.classList.remove('active');
searchInput.setAttribute('placeholder', translateCommonWords.search[getLanguage()]);

if (!localStorage.hasOwnProperty('theme')) {
	localStorage.setItem('theme', 'dark');
}

if (localStorage.getItem('theme') === 'lite') {
	liteTheme();
} else {
	darkTheme();
}

if (!localStorage.hasOwnProperty('lang')) {
	localStorage.setItem('lang', 'Eng');
} else {
	document.querySelector('.lang_0').firstElementChild.innerText = localStorage.getItem('lang');
}

if (!localStorage.hasOwnProperty('degree')) {
	localStorage.setItem('degree', 'C');
	degreeCelsiusBtn.classList.add('active');
} else {
	localStorage.getItem('degree') === 'C'
		? degreeCelsiusBtn.classList.add('active')
		: degreeFahrenheitBtn.classList.add('active');
}


//// codeCountry();

if (localStorage.hasOwnProperty('lat')) {
	localStorage.removeItem('lat');
	localStorage.removeItem('lon');
}


// выше сначало идет логига  для css и языка (всетлая/темная тема англ язык)
// первая загрузка приложения(!) здесь стоит условие т.к. я не впили что происходит потом. 

// при загрузке сначало идет определение геолокации( если она выключена то ставятся координаты минска)
// после этого пошло по этапу определение название нас. пункта и т.д. - приложение загружено

//дальше вниз пойдут только два лисенера
if (!localStorage.hasOwnProperty('searchCityFlag')) {
	geolocation();
} else {
	getCoordinates(localStorage.getItem('regionCity'));
}





export async function allRequest(coordinates) {
	// const coordinates = {
	// 	lat: localStorage.getItem('lat'),
	// 	lon: localStorage.getItem('lon')
	// };
	const backGroundBar = document.querySelector('.wrapper_progress_bar');
	backGroundBar.classList.add('active');
	Promise.all([
		replaceImg(),
		nameRegion(coordinates),
		getWeather(),
		getThreeWeather()
	]).then(([ img, region, weatherObj, weatherObjArray ]) => {
		const backGround = document.querySelector('body');
		const spinner = document.querySelector('.spinner');
		if (img) {
			backGround.style.background = `url(${img})`;
			backGround.style.backgroundSize = 'cover';
			backGround.style.backgroundRepeat = 'no-repeat';
			backGround.style.transition = '1s';
			backGround.style.transitionDelay = '1s';
			spinner.classList.remove('active');
		}

		setTimeout(addElement, 0, weatherObj, region, weatherObjArray);
	});
}

async function nameRegion(coordinates) {
	try {
		const response = await fetch(
			`https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat}+${coordinates.lon}&key=c6b6da0f80f24b299e08ee1075f81aa5`
		); //a44c8192d43e4d77a0f8297834df2a12
		const parsed = await response.json();
		const parsedResult = parsed.results[0].components;
		const nameCity = parsed.results[0].formatted;

		// const nameCity = localStorage.hasOwnProperty('regionCity') ? localStorage.getItem('regionCity') : parsed.results[0].formatted;

		const region = new RegionObj(
			parsedResult['ISO_3166-1_alpha-3'],
			parsedResult.city === undefined
				? // nameCity === undefined
					parsedResult.town === undefined ? nameCity.slice(0, nameCity.indexOf(',')) : parsedResult.town
				: parsedResult.city,
			parsedResult.city_district,
			parsedResult.continent,
			parsedResult.country,
			parsedResult['ISO_3166-1_alpha-2'],
			parsedResult.postcode,
			parsedResult.residential,
			parsedResult.suburb,
			parsed.results[0].annotations.timezone.offset_sec
		);

		localStorage.setItem('regionCity', region.city);
		localStorage.setItem('country', region.country);
		localStorage.setItem('residential', region.residential);
		localStorage.setItem('DMS_lat', parsed.results[0].annotations.DMS.lat);
		localStorage.setItem('DMS_lon', parsed.results[0].annotations.DMS.lng);
		localStorage.setItem('timezone', region.timezone);
		return region;
	} catch (error) {
		console.log('Превышен лимит запросов на поиск города, обновите страницу позже');
	}
}

function addElement(weatherObj, region, weatherObjArray) {
	addElementWeather(weatherObj, region);
	addElementThreeWeather(weatherObjArray);
	const coordinates = {
		lat: localStorage.getItem('lat'),
		lon: localStorage.getItem('lon')
	};
	map(coordinates);
}

async function codeCountry() {
	const response = await fetch('https://ipinfo.io/json?token=a045dc5cfaf1fe');
	const parsed = await response.json();
	localStorage.setItem('country_code', parsed.country);
}

function getMonth(numberMonth) {
	const timeOfYear = '';
	if (numberMonth === 0 || numberMonth === 1 || numberMonth === 11) {
		timeOfYear = 'winter';
	} else if (numberMonth === 2 || numberMonth === 3 || numberMonth === 4) {
		timeOfYear = 'spring';
	} else if (numberMonth === 5 || numberMonth === 6 || numberMonth === 7) {
		timeOfYear = 'summer';
	} else if (numberMonth === 8 || numberMonth === 9 || numberMonth === 10) {
		timeOfYear = 'autumn';
	}
	return timeOfYear;
}

function url() {
	const numberMonth = new Date().toLocaleString('en', {
		month: 'numeric'
	});

	const url = `https://api.unsplash.com/photos/random?orientation=squarish&per_page=1&query=${getMonth(
		numberMonth
	)}&client_id=${client_id}`;
	return url;
}

function replaceImg() {
	const img = fetch(url())
		.then((response) => {
			if (response.status >= 400) {
				console.log(response.status);
				// throw new Error(`Response api return: ${response.status}`);
				return Promise.reject(new Error(response.statusText));
				// throw new Error(response.statusText, response.status);
			}
			return Promise.resolve(response.json());
		})
		.then((parsed) => {
			const urlImg = parsed.urls.regular;
			return urlImg;
		})
		.catch((error) => {
			console.log(`Превышен лимит запросов на фоновую картинку, обновите страницу позже : ${error} `);
			const backGround = document.querySelector('body');
			backGround.style.background = `url('./src/img/city_street.jpg')`;
			backGround.style.backgroundSize = 'cover';
			backGround.style.backgroundRepeat = 'no-repeat';
			backGround.style.transition = '1s';
			backGround.style.transitionDelay = '1s';
			spinner.classList.remove('active');
		});
	return img;
}

function deleteActiveLi() {
	languageLiAll.forEach((el) => {
		el.classList.remove('active');
	});
}









async function getCoordinates(city) {
	// и вот тут пока идет этот запрос 246стр - здесь резко все обрывается(без каких-либо ошибок)
	// и весь файл control.js начинает перечитывать заново т.е. он снова попадает на геолокацию и выводит Минск.
	// такое ощущение что поток перепрыгивает, как-будто что-то заставляет обновить страницу.
	// и это только происходит при первом поиске. если я второй и т.д. n - раз буду искать город все гуд работает.
	const response = await fetch(
		`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=c6b6da0f80f24b299e08ee1075f81aa5`
	);

	const parsed = await response.json();
//  //const arrCountry = [];
//	// parsed.results.forEach((el, index) => {
//	// 	if (el.components['ISO_3166-1_alpha-2'] === `${localStorage.getItem('country_code')}`) {
//	// 		arrCountry.push(index);
//	// 	}
//	// });

	try {
		const coordinates = {
//			// lat: parsed.results[arrCountry.length > 0 ? arrCountry[0] : 0].geometry.lat,
//			// lon: parsed.results[arrCountry.length > 0 ? arrCountry[0] : 0].geometry.lng
			lat: parsed.results[0].geometry.lat,
			lon: parsed.results[0].geometry.lng

		};
		localStorage.setItem('lat', coordinates.lat);
		localStorage.setItem('lon', coordinates.lon);
		localStorage.setItem('regionCity', city);
		allRequest(coordinates);
	} catch (error) {
		searchInput.setAttribute('placeholder', translateCommonWords.error[getLanguage()]);
		searchInput.classList.add('active');
		console.log('Такого города не существует, попробуйте еще раз, и без ошибок :)');
	}
}












// -------------------------  Listener language  -------------------------
body.addEventListener('click', (event) => {
	if (!event.target.closest('.wrapper_language')) {
		deleteActiveLi();
	}
});

//		button select lang
wrapperLanguage.addEventListener('click', (event) => {
	if (event.target.closest('.language')) {
		languageLiAll.forEach((el) => {
			el.classList.toggle('active');
		});
	}

	if (
		event.target.closest('.lang_1') ||
		event.target.closest('.lang_2') ||
		event.target.closest('.lang_3') ||
		event.target.closest('.lang_4')
	) {
		document.querySelector('.lang_0').firstElementChild.innerText = event.target.innerText;
		localStorage.setItem('lang', event.target.innerText);
		const coordinates = {
			lat: localStorage.getItem('lat'),
			lon: localStorage.getItem('lon')
		};

		Promise.all([
			nameRegion(coordinates),
			getWeather(),
			getThreeWeather()
		]).then(([ region, weatherObj, weatherObjArray ]) => {
			addElementWeather(weatherObj, region);
			addElementThreeWeather(weatherObjArray);
		});

		deleteActiveLi();
		delete_burger_open();
	} else if (
		!event.target.closest('.lang_1') &&
		!event.target.closest('.lang_2') &&
		!event.target.closest('.lang_3') &&
		!event.target.closest('.lang_4') &&
		!event.target.closest('.lang_0')
	) {
		deleteActiveLi();
		delete_burger_open();
	}
});

// -------------------------  Listener control block -------------------------

controlBlock.addEventListener('click', async (event) => {
	//		replace background
	if (event.target.closest('.wrapper_refresh_img')) {
		const searchInput = document.querySelector('.search_input');

		delete_burger_open();
		spinner.classList.add('active');
		searchInput.classList.remove('active');

		// search_input
		const coordinates = {
			lat: localStorage.getItem('lat'),
			lon: localStorage.getItem('lon')
		};

		allRequest(coordinates);
	}
	// GPS
	if (event.target.closest('.wrapper_geolacation_img')) {
		const searchInput = document.querySelector('.search_input');

		// delete_burger_open();
		// spinner.classList.add('active');
		searchInput.classList.remove('active');

		// search_input
		// const coordinates = {
		// 	lat: localStorage.getItem('lat'),
		// 	lon: localStorage.getItem('lon')
		// };

		// allRequest(coordinates);
		geolocation();
	}




	//		search button

	
	//когда сайт загрузился, при первом вводе поиска города (только при первом).  т.е. у меня загрузился Минск, я набираю искать город Майми...
	// срабатывает этот лисенер по нажатию кнопки поиск и попадаю в этот if/
	if (event.target.closest('.search_btn')) {
	//	// const searchInput = document.querySelector('.search_input');
		const city = searchInput.value.toString();

		localStorage.setItem('searchCityFlag', '');
	//	// localStorage.setItem('regionCity', city);
	//	// localStorage.setItem('searchCity', city);

		document.querySelector('.form_search').reset();
		searchInput.classList.remove('active');

		getCoordinates(city);   //  вызываю функ которая по названию населен пункта вернет мне его координаты
	}








	//		change degree
	if (event.target.closest('.wrapper_change_degree')) {
		degreeFahrenheitBtn.classList.remove('active');
		degreeCelsiusBtn.classList.remove('active');
		localStorage.setItem('degree', event.target.value);
		event.target.classList.add('active');
		const region = {
			country: localStorage.getItem('country'),
			city: localStorage.getItem('regionCity'),
			residential: localStorage.getItem('residential')
		};
		Promise.all([ getWeather(), getThreeWeather() ]).then(([ weatherObj, weatherObjArray ]) => {
			addElementWeather(weatherObj, region);
			addElementThreeWeather(weatherObjArray);
		});
	}

	if (event.target.closest('.theme_day_btn')) {
		liteTheme();
	} else if (event.target.closest('.theme_night_btn')) {
		darkTheme();
	}

	if (event.target.closest('.burger_switch') || event.target === controlBlock) {
		containerButton.classList.toggle('open');
		controlBlock.classList.toggle('open');
		burgerSwitch.classList.toggle('open');
		containerSearch.classList.toggle('open');
		body.classList.toggle('open');
	}
});

//		delete burger open

export function delete_burger_open() {
	containerButton.classList.remove('open');
	controlBlock.classList.remove('open');
	burgerSwitch.classList.remove('open');
	containerSearch.classList.remove('open');
	body.classList.remove('open');
}

function liteTheme() {
	localStorage.setItem('theme', 'lite');
	themeDay.classList.add('active');
	themeNight.classList.remove('active');
	controlBlock.classList.add('active');
	weatherToday.classList.add('active');
	weatherThreeDay.classList.add('active');
	wrapperMap.classList.add('active');
	body.classList.add('active');
	mapElement.classList.add('active');
	wrapperProgressBar.classList.add('white');
}

function darkTheme() {
	localStorage.setItem('theme', 'dark');
	themeNight.classList.add('active');
	themeDay.classList.remove('active');
	controlBlock.classList.remove('active');
	weatherToday.classList.remove('active');
	weatherThreeDay.classList.remove('active');
	wrapperMap.classList.remove('active');
	body.classList.remove('active');
	mapElement.classList.remove('active');
	wrapperProgressBar.classList.remove('white');
}

export default replaceImg;
