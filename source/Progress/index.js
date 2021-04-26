const moment = require("moment");
const pref = require("pref");
const i18n = require("i18n");

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

    const timestamp = moment().unix();
    const total = 86400;
    const factor = (timestamp - moment().startOf("day").unix()) / total;
    return {
        percent: Math.round(factor * 100),
        bar: bar(factor),
        current: timestamp,
        total: total,
    };
}

function convertToMiniWinData(key, data) {
    console.log(`convertToMiniWinData: ${key}`);
    return {
        title: __(`Progress of the ${key}`),
        detail: data.bar,
        accessory: {
            badge: `${data.percent}%`,
        },
    };
}

function updateData() {
    const year = progressOfYear();
    const month = progressOfMonth();
    const today = progressOfToday();

    console.log(`123`);
    console.log(pref._valueForItem(pref.getPrefs()));
    console.log(`123`);
    let displayType = pref.get("displayType");
    if (displayType == undefined || typeof displayType != "string") {
        displayType = "Year";
    }
    console.log(`displayType: ${displayType.toLowerCase()}`);
    let miniWinData = {};
    switch (displayType.toLowerCase()) {
        case "year":
            miniWinData = convertToMiniWinData(displayType, year);
            break;
        case "month":
            miniWinData = convertToMiniWinData(displayType, month);
            break;
        case "today":
            miniWinData = convertToMiniWinData(displayType, today);
            break;
        default:
            miniWinData = convertToMiniWinData(displayType, year);
            break;
    }

    let popovers = [
        {
            title: `${year.bar} ` + __("Year") + `(${year.current}/${year.total})`,
            accessory: { title: year.percent + "%" },
        },
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
    here.miniWindow.data = miniWinData;
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
