var request = require("request");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'relayr.api'});
var api = module.exports = {};

var base = "https://api.relayr.io";

var respond200 = function (err, data, body, callback){
    respond(200, err, data, body, callback);
}
var respond = function (expected, err, data, body, callback){
    var parsed;
    if (data.statusCode != expected) {
        err = {
            statusCode: data.statusCode,
            message: JSON.parse(body)
        }
    } else {
         parsed = JSON.parse(body);
    }
    callback(err,parsed);
}


api.devices = function(user, token, callback) {

	var options = addHeaders({
        uri: base + "/users/"+user+"/devices",
    }, token);
    
	request.get(options,function(err,data, body){
        respond200(err, data, body, callback);
	});
}


api.deviceModel = function(token, dev_id, callback) {

	var options = addHeaders({
        uri: base + "/device-models/"+dev_id,
    }, token);
    
	request.get(options,function(err,data, body){
        respond200(err, data, body, callback);
	});
}
api.device = function(token, dev_id, callback) {

	var options = addHeaders({
        uri: base + "/devices/"+dev_id,
    }, token);
    
	request.get(options,function(err,data, body){
        respond200(err, data, body, callback);
	});
}

api.user = function(token, callback) {
	var options = addHeaders({
        uri: base + "/oauth2/user-info"
    }, token);
    
	request.get(options,function(err,data, body){
        respond200(err, data, body, callback);
	});
}

api.channels = function(token, dev_id, callback) {
	var options = addHeaders({
		url: base + "/devices/" + dev_id + "/channels",
	});
	request.get(options,function(err,data, body){
        respond200(err, data, body, callback);
	});

}


api.deleteChannel = function(token, channel_id, callback) {
	var options = addHeaders({
		url: base + "/channels/" + channel_id,
	}, token);
	request.del(options,function(err,data){
		callback(err,data);
	});

}

api.createChannel = function(token, dev_id, callback) {
	var options = addHeaders({
		url: base + "/channels",
        json: true,
        body : {
            "deviceId":dev_id,
            "transport": "mqtt"
        }
	}, token);

	request.post(options,function(err,data, body){
        if (data.statusCode != 201){
            err = {
                "statusCode": data.statusCode,
                "message":body
            }
            callback(err,body);
        } else {
            callback(err,body);
        
        }
	});

}

api.command = function(token, device, command, callback) {
    log.info("sending command", command);
	var options = addHeaders({
        uri: base + "/devices/"+device+"/cmd/",
        json: true,
        body : command
    }, token);
    
	request.post(options,function(err,data){
		callback(err, data.statusCode);
	});

}

function addHeaders(options, token) {
	options.headers  = {'Authorization': 'Bearer ' + token}
    return options;
}
