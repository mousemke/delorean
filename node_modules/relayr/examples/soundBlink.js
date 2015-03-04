/*
 * run with bunyan to et sensible logging:
 * node examples/simpleOutput.js | bunyan -o short
 */
var Relayr = require("../");

var app_id = "0e5b71a9-ad78-4e24-9ec1-8b3de04ff710";
var token =  "BwwORoJcI9iKDN9NEHs1hXYOeCV3cEoS";
var snd =  "4a8bf823-ac9d-48dd-b917-d0c3755e68c6";

var relayr = new Relayr(app_id);

relayr.connect(token, snd);

function respond(err, data) {
    console.log(err || data);
}
function blink() {
    console.log("BLINK");
    relayr.command(token, snd, {path:"led", command:"cmd", value:1}, respond);
    setTimeout(function () {
        relayr.command(token, snd, {path:"led", command:"cmd", value:0}, respond)
    }, 1000);
}

relayr.on('connect', function () {
});
relayr.on('data', function (topic, msg) {
    var level = msg.readings[0].value;
    console.log(level);
    if (level > 100) {
        blink();
    }
});


