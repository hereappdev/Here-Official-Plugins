function onClick() {
    here.exec("osascript -e 'tell application \"Finder\" to empty trash'");
    here.hudNotification("Files deleted");
}

here.on("load", () => {

    // Mini Window
    here.miniWindow.data = {
        title: "Empty Trash",
        detail: "Click to empty trash can.",
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
