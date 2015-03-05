
var nest    = require( '../vendor/nest' );
var currentTemp, targetTemp;


/*
 * the building blocks of life!  or the nest module... take your pick
 * also initializes the nest functions
 *
 * @parameters {config}             config              main config file
 */
var nestModule    = function( config )
{
    this.ini( config );
};


nestModule.ini   = function( config )
{
    var username = config.nest.username;
    var password = config.nest.password;

    this.data   = data;
    this.config = config;

    nest.login( username, password, function ( err, data ) 
    {
        if ( err ) 
        {
            console.log( err.message );
            process.exit( 1 );
            return;
        }
        console.log( 'Nest connected.' );
        nest.fetchStatus( function ( data ) 
        {
            for ( var deviceId in data.device ) 
            {
                if ( data.device.hasOwnProperty( deviceId ) ) 
                {
                    var device  = data.shared[ deviceId ];
                    currentTemp = device.current_temperature,
                    targetTemp  = device.target_temperature;
                }
            }
            nest.ids = nest.getDeviceIds();
        } );
    } );
};


/**
 * points the nest -> direction things!  Handles all the commands 
 * and closes the response
 * 
 * @param  {obj}                    res                 result
 * @param  {obj}                    response            http response
 * 
 * @return {void}
 */
nestModule.command = function( res, response )
{
    var fahrenheit, data = {};

    if ( res.away  )
    {
        data.away = res.away;
        ( res.away === 'true' ) ? this.away() : this.home();
    }
    if ( res.home )
    {
        data.home = res.home;
        ( res.home === 'true' ) ? this.home() : this.away();
    }
    if ( res.increase )
    {
        currentTemp     += parseInt( res.increase );
        fahrenheit      = nest.ctof( currentTemp );
        this.temp( fahrenheit );   
        data.increase   = res.increase;
    }
    if ( res.lower )
    {
        currentTemp -= parseInt( res.lower );
        fahrenheit  = nest.ctof( currentTemp );
        this.temp( fahrenheit ); 
        data.lower  = res.lower;
    }
    if ( res.temp && res.temp.match( /^[0-9]+$/ ) )
    {
        fahrenheit = nest.ctof( res.temp );
        this.temp( fahrenheit );   
        data.temp = parseInt( res.temp );
    }
    if ( res.fan && ( res.fan === 'auto' || res.fan === 'on' ) )
    {
        data.fan = res.fan;
        ( res.fan === 'auto' ) ? nest.setFanModeAuto() : nest.setFanModeOn();
    }


    if ( data.away || data.home || data.temp || data.increase || 
        data.lower || data.fan )
    {
        data.result     = 'success';
        response.writeHead( 200, { "Content-Type": "text/html" } );
        response.write( JSON.stringify( data ) );
        response.end(); 
    }
    else
    {
        data.result     = 'error';
        data.error      = 'not enough parameters';
        response.writeHead( 200, { "Content-Type": "text/html" } );
        response.write( JSON.stringify( data ) );
        response.end();
    }
};


/**
 * sets the nest temperature
 *
 * @return {void}
 */
nestModule.temp = function( temp )
{
    for (var i = 0, lenI = nest.ids.length; i < lenI; i++ ) 
    {
        nest.setTemperature( nest.ids[ i ], temp );
    }
};


/**
 * sets the nest to away
 *
 * @return {void}
 */
nestModule.away = function()
{
    nest.setAway();
};

/**
 * sets the nest to home
 *
 * @return {void}
 */
nestModule.home = function()
{
    nest.setHome();
};


module.exports = nestModule;

