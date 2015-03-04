/*
 * run with bunyan to et sensible logging:
 * node examples/simpleOutput.js | bunyan -o short
 */
var Relayr = require("../");

var app_id = "0e5b71a9-ad78-4e24-9ec1-8b3de04ff710";
var token =  "BwwORoJcI9iKDN9NEHs1hXYOeCV3cEoS";
var htu =  "6fbb27dd-ac8f-4d1f-bd82-8d37405d8cfb";
var snd =  "a0dde2dc-bce6-4df3-8f6c-2b773ce6fb90";
var lcp =  "a2242103-c522-4b6f-a533-7740db2cb891";
relayr = new Relayr(app_id);

relayr.deviceModel(token, htu, function (err, description) {
    console.log("-------------- Temperature & Humidity --------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});
relayr.deviceModel(token, snd, function (err, description) {
    console.log("-------------- Sound Level -------------------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});
relayr.deviceModel(token, lcp, function (err, description) {
    console.log("-------------- Light, Color & Proximity ------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});

relayr.connect(token, htu);
relayr.connect(token, snd);
relayr.connect(token, lcp);

relayr.on('connect', function () {
});
relayr.on('data', function (topic, msg) {
    console.log("TOPIC:"+topic);
    console.log(msg);
});

