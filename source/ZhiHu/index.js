const _ = require("underscore");
const http = require("http");
const net = require("net");

const CHANNELS = [
    { api: "total", title: "全部" },
    { api: "science", title: "科技" },
    { api: "digital", title: "数码" },
    { api: "sport", title: "体育" },
    { api: "fashion", title: "时尚" },
    { api: "film", title: "影视" },
];

function getDate(api, title = "", LIMIT = 15) {
    let entryList = [];
    return http
        .get("https://www.zhihu.com/api/v3/feed/topstory/hot-lists/" + api + "?limit=" + LIMIT)
        .then(function (response) {
            const json = response.data;
            entryList = json.data;

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

            entryList = _.map(entryList, (entry, index) => {
                return {
                    title: entry.target.title,
                    url: `https://www.zhihu.com/question/${entry.target.id}`,
                };
            });

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
        here.miniWindow.data.title = topFeed.title;
        here.miniWindow.data.detail = "知乎热榜";
        here.miniWindow.onClick(function () {
            if (topFeed["id"] != undefined) {
                here.openURL("https://www.zhihu.com/question/" + topFeed.id);
            }
        });
        here.miniWindow.reload();

        // Menu Bar
        let title = topFeed.title;
        if (title.length > 15) {
            title = title.substring(0, 15) + `…`;
        }
        here.menuBar.data.title = title;
        here.menuBar.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            return {
                title: data.title,
                data: _.map(data.entryList, (entry) => {
                    return {
                        title: entry.title,
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
