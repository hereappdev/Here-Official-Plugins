const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.set({ title: "Updating…" });

    http.request({
        url:
            "http://t.yushu.im/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC&start=0&count=10&client=&udid=",
        allowHTTPRequest: true,
    })
        .then(function (response) {
            const json = response.data;
            const entryList = json.subjects;

            if (entryList == undefined) {
                console.error("Invalid data.");
                return;
            }

            if (entryList.length <= 0) {
                console.error("Entrylist is empty.");
                return;
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            const topFeed = entryList[0];

            // Mini Window
            here.miniWindow.data = {
                title: "🎬《" + topFeed.title + "》 ★" + topFeed.rating.average,
                detail: "上映" + topFeed["mainland_pubdate"],
                accessory: { badge: topFeed["rating"]["average"].toString() },
                onClick: () => {
                    if (topFeed.alt != undefined) {
                        here.openURL(topFeed.alt);
                    }
                },
            };
            here.miniWindow.reload();

            // Popover
            here.popover.data = _.map(entryList, (entry) => {
                return {
                    title: "《" + entry.title + "️️️》 ★" + entry.rating.average + "",
                    accessory: {
                        title: entry["mainland_pubdate"],
                    },
                    onClick: () => {
                        here.openURL(entry.alt);
                    },
                };
            });
            here.popover.reload();
        })
        .catch(function (error) {
            console.error(`Error: ${JSON.stringify(error)}`);
            here.miniWindow.set({ title: JSON.stringify(error) });
        });
}

here.on("load", () => {
    updateData();
    // Update every 2 hours
    setInterval(updateData, 2 * 3600 * 1000);
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
