const moment = require("moment");
const pref = require("pref");
const i18n = require('i18n')

    var displayType = "Year";

    here.miniWindow.data = { title: "Updating…" };
    here.miniWindow.reload();

    const json = pref.all();
    const json1 = pref.get("displayType");

    console.log(JSON.stringify(json))
    if (json == undefined) {
        console.log("No prefs found.");
    }

    if (json["location"] != undefined) {
        location = json["location"];
    }

    


function bar(factor) {
    let bar = "";
    for (let index = 0; index < 16; index++) {
        if (index / 16 <= factor) {
            bar += "■";
        } else {
            bar += "□";
        }
    }
    return bar;
}

function progressOfYear() {
    const startOfYear = moment().startOf("year");
    const endOfYear = moment().endOf("year");

    const totalDaysInYear = endOfYear.diff(startOfYear, "days") + 1;
    const dayOfYear = moment().dayOfYear();

    const factor = ((dayOfYear * 1.0) / totalDaysInYear) * 1.0;

    return {
        percent: Math.round(factor * 100),
        bar: bar(factor),
        current: dayOfYear,
        total: totalDaysInYear,
    };
}

function progressOfMonth() {
    const start = moment().startOf("month");
    const end = moment().endOf("month");

    const totdalDays = end.diff(start, "days") + 1;
    const daoOfMo = parseInt(moment().format("D"));

    const factor = ((daoOfMo * 1.0) / totdalDays) * 1.0;
    return {
        percent: Math.round(factor * 100),
        bar: bar(factor),
        current: daoOfMo,
        total: totdalDays,
    };
}

function progressOfToday() {
    const start = moment().startOf("day");
    const end = moment().endOf("day");

    const factor = (moment().unix() - moment().startOf("day").unix()) / 86400;
    return {
        percent: Math.round(factor * 100),
        bar: bar(factor),
    };
}

function updateData() {
    const year = progressOfYear();
    const month = progressOfMonth();
    const today = progressOfToday();

    let popovers = [
        { title: `${year.bar} ` + __("Year") + `(${year.current}/${year.total})`, accessory: { title: year.percent + "%" } },
        {
            title: `${month.bar} ` + __("Month") + `(${month.current}/${month.total})`,
            accessory: { title: month.percent + "%" },
        },
        {
            title: `${today.bar} ` + __("Day") + `(${moment().format("HH:mm:ss")})`,
            accessory: { title: today.percent + "%" },
        },
    ];

    // Mini Window
    here.miniWindow.data = {
        title: __("Progress of the Year"),
        detail: year.bar,
        accessory: {
            badge: `${year.percent}%`,
        },
    };
    here.miniWindow.reload();

    // Popover
    here.popover.data = popovers;
    here.popover.reload();

    // Dock
    here.dock.data = {
        title: year.percent + "%",
        detail: year.current + "/" + year.total,
    };
    here.dock.reload();
}

here.on("load", () => {
    updateData();
});

here.popover.on("willShow", () => {
    updateData();
});
