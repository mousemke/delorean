var https       = require( 'https' );

/*
 * hue building block
 */
var tadoModule  = {};


/**
 * checks connectivity on the appliances
 *
 * @return {void}
 */
tadoModule.ini = function( config, data, e )
{
    this.config = config;
    this.data   = data;
    this.e      = e; 

    this.e.on( 'poll', function( time ) 
    { 
        // console.log( time ); 
        console.log( 'tado' ); 
    } );

    var self = this;

    this.send( '/mobile/1.4/getCurrentState', function( res )
    { 
        if ( res.success ) 
        {
            console.log( 'Tado connected.' );
        }
        else
        {
            console.log( 'Tado connection failed.' );   
        }
    } );
};


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
tadoModule.send = function( _url, _cb, method, data )
{
    method = method || 'GET';

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
                console.log( _url + ' appears to be down' );
            }
        });

    };

    _url += '?username=' + this.config.tado.username + 
            '&password=' + this.config.tado.password;

    var options = {
        host    : this.config.tado.baseUrl,
        port    : 443,
        path    : _url,
        method  : method
    };

    var req = https.request( options, callback );

    if ( method === 'POST' || method === 'PUT' )
    {
        data = JSON.stringify( data );
        req.write( data );
    }

    req.end();
};


/**
 * processes commands
 * 
 * @param  {obj}                    res                 api call result
 * 
 * @return {void}
 */
tadoModule.command = function( res, response )
{
    var data = {};

    // if ( res.on )
    // {
    //     data.on = ( res.on === 'true' ) ? true : false;
    // }
    // if ( res.off )
    // {
    //     data.on = ( res.off === 'true' ) ? false : true;
    // }
    // if ( res.sat || res.sat === '0' )
    // {
    //     data.sat = parseFloat( res.sat ) / 100 * 255;
    // }
    // if ( res.bri || res.bri === '0' )
    // {
    //     data.bri = parseFloat( res.bri ) / 100 * 255;
    // }
    // if ( res.hue || res.hue === '0' )
    // {
    //     data.hue = parseFloat( res.hue ) / 100 * 45535;
    // }
    // if ( res.alert )
    // {
    //     data.alert = res.alert;   
    // }
    // if ( res.effect )
    // {
    //     data.effect = res.effect;   
    // }
    // if ( res.transitiontime || res.transitiontime === '0' )
    // {
    //     data.transitiontime = res.transitiontime / 100;   
    // }

    // if ( data.on || data.on === false || data.off || data.off === false || data.sat || data.bri || 
    //     data.hue || data.alert || data.effect || data.transitiontime )
    // {
    //     if ( res.light )
    //     {
    //         data.light  = res.light;
    //         this.send( '/api/' + developerName + '/lights/' + res.light + '/state', function()
    //         {
    //             data.result     = 'success';
    //             response.writeHead( 200, { "Content-Type": "text/html" } );
    //             response.write( JSON.stringify( data ) );
    //             response.end();

    //         }, 'PUT', data ); 
    //     }
    //     else
    //     {
    //         var self = this;

    //         this.send( '/api/' + developerName + '/groups/0/action', function( res )
    //         {
    //             var lightList = '';
    //             for ( var light in self.lightList )
    //             {
    //                 lightList += ',' + light;
    //             }

    //             data.light      = lightList.slice( 1 );
    //             data.result     = 'success';

                response.writeHead( 200, { "Content-Type": "text/html" } );
                // response.write( JSON.stringify( data ) );
                response.end();
    //         }, 'PUT', data ); 
    //     }
    // }
    // else
    // {
    //     data.result     = 'error';
    //     data.error      = 'not enough parameters';
    //     response.writeHead( 200, { "Content-Type": "text/html" } );
    //     response.write( JSON.stringify( data ) );
    //     response.end();
    // }
};


module.exports = tadoModule;

// POST: /updateLocation
// request:
// {
// "mode": "APP_TRIGGERED",
// "username": "",
// "password":"",
// "latitude:"xx.xxxx",
// "longitude:"xx.xxxx"
// "accuracy": "60.0",
// "batteryLevel":" 53",
// "debugString": "attempt-1-unsentFixes-0-"
// }
// response:
// {
// "homeFence": "",
// "homeGeolocationLatitude": "",
// "homeGeolocationLongitude": "",
// "minDistance": "",
// "minTime": 120000
// "regionDistances": Array[20],
// "success": true|false,
// "triggerInterval": "",
// "wakeupInterval": ""
// }</code>

// GET: /getAppUsers
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "currentUser": "",
// "appUsers": ""
// }

