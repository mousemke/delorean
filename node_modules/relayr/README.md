# node-relayr

Relayr sensor SDK for node.

Works by connecting to the MQTT channel associated with your Relayr connected
device.

## Status
This is still not much more thatn a utiity script, but will grow to expose a
lot more useful functionality.

## installation

```
npm install relayr
```

## connecting

Require the module

```js
var Relayr = require('relayr');
```

Get the following from your account at relayr.io

```js
var app_id = "YOURAPPID";
var dev_id = "YOURDEVICEID";
var token  = "YOURSENSORTOKEN";
```
Initialise the libary

```js
var relayr = new Relayr(app_id);
```

Connect using the keys:
```js
relayr.connect(token, dev_id);
```

Listen and do stuff
```js
relayr.on('data', function (topic, msg) {
        console.log(topic + ":" + msg);
}
```

Send a Command
```js
relayr.command(token, dev_id, 
    {
        path:"led", 
        command:"led", 
        value:true
    }, 
    function (err,code) {
        console.log(err||code)
    });
```

get Info about the registered user
```js
relayr.user(token, function (err, user) {
    console.log(err || user);
}
```

get Info about the users devices
```js
relayr.devices(user_id, token, function (err, devices) {
    console.log(err || devices);
}
```

get Info about the an individual device
```js
relayr.deviceModel(token, dev_id, function (err, model) {
    console.log(err || model);
}
```

## Credits
Big thanks to BinaryMax for putting in the ground work

## License
MIT License
