const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

// const jsonPref = pref.all()

function getData(api) {
    console.log("开始执行：getData()")

    const LIMIT = 30;

    let entryList = [];
    return http.get(api).then(function (response) {
        console.log("执行：http.get(" + api + ")")
        var json = [];
        console.log(typeof(response.data.Data.data))
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
    Promise.all([
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1104"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1109"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1132"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1111"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1129"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1128"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1134"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1105"),
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1107"),
    ]).then(function (values) {

        const topFeed = values[0][0];

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

        values.forEach(function (element, index) {
            // console.log(index)
            // console.log(values[index])

            popovers[index] = _.map(values[index], (feed, index) => {
                return {
                    title: feed.Title.trim(),
                    accessory: {
                        title: feed.type.trim(),
                    },
                    // detail: feed.description,
                    onClick: () => {
                        here.openURL(feed.Url);
                    },
                };
            });
        });

        let tabs = [
            {
                title: "科技",
                data: popovers[0],
            },
            {
                title: "财经",
                data: popovers[1],
            },
            {
                title: "影视",
                data: popovers[2],
            },
            {
                title: "情感",
                data: popovers[3],
            },
            {
                title: "媒体",
                data: popovers[4],
            },
            {
                title: "政务",
                data: popovers[5],
            },
            {
                title: "健康",
                data: popovers[6],
            },
            {
                title: "搞笑",
                data: popovers[7],
            },
            {
                title: "开发",
                data: popovers[8],
            },
        ];

        // Popover
        let popover = new TabPopover();
        popover.data = tabs;
        here.popover = popover;
        here.popover.reload();
    }).catch(function (e){
        console.log("报错：catch error");
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
