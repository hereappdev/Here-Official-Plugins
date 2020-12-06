const _ = require("underscore");
const http = require("http");
const net = require("net");

function strToVar(str) {
    var json = new Function("return " + str)();
    return json;
}

function updateData() {
    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    http.get("https://hq.sinajs.cn/?list=gds_AUTD")
        .then(function (response) {
            let goldPrice;
            let goldDate;

            let data = response.data;
            if (data != undefined) {
                goldPrice = data.toString().split('="')[1].split(",")[0];
                goldDate =
                    data.toString().split('="')[1].split(",")[12] + " " + data.toString().split('="')[1].split(",")[6];
            }

            // console.log(goldPrice)

            // Menu Bar
            here.menuBar.data = {
                title: goldPrice,
                detail: "Gold",
            };
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: "黄金价格",
                detail: goldDate,
                accessory: {
                    title: goldPrice,
                },
            };
            here.miniWindow.reload();

            // Dock
            here.dock.data = {
                title: goldPrice,
                detail: "金价",
            };
            here.dock.reload();
        })
        .catch(function (error) {
            console.error(`Error: ${JSON.stringify(error)}`);
            here.miniWindow.set({ title: JSON.stringify(error) });
        });
}

// 直接调用 Webview
here.popover = new here.WebViewPopover();
here.popover.data = {
    url: "http://gu.sina.cn/m/?vt=4&cid=76613#/futures/month?symbol=AU0",
    width: 375,
    height: 500,
};
here.popover.reload();

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
