const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {

    here.miniWindow.set({ title: "Updating…" });

    http.request({
        url:
            "https://api.douban.com/v2/movie/new_movies?apikey=0df993c66c0c636e29ecbb5344252a4a&city=%E5%8C%97%E4%BA%AC&start=0&count=10&client=&udid=",
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


            const topFeed = entryList[0];

            // Mini Window
            here.miniWindow.data = {
                title: "🎬《" + topFeed.title + "》 ★" + topFeed.rating.average,
                detail: "上映" + topFeed["mainland_pubdate"] != "" ? topFeed["mainland_pubdate"] + "(CN)" : "",
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
                        title: entry["mainland_pubdate"] != "" ? entry["mainland_pubdate"] + "(CN)" : "",
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
