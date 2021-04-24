const i18n = require('i18n')

here.on("load", () => {
    here.miniWindow.data = {
        title: __("🕹Chrome Dino"),
        detail: __("T-Rex Game! (Keyboard: Space Key)"),
    };
    here.miniWindow.reload();

    here.popover = new here.WebViewPopover();
    here.popover.data = {
        url: "./game/index.html",
        width: 600,
        height: 150,
        backgroundColor: "#FFFFFF",
        foregroundColor: rgba(255, 255, 255, 255),
        hideStatusBar: true
    };
    here.popover.reload();
});
