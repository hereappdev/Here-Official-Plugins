const http = require("http");
const pasteboard = require("pasteboard");
const net = require("net");

var isIp = (function () {
    var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return function (value) {
        var valid = regexp.test(value);
        if (!valid) {
            //首先必须是 xxx.xxx.xxx.xxx 类型的数字，如果不是，返回false
            return false;
        }
        return value.split(".").every(function (num) {
            //切割开来，每个都做对比，可以为0，可以小于等于255，但是不可以0开头的俩位数
            //只要有一个不符合就返回false
            if (num.length > 1 && num.charAt(0) === "0") {
                //大于1位的，开头都不可以是‘0’
                return false;
            } else if (parseInt(num, 10) > 255) {
                //大于255的不能通过
                return false;
            }
            return true;
        });
    };
})();

function clipboardQuery() {
    var getIP = pasteboard.getText();
    console.log("getIP");
    if (isIp(getIP)) {
        showIP(getIP);
    } else {
        here.hudNotification("Not a valid IP address in the clipboard.");
    }
}

function showIP(ip) {
    here.miniWindow.data = { title: "Loading...", detail: "Request " + ip + " info." };
    here.miniWindow.reload();

    http.get(`https://api.ip.sb/geoip/${ip}`).then((response) => {
        if (response.statusCode != 200) {
            here.miniWindow.data = {
                title: "Bad HTTP response.",
                detail: "HTTP " + response.statusCode + " (Click to check IP from clipboard)",
            };
        } else {
            const ipInfo = response.data;

            // Mini Window
            here.miniWindow.data = {
                title: "IP: " + ip + " (Click to check)",
                detail: ipInfo.isp + " / " + ipInfo.city + " / " + ipInfo.country,
            };
        }
        here.miniWindow.onClick(clipboardQuery);
        here.miniWindow.reload();
    });
}

function updateData() {
    let aIP = "";

    http.get("https://api.ip.sb/jsonip")
        .then((response) => {
            if (response.data && response.data.ip) {
                // console.log(response.data.ip)
                aIP = response.data.ip;
                return showIP(aIP);
            }
            return Promise.reject("Can't get current IP.");
        })
        .catch((error) => {
            console.error(JSON.stringify(error));

            here.miniWindow.data.title = "Failed to get IP address.";
            here.miniWindow.data.detail = "Copy IP firstly";
            here.miniWindow.reload();

            setTimeout(updateData, 3000);
        });
}

here.on("load", () => {
    updateData();
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});

here.popover = new here.WebViewPopover();
here.popover.data = {
    url: "https://ip.sb/ip/",
    width: 375,
    height: 500,
};
here.popover.reload();
