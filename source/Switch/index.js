function isDesktopIconsHidden() {
    return here.exec("defaults read com.apple.finder CreateDesktop");
}

function setDesktopIconsHidden(hidden) {
    here.exec(`defaults write com.apple.finder CreateDesktop -boolean ${hidden}; killall Finder`);
}

async function hideDesktopIconSwitch() {
    return isDesktopIconsHidden().then((stdOut) => {
        const isHidden = stdOut == 0;
        console.log(`stdOut: ${stdOut}`);
        console.log(`isHidden: ${isHidden}`);

        return Promise.resolve({
            title: "Hide desktop icons",
            accessory: new here.SwitchAccessory({
                isOn: isHidden,
                onValueChange: (isOn) => {
                    console.log(`isOn: ${isOn}`);
                    setDesktopIconsHidden(!isOn);
                },
            }),
        });
    });
}

here.on("load", async () => {
    here.miniWindow.set({
        title: "Simple Switch",
        detail: "All in one Switches.",
    });

    hideDesktopIconSwitch().then((switchData) => {
        here.popover.data = [switchData];
        here.popover.reload();
    })
    .catch((error) => {
        console.error(error)
    });
});
