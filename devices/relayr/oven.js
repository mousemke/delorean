// oven settings
var oven = {
    

    /**
     * double checks oven connectivity
     * 
     * @param  {obj}                config              main config file
     * 
     * @return {void}
     */
    ini : function( config, data )
    {
        this.config = config;
        this.data   = data;

        this.send( '/devices/' + config.oven.id, function( res )
        { 
            if ( res.id ) 
            {
                console.log( 'Oven connected.' );
            }
        } );
    },


    /**
     * main command processor.  Think cobra commander.  but also cooks food
     *  
     * @param  {obj}                res                 result
     * @param  {obj}                response            http response
     * 
     * @return {void}
     */
    command : function( res, response )
    {
        var data = {};

        if ( res.on )
        {
            data     = this.commands.power;
            switch ( res.on )
            {
                case 'true':
                    data.value = 2;
                    break;
                case 'false':
                    data.value = 3;
                    break;
            }
        }
        if ( res.off )
        {
            data     = this.commands.power;
            switch ( res.off )
            {
                case 'true':
                    data.value = 3;
                    break;
                case 'false':
                    data.value = 2;
                    break;
            }
        }
        if ( res.lock )
        {
            data = this.commands.locked;
            data.value = ( res.lock === 'true' ) ? 1 : 0;
        }
        if ( res.lights )
        {
            data = this.commands.lights;
            data.value = ( res.lights === 'true' ) ? 1 : 0;
        }
        if ( res.brightness )
        {
            data = this.commands.brightness;
            data.value = parseInt( res.brightness );
        }

        if ( data.value || data.value === 0 || data.value === false )
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
    },


    /**
     * these commands work.  yay!
     * 
     * @type {obj}
     */
    commands : {
        power:      { 
            command : 'power',
            path    : 'power_unit',
            info    : {
                unit    : 'integer',
                maximum : 3,
                minimum : 1 
            }
        },
        locked:     { 
            command : 'locked',
            path    : 'door',
            info    : {
                unit    : 'boolean',
                maximum : 1,
                minimum : 0 
            }
        },
        brightness: { 
            command : 'brightness', 
            path    : 'display', 
            info: {
                maximum : 4, 
                minimum : 1 
            }
        }

    /**
     * these dont work.  maybe someday....
     */
    
        // lights: { 
        //     command : 'luminosity',
        //     path    : 'cavity',
        //     info:    {           
        //         unit    : 'boolean',
        //         maximum : 1,
        //         minimum : 0 
        //     }
        // },
        // { 
        //     command : 'selected', 
        //     path    : 'programme' 
        // },
        // { 
        //     command : 'aborted',
        //     path    : 'programme',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0 
        // },
        // { 
        //     command : 'paused',
        //     path    : 'programme',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0 
        // },
        // { 
        //     command : 'time', 
        //     path    : 'clock', 
        //     unit    : 'dateTime' 
        // },
        // { 
        //     command : 'alarm', 
        //     path    : 'clock', 
        //     unit    : 'dateTime' 
        // },
        // { 
        //     command : 'sound_level', 
        //     path    : 'sound', 
        //     maximum : 4, 
        //     minimum : 0 
        // },
        // { 
        //     command : 'tone',
        //     path    : 'sound',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0 
        // },
        // { 
        //     command : 'signal_duration',
        //     path    : 'sound',
        //     maximum : 2,
        //     minimum : 0 
        // },
        // { 
        //     command : 'clockness',
        //     path    : 'display',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0 
        // },
        // { 
        //     command : 'hardness',
        //     path    : 'water_tank',
        //     maximum : 4,
        //     minimum : 0 
        // },

        // { 
        //     command : 'sabbath',
        //     path    : 'programme',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0 
        // },
        // { 
        //     command : 'wattage', 
        //     path    : 'microwave' 
        // },
    
    
    // readings : { 
    //     finished: {
    //         meaning : 'finished',
    //         path    : 'programme', 
    //         info    : {
    //             maximum : 1,
    //             minimum : 0,
    //             unit    : 'boolean'
    //         }
    //     },
    //     paused: { 
    //         meaning : 'paused',
    //         path    : 'programme',
    //         info    : {
    //             maximum : 1,
    //             minimum : 0,
    //             unit    : 'boolean'
    //         }
    //     },
    //     stopped: { 
    //         meaning : 'aborted',
    //         path    : 'programme', 
    //         info    : { 
    //             maximum : 1,
    //             minimum : 0,
    //             unit    : 'boolean'
    //         }
    //     },
    //     lightsOn: { 
    //         meaning : 'luminosity',
    //         path    : 'cavity', 
    //         info    : {
    //             maximum : 1,
    //             minimum : 0,
    //             unit    : 'boolean'
    //         }
    //     },
    //     temp: { 
    //         meaning : 'temperature', 
    //         path    : 'cavity',
    //         info    : {
    //             unit    : 'celsius'
    //         }
    //     },
    //     locked: { 
    //         meaning : 'locked',
    //         path    : 'door',
    //         info    : {
    //             unit    : 'boolean',
    //             maximum : 1,
    //             minimum : 0
    //         }
    //     },
    //     doorOpen: { 
    //         meaning : 'open',
    //         path    : 'door',
    //         info    : {
    //             maximum : 1,
    //             minimum : 0,
    //             unit    : 'boolean'
    //         }
    //     },
    //     power: { 
    //         meaning : 'power',
    //         path    : 'power_unit',
    //         info    : {
    //             unit    : 'integer',
    //             maximum : 3,
    //             minimum : 1
    //         }
    //     },
        // { 
        //     meaning : 'sabbath',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'programme' 
        // },
        // { 
        //     meaning : 'plugged',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'water_tank' 
        // },
        // { 
        //     meaning : 'emptiness',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'water_tank' 
        // },
        // { 
        //     meaning : 'clockness',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'display' 
        // },  
        // { 
        //     meaning : 'plugged',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'meat_probe' 
        // },
        // { 
        //     meaning : 'temperature', 
        //     unit    : 'celsius', 
        //     path    : 'meat_probe' 
        // },
        // { 
        //     meaning : 'tone',
        //     unit    : 'boolean',
        //     maximum : 1,
        //     minimum : 0,
        //     path    : 'sound' 
        // },
        // { 
        //     meaning : 'alarm', 
        //     unit    : 'dateTime', 
        //     path    : 'clock' 
        // },
        // { 
        //     meaning : 'time', 
        //     unit    : 'dateTime', 
        //     path    : 'clock' 
        // }
    // }
    }
};

// {"path":"raw","command":565,"value":{"enum":[{"program":8208,"options":[{"uid":548,"value":300},{"uid":551,"value":300},{"uid":5123,"value":false},{"uid":5120,"value":60},{"uid":5125,"value":0}]}]}}

module.exports = oven;