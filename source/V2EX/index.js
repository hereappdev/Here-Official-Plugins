const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

const jsonPref = pref.all();

function getDate(api) {
    const LIMIT = 25;

    let entryList = [];
    return http.get(api).then(function (response) {
        entryList = Object.values(response.data);

        if (entryList == undefined) {
            return here.miniWindow.set({ title: "Invalid data." });
        }

        if (entryList.length <= 0) {
            return here.miniWindow.set({ title: "Entrylist is empty." });
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT);
        }

        return entryList;
    });
}

function updateData() {
    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    Promise.all([
        getDate("https://v2ex.apispeedy.com/api/topics/hot.json"),
        getDate("https://v2ex.apispeedy.com/api/topics/latest.json"),
        getDate("https://v2ex.apispeedy.com/api/topics/show.json?node_name=" + jsonPref["nodeName"]),
    ]).then(function (values) {
        const topFeed = values[0][0];

        // Mini Window
        here.miniWindow.data = {
            title: topFeed.title,
            detail: "V2EX",
            onClick: () => {
                if (topFeed.url != undefined) {
                    here.openURL(topFeed.url);
                }
            },
        };
        here.miniWindow.reload();

        let tabs = [
            {
                title: "最热",
                data: _.map(values[0], (entry, index) => {
                    // console.log(entry[index]["target"]["title"])
                    return {
                        title: entry.title,
                        accessory: {
                            title: "",
                            imageURL: entry.member.avatar_large,
                            imageCornerRadius: 4,
                        },
                        onClick: () => {
                            if (entry.url != undefined) {
                                here.openURL(entry.url);
                            }
                        },
                    };
                }),
            },
            {
                title: "全部",
                data: _.map(values[1], (entry, index) => {
                    // console.log(entry[index]["target"]["title"])
                    return {
                        title: entry.title,
                        accessory: {
                            title: "",
                            imageURL: entry.member.avatar_large,
                            imageCornerRadius: 4,
                        },
                        onClick: () => {
                            if (entry.url != undefined) {
                                here.openURL(entry.url);
                            }
                        },
                    };
                }),
            },
            {
                title: jsonPref["nodeName"],
                data: _.map(values[2], (entry, index) => {
                    // console.log(entry[index]["target"]["title"])
                    return {
                        title: entry.title,
                        accessory: {
                            title: "",
                            imageURL: entry.member.avatar_large,
                            imageCornerRadius: 4,
                        },
                        onClick: () => {
                            if (entry.url != undefined) {
                                here.openURL(entry.url);
                            }
                        },
                    };
                }),
            },
        ];

        // Popover
        let popover = new TabPopover();
        popover.data = tabs;
        here.popover = popover;
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
