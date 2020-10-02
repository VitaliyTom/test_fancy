import { allRequest } from '../control_block/control.js';
import { translateCommonWords } from '../general/translateCommonWords.js';
import { getLanguage } from '../general/lng.js';
import { delete_burger_open } from '../control_block/control.js';



var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

function success(pos) {
	var crd = pos.coords;
	const coordinates = {
		lat: crd.latitude,
		lon: crd.longitude
	};
	localStorage.setItem('lat', crd.latitude);
	localStorage.setItem('lon', crd.longitude);
	delete_burger_open();
	allRequest(coordinates);
}

function error(err) {
	const modal = document.querySelector('.modal');

	console.warn(
		`${translateCommonWords.gps[getLanguage()]} ERROR(${err.code}): ${err.message}`
	);

	document.querySelector('.modal_message').innerText = `${translateCommonWords.gps[getLanguage()]}`;

    modal.classList.add('active');
    
	setTimeout(() => {
		modal.classList.remove('active');
	}, 2000);

	const coordinates = {
		lat: 53.902334,
		lon: 27.5618791
	};
	localStorage.setItem('lat', 53.902334);
	localStorage.setItem('lon', 27.5618791);
	if (!localStorage.hasOwnProperty('regionCity')) {
		allRequest(coordinates);
	}
}

export function geolocation() {
	// document.querySelector('.spinner').classList.add('active');

	navigator.geolocation.getCurrentPosition(success, error, options);
}
