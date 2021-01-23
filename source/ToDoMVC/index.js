here.on("load", () => {
    here.miniWindow.data = {
        title: "ToDoMVC",
        detail: "Double-click to edit a todo.",
    };
    here.miniWindow.reload();

    here.popover = new here.WebViewPopover();
    here.popover.data = {
        url: "./vue/index.html",
        width: 375,
        height: 500,
        backgroundColor: "#f5f5f5",
        foregroundColor: rgba(0, 0, 0, 0.5),
        hideStatusBar: true,
    };
    here.popover.reload();
});
