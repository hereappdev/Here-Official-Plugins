const _ = require("underscore")
const net = require("net")

function updateData() {
    const LIMIT = 50
    
    here.miniWindow.set({ title: "Updating…" })
    here.parseRSSFeed("https://developer.apple.com/news/releases/rss/releases.rss")
    .then((feed) => {
    	// console.log(JSON.stringify(feed))
        if (feed.items.length <= 0) {
            return here.miniWindow.set({ title: "No item found." })
        }
    
        if (feed.items.length > LIMIT) {
            feed.items = feed.items.slice(0, LIMIT)
        }
    
        const topFeed = feed.items[0]
        // Mini Window
        here.miniWindow.set({
            onClick: () => { if (topFeed.link != undefined)  { here.openURL("https://developer.apple.com/news/releases/") } },
            title: topFeed.title,
            detail: "Apple Developer Releases",
            accessory: { badge: feed.items.length.toString() }
        })

        let dataAll = feed.items.map( function(item, index){
            return {
                title: item.title,
                // accessory: {
                //     title: "date"
                // },
                onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } },
            }
        })

        let dataBeta = feed.items.filter(function(item, index) {
            if(item.title.indexOf("beta") > 1){
                // console.log(index)
                return true;  
            }
            return false
            
        }).map( function(item, index){
            return {
                title: item.title,
                // accessory: {
                //     title: "date"
                // },
                onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } },
            }
        })

        let dataReleased = feed.items.filter(function(item, index) {
            if(item.title.indexOf("beta") < 1){
                // console.log(index)
                return true;  
            }
            return false
        }).map( function(item, index){
            return {
                title: item.title,
                // accessory: {
                //     title: "date"
                // },
                onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } },
            }
        })

        let tabs = [
            {
                title: "All",
                data: dataAll
            },
            {
                title: "Beta",
                data: dataBeta
            },
            {
                title: "Released",
                data: dataReleased
            }
        ]
        here.popover.set(tabs)


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