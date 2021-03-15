const _ = require("underscore");
const http = require("http");
const net = require("net");
const pref = require("pref");

// const jsonPref = pref.all()

function timestampFormat( timestamp ) {
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }
 
    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
 
    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
 
    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
 
    if ( timestampDiff < 60 ) { // 一分钟以内
        return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
            return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}

function updateData() {
    const LIMIT = 80;

    let entryList = [];




    http.post({
        url: "https://the.top/api/index/Index/list",
        parameters: {"limit":5,"act":"getNodeLists","page":1,"nameArray":["zhihu_total","weibo","baidu_ssrd","tencent_news","en_today","cnbeta_hot","kr_renqi"],"style":"txt","ispage":0}
    }).then(function (response) {


        const json = response.data.result.lists

console.log(json)
        if (json == undefined) {
            return here.miniWindow.set({ title: "Invalid data." });
        }

        let entryList = json;
        console.log(entryList.length)


        if (entryList.length <= 1) {
            return here.miniWindow.set({ title: "Entrylist is empty." });
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT);
        }

        here.miniWindow.data = { title: "Updating…" };
        here.miniWindow.reload();

        const topFeed = json[0];

        // Mini Window
        here.miniWindow.data = {
            title: topFeed.title,
            detail: "TheTop热门聚合",
            onClick: () => {
                if (topFeed.url != undefined) {
                    here.openURL(topFeed.url);
                }
            },
        };
        here.miniWindow.reload();

        function getPopovers(cateArray) {
            let popovers = [];

            cateArray.forEach(function (item, index) {
                popovers.push(item);
            });
            return _.map(popovers, (feed, index) => {
                return {
                    title: feed.title,
                    accessory: {
                        title: timestampFormat(feed.ts),
                    },
                    onClick: () => {
                        here.openURL(feed.url);
                    },
                };
            });
        }

        let tabs = [
            {
                title: "知乎",
                data: getPopovers(entryList.slice(0,9)),
            },
            {
                title: "微博",
                data: getPopovers(entryList.slice(10,19)),
            },
            {
                title: "百度新闻",
                data: getPopovers(entryList.slice(20,29)),
            }
            ,{
                title: "腾讯新闻",
                data: getPopovers(entryList.slice(30,39)),
            },
            {
                title: "网易新闻",
                data: getPopovers(entryList.slice(40,49)),
            },
            {
                title: "CnBeta",
                data: getPopovers(entryList.slice(50,59)),
            },
            {
                title: "36氪",
                data: getPopovers(entryList.slice(60,69)),
            }
        ];

        let popover = new TabPopover();
        popover.data = tabs;
        here.popover = popover;
        here.popover.reload();
    });
}

here.on("load", () => {
    updateData();
    // Update every 2 hours
    setInterval(updateData, 12 * 3600 * 1000);
});

net.on("change", (type) => {
    console.log("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
