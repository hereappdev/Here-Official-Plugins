const pasteboard = require("pasteboard");

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: "Search on Google…",
        detail: "from Clipboard",
    };
    here.miniWindow.onClick(function () {
        const q = escape(pasteboard.getText());
        here.exec(`open https://www.google.com/search?q=${q}`).then(() => {
            console.log("Done.");
        });
    });
    here.miniWindow.reload();
});
