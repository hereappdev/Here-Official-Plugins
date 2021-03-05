const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;
    let indexNum = 0;

    here.miniWindow.set({ title: "Updating…" });
    http.get("https://m.cnbeta.com/touch/default/timeline.json?page=1")
        .then(function (response) {
            const json = response.data;
            let entryList = json.result.list;
            // console.log(entryList);
            if (entryList == undefined) {
                return here.miniWindow.set({ title: "Invalid data." });
            }

            if (entryList.length <= 0) {
                return here.miniWindow.set({ title: "Entrylist is empty." });
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            entryList = _.map(entryList, (entry) => {
                entry.title = entry["title"];
                return entry;
            });

            let adNum = 0; // 计算广告条数
            let popOvers = _.map(entryList, (entry, index) => {
                if (entry.title.indexOf("<span") != -1) {
                    adNum++;
                } else {
                    indexNum++;
                }
            });

            const topFeed = entryList[adNum];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "cnBeta",
                onClick: () => {
                    if (topFeed.url_show != undefined) {
                        here.openURL(topFeed.url_show);
                    }
                },
            };
            here.miniWindow.reload();

            here.popover.data = _.map(entryList.splice(adNum, entryList.length), (entry, index) => {
                return {
                    title: entry.title,
                    accessory: {
                        title: "",
                        imageURL: entry.thumb,
                        imageCornerRadius: 4,
                    },
                    onClick: () => {
                        if (entry.url_show != undefined) {
                            console.log(entry.url_show);
                            here.openURL(entry.url_show);
                        }
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
