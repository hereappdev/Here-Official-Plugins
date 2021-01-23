const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    // API: https://www.npr.org/rss/rss.php
    // API Speedy: https://apispeedy.com/npr/

    http.get("https://www.npr.org/feeds/1001/feed.json")
        .then(function (response) {
            var entryList = response.data;

            if (entryList == undefined) {
                return here.miniWindow.set({ title: "Invalid data." });
            }

            if (entryList.length <= 0) {
                return here.miniWindow.set({ title: "Entrylist is empty." });
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            const topFeed = entryList.items[0];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "NPR News",
                onClick: () => {
                    if (topFeed.url != undefined) {
                        here.openURL(topFeed.url);
                    }
                },
            };
            here.miniWindow.reload();

            // popover
            here.popover.data = _.map(entryList.items, (item, index) => {
                return {
                    title: item.title,
                    onClick: () => {
                        if (item.url != undefined) {
                            here.openURL(item.url);
                        }
                    },
                    accessory: {
                        title: "",
                        imageURL: item.image,
                        imageCornerRadius: 4,
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
