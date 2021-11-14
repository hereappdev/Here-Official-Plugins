const _ = require("underscore");
const http = require("http");
const pref = require("pref");
const net = require("net");
const mt = require("moment.min.js");

function updateData() {
    var location = "newyork";
    var temperature = "℃";
    var temperatureCode = "uk";

    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    const json = pref.all();

    if (json == undefined) {
        console.log("No prefs found.");
    }

    if (json["location"] != undefined) {
        location = json["location"];
    }

    // console.log(json["temperature"])

    if (json["temperature"] != undefined) {
        if (json["temperature"]["index"] == 0) {
            temperature = "℃";
            temperatureCode = "uk";
        } else {
            temperature = "℉";
            temperatureCode = "us";
        }
    }

    // console.log("https://weather.herecdn.com/" + encodeURI(location) + "?unitGroup=" + temperatureCode + "&include=fcst%2Ccurrent&iconSet=icons2")
    http.get("https://weather.herecdn.com/" + encodeURI(location) + "?unitGroup=" + temperatureCode + "&include=fcst%2Ccurrent&iconSet=icons2")
        .then((response) => {
            const json = response.data;

            // console.log(json["forecasts"][0])

            if (json == undefined) {
                console.error("JSON result undefined");
                return;
            }
            const weatherCity = json["resolvedAddress"].split(",")[0];
            const weatherToday = json["days"][0]["datetime"];
            const weatherLow = json["days"][0]["tempmin"];
            const weatherHigh = json["days"][0]["tempmax"];
            const weatherText = json["currentConditions"]["conditions"].split(",")[0];
            const weatherTemperature = json["currentConditions"]["temp"] + temperature;

            const weatherForecasts = json["days"];
            const keys = _.allKeys(weatherForecasts);

            let popovers = _.map(keys, (key) => {

                let value = weatherForecasts[key];
                // console.log(value["conditions"])
                return {
                        title: moment(value["datetimeEpoch"] * 1000).format("MMM DD, dddd") + " " + (key == 0 ? "(Today)" : ""),
                        accessory: {
                            imageURL: "images/" + value["icon"] + ".png",
                            imageCornerRadius: 4,
                        },
                    };
            });

            // console.log(JSON.stringify(popovers))

            // Menu Bar
            here.menuBar.data = {
                title: weatherText,
                detail: weatherTemperature,
            };
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: weatherCity,
                detail:
                    "↑" +
                    weatherHigh +
                    temperature +
                    " · ↓" +
                    weatherLow +
                    temperature +
                    " (" +
                    moment(weatherToday).format("dddd") +
                    ")",
                accessory: {
                    title: weatherText,
                    detail: weatherTemperature,
                },
            };
            here.miniWindow.onClick(function () {
                updateData();
            });
            here.miniWindow.reload();

            here.popover.data = popovers;
            here.popover.reload();

            // Dock
            here.dock.data = {
                title: weatherTemperature,
                detail: weatherText,
            };
            here.dock.reload();
        })
        .catch((error) => {
            console.error("Error: " + JSON.stringify(error));
        });
}

here.on("load", () => {
    updateData();
    // Update every 12 hours
    setInterval(updateData, 12 * 3600 * 1000);
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
