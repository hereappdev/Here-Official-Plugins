const pref = require("pref");
const json = pref.all();

if (json == undefined) {
    console.log("No prefs found.");
}

here.on("load", () => {
    here.miniWindow.data = {
        title: json["websiteName"],
        detail: json["websiteURL"],
    };
    here.miniWindow.reload();

    here.popover = new here.WebViewPopover();
    here.popover.data = {
        url: json["websiteURL"],
        width: json["windowWidth"],
        height: json["windowHeight"],
        backgroundColor: json["backgroundColor"],
        foregroundColor: json["foregroundColor"],
        hideStatusBar: json["hideStatusBar"] == "true" ? 1 : 0,
    };
    here.popover.reload();
});
