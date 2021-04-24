const pb = require("pasteboard");
const process = require("process");
const _ = require("underscore");
const i18n = require("i18n");
const { version } = require("os");

function updateData() {
    const versions = process.versions;
    const keys = _.allKeys(versions);
    if (keys.includes("uuid")) {
        keys.splice(keys.indexOf("uuid"), 1);
    }
    let versionData = _.map(keys, (key) => {
        let val = versions[key];
        return {
            title: key,
            accessory: {
                title: val,
            },
        };
    });
    let debug = [];
    debug.push({
        title: __("Reveal Logs in Finder…"),
        onClick: () => {
            process.openLogsFolder();
        },
    });
    debug.push({
        title: __("Reveal Plugins in Finder…"),
        onClick: () => {
            process.openPluginsFolder();
        },
    });
    if (typeof process.checkForUpdates === "function") {
        // checkForUpdates function exists
        debug.push({
            title: __("Check for Updates…"),
            onClick: () => {
                process.checkForUpdates();
            },
        });
    }
    debug.push({
        title: `Toggle auto install preloaded plugins: ${process.installPreloadPluginsAtLaunch()}`,
        onClick: () => {
            process.toggleInstallPreloadPluginsAtLaunch();
            updateData();
        },
    });

    // Config.json
    let conf = here.getConfig();
    const confKeys = _.allKeys(conf);
    let confTab = _.map(confKeys, (k) => {
        return { title: `${k}: ${conf[k]}` }
    })
    // console.log(`confTab`)

    // Popovers
    here.popover.reload();
    here.popover = new here.TabPopover();
    here.popover.data = [
        {
            title: __("Version"),
            data: _.sortBy(versionData, (v) => {
                return v.title;
            }),
        },
        {
            title: __("Debug"),
            data: debug,
        },
        {
            title: __("Tab-Config"),
            data: confTab,
        }
    ];
    here.popover.reload();

    // Mini Window
    here.miniWindow.data = {
        title: __("Debug Info"),
        detail: `Here (${process.versions.stage})`,
        accessory: {
            title: process.versions.shortVersion,
            detail: process.versions.buildNumber,
        },
        onClick: () => {
            pb.setText(JSON.stringify(process.versions));
            here.hudNotification("Debug info copied.");
        }
    };
    here.miniWindow.reload();

    // Menu Bar
    here.menuBar.data = {
        title: "v" + process.versions.shortVersion,
        detail: process.versions.buildNumber,
    };
    here.menuBar.reload();

    // Dock
    here.dock.data = {
        title: "v" + process.versions.shortVersion,
        detail: process.versions.buildNumber,
    };
    here.dock.reload();
}

here.on("load", () => {
    updateData();
});
