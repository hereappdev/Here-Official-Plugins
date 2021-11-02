const _ = require("underscore");
const pref = require("pref");
const http = require("http");
const net = require("net");

var codeLanguage = ""; // via https://github.com/trending
var spokenLanguageCode = "en";

const json = pref.all();

if (json == undefined) {
        console.log("No prefs found.");
    }
if (json != undefined) {
    codeLanguage = json.codeLanguage;
    spokenLanguageCode = json.spokenLanguageCode;
}

const CHANNELS = [
    { api: "daily", title: "Today" },
    { api: "weekly", title: "Weekly" },
    { api: "monthly", title: "Monthly" },
];

function getDate(api, title = "", LIMIT = 25) {
    let entryList = [];
    return http.get("https://trendings.herokuapp.com/repo?" + codeLanguage + "&since=" + api + "&spoken_lang=" + spokenLanguageCode).then(function (response) {
        const json = response.data;
        entryList = json;

        if (entryList == undefined) {
            here.miniWindow.data.title = "Invalid data.";
            here.miniWindow.reload();
            return;
        }

        if (entryList.length <= 0) {
            here.miniWindow.data.title = "Entrylist is empty.";
            here.miniWindow.reload();
            return;
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT);
        }

        return {
            title: title,
            entryList: entryList,
        };
    });
}

function updateData() {
    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    Promise.all(
        CHANNELS.map((channel) => {
            return getDate(channel.api, channel.title);
        })
    ).then(function (results) {
        console.log(results[0].entryList.items[0])
        const totalData = results[0].entryList.items[0];

        if (totalData == undefined || totalData.length == 0) {
            console.error(`Invalid data.`);
            return;
        }

        const topFeed = totalData;

        if (topFeed == undefined) {
            console.error(`Invalid top feed.`);
            return;
        }
        
        // Mini Window
        here.miniWindow.data.title = topFeed.repo;
        here.miniWindow.data.detail = "Github Trending";
        here.miniWindow.data.accessory = { title: (topFeed.stars.replace(/,/g, "") / 1000).toFixed(1) + "k⭐️" };
        here.miniWindow.onClick(function () {
            if (topFeed["name"] != undefined) {
                here.openURL(topFeed.repo_link);
            }
        });
        here.miniWindow.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            // console.log(results);
            return {
                title: data.title /*  */,
                data: _.map(data.entryList.items, (entry) => {
                    return {
                        title: entry.repo,
                        accessory: {
                            title: (entry.stars.replace(/,/g, "") / 1000).toFixed(1) + "k⭐️",
                        },
                        onClick: () => {
                            here.openURL(entry.repo_link);
                        },
                    };
                }),
            };
        });
        here.popover = popover;
        here.popover.reload();
    });
}

here.on("load", () => {
    updateData();
    // Update every 2 hours
    setInterval(updateData, 2 * 3600 * 1000);
});

net.on("change", (type) => {
    console.log("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
