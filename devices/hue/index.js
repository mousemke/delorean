var http            = require( 'http' );

/*
 * hue building block
 */
var hueModule       = {};


/**
 * checks connectivity on the appliances
 *
 * @return {void}
 */
hueModule.ini = function( config, data )
{
    this.config = config;
    this.data   = data;

    var self    = this;

    this.send( '/api/' + config.hue.developer, function( res )
    { 
        if ( res.lights ) 
        {
            console.log( 'Hue base station connected.' );
            self.getLightList();
        }
        else
        {
            console.log( 'Hue base station connection failed.' );   
        }
    } );
};


/**
 * builds a list off all the lights to be referred to later and 
 * mounts it to the hue base object
 * 
 * @return {void}
 */
hueModule.getLightList = function()
{
    var self = this;

    this.send( '/api/' + this.config.hue.developer + '/lights', function( allLights )
    {
        self.lightList = [];

        for ( var light in allLights )
        {
            self.lightList.push( light );
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
hueModule.send = function( _url, _cb, method, data )
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

    var options = {
        host    : this.config.hue.baseUrl,
        port    : 80,
        path    : _url,
        method  : method
    };

    var req = http.request( options, callback );

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
hueModule.command = function( res, response )
{
    var data = {};

    if ( res.on )
    {
        data.on = ( res.on === 'true' ) ? true : false;
    }
    if ( res.sat || res.sat === '0' )
    {
        data.sat = parseFloat( res.sat );
    }
    if ( res.bri || res.bri === '0' )
    {
        data.bri = parseFloat( res.bri );
    }
    if ( res.hue || res.hue === '0' )
    {
        data.hue = parseFloat( res.hue );
    }
    if ( res.alert === 'alert' || res.alert === 'once' ||
        res.alert === 'none' )
    {
        switch( res.alert )
        {
            case 'alert':
                res.alert = 'select';
                break;
            case 'once':
                res.alert = 'select';
                break;
        }
        data.alert = res.alert;   
    }
    if ( res.effect )
    {
        data.effect = res.effect;   
    }
    if ( res.transitiontime || res.transitiontime === '0' )
    {
        data.transitiontime = parseFloat( res.transitiontime ) / 100;   
    }

    if ( data.on || data.on === false || data.off || data.off === false || data.sat || data.bri || 
        data.hue || data.alert || data.effect || data.transitiontime )
    {
        if ( res.light )
        {
            data.light  = res.light;

            this.send( '/api/' + this.config.hue.developer + '/lights/' + res.light + '/state', function()
            {
                data.result     = 'success';
                response.writeHead( 200, { "Content-Type": "text/html" } );
                response.write( JSON.stringify( data ) );
                response.end();

            }, 'PUT', data ); 
        }
        else
        {
            var self = this;

            this.send( '/api/' + this.config.hue.developer + '/groups/0/action', function( res )
            {
                var lightList = '';
                for ( var light in self.lightList )
                {
                    lightList += ',' + light;
                }

                data.light      = lightList.slice( 1 );
                data.result     = 'success';

                response.writeHead( 200, { "Content-Type": "text/html" } );
                response.write( JSON.stringify( data ) );
                response.end();
            }, 'PUT', data ); 
        }
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


module.exports = hueModule;

