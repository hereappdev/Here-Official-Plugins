const i18n = require('i18n')

function onClick() {
    here.exec("osascript -e 'tell application \"Finder\" to empty trash'");
    here.hudNotification(__("Files deleted"));
}

here.on("load", () => {

    // Mini Window
    here.miniWindow.data = {
        title: __("Empty Trash"),
        detail: __("Click to empty ~/.Trash"),
    };
    here.miniWindow.onClick(() => {
        onClick();
    });
    here.miniWindow.reload();

    // Menu Bar
    here.menuBar = new MenuBar();
    // here.menuBar.set({ title: "empty" })
    here.menuBar.onClick(() => {
        onClick();
    });
    here.menuBar.reload();
});
