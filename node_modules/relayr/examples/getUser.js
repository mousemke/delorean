/*
 * run with bunyan to et sensible logging:
 * node examples/getUser.js | bunyan -o short
 */
var Relayr = require("../");
var relayr = new Relayr();

var token = "BwwORoJcI9iKDN9NEHs1hXYOeCV3cEoS";


relayr.user(token, function (err, user) {
    console.log(err);

    
    relayr.devices(user.id, token, function (err, devices) {

        console.log(devices.length);
        devices.forEach(function (device) {
            if (device.model.id === "ecf6cf94-cb07-43ac-a85e-dccf26b48c86") {
                console.log(device);
                relayr.connect(token, device.id);
            }
        });
        
    } );
});

relayr.on('connect', function () {
    console.log('connect');
})
relayr.on('data', function (topic, msg) {
    console.log("TOPIC:"+topic);
    console.log(msg);
});

