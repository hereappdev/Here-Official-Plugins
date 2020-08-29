const _ = require("underscore");
const http = require("http");
const net = require("net");

const CHANNELS = [
    { api: "today", title: "Today" },
    { api: "weekly", title: "Weekly" },
    { api: "monthly", title: "Monthly" },
];

function getDate(api, title = "", LIMIT = 25) {
    let entryList = [];
    return http.get("https://github-trending-api.now.sh/repositories?since=" + api).then(function (response) {
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
        // 直接调用 Webview
        here.popover = new here.WebViewPopover();
        here.popover.data = {
            url: "https://news.qq.com/zt2020/page/feiyan.htm",
            width: 375,
            height: 550,
            backgroundColor: "#ffffff",
            foregroundColor: rgba(0, 0, 0, 0.5),
            hideStatusBar: false,
        };
        here.popover.reload();
        // Mini Window
        here.miniWindow.data.title = topFeed.author + "/" + topFeed.name;
        here.miniWindow.data.detail = "Github Trending";
        here.miniWindow.data.accessory = { title: (Number(topFeed.stars) / 1000).toFixed(1) + "k⭐️" };
        here.miniWindow.onClick(function () {
            if (topFeed["id"] != undefined) {
                here.openURL(topFeed.url);
            }
        });
        here.miniWindow.reload();

        // Popover
        let popover = new TabPopover();
        popover.data = _.map(results, (data) => {
            console.log(results);
            return {
                title: data.title /*  */,
                data: _.map(data.entryList, (entry) => {
                    return {
                        title: entry.author + "/" + entry.name,
                        accessory: {
                            title: (Number(entry.stars) / 1000).toFixed(1) + "k⭐️",
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
