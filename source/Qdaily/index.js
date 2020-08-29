const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 30;
    const nowTime = new Date();

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    http.request({
        url: "http://www.qdaily.com/homes/articlemore/" + Math.round(new Date().getTime() / 1000) + ".json",
        allowHTTPRequest: true,
    })
        .then(function (response) {
            let entryList = response.data.data.feeds;

            if (entryList == undefined) {
                return here.miniWindow.set({ title: "Invalid data." });
            }

            if (entryList.length <= 0) {
                return here.miniWindow.set({ title: "Entrylist is empty." });
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            const topFeed = entryList[0];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.post.title.replace("大公司头条：", ""),
                detail: "好奇心日报",
                onClick: () => {
                    if (topFeed.post.id != undefined) {
                        here.openURL("http://www.qdaily.com/articles/" + topFeed.post.id + ".html");
                    }
                },
            };
            here.miniWindow.reload();

            // WebView
            here.popover.data = _.map(entryList, (item, index) => {
                return {
                    title: item.post.title.replace("大公司头条：", ""),
                    onClick: () => {
                        if (item.post.id != undefined) {
                            here.openURL("http://www.qdaily.com/articles/" + item.post.id + ".html");
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
