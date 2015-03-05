var http       = require( 'http' );

/*
 * hue building block
 */
var weatherModule  = {};


/**
 * checks connectivity on the appliances
 *
 * @return {void}
 */
weatherModule.ini = function( config, data )
{
    this.config = config;
    this.data   = data;

    var self = this;

    this.send( function( res )
    { 
        if ( res.coord ) 
        {
            console.log( 'Weather connected.' );
        }
        else
        {
            console.log( 'Weather connection failed.' );   
        }
    } );
};


weatherModule.parseWeather = function( res )
{
    var weatherId   = res.weather[ 0 ].id;
    var info        = this.weatherCodes[ weatherId ];

    var data    = {
        time        : res.dt,
        location    : res.name,
        wind        : res.wind,
        clouds      : res.clouds.all,
        sunrise     : res.sys.sunrise,
        sunset      : res.sys.sunset,
        icon        : 'http://openweathermap.org/img/w/' + res.weather[ 0 ].icon + '.png',
        pressure    : res.main.pressure,
        humidity    : res.main.humidity,
        type        : res.weather[ 0 ].main,
        description : res.weather[ 0 ].description,
        title       : info.name,
        triggers    : {
            weatherId   : weatherId,
            precip      : info.precip,
            alert       : info.alert
        },
        tempNow     : parseFloat( res.main.temp )       - 273.15,
        tempHigh    : parseFloat( res.main.temp_max )   - 273.15,
        tempLow     : parseFloat( res.main.temp_min )   - 273.15
    };

    return data;
},


/**
 * send
 *
 * gets and parses JSON from api sources
 *
 * @param  {str}                    _url                target url
 * @param  {func}                   _cb                 callback
 * @param  {str}                    method              GET, POST, etc
 * @param  {obj}                    data                data
 *
 * @return {void}
 */
weatherModule.send = function( url, _cb )
{
    var config = this.config;

    var callback = function( res )
    {
        var body = '';

        res.on( 'data', function( chunk )
        {
            body += chunk;
        });

        res.on( 'end', function()
        {
            var data;
            try
            {
                data = JSON.parse( body );
                _cb( data );
            }
            catch( e )
            {
                console.log( config.weather.baseUrl + ' appears to be down' );
            }
        });

    };

    var options = {
        host    : this.config.weather.baseUrl,
        port    : 80,
        path    : url,
        method  : 'GET'
    };

    var req = http.request( options, callback );
    req.end();
};


/**
 * processes commands
 * 
 * @param  {obj}                    res                 api call result
 * 
 * @return {void}
 */
weatherModule.command = function( res, response )
{
    // build forcast - http://openweathermap.org/forecast

    var self    = this;

    if ( res.now )
    {
        var url = '/data/2.5/weather?lat=' + this.config.weather.latitude + 
                                    '&lon=' + this.config.weather.longitude;
    }

    this.send( url, function( data )
    {
        data                = self.parseWeather( data );

        self.data.weather   = data;

        data.result         = 'success';

        response.writeHead( 200, { "Content-Type": "text/html" } );
        response.write( JSON.stringify( data ) );
        response.end();
    } ); 
};


