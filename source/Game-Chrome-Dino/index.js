here.on('load', () => {
    here.miniWindow.set({ title: "🕹Chrome Dino", detail: "T-Rex Game! (Keyboard: Space Key)" })

    here.popover.set({
        type: "webView",
        data: {
            url: "./game/index.html",
            width: 600,
            height: 150,
            backgroundColor: "#FFFFFF",
            foregroundColor: rgba(255, 255, 255, 255),
            hideStatusBar: true
        }
    })
})