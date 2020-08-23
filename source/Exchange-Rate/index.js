const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    http.get("https://stock.finance.sina.com.cn/forex/api/openapi.php/ForexService.getAllBankForex?ft=part")
        .then(function (response) {
            const json = response.data;
            // boc 是中国人民银行的缩写
            const entryList = json.result.data.boc;

            if (entryList == undefined) {
                console.error("Invalid data.");
                return;
            }

            if (entryList.length <= 0) {
                console.error("Entrylist is empty.");
                return;
            }

            const topFeed = entryList[0];

            // Menu Bar
            here.menuBar.data = {
                title: Number(topFeed.xh_buy).toFixed(2),
                detail: "CNY/USD",
            };
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: "人民币牌价 (" + topFeed.name + ")",
                detail: "中国人民银行",
                accessory: {
                    title: topFeed.xh_buy,
                },
            };
            here.miniWindow.onClick(() => {
                here.openURL("https://finance.sina.com.cn/forex/");
            });
            here.miniWindow.reload();

            here.popover.data = _.map(entryList, (entry) => {
                return {
                    title: entry.name,
                    accessory: {
                        title: entry.xh_buy,
                    },
                };
            });
            here.popover.reload();

            // Dock
            here.dock.data = {
                title: Number(topFeed.xh_buy).toFixed(2),
                detail: "￥/$",
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
