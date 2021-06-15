const _ = require("underscore");
const http = require("http");
const pref = require("pref");
const net = require("net");
const mt = require("moment.min.js");
const i18n = require('i18n');

function updateData() {
    var location = "New York";
    var degreeUnits = "℉";
    var degreeUnitsCode = "imperial";

    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    const json = pref.all();

    if (json == undefined) {
        console.log("No prefs found.");
    }

    if (json["location"] != undefined) {
        location = json["location"];
    }
    
    // console.log(JSON.stringify(json))
    if (json["degreeUnits"]["index"] != undefined) {
        if (json["degreeUnits"]["index"] == 0) {
            degreeUnits = "℉";
            degreeUnitsCode = "imperial";
        } else {
            degreeUnits = "℃";
            degreeUnitsCode = "metric";
        }
    }

    // console.log('degreeUnits:' + degreeUnits)

    http.get("https://api.openweathermap.org/data/2.5/weather?appid=c5510351cb7db5b2dd9005e0d8be812c&q=" + encodeURIComponent(location) + "&units=" + degreeUnitsCode)
        .then((response) => {
            const json = response.data;

            if (json.cod == 404) {
                console.error(__("City not found, please check settings."));
                here.miniWindow.set({ title: __("City not found, please check settings.") });
                return;
            }

            const weatherCity = json["name"];
            const weatherToday = json["main"]["temp"];
            const weatherLow = json["main"]["temp_min"].toFixed(1);
            const weatherHigh = json["main"]["temp_max"].toFixed(1);
            const weatherText = json["weather"][0]["main"];
            const weatherTemperature = json["main"]["temp"].toFixed(1) + degreeUnits;

            http.get("https://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&appid=de324c3839d438273b1d6f72b2298694&q=" + encodeURIComponent(location) + "&units=" + degreeUnitsCode).then((response) => {
            	
            	const json = response.data;
            	const weatherForecasts = json["list"];
            	const keys = _.allKeys(weatherForecasts);

            	let popovers = _.map(keys, (key) => {
            	    let value = weatherForecasts[key];
            	    // console.log(value["dt"])
            	    return {
            	        title: moment(value["dt"] * 1000).format("MMM DD") + " - " + value["weather"][0]["main"],
            	        accessory: {
            	            title: value["weather"][0]["main"],
            	            imageURL: "images/" + value["weather"][0]["icon"] + ".png",
            	            imageCornerRadius: 4,
            	        },
            	    };
            	});
            	here.popover.data = popovers;
            	here.popover.reload();
        	})

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
                    degreeUnits +
                    " · ↓" +
                    weatherLow +
                    degreeUnits +
                    " (" +
                    moment(weatherToday).format("MMM DD / dddd") +
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
    // Update every 2 hours
    setInterval(updateData, 4 * 3600 * 1000);
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
