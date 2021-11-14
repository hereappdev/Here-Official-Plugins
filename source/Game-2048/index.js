const i18n = require('i18n')

here.on("load", () => {
    here.miniWindow.data = {
        title: "🕹Game: 2048",
        detail: __("Get to the 2048 Tile! (Keyboard: ↑↓← →)"),
    };
    here.miniWindow.reload();

    here.popover = new here.WebViewPopover();
    here.popover.data = {
        url: "./game/index.html",
        width: 300,
        height: 432,
        backgroundColor: "#FAF8EF",
        foregroundColor: rgba(133, 109, 0, 1),
        hideStatusBar: true,
    };
    here.popover.reload();
});
