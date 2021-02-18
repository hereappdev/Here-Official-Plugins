here.on("load", () => {
    here.miniWindow.data = {
        title: "🕹Chrome Dino",
        detail: "T-Rex Game! (Keyboard: Space Key)",
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
