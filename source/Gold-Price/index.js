const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    here.miniWindow.set({ title: "Updating…" });
    http.get("https://hq.sinajs.cn/?list=gds_AUTD")
        .then(function (response) {
            let goldPrice;
            let goldDate;

            let data = response.data;
            if (data != undefined) {
                //  var hq_str_gds_AUTD="417.70,0,417.52,417.70,423.29,411.33,15:30:07,417.55,417.59,109956,0.00,0.00,2020-08-28,黄金延期";
                data = data.split(",");
                const firstItem = data[0].split('"');
                goldPrice = firstItem[firstItem.length - 1];
                goldDate = data[data.length - 2];
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

// WebView
here.popover = new here.WebViewPopover();
here.popover.data = {
    url: "http://gu.sina.cn/m/?vt=4&cid=76613#/futures/month?symbol=AU0",
    width: 375,
    height: 500,
};
here.popover.reload();
