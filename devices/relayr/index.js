var https                       = require( 'https' );

var relayrModule                = {};

/**
 * checks connectivity on the appliances
 *
 * @return {void}
 */
relayrModule.ini = function( config )
{
    this.config             = config;

    var modules = this.config.relayr.modules;

    for ( var mod in modules )
    {
        if ( modules[ mod ] )
        {
            this[ mod ]        = require( './' + mod );
            this[ mod ].send   = this.send;
            this[ mod ].ini( config );    
        }
    }
};


/**
 * send
 *
 * gets and parses JSON from api sources
 *
 * @param  {str}                    _url                target url
 * @param  {func}                   _cb                 callback
 * @param  {bool}                   secure              https?
 *
 * @return {void}
 */
relayrModule.send = function( _url, _cb, method, data )
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
                if ( body )
                {
                    data = JSON.parse( body );
                }
                else
                {
                    data = {};
                }
                _cb( data );
            }
            catch( e )
            {
                console.log( e );
                console.log( _url + ' appears to be down' );
            }
        });
    };

    var options = {
        host    : this.config.relayr.baseUrl,
        port    : 443,
        path    : _url,
        method  : method,
        headers : { 
            'Authorization' : 'bearer ' + this.config.relayrToken,
            'Content-Type'  : 'application/json'
        }
    };

    var req = https.request( options, callback );

    if ( method === 'POST' )
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
relayrModule.command = function( res )
{
    console.log( 'wooo! ' + res );
};


module.exports = relayrModule;

