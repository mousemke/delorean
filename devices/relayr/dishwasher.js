// dishwasher settings
var dishwasher = {


    /**
     * initializes the connection to the dishwasher
     * 
     * @param  {obj}             config              delorean config
     * 
     * @return {void}
     */
    ini : function( config )
    {
        this.config             = config;

        this.send( '/devices/' + config.dishwasher.id, function( res )
        { 
            if ( res.id ) 
            {
                console.log( 'Dishwasher connected.' );
            }
        } );
    },


    /**
     * processes all outside commands
     * 
     * @param  {obj}                res                 results
     * @param  {obj}                response            response
     * 
     * @return {void}
     */
    command : function( res, response )
    {
        var data = {};

        if ( res.locked )
        {
            data.locked = this.commands.locked;
            data.value = ( res.locked === 'true' ) ? 1 : 0;
        }
        if ( res.brilliance_dry )
        {
            datas.brilliance_dry = this.commands.brilliance_dry;
            data.value = ( res.brilliance_dry === 'on' ) ? 1 : 0;
        }
        if ( res.hygiene_plus )
        {
            data.hygiene_plus = this.commands.hygiene_plus;
            data.value = ( res.hygiene_plus === 'on' ) ? 1 : 0;
        }
        if ( res.eco_as_default )
        {
            data.eco_as_default = this.commands.eco_as_default;
            data.value = ( res.eco_as_default === 'true' ) ? 1 : 0;
        }
        if ( res.intensiv_zone )
        {
            data.intensiv_zone = this.commands.intensiv_zone;
            data.value = ( res.intensiv_zone === 'on' ) ? 1 : 0;
        }
        if ( res.lights )
        {
            data.luminosity = this.commands.luminosity;
            data.value = ( res.lights === 'on' ) ? 1 : 0;
        }
        if ( res.energy_management )
        {
            data.energy_management = this.commands.energy_management;
            data.value = res.energy_management;
        }
        if ( res.rinse_aid )
        {
            data.rinse_aid = this.commands.rinse_aid;
            data.value = res.rinse_aid;
        }
        if ( res.turbidity )
        {
            data.turbidity = this.commands.turbidity;
            data.value = res.turbidity;
        }


        if ( data.value || data.value === 0 || data.value === false ||
            data.locked || data.hygiene_plus || data.eco_as_default ||
            data.intensiv_zone || data.luminosity || data.energy_management ||
            data.rinse_aid || data.turbidity )
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

    commands : { 
        energy_management :{ 
            command : 'energy_management',
            path    : 'power_unit',
            info    : {
                unit    : 'integer',
                maximum : 2,
                minimum : 1 
            }
        },
        locked      : { 
            command : 'locked',
            path    : 'door',
            info    : {
                unit    : 'boolean',
                maximum : 1,
                minimum : 0 
            }
        },
        luminosity  : { 
            command : 'luminosity', 
            path    : 'interior', 
            info    : {
                unit    : 'boolean' 
            }
        },
        rinse_aid   : { 
            command : 'rinse_aid',
            path    : 'consumables',
            info    : {
                unit    : 'integer',
                maximum : 6,
                minimum : 0 
            }
        },
        turbidity   : { 
            command : 'turbidity',
            path    : 'drainage',
            info    : {
                unit    : 'integer',
                maximum : 2,
                minimum : 0 
            }
        },
        brilliance_dry : { 
            command : 'brilliance_dry',
            path    : 'programme',
            info    : {
                unit    : 'boolean',
                maximum : 1,
                minimum : 0 
            }
        },
        hygiene_plus : { 
            command : 'hygiene_plus',
            path    : 'programme',
            info    : {
                unit    : 'boolean',
                maximum : 1,
                minimum : 0 
            }
        },
        eco_as_default : { 
            command : 'eco_as_default',
            path    : 'programme',
            info    : {
                unit    : 'integer',
                maximum : 1,
                minimum : 0 
            }
        },
        intensiv_zone : { 
            command : 'intensiv_zone', 
            path    : 'programme', 
            info    : {
                unit    : 'boolean' 
            }
        } 
    },


/**
 * THESE OPTIONS ARE NOT APPLICABLE YET
 */
    // readings : [ 
    //     { 
    //         meaning : 'phase',
    //         unit    : 'integer',
    //         maximum : 4,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'intensiv_zone', 
    //         unit    : 'boolean', 
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'eco_as_default',
    //         unit    : 'integer',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'operation_state',
    //         unit    : 'integer',
    //         maximum : 8,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'hygiene_plus',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'brilliance_dry',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'auto_power_off',
    //         unit    : 'integer',
    //         maximum : 2,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'finished',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'paused',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'sabbath',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'aborted',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'programme' 
    //     },
    //     { 
    //         meaning : 'turbidity',
    //         unit    : 'integer',
    //         maximum : 2,
    //         minimum : 0,
    //         path    : 'drainage' 
    //     },
    //     { 
    //         meaning : 'drain_blockage',
    //         unit    : 'integer',
    //         maximum : 2,
    //         minimum : 0,
    //         path    : 'drainage' 
    //     },
    //     { 
    //         meaning : 'check_filter',
    //         unit    : 'integer',
    //         maximum : 3,
    //         minimum : 0,
    //         path    : 'drainage' 
    //     },
    //     { 
    //         meaning : 'rinse_aid_lack',
    //         unit    : 'integer',
    //         maximum : 2,
    //         minimum : 0,
    //         path    : 'consumables' 
    //     },
    //     { 
    //         meaning : 'rinse_aid',
    //         unit    : 'integer',
    //         maximum : 6,
    //         minimum : 0,
    //         path    : 'consumables' 
    //     },
    //     { 
    //         meaning : 'display', 
    //         unit    : 'boolean', 
    //         path    : 'display' 
    //     },
    //     { 
    //         meaning : 'clockness',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'display' 
    //     },
    //     { 
    //         meaning : 'luminosity', 
    //         unit    : 'boolean', 
    //         path    : 'interior' 
    //     },
    //     { 
    //         meaning : 'interior_light',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'interior' 
    //     },
    //     { 
    //         meaning : 'alarm', 
    //         unit    : 'dateTime', 
    //         path    : 'clock' 
    //     },
    //     { 
    //         meaning : 'time', 
    //         unit    : 'dateTime', 
    //         path    : 'clock' 
    //     },
    //     { 
    //         meaning : 'locked',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'door' 
    //     },
    //     { 
    //         meaning : 'open',
    //         unit    : 'boolean',
    //         maximum : 1,
    //         minimum : 0,
    //         path    : 'door' 
    //     },
    //     { 
    //         meaning : 'energy_management',
    //         unit    : 'integer',
    //         maximum : 2,
    //         minimum : 1,
    //         path    : 'power_unit' 
    //     },
    //     { 
    //         meaning : 'power',
    //         unit    : 'boolean',
    //         maximum : 2,
    //         minimum : 1,
    //         path    : 'power_unit' 
    //     } 
    // ]
};

module.exports = dishwasher;
