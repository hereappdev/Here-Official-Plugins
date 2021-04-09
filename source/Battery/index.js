const pm = require("pm");
const _ = require("underscore");
const i18n = require('i18n');

function updateBatteryInfo() {
    console.log("updateBatteryInfo");

    Promise.all([pm.batteryInfo(), pm.advancedBatteryInfo(), pm.otherBatteryInfo(), pm.privateAirPodsBatteryInfo()])
        .then((infoList) => {
            try {
                let basicInfo = JSON.parse(infoList[0]);
                let advancedInfo = JSON.parse(infoList[1]);
                let otherInfo = JSON.parse(infoList[2]);
                let airPodsInfo = JSON.parse(infoList[3]);

                let percentage =
                    Math.round((Number(basicInfo["Current Capacity"]) / Number(basicInfo["Max Capacity"])) * 100) + "%";

                let title = __("Battery Health: ") + basicInfo["BatteryHealth"];
                let state = Boolean(basicInfo[__("[Is Charging]")]) ? "🔋" : "";

                let detailText =
                    state + __("Cycle Count: ") + advancedInfo["CycleCount"] + " (" + basicInfo["Power Source State"] + ")";
                if (basicInfo["Max Capacity"] == 0) {
                    percentage = "100%";
                    title = __("Connected accessories") + ` (${otherInfo.length})`;
                    detailText = __("[Not Charging]");
                }

                // Menu Bar
                here.menuBar.data = {
                    title: percentage,
                    detail: __("Battery"),
                }
                here.menuBar.reload();

                // Mini Window
                here.miniWindow.data = {
                    title: __("Battery Status"),
                    detail: detailText,
                    accessory: {
                        title: percentage,
                        detail: title,
                    },
                };
                here.miniWindow.reload();

                // Popover
                console.log(`otherInfo count: ${otherInfo.length}`)
                let popovers = _.map(otherInfo, (aInfo, index) => {
                    return {
                        title: aInfo["name"],
                        accessory: {
                            title: aInfo["batteryPercent"] + "%",
                        },
                    };
                });
                
                console.log(`airPodsInfo count: ${airPodsInfo.length}`)
                popovers = popovers.concat(
                    _.map(airPodsInfo, (aInfo, index) => {
                        return {
                            title: `${aInfo["name"]} L: ${aInfo["batteryPercentLeft"]} R: ${aInfo["batteryPercentRight"]} Case: ${aInfo["batteryPercentCase"]}`,
                        };
                    })
                );
                console.log(`popovers: ${JSON.stringify(popovers)}`);
                here.popover.data = popovers;
                here.popover.reload();

                // Dock
                here.dock.data = {
                    title: percentage,
                    detail: otherInfo.length.toString() + __(" device"),
                }
                here.dock.reload()

            } catch (error) {
                console.log(`Failed to parse json.`);
            }
        })
        .catch((err) => {
            console.error(`Error: ${JSON.stringify(error)}`);
            here.miniWindow.set({ title: err });
        });
}

pm.watchPowerChange(() => {
    console.log("Power Changed");
    updateBatteryInfo();
});

here.on("load", () => {
    updateBatteryInfo();
});
