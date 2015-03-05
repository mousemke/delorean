var fs              = require( 'fs' );
var http            = require( 'http' );
var url             = require( 'url' );
var qs              = require( 'querystring' );
var sockets         = {};
var nextSocketId    = 0;

/**
 * private and configurable variables
 * @type {obj}
 */
var config = require( './config/' );

/**
 * referencable dynamic delorean
 */
var self;


/**
 * delorean main building block.  will always return a new delorean
 */
function Delorean()
{
    /**
     * always return a new Delorean
     */
    if ( !( this instanceof Delorean ) )
    {
        return new Delorean( options );
    }


    /**
     * /config/index.js 
     * 
     * @type {obj}
     */
    this.config = config;

    /**
     * active data
     * 
     * @type {obj}
     */
    this.data   = {};


    /**
     *  Delorean init
     **/
    this.ini();
}


/**
 * starts the server and initializes the modules
 * 
 * @return {void}
 */
Delorean.prototype.ini = function()
{
    self = this;
    this.server.listen( this.config.serverPort );
    this.watchSockets();
    console.log( 'Server is started on port ' + ( this.config.serverPort ) );

    var modules = this.config.modules;

    for ( var mod in modules )
    {
        if ( modules[ mod ] === true )
        {
            Delorean.prototype[ mod ] = require( './devices/' + mod + '/index' ); 
            this[ mod ].ini( config, this.data );   
        }
    }
};


/**
 * http server
 */
Delorean.prototype.server = http.createServer( function( request, response )
{
    if ( request.method === 'GET' )
    {
        self.recieveCommands( response, request );
    }
} );


/**
 * watches and closes web sockets
 *
 * @return {void}
 */
Delorean.prototype.watchSockets = function()
{
    this.server.on( 'connection', function( socket )
    {
      var socketId          = nextSocketId++;
      sockets[ socketId ]   = socket;

      console.log( 'socket ' + socketId + ' opened' );

      socket.once( 'close', function ()
      {
        console.log( 'socket ' + socketId + ' closed' );
        delete sockets[ socketId ];
      });

      socket.setTimeout( 4000 );
    });
};


/**
 * sets the response with the event data for the recieved page
 *
 * @param  {obj}                    response            http response object
 * @param  {obj}                    request             http request object
 *
 * @return {void}
 */
Delorean.prototype.recieveCommands = function( response, request )
{
    var variables   = url.parse( request.url, true ).query;
    var pathname    = url.parse( request.url ).pathname;
    
    if ( variables.t )
    {
        if ( this[ variables.t ] )
        {
            try
            {
                this[ variables.t ].command( variables, response, this.data );
            }
            catch( e )
            {
                console.log( 'nope' );
                response.writeHead( 200, { "Content-Type": "text/html" } );
                response.write( '{"result":"error","error":"something went wrong"}' );
                response.end();
            }
        }
        else if ( this.relayr[ variables.t ] ) 
        {
            this.relayr[ variables.t ].command( variables, response, this.data );
        }
        else
        {
            response.writeHead( 200, { "Content-Type": "text/html" } );
            response.write( '{"result":"error","error":"invalid target"}' );
            response.end();
        };
    }
    else
    {
        response.writeHead( 200, { "Content-Type": "text/html" } );
        response.write( '{"result":"error","error":"invalid target"}' );
        response.end();
    }
};


var delorean = new Delorean();

