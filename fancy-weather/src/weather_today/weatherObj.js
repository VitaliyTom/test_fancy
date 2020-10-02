function Weather(lat, lon, temp, feelslike, humidity, wind, localtime, weather_code) {
	this.lat = lat;
	this.lon = lon;
	this.temp = temp;
	this.feelslike = feelslike;
	this.humidity = humidity;
	this.wind = wind;
	this.localtime = localtime;
	this.weather_code = weather_code;
}

export default Weather;
