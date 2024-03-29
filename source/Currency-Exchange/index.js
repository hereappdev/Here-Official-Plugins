const _ = require("underscore");
const http = require("http");
const pref = require("pref");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.set({ title: "Updating…" });

    var currencySymbols = "USD";
    var displaySymbols = "CNY";
    var currencyValue = 0;

    const json = pref.all();
    if (json == undefined) {
        console.log("No prefs found.");
    }

    // console.log(`prefs: ${JSON.stringify(json)}`)
    if (typeof json.currencySymbols == "string") {
        currencySymbols = json.currencySymbols.toUpperCase();
    }
    if (typeof json.displaySymbols == "string") {
        displaySymbols = json.displaySymbols.toUpperCase();
    }

    here.miniWindow.set({ title: "Updating…" });

    // API Source: https://openexchangerates.org/api/latest.json?app_id=48c5e363909e4a2bba48937790c365e7&show_alternative=1%27
    // SpeedyAPI with cache: http://openexchangerates.apispeedy.com/api/latest.json?app_id=48c5e363909e4a2bba48937790c365e7&show_alternative=1%27
    http.request(
        "https://openexchangerates.apispeedy.com/api/latest.json?app_id=48c5e363909e4a2bba48937790c365e7&show_alternative=1%27"
    ).then(function (response) {
        const json = response.data;
        const entryList = json.rates;

        currencyValue = entryList[currencySymbols];

        if (entryList == undefined) {
            return here.miniWindow.set({ title: "Invalid data." });
        }

        if (entryList.length <= 0) {
            return here.miniWindow.set({ title: "Entrylist is empty." });
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT);
        }

        const ratio = (entryList[displaySymbols] / currencyValue).toFixed(3).toString();
        const detail = `${currencySymbols}⇌${displaySymbols}: ${ratio}`;

        here.miniWindow.data = {
            title: displaySymbols + "⇌" + currencySymbols,
            detail: detail,
            accessory: {
                title: (currencyValue / entryList[displaySymbols]).toFixed(3).toString(),
            },
        };
        here.miniWindow.reload();

        here.popover.data = _.map(entryList, (entry, key) => {
            return {
                title: key.toString(),
                accessory: {
                    title: (currencyValue / entry).toFixed(3).toString(),
                },
            };
        });
        here.popover.reload();
    });
}

here.on("load", () => {
    updateData();
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
