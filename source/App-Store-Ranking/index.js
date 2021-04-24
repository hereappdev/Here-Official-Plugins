const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");
const i18n = require('i18n')

const jsonPref = pref.all();

const CATEGORY = [
    { title: __("Free"), type: "top-free" },
    { title: __("Grossing"), type: "top-grossing" },
    { title: __("Paid"), type: "top-paid" },
];

function getData(api, title) {
    const LIMIT = 25;

    let entryList = [];
    return http.get(api).then(function (response) {
        const json = response.data;
        entryList = json.feed.results;

        if (entryList == undefined) {
            return here.miniWindow.set({ title: "Invalid data." });
        }

        if (entryList.length <= 0) {
            return here.miniWindow.set({ title: "Entrylist is empty." });
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT);
        }
        // console.log(entryList)
        entryList = _.map(entryList, (entry, key) => {
            // console.log(entry["name"])
            entry.title = entry["name"];
            entry.url = entry["artistUrl"];
            entry.appIcon = entry["artworkUrl100"].replace("200x2002bb.png", "100x100bb.png");
            entry.rank = entry["genres"][0]["name"];
            return entry;
        });

        return {
            title: title,
            entryList: entryList,
        };
    });
}

function updateData() {
    here.miniWindow.set({ title: __("Updating…") });

    const apiPrefix = "https://rss.itunes.apple.com/api/v1/";
    const countryCode = jsonPref["countryCode"];
    Promise.all(
        CATEGORY.map((cat) => {
            const url = `${apiPrefix}${countryCode}/ios-apps/${cat.type}/all/25/explicit.json`;
            return getData(url, cat.title);
        })
    ).then(function (results) {
        const freeApps = results[0];
        const topFeed = freeApps.entryList[0];

        // Mini Window
        here.miniWindow.data = {
            title: "No.1 " + topFeed.title,
            detail: "App Store(" + jsonPref["countryCode"].toUpperCase() + ")",
            accessory: {
                badge: topFeed.rank,
            },
            onClick: () => {
                if (topFeed.url != undefined) {
                    here.openURL(topFeed.url);
                }
            },
        };
        here.miniWindow.reload();

        // Popover
        here.popover = new here.TabPopover();
        const tabs = results.map((result) => {
            return {
                title: result.title,
                data: result.entryList.map((entry, index) => {
                    return {
                        title: index + 1 + ". " + entry.title,
                        accessory: {
                            title: entry.rank,
                            imageURL: entry.appIcon,
                            imageCornerRadius: 4,
                        },
                        onClick: () => {
                            here.openURL(entry.url);
                        },
                    };
                }),
            };
        });
        here.popover.data = tabs;
        here.popover.reload();
    });
}

here.on("load", () => {
    updateData();
    // Update every 2 hours
    setInterval(updateData, 12 * 3600 * 1000);
});

net.on("change", (type) => {
    console.log("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
