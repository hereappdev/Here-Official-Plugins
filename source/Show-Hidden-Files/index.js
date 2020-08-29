function isDesktopIconsHidden() {
    return here.exec("defaults read com.apple.finder CreateDesktop");
}

function setDesktopIconsHidden(hidden) {
    here.exec(`defaults write com.apple.finder CreateDesktop -boolean ${hidden}; killall Finder`);
}

here.on("load", () => {
    isDesktopIconsHidden().then((stdOut) => {
        const isHidden = stdOut == 0;
        console.log(`stdOut: ${stdOut}`);
        console.log(`isHidden: ${isHidden}`);

        here.miniWindow.data = {
            title: "Hide Desktop Icons",
            detail: "Click to show/hide desktop icons"
        };
        here.miniWindow.data.accessory = new here.SwitchAccessory({
            isOn: isHidden,
            onValueChange: (isOn) => {
                console.log(`isOn: ${isOn}`);
                setDesktopIconsHidden(!isOn);
            },
        });
        here.miniWindow.reload();
    });
});
