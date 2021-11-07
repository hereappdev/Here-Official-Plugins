const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

        here.parseRSSFeed("https://rsshub.rssforever.com/juejin/pins")
        .then((feed) => {
            if (feed.items.length <= 0) {
                return here.miniWindow.set({ title: "No item found." });
            }

            if (feed.items.length > LIMIT) {
                feed.items = feed.items.slice(0, LIMIT);
            }

            const topFeed = feed.items[0];
            console.log(topFeed.title)
            
            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "掘金热门",
                onClick: () => {
                    if (topFeed.link != undefined) {
                        here.openURL(topFeed.link);
                    }
                },
            };
            here.miniWindow.reload();

            here.popover.data = _.map(feed.items, (item, index) => {
                return {
                    title: item.title,
                    onClick: () => {
                        if (item.link != undefined) {
                            here.openURL(item.link);
                        }
                    },
                };
            });
            here.popover.reload();
        })
        .catch((error) => {
            console.error("Error: " + JSON.stringify(error));
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
