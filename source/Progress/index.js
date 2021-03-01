const moment = require("moment");

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
        { title: `${year.bar} Year ${year.current}/${year.total}`, accessory: { title: year.percent + "%" } },
        {
            title: `${month.bar} Month ${month.current}/${month.total}`,
            accessory: { title: month.percent + "%" },
        },
        {
            title: `${today.bar} Day ${moment().format("HH:mm:ss")}`,
            accessory: { title: today.percent + "%" },
        },
    ];

    // Mini Window
    here.miniWindow.data = {
        title: "Progress of the Year",
        detail: year.bar,
        accessory: {
            badge: `${year.percent}%`,
        },
    };
    here.miniWindow.reload();

    // Popover
    here.popover.data = popovers;
    here.popover.reload();
}

here.on("load", () => {
    updateData();
});

here.popover.on("willShow", () => {
    updateData();
});
