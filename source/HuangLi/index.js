const _ = require("underscore");
const http = require("http");
const net = require("net");

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" +  mm + "-" + dd;
console.log(today)

function updateData() {
    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    http.get("https://api.timelessq.com/time?datetime=" + today)
        .then(function (response) {
            const json = response;

            const entryList = response.data.data;


            if (entryList == undefined) {
                console.error("Invalid data.");
                return;
            }

            if (entryList.length <= 0) {
                console.error("Entrylist is empty.");
                return;
            }

            const topFeed = entryList["lunar"];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.cnMonth + topFeed.cnDay + " " + topFeed.cyclicalYear + topFeed.zodiac + "年 " + topFeed.cyclicalMonth + "月 "+ topFeed.cyclicalDay + "日",
                detail: topFeed.year + "年" + topFeed.month + "月" + topFeed.day + "日" + "（节气：" + topFeed.solarTerms[0]["name"] + " - " + topFeed.solarTerms[1]["name"] + "）",
            };
            here.miniWindow.reload();

            // 直接调用 Webview
            here.popover = new here.WebViewPopover();
            here.popover.data = {
                url: "https://nongli.911cha.com/",
                width: 375,
                height: 500,
            };
            here.popover.reload();

            // Dock
            here.dock.data = {
                title: topFeed.cnMonth + topFeed.cnDay,
                detail: topFeed.cyclicalYear + " " + topFeed.zodiac,
            };
            here.dock.reload();

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
