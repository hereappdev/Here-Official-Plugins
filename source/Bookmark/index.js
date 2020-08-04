const pref = require("pref")

var json = pref.all()

if (json == undefined) {
    console.log("No prefs found.")
}

here.on('load', () => {
    here.setMiniWindow({ 
        title: json["websiteName"],
        detail: json["websiteURL"]
    })
console.log(json["windowWidth"])
    here.setPopover({
        type: "webView",
        data: {
            url: json["websiteURL"],
            width: Number(json["windowWidth"]),
            height: Number(json["windowHeight"]),
            backgroundColor: json["backgroundColor"],
            foregroundColor: json["foregroundColor"],
            hideStatusBar: json["hideStatusBar"] == "true" ? 1 : 0
        }
    })
})