weatherModule.weatherCodes = {
    200 : {
        precip  : true,
        name    : 'thunderstorm with light rain',
        imgCode : '11',
        alert   : false
    },
    201 : {
        precip  : true,
        name    : 'thunderstorm with rain',
        imgCode : '11',
        alert   : false
    },
    202 : {
        precip  : true,
        name    : 'thunderstorm with heavy rain',
        imgCode : '11',
        alert   : false
    },
    210 : {
        precip  : true,
        name    : 'light thunderstorm',
        imgCode : '11',
        alert   : false
    },
    211 : {
        precip  : true,
        name    : 'thunderstorm',
        imgCode : '11',
        alert   : false
    },
    212 : {
        precip  : true,
        name    : 'heavy thunderstorm',
        imgCode : '11',
        alert   : false
    },
    221 : {
        precip  : true,
        name    : 'ragged thunderstorm',
        imgCode : '11',
        alert   : false
    },
    230 : {
        precip  : true,
        name    : 'thunderstorm with light drizzle',
        imgCode : '11',
        alert   : false
    },
    231 : {
        precip  : true,
        name    : 'thunderstorm with drizzle',
        imgCode : '11',
        alert   : false
    },
    232 : {
        precip  : true,
        name    : 'thunderstorm with heavy drizzle',
        imgCode : '11',
        alert   : false
    },
    300 : {
        precip  : true,
        name    : 'light intensity drizzle',
        imgCode : 0,
        alert   : false
    },
    301 : {
        precip  : true,
        name    : 'drizzle',
        imgCode : '09',
        alert   : false
    },
    302 : {
        precip  : true,
        name    : 'heavy intensity drizzle',
        imgCode : '09',
        alert   : false
    },
    310 : {
        precip  : true,
        name    : 'light intensity drizzle rain',
        imgCode : '09',
        alert   : false
    },
    311 : {
        precip  : true,
        name    : 'drizzle rain',
        imgCode : '09',
        alert   : false
    },
    312 : {
        precip  : true,
        name    : 'heavy intensity drizzle rain',
        imgCode : '09',
        alert   : false
    },
    313 : {
        precip  : true,
        name    : 'shower rain and drizzle',
        imgCode : '09',
        alert   : false
    },
    314 : {
        precip  : true,
        name    : 'heavy shower rain and drizzle',
        imgCode : '09',
        alert   : false
    },
    321 : {
        precip  : true,
        name    : 'shower drizzle',
        imgCode : '09',
        alert   : false
    },
    500 : {
        precip  : true,
        name    : 'light rain',
        imgCode : '10',
        alert   : false
    },
    501 : {
        precip  : true,
        name    : 'moderate rain',
        imgCode : '10',
        alert   : false
    },
    502 : {
        precip  : true,
        name    : 'heavy intensity rain',
        imgCode : '10',
        alert   : false
    },
    503 : {
        precip  : true,
        name    : 'very heavy rain',
        imgCode : '10',
        alert   : false
    },
    504 : {
        precip  : true,
        name    : 'extreme rain',
        imgCode : '10',
        alert   : false
    },
    511 : {
        precip  : true,
        name    : 'freezing rain',
        imgCode : '13',
        alert   : false
    },
    520 : {
        precip  : true,
        name    : 'light intensity shower rain',
        imgCode : '09',
        alert   : false
    },
    521 : {
        precip  : true,
        name    : 'shower rain',
        imgCode : '09',
        alert   : false
    },
    522 : {
        precip  : true,
        name    : 'heavy intensity shower rain',
        imgCode : '09',
        alert   : false
    },
    531 : {
        precip  : true,
        name    : 'ragged shower rain',
        imgCode : '09',
        alert   : false
    },
    600 : {
        precip  : true,
        name    : 'light snow',
        imgCode : '13',
        alert   : false
    },
    601 : {
        precip  : true,
        name    : 'snow',
        imgCode : '13',
        alert   : false
    },
    602 : {
        precip  : true,
        name    : 'heavy snow',
        imgCode : '13',
        alert   : false
    },
    611 : {
        precip  : true,
        name    : 'sleet',
        imgCode : '13',
        alert   : false
    },
    612 : {
        precip  : true,
        name    : 'shower sleet',
        imgCode : '13',
        alert   : false
    },
    615 : {
        precip  : true,
        name    : 'light rain and snow',
        imgCode : '13',
        alert   : false
    },
    616 : {
        precip  : true,
        name    : 'rain and snow',
        imgCode : '13',
        alert   : false
    },
    620 : {
        precip  : true,
        name    : 'light shower snow',
        imgCode : '13',
        alert   : false
    },
    621 : {
        precip  : true,
        name    : 'shower snow',
        imgCode : '13',
        alert   : false
    },
    622 : {
        precip  : true,
        name    : 'heavy shower snow',
        imgCode : '13',
        alert   : false
    },
    701 : {
        precip  : true,
        name    : 'mist',
        imgCode : '50',
        alert   : false
    },
    711 : {
        precip  : false,
        name    : 'smoke',
        imgCode : '50',
        alert   : false
    },
    721 : {
        precip  : false,
        name    : 'haze',
        imgCode : '50',
        alert   : false
    },
    731 : {
        precip  : false,
        name    : 'sand, dust whirls',
        imgCode : '50',
        alert   : false
    },
    741 : {
        precip  : true,
        name    : 'fog',
        imgCode : '50',
        alert   : false
    },
    751 : {
        precip  : false,
        name    : 'sand',
        imgCode : '50',
        alert   : false
    },
    761 : {
        precip  : false,
        name    : 'dust',
        imgCode : '50',
        alert   : false
    },
    762 : {
        precip  : false,
        name    : 'volcanic ash',
        imgCode : '50',
        alert   : false
    },
    771 : {
        precip  : true,
        name    : 'squalls',
        imgCode : '50',
        alert   : false
    },
    781 : {
        precip  : true,
        name    : 'tornado',
        imgCode : '50',
        alert   : false
    },
    800 : {
        precip  : false,
        name    : 'clear sky',
        imgCode : '01',
        alert   : false
    },
    801 : {
        precip  : false,
        name    : 'few clouds',
        imgCode : '02',
        alert   : false
    },
    802 : {
        precip  : false,
        name    : 'scattered clouds',
        imgCode : '03',
        alert   : false
    },
    803 : {
        precip  : false,
        name    : 'broken clouds',
        imgCode : '04',
        alert   : false
    },
    804 : {
        precip  : false,
        name    : 'overcast clouds',
        imgCode : '04',
        alert   : false
    },
    900 : {
        precip  : true,
        name    : 'tornado',
        imgCode : false,
        alert   : false
    },
    901 : {
        name    : 'tropical storm',
        imgCode : false,
        alert   : false
    },
    902 : {
        precip  : true,
        name    : 'hurricane',
        imgCode : false,
        alert   : true
    },
    903 : {
        precip  : false,
        name    : 'cold',
        imgCode : false,
        alert   : true
    },
    904 : {
        precip  : false,
        name    : 'hot',
        imgCode : false,
        alert   : true
    },
    905 : {
        precip  : false,
        name    : 'windy',
        imgCode : false,
        alert   : true
    },
    906 : {
        precip  : true,
        name    : 'hail',
        imgCode : false,
        alert   : true
    },
    951 : {
        precip  : false,
        name    : 'calm',
        imgCode : false,
        alert   : false
    },
    952 : {
        precip  : false,
        name    : 'light breeze',
        imgCode : false,
        alert   : false
    },
    953 : {
        precip  : false,
        name    : 'gentle breeze',
        imgCode : false,
        alert   : false
    },
    954 : {
        precip  : false,
        name    : 'moderate breeze',
        imgCode : false,
        alert   : false
    },
    955 : {
        precip  : false,
        name    : 'fresh breeze',
        imgCode : false,
        alert   : false
    },
    956 : {
        precip  : false,
        name    : 'strong breeze',
        imgCode : false,
        alert   : false
    },
    957 : {
        precip  : false,
        name    : 'high wind, near gale',
        imgCode : false,
        alert   : false
    },
    958 : {
        precip  : false,
        name    : 'gale',
        imgCode : false,
        alert   : false
    },
    959 : {
        precip  : false,
        name    : 'severe gale',
        imgCode : false,
        alert   : true
    },
    960 : {
        precip  : true,
        name    : 'storm',
        imgCode : false,
        alert   : true
    },
    961 : {
        precip  : true,
        name    : 'violent storm',
        imgCode : false,
        alert   : true
    },
    962 : {
        precip  : true,
        name    : 'hurricane',
        imgCode : false,
        alert   : true
    }
};


module.exports = weatherModule;

