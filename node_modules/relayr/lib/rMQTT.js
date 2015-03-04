var events = require("events");
var mqtt = require("mqtt");
var util = require("util");
var certificates = require("./certificate");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'relayr.mqtt'});

var queue = {
    q: [],
    done: false,

    push : function (topic) {
        if (this.q.indexOf(topic === -1)) {
            this.q.push(topic);
        }
    },
    each : function(fn) {
        if (!this.q.length) return;
        do {
            fn(this.q.pop());
        } while (this.q.length);
        
    }
}

function rMQTT(){
    this.client = undefined;
    this.queue = queue;
    events.EventEmitter.call(this);
    log.info("rMQTT created");
}
util.inherits(rMQTT, events.EventEmitter);


rMQTT.prototype.subscribe = function(topic) {

    log.info("subscribing to %s", topic);
    this.client.subscribe(topic, function (err, granted) {
        if (err) {
            log.err(err, "unable to subscribe to %s", topic);
        }
        log.info("subscribed to %s", topic);
    });
}

rMQTT.prototype.connect = function(channelInfo) {
    var self = this;
    var creds = channelInfo.credentials;

    if (!this.client) {
        log.info("creating client");
        this.client = mqtt.connect({
            servers:[{'host':'mqtt.relayr.io','port':8883}],
            username: creds.user,
            password: creds.password,
            clientId: creds.clientId,
            protocol : 'mqtts',
            certPath: certificates.CERT,
            rejectUnauthorized : false, 
        });
        this.queue.push(creds.topic);
    } else {
        log.info("client already created");
        if (!this.queue.done) {
            this.queue.push(creds.topic);
        } else {
            this.subscribe(creds.topic); 
        }
    }

    this.client.on('connect', function () {
        log.info('connected', arguments);
        self.emit('connect');

        self.queue.each(function (topic) {
            self.subscribe(topic);
        });

        self.queue.done = true;
    });

    this.client.on('error', function (error) {
        log.error(error, "connection error");
    });

    this.client.on('message', function(topic, message, packet) {
        var err;
        try {
            message = JSON.parse(new Buffer(message).toString("ascii"));
            self.emit('data', topic, message);
        } catch (ex) {
            log.error(ex, "connection error");
        }
    })

};

module.exports = rMQTT;
