const _ = require("underscore");
const net = require("net");

function updateData() {
    const LIMIT = 50;

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    here.parseRSSFeed("https://developer.apple.com/news/releases/rss/releases.rss")
        .then((feed) => {
            // console.log(JSON.stringify(feed))
            if (feed.items.length <= 0) {
                return here.miniWindow.set({ title: "No item found." });
            }

            if (feed.items.length > LIMIT) {
                feed.items = feed.items.slice(0, LIMIT);
            }

            const topFeed = feed.items[0];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "Apple Developer Releases",
                accessory: { badge: feed.items.length.toString() },
                onClick: () => {
                    here.openURL("https://developer.apple.com/news/releases/");
                },
            };
            here.miniWindow.reload();

            // Popover
            let dataAll = feed.items.map((item) => {
                return {
                    title: item.title.trim(),
                    onClick: () => {
                        if (item.link != undefined) {
                            here.openURL(item.link);
                        }
                    },
                };
            });

            let dataBeta = dataAll.filter((item) => {
                return item.title.indexOf("beta") != -1;
            });

            let dataReleased = dataAll.filter((item) => {
                return item.title.indexOf("beta") == -1;
            });

            let tabs = [
                { title: "All", data: dataAll },
                { title: "Beta", data: dataBeta },
                { title: "Released", data: dataReleased },
            ];

            here.popover = new here.TabPopover();
            here.popover.data = tabs;
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
