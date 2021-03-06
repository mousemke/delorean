var config = {

    path: '/',

    serverPort: 666,

    masterPoll  : 30,

    modules : {

        hue     : true,
        relayr  : true,
        tado    : true,
        weather : true
        nest    : false,
        twilo   : false,
    },

    weather : {
        baseUrl     : 'api.openweathermap.org',
        latitude    : '51',
        longitude   : '11',
        pollTime    : 30 // in seconds
    },

    nest : {
        username    : 'nest username',
        password    : 'nest password',
        pollTime    : 30 // in seconds
    },

    tado : {
        baseUrl     : 'https://my.tado.com/mobile/1.4',
        username    : 'tado email address',
        password    : 'tado password',
        pollTime    : 30 // in seconds
    },

    twilo : {
        sid         : 'twilo sid',
        token       : 'twilo api token',
    },

    hue : {
        baseUrl     : '192.168.0.105',
        developer   : 'newdeveloper',
        pollTime    : 30 // in seconds
    },

    relayr : {
        baseUrl     : 'api.relayr.io',
        modules     : {
            wunderbar   : true,
            oven        : false,
            dishwasher  : false
        }
    },

    wunderbar : {
        app_id      : 'unique device data',
        token       : 'unique device data',

        light_id    : 'unique device data',
        temp_id     : 'unique device data',
        gyro_id     : 'unique device data',
        sound_id    : 'unique device data',
        ir_id       : 'unique device data',
        grove_id    : 'unique device data'
    },

    // SUPPORT STOPPED 4.3.2015
    // oven : {
    //     id       : 'unique oven id',
    //     pollTime : 30 // in seconds
    // },

    // SUPPORT STOPPED 4.3.2015
    // dishwasher : {
        // id          : 'unique dishwasher id',
        // pollTime    : 30 // in seconds
    // }
};

module.exports = config;