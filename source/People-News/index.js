const _ = require("underscore");
const http = require("http");
const net = require("net");

const CHANNELS = [
    { api: "politics", title: "国内新闻" },
    { api: "world", title: "国际新闻" },
    { api: "finance", title: "经济新闻" },
    { api: "sports", title: "体育新闻" },
];

function getData(api, title = "", LIMIT = 15) {
    let entryList = [];
    return here.parseRSSFeed("http://www.people.com.cn/rss/" + api + ".xml").then(function (feed) {
        entryList = feed.items;
        // console.log(JSON.stringify(feed.items[0]))
        if (feed.items.length <= 0) {
            return here.miniWindow.set({ title: "No item found." });
        }

        if (feed.items.length > LIMIT) {
            feed.items = feed.items.slice(0, LIMIT);
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
            return getData(channel.api, channel.title);
        })
    ).then(function (results) {
        const totalData = results[0].entryList;

        if (totalData == undefined || !Array.isArray(totalData) || totalData.length == 0) {
            console.error(`Invalid data.`);
            return;
        }

        const topFeed = totalData[0];
        if (topFeed == undefined) {
            console.error(`Invalid top feed.`);
            return;
        }

        // Mini Window
        here.miniWindow.data = {
            title: topFeed.title,
            detail: "人民网",
            onClick: () => {
                here.openURL("http://people.cn/");
            },
        };
        here.miniWindow.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            return {
                title: data.title,
                data: _.map(data.entryList, (entry) => {
                    return {
                        title: entry.title,
                        onClick: () => {
                            if (topFeed.link != undefined) {
                                here.openURL(entry.link);
                            }
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
    setInterval(updateData, 12 * 3600 * 1000);
});

net.on("change", (type) => {
    console.log("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
