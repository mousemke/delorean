var fs = require("fs");
var http = require("http");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'relayr.certificates'});

var CERT = __dirname + '/relayr.crt';

var certificates = module.exports = {};
certificates.CERT = CERT;

certificates.check = function (callback) {
    fs.exists(CERT, function(exists){
    
        if (!exists) {

            log.info("token missing");

            var file = fs.createWriteStream(CERT);
            var request = http.get("http://mqtt.relayr.io/relayr.crt", function(response) {
              response.pipe(file);
              log.info("retreiving token");
              response.on('close', function () {
                log.info("token retrieved");
                callback();
              });
            });
        } else {
            callback();
        }
    });
};
