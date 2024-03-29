here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: "Nyan Cat",
        detail: "I'm on your menubar now.🌈🐱",
    };
    here.miniWindow.reload();

    // Popover
    // here.popover = new here.WebViewPopover();
    // here.popover.data = {
    //     url: "http://www.nyan.cat/index.php?cat=original",
    //     width: 772,
    //     height: 400,
    //     backgroundColor: "#ffffff",
    //     foregroundColor: rgba(0, 0, 0, 0.5),
    //     hideStatusBar: false,
    // };
    // here.popover.reload();

    // Menu Bar
    here.menuBar = new MenuBar();
    var n = 1;
    var interval = setInterval(function () {
        n++;
        if (n == 7) n = 1;
        here.menuBar.setIcon("./gif/" + n + ".png");
        // console.log(n);
        here.menuBar.reload();
    }, 70);
});
