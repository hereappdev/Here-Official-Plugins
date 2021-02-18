// Do Not Disturb
function isDoNotDisturbOn() {
    return here.exec("defaults -currentHost read com.apple.notificationcenterui doNotDisturb");
}

function setDoNotDisturbOn(isOn) {
    const boolStr = isOn ? "TRUE" : "FALSE";
    if (isOn) {
        return here.exec('date -u "+%Y-%m-%dT%TZ"').then((stdOut) => {
            console.log(`stdOut: ${stdOut}`);
            const tdate = stdOut.replace(`\n`, "");
            return here.exec(
                "defaults -currentHost write com.apple.notificationcenterui doNotDisturb -bool TRUE; defaults -currentHost write com.apple.notificationcenterui doNotDisturbDate -date " +
                    tdate +
                    "; osascript -e 'quit application \"NotificationCenter\" ' && killall usernoted"
            );
        });
    } else {
        return here.exec(
            "defaults -currentHost write com.apple.notificationcenterui doNotDisturb -bool FALSE; defaults -currentHost delete com.apple.notificationcenterui doNotDisturbDate; osascript -e 'quit application \"NotificationCenter\" ' && killall usernoted"
        );
    }
}

function doNotDisturbSwitch() {
    return isDoNotDisturbOn().then((stdOut) => {
        const isDNDOn = stdOut == "NO";
        // console.log(`stdOut: ${stdOut}`);
        // console.log(`isDoNotDisturbOn: ${isDNDOn}`);

        return Promise.resolve({
            title: "Do Not Disturb",
            accessory: new here.SwitchAccessory({
                id: "accessory-dnd",
                isOn: isDNDOn,
                onValueChange: (isOn) => {
                    console.log(`isOn: ${isOn}`);
                    here.popover.update(`#accessory-dnd.isOn`, isOn)
                    
                    setDoNotDisturbOn(isOn)
                        .then(() => {
                            here.hudNotification(`Do Not Disturb is ${isOn ? "On" : "Off"}.`);
                        })
                        .catch(() => {
                            console.log(`Failed to setDoNotDisturbOn(${isOn})`);
                        });
                },
            }),
        });
    });
}

// Hide Desktop Icons
function isDesktopIconsHidden() {
    return here.exec("defaults read com.apple.finder CreateDesktop");
}

function setDesktopIconsHidden(hidden) {
    return here.exec(`defaults write com.apple.finder CreateDesktop -boolean ${hidden}; killall Finder`);
}

function hideDesktopIconSwitch() {
    return isDesktopIconsHidden().then((stdOut) => {
        const isHidden = stdOut == "NO";
        console.log(`stdOut: ${stdOut}`);
        console.log(`isDesktopIconsHidden: ${isHidden}`);

        return Promise.resolve({
            title: "Hide desktop icons",
            accessory: new here.SwitchAccessory({
                id: "accessory-hdi",
                isOn: isHidden,
                onValueChange: (isOn) => {
                    here.popover.update("#accessory-hdi.isOn", isOn);
                    setDesktopIconsHidden(!isOn)
                        .then(() => {
                            here.hudNotification(`Hide desktop icons: ${isOn ? "On" : "Off"}.`);
                        })
                        .catch(() => {
                            console.log(`Failed to setDesktopIconsHidden(${!isOn})`);
                        });
                },
            }),
        });
    });
}

// Show Hidden Files
function isShowingAllFiles() {
    return here.exec("defaults read com.apple.finder AppleShowAllFiles");
}

function setShowAllFiles(hidden) {
    return here.exec(`defaults write com.apple.finder AppleShowAllFiles -boolean ${hidden}; killall Finder`);
}

function allFileHiddenSwitch() {
    return isShowingAllFiles().then((stdOut) => {
        const isShowing = stdOut == "NO";
        console.log(`stdOut: ${stdOut}`);
        console.log(`isShowing: ${isShowing}`);

        return Promise.resolve({
            title: "Show hidden files",
            accessory: new here.SwitchAccessory({
                id: "accessory-shf",
                isOn: isShowing,
                onValueChange: (isOn) => {
                    console.log(`isOn: ${isOn}`);
                    here.popover.update("#accessory-shf.isOn", isOn);

                    setShowAllFiles(isOn)
                        .then(() => {
                            here.hudNotification(`Show hidden files: ${isOn ? "On" : "Off"}.`);
                        })
                        .catch(() => {
                            console.log(`Failed to setShowAllFiles(${isOn})`);
                        });
                },
            }),
        });
    });
}
