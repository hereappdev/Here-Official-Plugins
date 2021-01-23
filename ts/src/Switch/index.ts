/// <reference path="../../../../hereapp/jslib/src/common.d.ts" />

function isDesktopIconsHidden() {
    return here.exec("defaults read com.apple.finder CreateDesktop");
}

function setDesktopIconsHidden(hidden: boolean) {
    here.exec(`defaults write com.apple.finder CreateDesktop -boolean ${hidden}; killall Finder`);
}

async function hideDesktopIconSwitch() {
    const stdOut: string | number = await isDesktopIconsHidden()
    const isHidden = stdOut == 0;
    console.log(`stdOut: ${stdOut}`);
    console.log(`isHidden: ${isHidden}`);
    return {
        title: "Hide desktop icons",
        accessory: new here.SwitchAccessory({
            isOn: isHidden,
            onValueChange: (isOn: boolean) => {
                console.log(`isOn: ${isOn}`);
                setDesktopIconsHidden(!isOn);
            },
        })
    }
}

here.on("load", async () => {
    here.miniWindow.set({
        title: "Simple Switch",
        detail: "All in one Switches."
    })

    here.popover.data = [
        await hideDesktopIconSwitch()
    ]
    here.popover.reload()
});
