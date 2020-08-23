here.on("load", () => {
    here.miniWindow.data = {
        title: "Apple Service Coverage",
        detail: "Check the Status of your Apple Devices",
    };
    here.miniWindow.reload();

    here.popover = new here.WebViewPopover()
    here.popover.data = {
        url: "https://checkcoverage.apple.com",
        width: 375,
        height: 580,
        backgroundColor: "#ffffff",
        foregroundColor: rgba(0, 0, 0, 0.5),
        hideStatusBar: false,
    };
    here.popover.reload();
});
