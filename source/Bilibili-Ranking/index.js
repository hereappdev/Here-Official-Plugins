const _ = require("underscore")
const http = require("http")
const net = require("net")
const pref = require("pref")

// const jsonPref = pref.all()

function getData(api) {

    const LIMIT = 30

    let entryList = []
    return http.get(api)
    .then(function(response) {
        var json = response.data.data.list

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
            return entryList
        })
}

function updateData() {

    here.miniWindow.set({ title: "Updating…" })

    Promise.all([
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=0&day=1&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=1&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=168&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=3&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=129&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=4&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=36&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=188&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=160&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=119&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=155&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=5&day=3&type=1"),
        getData("https://api.bilibili.com/x/web-interface/ranking?rid=181&day=3&type=1")
    ]).then(function (values) {

        const topFeed = values[0][0]

        // Mini Window
        here.miniWindow.set({
            onClick: () => { here.openURL(topFeed.url) },
            title: topFeed.title,
            detail: "Bilibili排行榜"
        })

        here.menuBar.set({
            title: ""
        })

        let popovers = []


        values.forEach(function(element, index){
            // console.log(index)
            // console.log(values[index])

            popovers[index] = _.map(values[index], (feed, index) => {
                return {
                    title: feed.title + " - @" + feed.author,
                    accessory: {
                        title: "",
                        imageURL: feed.pic,
                        imageCornerRadius: 4
                    },
                    // detail: feed.description,
                    onClick: () => { here.openURL(feed.url) }
                }
            })

        });

        let tabs = [
            {
                title: "全站",
                data: popovers[0]
            },
            {
                title: "动画",
                data: popovers[1]
            },
            {
                title: "国创相关",
                data: popovers[2]
            },
            {
                title: "音乐",
                data: popovers[3]
            },
            {
                title: "舞蹈",
                data: popovers[4]
            },
            {
                title: "游戏",
                data: popovers[5]
            },
            {
                title: "知识",
                data: popovers[6]
            },
            {
                title: "数码",
                data: popovers[7]
            },
            {
                title: "生活",
                data: popovers[8]
            },
            {
                title: "鬼畜",
                data: popovers[9]
            },
            {
                title: "时尚",
                data: popovers[10]
            },
            {
                title: "娱乐",
                data: popovers[11]
            },
            {
                title: "影视",
                data: popovers[12]
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