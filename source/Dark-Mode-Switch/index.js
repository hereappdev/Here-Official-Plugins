const hotkey = require("hotkey");
const os = require('os');
const i18n = require('i18n')

function checkDarkMode() {
    if (os.interfaceThemeIsDark()) {
        here.miniWindow.data.accessory.isOn = true;
    } else {
        here.miniWindow.data.accessory.isOn = false;
    }
    here.miniWindow.reload();
}

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: __("Dark Mode Switch"),
        detail: __("Click to switch"),
    };

    // Menu Bar
    here.menuBar = new MenuBar();
    here.menuBar.onClick(() => {

        if (!here.miniWindow.data.accessory.isOn) {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to true'`
                ).then(() => {
                    console.log("Switch to dark.");
                    // here.miniWindow.data.accessory.isOn = false;
                    // console.log(`after isOn: ${isOn}`);
                    here.menuBar.setIcon("./light.png")
                    .catch((err) => {
                         console.error(err)
                    })
                    here.menuBar.reload();
                });
            } else {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to false'`
                ).then(() => {
                    console.log("Switch to light.");
                    //  here.miniWindow.data.accessory.isOn = true;
                    // console.log(`after isOn: ${isOn}`);
                    here.menuBar.setIcon("./dark.png")
                    .catch((err) => {
                         console.error(err)
                    })
                    here.menuBar.reload();
                });
            }

    });

    here.menuBar.reload();
    
    here.miniWindow.data.accessory = new here.SwitchAccessory({
        isOn: false,
        onValueChange: (isOn) => {
            // console.log(`isFirstTime: ${isFirstTime}`);
            if (isOn) {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to true'`
                ).then(() => {
                    // console.log("Switch to dark.");
                    // here.miniWindow.data.accessory.isOn = false;
                    // console.log(`after isOn: ${isOn}`);
                });
            } else {
                here.exec(
                    `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to false'`
                ).then(() => {
                    // console.log("Switch to light.");
                    // here.miniWindow.data.accessory.isOn = true;
                    // console.log(`after isOn: ${isOn}`);
                });
            }
        },
    });
    here.miniWindow.reload();
    
    os.on('interfaceThemeChange', () => {
        checkDarkMode()
    });
   
    checkDarkMode()
    
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
