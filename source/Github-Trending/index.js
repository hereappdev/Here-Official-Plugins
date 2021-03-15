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
    // console.log("https://gh-trending-api.herokuapp.com/repositories/" + codeLanguage + "?since=" + api + "&spoken_lang=" + spokenLanguageCode)
    return http.get("https://gh-trending-api.herokuapp.com/repositories/" + codeLanguage + "?since=" + api + "&spoken_lang=" + spokenLanguageCode).then(function (response) {
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
        const totalData = results[0].entryList;

        if (totalData == undefined || totalData.length == 0) {
            console.error(`Invalid data.`);
            return;
        }

        const topFeed = totalData[0];

        if (topFeed == undefined) {
            console.error(`Invalid top feed.`);
            return;
        }
        
        // Mini Window
        here.miniWindow.data.title = topFeed.username + "/" + topFeed.repositoryName;
        here.miniWindow.data.detail = "Github Trending";
        here.miniWindow.data.accessory = { title: (topFeed.totalStars / 1000).toFixed(1) + "k⭐️" };
        here.miniWindow.onClick(function () {
            if (topFeed["name"] != undefined) {
                here.openURL(topFeed.url);
            }
        });
        here.miniWindow.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            // console.log(results);
            return {
                title: data.title /*  */,
                data: _.map(data.entryList, (entry) => {
                    return {
                        title: entry.username + "/" + entry.repositoryName,
                        accessory: {
                            title: (entry.totalStars / 1000).toFixed(1) + "k⭐️",
                        },
                        onClick: () => {
                            here.openURL(entry.url);
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
