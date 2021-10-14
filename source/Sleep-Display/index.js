const i18n = require('i18n')
const hotkey = require("hotkey")
const pm = require('pm')

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: __("Sleep Display"),
        detail: __("Click to put display to sleep"),
        onClick: () => {
            pm.putDisplayToSleep(true)
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
