const http = require("http");
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

function showIP(ip) {
    here.miniWindow.set({ title: "Loading...", detail: "Request " + ip + " info." });

    http.get({
        url: "https://api.ip.sb/geoip/" + ip,
    }).then((response) => {
        if (response.statusCode != 200) {
            here.miniWindow.data = {
                title: "Bad HTTP response.",
                detail: "HTTP " + response.statusCode + " (Click to check IP from clipboard)",
                onClick: () => {
                    updateData();
                },
            };
            here.miniWindow.reload();
            return;
        }

        const ipInfo = response.data;

        // Mini Window
        here.miniWindow.data = {
            title: "IP: " + ip + " (Click to check)",
            detail: ipInfo.isp + " / " + ipInfo.city + " / " + ipInfo.country,
        };
        here.miniWindow.onClick(function () {
            updateData();
        });
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
            here.miniWindow.set({ title: "Failed to get IP address.", detail: "Copy IP firstly" });
            setTimeout(updateData, 3000);
        });
}

// 直接调用 Webview
here.popover = new here.WebViewPopover();
here.popover.data = {
    url: "https://ip.sb/",
    width: 375,
    height: 500,
};
here.popover.reload();

here.on("load", () => {
    updateData();
});

net.onChange((type) => {
    console.verbose("Connection type changed:", type);
    if (net.isReachable()) {
        updateData();
    }
});
