/*
 * run with bunyan to et sensible logging:
 * node examples/simpleOutput.js | bunyan -o short
 */
var Relayr = require("../");

var app_id = "0e5b71a9-ad78-4e24-9ec1-8b3de04ff710";
var token =  "BwwORoJcI9iKDN9NEHs1hXYOeCV3cEoS";
var snd =  "4a8bf823-ac9d-48dd-b917-d0c3755e68c6";
var oven = "8736887d-7661-4501-a4a6-c8a42ce461ba";

var relayr = new Relayr(app_id);

relayr.connect(token, snd);

function respond(err, data) {
    console.log(err || data);
}

var lastval = 2;
var lock = false;

function blink() {
    if (lock) return;
    console.log("BLINK");
    lastval = (lastval===2) ? 3 : 2;
    relayr.command(token, oven, {path:"power_unit", command:"power", value:lastval}, respond);
    lock = true;
    setTimeout(function () {lock=false}, 6000);
}

relayr.on('connect', function () {
});
relayr.on('data', function (topic, msg) {
    var level = msg.readings[0].value;
    console.log(level);
    if (level > 1000) {
        blink();
    }
});


