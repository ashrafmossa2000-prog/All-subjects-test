const { app, BrowserWindow } = require("electron");
const path = require("path");

// ✅ إصلاح مشكلة ICU في Electron
app.commandLine.appendSwitch('icu-data-dir', path.join(__dirname, 'node_modules', 'electron', 'dist', 'locales'));
app.commandLine.appendSwitch('lang', 'ar');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 850,
        minWidth: 400,
        minHeight: 600,
        title: "منصة الاختبارات - Quiz Pro",
        backgroundColor: "#0f0f1e",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            spellcheck: false
        },
        show: false,
        autoHideMenuBar: true
    });

    mainWindow.loadFile("index.html");

    // إظهار النافذة بعد التحميل الكامل
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // فتح أدوات المطور اختيارياً (اضغط F12)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F12' && input.type === 'keyDown') {
            mainWindow.webContents.toggleDevTools();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// منع فتح نوافذ جديدة غير مصرح بها
app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
        return { action: 'deny' };
    });
});