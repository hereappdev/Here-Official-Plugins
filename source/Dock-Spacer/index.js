const i18n = require('i18n')

function onClick() {
    here.exec(`defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="small-spacer-tile";}';killall Dock`);
}

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: __("Dock Spacer"),
        detail: __("Click to add spacer to Dock"),
    };
    here.miniWindow.onClick(() => {
        console.log("Did click on miniwin cell");
        onClick();
    });
    here.miniWindow.reload();
});
