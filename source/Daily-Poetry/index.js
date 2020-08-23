const _ = require("underscore");
const http = require("http");
const net = require("net");

function updateData() {
    const LIMIT = 10;

    here.miniWindow.data.title = "Updating…";
    here.miniWindow.reload();

    http.request({
        url: "http://meirishici.com/getQuote",
        allowHTTPRequest: true,
    })
        .then(function (response) {
            const json = response.data;
            const entryList = json;

            console.verbose(JSON.stringify(entryList));

            if (entryList == undefined) {
                console.error("Invalid data.");
                return;
            }

            if (entryList.length <= 0) {
                console.error("Entrylist is empty.");
                return;
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            // Menu Bar
            here.menuBar.data = { title: entryList.quote.replace(/\r\n/g, "，") };
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: entryList.quote.replace(/\r\n/g, "，"),
                detail: entryList.author.intro.replace(/\r\n/g, "，"),
            };
            here.miniWindow.onClick(() => {
                here.openURL("http://meirishici.com/poetry/" + entryList.poetry.uuid);
            });
            here.miniWindow.reload();

            // Popover
            here.popover.data = [
                {
                    onClick: () => {
                        here.openURL("http://meirishici.com/poetry/" + entryList.poetry.uuid);
                    },
                    title: entryList.author.intro.replace(/\r\n/g, "，"),
                },
                {
                    onClick: () => {
                        here.openURL(entryList.author.wiki);
                    },
                    title: entryList.quote.replace(/\r\n/g, "，"),
                },
            ];
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
    setInterval(updateData, 12 * 3600 * 1000);
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
