var Relayr = require("../");

var app_id = "0e5b71a9-ad78-4e24-9ec1-8b3de04ff710";
var dev_id = "8736887d-7661-4501-a4a6-c8a42ce461ba";
var token  = "BwwORoJcI9iKDN9NEHs1hXYOeCV3cEoS";
var relayr = new Relayr(app_id);

relayr.deviceModel(token, dev_id, function (err, description) {
    console.log("-------------- BSH --------------------");
    console.log(description);
    console.log("----------------------------------------------------------");
});

relayr.connect(token, dev_id);

relayr.on("data", function (topic, msg) {
    console.log(msg);
});

relayr.on("connect", function () {
 console.log("connected");
});

