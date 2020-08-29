const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

// const jsonPref = pref.all()

function getData(api) {
    const LIMIT = 30;

    let entryList = [];
    return http.get(api).then(function (response) {
        const json = response.data.data;

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

    Promise.all([getData("https://the.top/v1/weixin/1/30")]).then(function (values) {
        // console.log(values)
        const topFeed = values[0][0];

        // Mini Window
        here.miniWindow.data = {
            title: topFeed.title,
            detail: "微信公众号热文",
        };
        here.miniWindow.onClick(function () {
            here.openURL("https://news.sogou.com/news?query=" + topFeed.word);
        });
        here.miniWindow.reload();

        let popovers = [];

        values.forEach(function (element, index) {
            // console.log(index)
            // console.log(values[index])

            popovers[index] = _.map(values[index], (feed, index) => {
                return {
                    title: feed.title,
                    accessory: {
                        title: "🔥" + feed.heat,
                    },
                    // detail: feed.description,
                    onClick: () => {
                        here.openURL(feed.url);
                    },
                };
            });

            // popovers[index].push({
            //     title: "View All…",
            //     onClick: () => { _.each(values[index], (feed) => { here.openURL(feed.url) }) }
            // })
        });

        let tabs = [
            {
                title: "综合",
                data: popovers[0],
            },
            // {
            //     title: "科技",
            //     data: popovers[1]
            // },
            // {
            //     title: "创业",
            //     data: popovers[2]
            // },
            // {
            //     title: "生活",
            //     data: popovers[3]
            // },
            // {
            //     title: "政务",
            //     data: popovers[4]
            // }
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
