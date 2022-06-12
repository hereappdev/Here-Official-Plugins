const i18n = require('i18n')
const hotkey = require("hotkey")
const pm = require('pm')
const os = require('os')

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: __("Sleep Display"),
        detail: __("Click to put display to sleep"),
        onClick: () => {
            os.systemInfo().then(info => {
                console.log(info)
                const device = info["device"]
                // if (device.startsWith("MacBook")) {
                    here.exec(`pmset displaysleepnow`)

                // } else {
                //     pm.putDisplayToSleep(true)
                // }
            })
        }
    };

    here.miniWindow.reload();

    // Menu Bar
    here.menuBar = new MenuBar();
    here.menuBar.onClick(() => {
        pm.putDisplayToSleep(true)
    });

    here.menuBar.reload();
});
