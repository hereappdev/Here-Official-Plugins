const _ = require("underscore");
const http = require("http");
const net = require("net");

const WEIBO_API =
    "https://api.weibo.cn/2/guest/page?gsid=_2AkMsRHgCf8NhqwJRmPEWzGLrbIp1zgvEieKaGInZJRMxHRl-wT9jqkwotRV6BsnXmI8TER6eO_7HUnQEHkvXuECqqwND&uid=1009309907243&wm=3333_2001&i=eec40a6&b=0&from=1086093010&checktoken=44a6ad381333a8e42d1cbfd4b967e106&c=iphone&networktype=wifi&v_p=62&skin=default&v_f=1&s=22222222&did=de72f6ddab0fb8c7e531768a5bcc3b62&lang=zh_CN&ua=iPhone10,3__weibo__8.6.0__iphone__os11.3.1&sflag=1&ft=0&aid=01AuIbc-C3agwrxmEBKX4toj0P0yWVwPZCR5lBXEPc01lTRkU.&moduleID=pagecard&uicode=10000011&featurecode=10000085&feed_mypage_card_remould_enable=1&luicode=10000003&count=20&extparam=filter_type%3Drealtimehot%26mi_cid%3D100103%26pos%3D0_0%26c_type%3D30%26display_time%3D1528362831&containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot";

function updateData() {
    const LIMIT = 10;
    let entryList = [];

    // Setup title
    here.miniWindow.data.title = "Updating…"
    here.miniWindow.reload()

    // Featch data from weibo
    http.request(WEIBO_API)
        .then((response) => {
            const json = response.data;
            if (
                json == undefined ||
                json.cards == undefined ||
                json.cards[0] == undefined ||
                json.cards[0].card_group == undefined
            ) {
                here.miniWindow.data.title = "Invalid data."
                here.miniWindow.reload()
                return
            }

            entryList = json.cards[0].card_group;
            if (entryList.length <= 1) {
                here.miniWindow.data.title = "Entrylist is empty."
                here.miniWindow.reload()
                return
            }

            if (entryList.length > LIMIT) {
                entryList = entryList.slice(0, LIMIT);
            }

            entryList = _.map(entryList, (entry) => {
                entry.title = entry.desc;
                entry.url = `https://s.weibo.com/weibo?q=${entry["desc"]}`;
                entry.desc_extr = entry.desc_extr;
                return entry;
            });

            const topFeed = entryList[1];

            // Mini Window
            here.miniWindow.data = {
                title: topFeed.title,
                detail: "微博热搜榜",
                accessory: {
                    title: topFeed.desc_extr == null ? "置顶🔝" : "🔥" + (parseInt(topFeed.desc_extr / 10000) + "万"),
                },
            }
            here.miniWindow.onClick(() => {
                if (topFeed.url != undefined) {
                    here.openURL(topFeed.url);
                }
            })
            here.miniWindow.reload()
            
            // Popover
            here.popover = new here.ListPopover()
            here.popover.data = _.map(entryList, (entry, index) => {
                let prefix = (entry["desc_extr"] == null) ? "置顶🔝" : "🔥"
                let acTitle = `${prefix}${(parseInt(entry["desc_extr"]) / 10000)}万`
                return {
                    title: entry.title,
                    accessory: { title: acTitle },
                    onClick: () => { here.openURL(entry.url) }
                }
            })
            here.popover.reload()
        })
        .catch(function (error) {
            console.error(`Error: ${JSON.stringify(error)}`);
            // here.miniWindow.set({ title: JSON.stringify(error) });
        });
}

here.on("load", () => {
    updateData();
    // Update every 2 hours
    setInterval(updateData, 2 * 3600 * 1000);
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
