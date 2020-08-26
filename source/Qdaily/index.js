const _ = require("underscore")
const net = require("net")
const http = require("http")

function updateData() {
    const LIMIT = 30
    const nowTime = new Date()
    
    here.miniWindow.set({ title: "Updating…" })
    http.request({
        url: "http://www.qdaily.com/homes/articlemore/" + Math.round(new Date().getTime()/1000) + ".json",
        allowHTTPRequest: true
    })
    .then(function(response) {
        let feed = response.data.data.feeds

        if (feed.length <= 0) {
            return here.miniWindow.set({ title: "No item found." })
        }
    
        if (feed.length > LIMIT) {
            feed = feed.slice(10)
        }

        const topFeed = feed[0]
        // Mini Window
        here.miniWindow.set({
            onClick: () => { if (topFeed.post.id != undefined)  { here.openURL("http://www.qdaily.com/articles/" + topFeed.post.id + ".html") } },
            title: topFeed.post.title.replace("大公司头条：",""),
            detail: "好奇心日报"
        })
        here.popover.set(_.map(feed, (item, index) => {
            return {
                title: item.post.title.replace("大公司头条：",""),
                onClick: () => { if (item.post.id != undefined)  { here.openURL("http://www.qdaily.com/articles/" + item.post.id + ".html") } }
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