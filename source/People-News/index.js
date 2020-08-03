const _ = require("underscore")
const http = require("http")
const net = require("net")
const pref = require("pref")

const jsonPref = pref.all()

function getData(api) {

    const LIMIT = 20

    let entryList = []
    return here.parseRSSFeed(api)
        .then(function (feed) {

            const entryList = feed.items

            // console.log(JSON.stringify(feed.items[0]))
            if (feed.items.length <= 0) {
                return here.miniWindow.set({ title: "No item found." })
            }
        
            if (feed.items.length > LIMIT) {
                feed.items = feed.items.slice(0, LIMIT)
            }

            return entryList
        })
}

function updateData() {

    here.miniWindow.set({ title: "Updating…" })

    Promise.all([
        getData("http://www.people.com.cn/rss/politics.xml"),
        getData("http://www.people.com.cn/rss/world.xml"),
        getData("http://www.people.com.cn/rss/finance.xml"),
        getData("http://www.people.com.cn/rss/sports.xml")
    ]).then(function (values) {
        const topFeed = values[0][0]

        // console.log(topFeed)
        
        // Mini Window
        here.miniWindow.set({
            title: topFeed.title,
            detail: "人民网",
            onClick: () => { here.openURL("http://people.cn/") }
        })

        here.menuBar.set({
            title: ""
        })

        let popovers = []

        values.forEach(function(element, index){
            popovers[index] = _.map(values[index], (feed, index) => {
                return {
                    title: feed.title,
                    // detail: feed.description,
                    onClick: () => { here.openURL("http://people.cn/") }
                }
            })
            popovers[index].push({
                title: "View All…",
                onClick: () => { _.each(values[index], (feed) => { here.openURL(feed.link) }) }
            })
        });

        let tabs = [
            {
                title: "国内新闻",
                data: popovers[0]
            },
            {
                title: "国际新闻",
                data: popovers[1]
            },
            {
                title: "经济新闻",
                data: popovers[2]
            },
            {
                title: "体育新闻",
                data: popovers[3]
            }
        ]

        here.popover.set(tabs)

    });
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