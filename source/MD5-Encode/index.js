const _ = require("underscore");
const crypto = require("crypto");
const pasteboard = require("pasteboard");
const i18n = require('i18n')

here.on("load", () => {
    // Mini Window
    here.miniWindow.data = {
        title: __("MD5 Encode"),
        detail: __("Encode from clipboard"),
    };
    here.miniWindow.onClick(function () {
        const text = pasteboard.getText();
        const encoded = crypto.md5(text);
        // console.log(`encoded: ${encoded}`)
        pasteboard.setText(encoded);
        here.postNotification("HUD", `String encoded: ${encoded}`);
    });
    here.miniWindow.reload();
});

here.on("query", (query, keyword) => {
    console.log(`query: ${query} keyword: ${keyword}`)
    if (typeof query != "string") {
        console.error(`query is not string!`);
        return;
    }
    if (query.length == 0) {
        console.warn(`query is empty.`)
        return;
    }

    const encoded = crypto.md5(query);
    console.log(`encoded: ${encoded}`)
    pasteboard.setText(encoded);
    here.postNotification("HUD", `String encoded: ${encoded}`);
});
