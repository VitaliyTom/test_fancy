export function getLanguage() {
	return [ 'Eng', 'Rus', 'Blr', 'Pol' ].indexOf(localStorage.getItem('lang'));
}
