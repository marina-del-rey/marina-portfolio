import * as WindowUtils from './utils/windowManager.js';

document.addEventListener("DOMContentLoaded", function () {
    const desktop = document.getElementById("desktop");
    const taskbarApps = document.getElementById("taskbar-apps");
    const browserIcon = document.getElementById("browser-icon");
    let browserWindow = null;

    // opens browser
    browserIcon.addEventListener("click", function () {
        WindowUtils.openWindow({
            url: "windows/browser.html",
            windowId: "browser-window",
            iconPath: "./assets/icons/browser.ico",
            iconName: "Browser",
            startX: 100,
            startY: 10,
            taskbarId: "browser-task",
            taskbarApps: taskbarApps,
            desktop: desktop
        });
    });
});