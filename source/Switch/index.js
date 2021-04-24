require(`./switches.js`);
const i18n = require('i18n')

here.on("load", () => {
    here.miniWindow.set({
        title: "Simple Switch",
        detail: __("All in one Switches."),
    });

    Promise.all([hideDesktopIconSwitch(), allFileHiddenSwitch(), doNotDisturbSwitch()])
        .then((list) => {
            // Reload popover
            here.popover.set(list);

            // Reload Menu Bar
            here.menuBar.set({});
        })
        .catch((error) => {
            console.error(error);
        });
});
