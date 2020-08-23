const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.set({ title: "Updating…" });

    const aURL = "https://sentence.iciba.com/index.php?c=dailysentence&m=getTodaySentence&_=1547327206019";
    http.request(aURL)
        .then(function (response) {
            const json = response.data;
            const entryList = json;

            // console.verbose(JSON.stringify(entryList))
            if (entryList == undefined) {
                return here.miniWindow.set({ title: "Invalid data." });
            }

            if (entryList.length <= 0) {
                return here.miniWindow.set({ title: "Entrylist is empty." });
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            // Menu Bar
            here.menuBar.data.title = entryList.content.substring(0, 50) + "...";
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: entryList.content,
                detail: entryList.note,
            };
            here.miniWindow.onClick(() => {
                here.openURL("http://m.iciba.com/daily.html");
            });
            here.miniWindow.reload();

            // Popover
            here.popover = new here.WebViewPopover();
            here.popover.data = {
                url: "http://m.iciba.com/daily.html",
                width: 375,
                height: 400,
                backgroundColor: "#ffffff",
                foregroundColor: rgba(0, 0, 0, 0.5),
                hideStatusBar: true,
            };
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
