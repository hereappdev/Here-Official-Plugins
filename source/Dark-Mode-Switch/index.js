const hotkey = require("hotkey");

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: "Dark Mode Switch",
        detail: "Click to switch",
    };
    here.miniWindow.data.accessory = new here.SwitchAccessory({
        isOn: false,
        onValueChange: (isOn) => {
            // console.log(`isFirstTime: ${isFirstTime}`);
            if (isOn) {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to true'`
                ).then(() => {
                    // console.log("Switch to dark.");
                    here.miniWindow.data.accessory.isOn = false;
                    // console.log(`after isOn: ${isOn}`);
                });
            } else {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to false'`
                ).then(() => {
                    // console.log("Switch to light.");
                    here.miniWindow.data.accessory.isOn = true;
                    // console.log(`after isOn: ${isOn}`);
                });
            }
        },
    });
    here.miniWindow.reload();

    // Bind hotkey: ctrl+alt+D
    const aHotKey = ["ctrl", "alt", "d"];
    let aID = hotkey.bind(aHotKey, () => {
        // console.log("hot key fired!")
        here.exec(
            `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'`
        );
    });

    if (aID == undefined) {
        console.error("Failed to register hotkey.");
    }
});
