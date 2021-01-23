const _ = require("underscore");
const http = require("http");
const net = require("net");

const CHANNELS = [
    { api: "0", title: "全站" },
    { api: "1", title: "动画" },
    { api: "168", title: "国创相关" },
    { api: "3", title: "音乐" },
    { api: "129", title: "舞蹈" },
    { api: "4", title: "游戏" },
    { api: "36", title: "知识" },
    { api: "188", title: "数码" },
    { api: "160", title: "生活" },
    { api: "119", title: "鬼畜" },
    { api: "155", title: "时尚" },
    { api: "5", title: "娱乐" },
    { api: "181", title: "影视" },
];

function getData(api, title = "", LIMIT = 15) {
    let entryList = [];
    return http
        .get("https://api.bilibili.com/x/web-interface/ranking?rid=" + api + "&day=1&type=1")
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
        const totalData = results[0].entryList["list"];

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
        here.miniWindow.data.detail = "Bilibili排行榜";
        here.miniWindow.onClick(function () {
            if (topFeed.bvid != undefined) {
                here.openURL("https://www.bilibili.com/video/" + topFeed.bvid);
            }
        });
        here.miniWindow.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            return {
                title: data.title,
                data: _.map(data.entryList["list"], (entry) => {
                    return {
                        title: entry.title + " - @" + entry.author,
                        accessory: {
                            title: "",
                            imageURL: entry.pic,
                            imageCornerRadius: 4,
                        },
                        onClick: () => {
                            here.openURL("https://www.bilibili.com/video/" + entry.bvid);
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
