const os = require("os");
const _ = require("underscore");

here.miniWindow.data.title = "Updating…";
here.miniWindow.reload();

function updateCPUInfo() {
    console.verbose("updateCPUInfo");

    os.cpuUsage()
        .then((usage) => {
            console.verbose(JSON.stringify(usage));

            var percentage = 0;
            var inuse = 0;
            var idle = 0;

            if (usage.overAll.total > 0) {
                console.verbose(`in use: ${usage.overAll.inUse}`);
                // console.log(`total: ${usage.overAll.total}`)
                inuse = usage.overAll.inUse + "";
                percentage = Math.round((usage.overAll.inUse / usage.overAll.total) * 100);
                idle = Math.round((usage.overAll.idle / usage.overAll.total) * 100);
                // console.log(`percentage: ${percentage}`)
                if (percentage < 10) {
                    percentage = "" + percentage;
                }
            }

            // Menu Bar
            here.menuBar.data = {
                title: percentage + "%",
                detail: "CPU",
            };
            here.menuBar.reload();

            // Mini Window
            here.miniWindow.data = {
                title: `CPU Usage`,
                detail: "Use:" + inuse,
                accessory: {
                    title: percentage + "%",
                    detail: "idle:" + idle + "%",
                },
            };
            here.miniWindow.reload();

            // Dock
            here.dock.data = {
                title: percentage + "% " + idle,
                detail: "CPU",
            };
            here.dock.reload();
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
            here.miniWindow.set({ title: JSON.stringify(error) });
        });
}

here.on("load", () => {
    // Update every 3 seconds
    setInterval(updateCPUInfo, 3000);
});
