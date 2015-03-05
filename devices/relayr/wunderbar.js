
var Relayr = require( 'relayr' );


/**
 * Es ist wunderbar, oder?  but seriously..  main building block of the wunderbar object
 * 
 * @type {Object}
 */
var wunderbar = {

    /*
     * the sensor data. elevated for accessibility
     */
    sensors : {},


    /**
     * initializes the wunderbar sensors
     * 
     * @param  {obj}                config              main config
     * 
     * @return {void}
     */
    ini : function( config, data )
    {
        this.config = config;
        this.data   = data;

        var wunderbar   = this.config.wunderbar;

        var sensors = [ 'light', 'temp', 'gyro', 'sound', 'ir', 'grove' ];

        for ( var i = 0, lenI = sensors.length; i < lenI; i++ ) 
        {
            this.send( '/devices/' + wunderbar[ sensors[ i ] + '_id' ], function( res )
            { 
                if ( res.id ) 
                {
                    console.log( 'wunderbar ' + sensors[ i ] + ' sensor connected.' );
                }
            } );
        }


        for ( var j = 0, lenJ = sensors.length; j < lenJ; j++ ) 
        {
            this.processElements( sensors[ j ] );
        }
    },


    /**
     * processes sensors data
     * 
     * @param  {str}                element             light, temp, or wind
     * 
     * @return {void}
     */
    processElements : function( element )
    {
        var self = this;

        var wunderbar = this.config.wunderbar;

        this.data[ element ] = new Relayr( wunderbar.app_id );

        var _el = this.data[ element ]

        _el.connect( wunderbar.token, wunderbar[ element + '_id' ] );

        _el.on( 'data', function ( topic, msg ) 
        {
            for ( var i = 0, lenI = msg.readings.length; i < lenI; i++ ) 
            {
                if ( msg.readings[ i ].meaning === 'angularSpeed' )
                {
                    var as                      = msg.readings[ i ].value;
                    self.sensors.gyro           = Math.floor( Math.abs( as.x ) + Math.abs( as.y ) + Math.abs( as.z ) );
                }
                else if ( msg.readings[ i ].meaning === 'luminosity' )
                {
                    self.sensors.brightness     = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'temperature' )
                {
                    self.sensors.temperature    = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'humidity' )
                {
                    self.sensors.humidity       = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'color' )
                {
                    self.sensors.color          = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'noiseLevel' )
                {
                    self.sensors.noiseLevel     = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'acceleration' )
                {
                    self.sensors.acceleration   = msg.readings[ i ].value;
                }
                else if ( msg.readings[ i ].meaning === 'proximity' )
                {
                    self.sensors.proximity     = msg.readings[ i ].value;
                }
            }
        } );
    },


    /**
     * handles all the commands passed to wunderbar sensors
     * 
     * @param  {obj}                res                 result
     * @param  {obj}                response            http response
     * 
     * @return {void}
     */
    command : function( res, response )
    {
        var data = {};

        if ( res.sensors )
        {
            data.sensors = this.sensors;
        } 

        if ( data.value || data.value === 0 || data.value === false || data.sensors )
        {   
            this.send( '/devices/' + this.id + '/cmd', function( res )
            {
                data.result     = 'success';
                response.writeHead( 200, { "Content-Type": "text/html" } );
                response.write( JSON.stringify( data ) );
                response.end();

            }, 'POST', data ); 
        }
        else
        {
            data.result     = 'error';
            data.error      = 'not enough parameters';
            response.writeHead( 200, { "Content-Type": "text/html" } );
            response.write( JSON.stringify( data ) );
            response.end();
        }
    }
};

module.exports = wunderbar;
