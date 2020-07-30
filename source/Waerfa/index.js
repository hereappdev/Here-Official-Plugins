const _ = require("underscore")
const net = require("net")
const pref = require("pref")

const json = pref.all();

var postSum = 30;

console.log(json["postSum"])
if (json == undefined) {
    console.log("No prefs found.")
}
if (json["postSum"] != undefined) {
    postSum = json["postSum"]
}

function updateData() {
    const LIMIT = postSum;
    
    here.miniWindow.set({ title: "Updating…" })
    here.parseRSSFeed("https://www.waerfa.com/feed")
    .then((feed) => {
    	// console.log(JSON.stringify(feed.items[0]))
        if (feed.items.length <= 0) {
            return here.miniWindow.set({ title: "No item found." })
        }
    
        if (feed.items.length > LIMIT) {
            feed.items = feed.items.slice(0, LIMIT)
        }
    
        const topFeed = feed.items[0]
        // Mini Window
        here.miniWindow.set({
            onClick: () => { here.openURL("https://www.waerfa.com/")},
            title: topFeed.title,
            detail: "Mac玩儿法"
        })
        here.popover.set(_.map(feed.items, (item, index) => {
            return {
                title: item.title,
                onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } },
            }
        }))
    })
    .catch((error) => {
        console.error(`Error: ${JSON.stringify(error)}`)
    })
}

here.on('load', () => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 2*3600*1000);
})

net.onChange((type) => {
    console.verbose("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})