// GET: /getCurrentState
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "boxConnected: true|false
// "controlPhase: ""
// "currentUserGeoStale: ""
// "currentUserPrivacyEnabled": ""
// "deviceUpdating": true|false
// "gwConnected": true|false
// "homeId": ""
// "insideTemp": ""
// "operation": ""
// "operationTrigger": ""
// "setPointTemp": ""
// "success": true|false
// "tsConnected": true|false
// }

// GET: /getThermostatSettings
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "setMode": "",
// "manualTemp": "",
// "homeTemp": "",
// "sleepTemp": "",
// "comfortLevel": "",
// "deactivateHomeButton": ""
// "hotWaterControl": true|false
// "hotWaterMode": ""
// "hotWaterTemp": ""
// "hotWaterTempControl": true|false
// "minAwayTemp": ""
// "success": true
// }

// GET: /updateThermostatSettings
// request:
// {
// "username": "",
// "password": "",
// "comfortLevel": "",
// "setMode": "",
// "deactivateHomeButton", "",
// "manualTemp": "",
// "homeTemp": "",
// "sleepTemp": ""
// }
// response:
// {
// "setMode": "",
// "manualTemp": "",
// "homeTemp": "",
// "sleepTemp": "",
// "comfortLevel": "",
// "deactivateHomeButton", ""
// }

// GET: /getAppUserSettings
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "stateChangeNotifications": true|false,
// "settingsChangeNotifications": true|false,
// "systemInfoNotifications": true|false,
// "rewardNotifications": true|false,
// "geoTrackingEnabled": true|false,
// "privacyEnabled", true|false
// }

// GET: /updateAppUserSettings
// request:
// {
// "username": "",
// "password": "",
// "stateChangeNotifications": true|false,
// "settingsChangeNotifications": true|false,
// "systemInfoNotifications": true|false,
// "rewardNotifications": true|false,
// "geoTrackingEnabled": true|false,
// "privacyEnabled", true|false
// }
// response:
// {
// "stateChangeNotifications": true|false,
// "settingsChangeNotifications": true|false,
// "systemInfoNotifications": true|false,
// "rewardNotifications": true|false,
// "geoTrackingEnabled": true|false,
// "privacyEnabled", true|false
// }

// GET: /getScheduleContainer
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "scheduleContainer": {
// "residentsWithoutCellphone": true|false,
// "currentScheduleType": "ONEDAY|ANYDAY|THREEDAY|SEVENDAY|WORKDAY|SATURDAY|SUNDAY|MONDAY|TUESDAY|WEDNESDAY|..."
// "oneDaySchedule": {},
// "threeDaySchedule": {},
// "sevenDaySchedule": {}
// }

// GET: /updateScheduleContainer
// request:
// {
// "username": "",
// "password": ""
// }
// response:
// {
// "scheduleContainer": {
// "residentsWithoutCellphone": true|false,
// "currentScheduleType": "ONEDAY|ANYDAY|THREEDAY|SEVENDAY|WORKDAY|SATURDAY|SUNDAY|MONDAY|TUESDAY|WEDNESDAY|..."
// "scheduleDayType": "ONEDAY|ANYDAY|THREEDAY|SEVENDAY|WORKDAY|SATURDAY|SUNDAY|MONDAY|TUESDAY|WEDNESDAY|...",
// "getup": "",
// "leaving": "",
// "arrival": "",
// "sleep": ""
// }

        // GET: /getNotifications
        // request:
        // {
        // "username": "",
        // "password": "",
        // "fromDate": "",
        // "toDate": "",
        // "locale": "",
        // "max": "",
        // "lastMessageId": ""
        // }
        // response:
        // {
        // "notifications": {},
        // "messages", {}
        // }

        // GET: /createAppUser
        // request:
        // {
        // "username": "",
        // "password": "",
        // "nickname": "",
        // "geoTrackingEnabled": true|false,
        // "deviceName": "",
        // "devicePlatform": "",
        // "deviceUuid": "",
        // "deviceOsVer": "",
        // "appVersion": ""
        // }
        // response:
        // {
        // "username": "",
        // "password": "",
        // "nickname": "",
        // "geoTrackingEnabled": true|false,
        // "privacyEnabled": true|false
        // }

        // GET: /claimAppUser
        // request:
        // {
        // "username": "",
        // "password": "",
        // "nickname": "",
        // "geoTrackingEnabled": true|false,
        // "deviceName": "",
        // "devicePlatform": "",
        // "deviceUuid": "",
        // "deviceOsVer": "",
        // "appVersion": ""
        // }
        // response:
        // {
        // "username": "",
        // "password": "",
        // "nickname": "",
        // "geoTrackingEnabled": true|false,
        // "privacyEnabled": true|false
        // }

