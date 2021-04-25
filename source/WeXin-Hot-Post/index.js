const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

// const jsonPref = pref.all()

function getData(api) {
    console.log(`getData ${api}`);

    const LIMIT = 30;

    let entryList = [];
    return http.get(api).then(function (response) {
        console.log(`response http.get(${api})`);
        console.log(response);
        var json = [];
        // console.log(typeof(response.data.Data.data))

        if (response == undefined || response.data == undefined || response.data.Data == undefined) {
            console.error(`invalid response data`);
            here.miniWindow.set({ title: "Invalid data." });
            return [];
        }

        if (response.data.Data.data == undefined) {
            json = response.data.Data;
        } else {
            json = response.data.Data.data;
        }
        if (json == undefined) {
            return here.miniWindow.set({ title: "Invalid data." });
        }

        let entryList = json;

        if (entryList.length <= 1) {
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

    let sources = [
        { name: "科技", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1104" },
        { name: "财经", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1109" },
        { name: "影视", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1132" },
        { name: "情感", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1111" },
        { name: "媒体", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1129" },
        { name: "政务", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1128" },
        { name: "健康", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1134" },
        { name: "搞笑", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1105" },
        { name: "开发", url: "https://api.tophub.fun/v2/GetAllInfoGzip?id=1107" },
    ];

    Promise.all(
        sources.map((source) => {
            return getData(source.url);
        })
    )
        .then(function (values) {
            const topFeed = values[0][0];
            if (topFeed == undefined) {
                here.miniWindow.set({ title: "Invalid data." });
                return;
            }

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.Title,
                detail: "微信公众号热文",
            };
            here.miniWindow.onClick(function () {
                here.openURL(topFeed.Url);
            });
            here.miniWindow.reload();

            let popovers = [];

            const tabs = values.map(function (value, index) {
                // console.log(index)
                // console.log(values[index])

                // article list
                const data =  _.map(value, (feed, index) => {
                    return {
                        title: feed.Title.trim(),
                        accessory: {
                            title: feed.type.trim(),
                        },
                        // detail: feed.description,
                        onClick: () => {
                            here.openURL(feed.Url);
                        }
                    };
                });
                return {
                    title: sources[index].name,
                    data: data
                }
            });
            
            // Popover
            let popover = new TabPopover();
            popover.data = tabs;
            here.popover = popover;
            here.popover.reload();
        })
        .catch(function (e) {
            console.log(`catch error ${e}`);
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
