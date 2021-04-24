const i18n = require('i18n')

here.on("load", () => {
    const fileName = "NewFile.txt";
    const filePath = `~/Desktop/${fileName}`;

    // Mini Window
    here.miniWindow.data = {
        title: __("Create an empty file"),
        detail: filePath,
    };
    here.miniWindow.onClick(function () {
        here.exec(`touch ${filePath}`).then(() => {
            here.exec(`open ${filePath}`);
        });
    });
    here.miniWindow.reload();
});
