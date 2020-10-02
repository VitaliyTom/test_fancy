function RegionObj(
	ISOCountry,
	city,
	city_district,
	continent,
	country,
	country_code,
	postcode,
	residential,
	suburb,
	timezone
) {
	this.ISOCountry = ISOCountry;
	this.city = city;
	this.city_district = city_district;
	this.continent = continent;
	this.country = country;
	this.country_code = country_code;
	this.postcode = postcode;
	this.residential = residential;
	this.suburb = suburb;
	this.timezone = timezone;
}

export default RegionObj;
