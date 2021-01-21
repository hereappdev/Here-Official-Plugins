const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

// const jsonPref = pref.all()

function getData(api) {
    const LIMIT = 30;

    let entryList = [];
    return http.get(api).then(function (response) {
        var json = [];

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
        getData("https://api.tophub.fun/v2/GetAllInfoGzip?id=1065"),
        getData("https://api.tophub.fun/GetRandomInfo?time=0&is_follow=0"),
    ]).then(function (values) {

        const topFeed = values[0][0];

        // Mini Window
        here.miniWindow.data = {
            title: topFeed.Title,
            detail: "鱼塘热榜",
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
                title: "鱼塘TOP榜",
                data: popovers[0],
            },
            {
                title: "鱼塘最新榜",
                data: popovers[1],
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
