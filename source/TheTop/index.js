const _ = require("underscore")
const http = require("http")
const net = require("net")
const pref = require("pref")

// const jsonPref = pref.all()

function updateData() {

    const LIMIT = 20

    let entryList = []
    http.get("https://the.top/cate")
    .then(function(response) {

        const json = response.data.data

        
        if (json == undefined) {
            return here.miniWindow.set({ title: "Invalid data." })
        }
    
        let entryList = json

        if (entryList.length <= 1) {
            return here.miniWindow.set({ title: "Entrylist is empty." })
        }
    
        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT)
        }

        here.miniWindow.set({ title: "Updating…" })


        const topFeed = entryList["comprehensive"][0][0]
        
        // Mini Window
        here.miniWindow.set({
            onClick: () => { here.openURL(topFeed.url) },
            title: topFeed.title,
            detail: "TheTop热门聚合"
        })

        here.menuBar.set({
            title: ""
        })


        function getPopovers(cateArray){
            let popovers = []

            cateArray.forEach(function(item, index){
            
                item.forEach(function(feed, index){
                    if(index < 3)
                        popovers.push(item[index])
                })
            
            })

            return _.map(popovers, (feed, index) => {

                if(feed.heat != undefined){
                    return {
                        title: feed.title,
                        accessory: {
                            title: feed.heat
                        },
                        onClick: () => { here.openURL(feed.url) }
                    }
                }else{
                    return {
                        title: feed.title,
                        onClick: () => { here.openURL(feed.url) }
                    }
                }
            })

        }

        let tabs = [
            {
                title: "综合",
                data: getPopovers(entryList["comprehensive"])
            },
            {
                title: "新闻",
                data: getPopovers(entryList["news"])
            },
            {
                title: "科技",
                data: getPopovers(entryList["tech"])
            },
            {
                title: "财金",
                data: getPopovers(entryList["money"])
            },
            {
                title: "社区",
                data: getPopovers(entryList["society"])
            }
        ]

        here.popover.set(tabs)

    })


}

here.on('load', () => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 12 * 3600 * 1000)
})

net.on('change', (type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})