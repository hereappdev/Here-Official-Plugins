function onClick() {
    here.exec(`ls ~/.Trash | wc -l`)
        .then((stdOut) => {
            const count = parseInt(stdOut);
            console.log(`Files count: ${count}`);
            if (typeof count == "number" && count == 0) {
                console.log(`The trash can is empty.`);
                return Promise.resolve();
            } else {
                return here.exec("osascript -e 'tell application \"Finder\" to empty trash'");
            }
        })
        .then((stdOut) => {
            // console.log("stdOut: ", stdOut)
            if (stdOut != undefined && stdOut.length > 0) {
                // Interactive command
                // Treat it as an Error for now
                console.error(`Error: ${stdOut}`);
                here.hudNotification("Failed to empty trash");
            } else {
                here.hudNotification("Files deleted");
            }
        })
        .catch((error) => {
            console.error(`Faild to execute command. Error: ${JSON.stringify(error)}`);
            here.hudNotification("Failed to empty trash");
        });
}

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: "Empty Trash",
        detail: "Clean up trash can.",
    };
    here.miniWindow.onClick(() => {
        console.log("Did click on miniwin cell");
        onClick();
    });
    here.miniWindow.reload();

    // Menu Bar
    here.menuBar = new MenuBar();
    here.menuBar.data = {
        title: "Empty",
    };
    here.menuBar.onClick(() => {
        console.log(`on menu bar click.`)
        onClick();
    });
    here.menuBar.reload();
});
