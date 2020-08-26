const _ = require("underscore")
const http = require("http")
const net = require("net")

function updateData() {
    const LIMIT = 10

    here.miniWindow.set({ title: "Updating…" })
    http.request("https://www.tophub.fun:8888/v2/GetAllInfoGzip?id=154&page=0")
    .then(function(response) {
        const json = response.data.Data.data
        if (json == undefined) {
            return here.miniWindow.set({ title: "Invalid data." })
        }
    
        let entryList = json
        entryList.shift()
        // 删除第一条内容

        if (entryList == undefined) {
            return here.miniWindow.set({ title: "Invalid data." })
        }

        if (entryList.length <= 0) {
            return here.miniWindow.set({ title: "Entrylist is empty." })
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT)
        }

        const topFeed = entryList[0]
        // Mini Window
        here.miniWindow.set({
            onClick: () => { if (topFeed.Url != undefined)  { here.openURL(topFeed.Url) } },
            title: topFeed.Title,
            detail: "掘金热文"
        })
        here.popover.set(_.map(entryList, (entry, index) => {
            return {
                title: entry.Title,
                onClick: () => { if (entry.Url != undefined)  { here.openURL(entry.Url) } }
            }
        }))
    })
    .catch(function(error) {
        console.error(`Error: ${JSON.stringify(error)}`)
        here.miniWindow.set({ title: JSON.stringify(error) })
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