const _ = require("underscore");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    // API: http://rss.cnn.com/rss/cnn_topstories.rss
    // API Speedy: https://apispeedy.com/cnn/

    here.parseRSSFeed("https://apispeedy.com/cnn/")
        .then((feed) => {
            if (feed.items.length <= 0) {
                console.error("No item found.");
                return;
            }

            if (feed.items.length > LIMIT) {
                feed.items = feed.items.slice(0, LIMIT);
            }

            const topFeed = feed.items[0];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "CNN News",
                onClick: () => {
                    here.openURL(topFeed.link);
                },
            };
            here.miniWindow.reload();

            // Popover
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
            console.error(`Error: ${JSON.stringify(error)}`);
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
