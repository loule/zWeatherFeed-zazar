/**
 * Plugin: jquery.zWeatherFeed
 * 
 * Version: 1.2.1
 * (c) Copyright 2011-2013, Zazar Ltd
 * 
 * Description: jQuery plugin for display of Yahoo! Weather feeds
 * 
 * History:
 * 1.2.1 - Handle invalid locations
 * 1.2.0 - Added forecast data option
 * 1.1.0 - Added user callback function
 *         New option to use WOEID identifiers
 *         New day/night CSS class for feed items
 *         Updated full forecast link to feed link location
 * 1.0.3 - Changed full forecast link to Weather Channel due to invalid Yahoo! link
	   Add 'linktarget' option for forecast link
 * 1.0.2 - Correction to options / link
 * 1.0.1 - Added hourly caching to YQL to avoid rate limits
 *         Uses Weather Channel location ID and not Yahoo WOEID
 *         Displays day or night background images
 *
 **/

(function($){

	$.fn.weatherfeed = function(locations, options, fn) {	
	
		// Set plugin defaults
		var defaults = {
			unit: 'c',
			image: true,
			country: false,
			language: 'en',
			highlow: true,
			wind: true,
			humidity: false,
			visibility: false,
			sunrise: false,
			sunset: false,
			forecast: false,
			link: true,
			showerror: true,
			linktarget: '_self',
			woeid: false
		};  
		var options = $.extend(defaults, options); 
		var row = 'odd';
		
		//Here we prepare the text for each condition, in any language
		var condition_codes = {
			//For information and translation base because English is already used
			'en' : {
				0 :	'tornado',
				1 :	'tropical storm',
				2 :	'hurricane',
				3 :	'severe thunderstorms',
				4 :	'thunderstorms',
				5 :	'mixed rain and snow',
				6 :	'mixed rain and sleet',
				7 :	'mixed snow and sleet',
				8 :	'freezing drizzle',
				9 :	'drizzle',
				10 : 'freezing rain',
				11 : 'showers',
				12 : 'showers',
				13 : 'snow flurries',
				14 : 'light snow showers',
				15 : 'blowing snow',
				16 :	'snow',
				17 :	'hail',
				18 :	'sleet',
				19 :	'dust',
				20 :	'foggy',
				21 :	'haze',
				22 :	'smoky',
				23 :	'blustery',
				24 :	'windy',
				25 :	'cold',
				26 :	'cloudy',
				27 :	'mostly cloudy (night)',
				28 :	'mostly cloudy (day)',
				29 :	'partly cloudy (night)',
				30 :	'partly cloudy (day)',
				31 :	'clear (night)',
				32 :	'sunny',
				33 :	'fair (night)',
				34 :	'fair (day)',
				35 :	'mixed rain and hail',
				36 :	'hot',
				37 :	'isolated thunderstorms',
				38 :	'scattered thunderstorms',
				39 :	'scattered thunderstorms',
				40 :	'scattered showers',
				41 :	'heavy snow',
				42 :	'scattered snow showers',
				43 :	'heavy snow',
				44 :	'partly cloudy',
				45 :	'thundershowers',
				46 :	'snow showers',
				47 :	'isolated thundershowers',
				3200 :	'not available'
			},
			'fr' :{
				//French words ( not complete )
				0 :	'Tornade',
				1 :	'Tempête tropicale',
				2 :	'Ouragan',
				3 :	'Orages sévères',
				4 :	'Orages',
				5 :	'mixed rain and snow',
				6 :	'mixed rain and sleet',
				7 :	'mixed snow and sleet',
				8 :	'freezing drizzle',
				9 :	'drizzle',
				10 :	'freezing rain',
				11 :	'Averses',
				12 :	'Averses',
				13 : 	'snow flurries',
				14 :	'Averses de neige légères',
				15 :	'blowing snow',
				16 :	'snow',
				17 :	'hail',
				18 :	'sleet',
				19 :	'dust',
				20 :	'Brouillard',
				21 :	'haze',
				22 :	'smoky',
				23 :	'blustery',
				24 :	'Venteux',
				25 :	'Froid',
				26 :	'Nuageux',
				27 :	'Nuageux',
				28 :	'Nuageux',
				29 :	'Partiellement nuageux',
				30 :	'Partiellement nuageux',
				31 :	'Clair',
				32 :	'Ensoleillé',
				33 :	'Beau temps',
				34 :	'Beau temps',
				35 :	'mixed rain and hail',
				36 :	'Chaud',
				37 :	'Orages isolés',
				38 :	'Orages intermittents',
				39 :	'Orages intermittents',
				40 :	'Averses intermittentes',
				41 :	'Neige',
				42 :	'Averses de neige intermittentes',
				43 :	'Neige',
				44 :	'Partiellement nuageux',
				45 :	'Orages',
				46 :	'Averses de neige',
				47 :	'Orages isolés',
				3200 :	'Non disponible'
			}
		};

		//Here, some words/terms needed to be translated
		var translated_text = {
			'en' : {
				'high' : 'High',
				'low' : 'Low',
				'full_forecast' : 'Full forecast',
				'full_forecast_title' : 'Read full forecast',
				'city_not_found' : 'City not found',
				'sunset' : 'Sunset',
				'sunrise' : 'Sunrise',
				'wind' : 'Wind',
				'humidity' : 'Humidity',
				'visibility' : 'Visibility'
			},
			'fr' : {
				'high' : 'Max',
				'low' : 'Min',
				'full_forecast' : 'Prévision complète',
				'full_forecast_title' :'Toute la prévision',
				'city_not_found' : 'Ville non trouvée',
				'sunset' : 'Lever du soleil',
				'sunrise' : 'Coucher du soleil',
				'wind' : 'Vent',
				'humidity' : 'Humidité',
				'visibility' : 'Visibilité',
				'days' : {
					'Mon' : 'Lun',
					'Tue' : 'Mar',
					'Wed' : 'Mer',
					'Thu' : 'Jeu',
					'Fri' : 'Ven',
					'Sat' : 'Sam',
					'Sun' : 'Dim'
				},
				'months' : {
					'Jan' : 'Jan',
					'Feb' : 'Fév',
					'Mar' : 'Mar',
					'Apr' : 'Avr',
					'May' : 'Mai',
					'Jun' : 'Juin',
					'Jul' : 'Juil',
					'Aug' : 'Août',
					'Sep' : 'Sep',
					'Oct' : 'Oct',
					'Nov' : 'Nov',
					'Dec' : 'Déc'
				}
			},
		}
		
		if(options.language!='en'){
			var text = translated_text[options.language];
			var t = condition_codes[options.language];
		} else {
			var text = translated_text.en;
		}
		
		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			
			// Add feed class to user div
			if (!$e.hasClass('weatherFeed')) $e.addClass('weatherFeed');

			// Check and append locations
			if (!$.isArray(locations)) return false;

			var count = locations.length;
			if (count > 10) count = 10;

			var locationid = '';

			for (var i=0; i<count; i++) {
				if (locationid != '') locationid += ',';
				locationid += "'"+ locations[i] + "'";
			}

			// Cache results for an hour to prevent overuse
			now = new Date();

			// Select location ID type
			var queryType = options.woeid ? 'woeid' : 'location';
					
			// Create Yahoo Weather feed API address
			var query = "select * from weather.forecast where "+ queryType +" in ("+ locationid +") and u='"+ options.unit +"'";
			var api = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=?';

			// Send request
			$.ajax({
				type: 'GET',
				url: api,
				dataType: 'json',
				success: function(data) {

					if (data.query) {
			
						if (data.query.results.channel.length > 0 ) {
							
							// Multiple locations
							var result = data.query.results.channel.length;
							for (var i=0; i<result; i++) {
							
								// Create weather feed item
								_process(e, data.query.results.channel[i], options);
							}
						} else {

							// Single location only
							_process(e, data.query.results.channel, options);
						}

						// Optional user callback function
						if ($.isFunction(fn)) fn.call(this,$e);

					} else {
						if (options.showerror) $e.html('<p>Weather information unavailable</p>');
					}
				},
				error: function(data) {
					if (options.showerror) $e.html('<p>Weather request failed</p>');
				}
			});

			// Function to each feed item
			var _process = function(e, feed, options) {
				var $e = $(e);

				// Check for invalid location
				if (feed.description != 'Yahoo! Weather Error') {

					// Format feed items
					var wd = feed.wind.direction;
					if (wd>=348.75&&wd<=360){wd="N"};if(wd>=0&&wd<11.25){wd="N"};if(wd>=11.25&&wd<33.75){wd="NNE"};if(wd>=33.75&&wd<56.25){wd="NE"};if(wd>=56.25&&wd<78.75){wd="ENE"};if(wd>=78.75&&wd<101.25){wd="E"};if(wd>=101.25&&wd<123.75){wd="ESE"};if(wd>=123.75&&wd<146.25){wd="SE"};if(wd>=146.25&&wd<168.75){wd="SSE"};if(wd>=168.75&&wd<191.25){wd="S"};if(wd>=191.25 && wd<213.75){wd="SSW"};if(wd>=213.75&&wd<236.25){wd="SW"};if(wd>=236.25&&wd<258.75){wd="WSW"};if(wd>=258.75 && wd<281.25){wd="W"};if(wd>=281.25&&wd<303.75){wd="WNW"};if(wd>=303.75&&wd<326.25){wd="NW"};if(wd>=326.25&&wd<348.75){wd="NNW"};
					var wf = feed.item.forecast[0];
		
					// Determine day or night image
					wpd = feed.item.pubDate;
					n = wpd.indexOf(":");
					tpb = _getTimeAsDate(wpd.substr(n-2,8));
					tsr = _getTimeAsDate(feed.astronomy.sunrise);
					tss = _getTimeAsDate(feed.astronomy.sunset);

					// Get night or day
					if (tpb>tsr && tpb<tss) { daynight = 'day'; } else { daynight = 'night'; }

					// Add item container
					var html = '<div class="weatherItem '+ row +' '+ daynight +'"';
					if (options.image) html += ' style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'+ feed.item.condition.code + daynight.substring(0,1) +'.png); background-repeat: no-repeat;"';
					html += '>';
		
					// Add item data
					html += '<div class="weatherCity">'+ feed.location.city +'</div>';
					if (options.country) html += '<div class="weatherCountry">'+ feed.location.country +'</div>';
					html += '<div class="weatherTemp">'+ feed.item.condition.temp +'&deg;</div>';
					
					//Here we look if we need to translate, then we do
					if(options.language!='en'){
						//var t = condition_codes[options.language];
						feed.item.condition.text = t[feed.item.condition.code];
					}
					
					html += '<div class="weatherDesc">'+ feed.item.condition.text +'</div>';
				
					// Add optional data
					if (options.highlow) html += '<div class="weatherRange">'+text.high+': '+ wf.high +'&deg; '+ text.low +': '+ wf.low +'&deg;</div>';
					if (options.wind) html += '<div class="weatherWind">'+ text.wind +': '+ wd +' '+ feed.wind.speed + feed.units.speed +'</div>';
					if (options.humidity) html += '<div class="weatherHumidity">'+ text.humidity +': '+ feed.atmosphere.humidity +'</div>';
					if (options.visibility) html += '<div class="weatherVisibility">'+ text.visibility +': '+ feed.atmosphere.visibility +'</div>';
					if (options.sunrise) html += '<div class="weatherSunrise">'+ text.sunrise +': '+ feed.astronomy.sunrise +'</div>';
					if (options.sunset) html += '<div class="weatherSunset">'+ text.sunset +': '+ feed.astronomy.sunset +'</div>';

					// Add item forecast data
					if (options.forecast) {

						html += '<div class="weatherForecast">';

						var wfi = feed.item.forecast;

						for (var i=0; i<wfi.length; i++) {
							if(options.language==='en'){
								html += '<div class="weatherForecastItem" style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'+ wfi[i].code +'s.png); background-repeat: no-repeat;">';
								html += '<div class="weatherForecastDay">'+ wfi[i].day +'</div>';
								html += '<div class="weatherForecastDate">'+ wfi[i].date +'</div>';
								html += '<div class="weatherForecastText">'+ wfi[i].text +'</div>';
								html += '<div class="weatherForecastRange">'+text.high+': '+ wfi[i].high +' '+ text.low +': '+ wfi[i].low +'</div>';
								html += '</div>'
							} else {
								html += '<div class="weatherForecastItem" style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'+ wfi[i].code +'s.png); background-repeat: no-repeat;">';
								html += '<div class="weatherForecastDay">'+ text.days[wfi[i].day] +'</div>';
								html += '<div class="weatherForecastDate">'+ wfi[i].date +'</div>';
								html += '<div class="weatherForecastText">'+ t[wfi[i].code] +'</div>';
								html += '<div class="weatherForecastRange">'+text.high+': '+ wfi[i].high +' '+ text.low +': '+ wfi[i].low +'</div>';
								html += '</div>'
							}
						}

						html += '</div>'
					}

					if (options.link) html += '<div class="weatherLink"><a href="'+ feed.link +'" target="'+ options.linktarget +'" title="'+ text.full_forecast_title +'">'+ text.full_forecast +'</a></div>';

				} else {
					var html = '<div class="weatherItem '+ row +'">';
					html += '<div class="weatherError">'+ text.city_not_found +'</div>';
				}

				html += '</div>';

				// Alternate row classes
				if (row == 'odd') { row = 'even'; } else { row = 'odd';	}
		
				$e.append(html);
			};

			// Get time string as date
			var _getTimeAsDate = function(t) {
		
				d = new Date();
				r = new Date(d.toDateString() +' '+ t);

				return r;
			};

		});
	};

})(jQuery);
