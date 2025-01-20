import * as WindowUtils from './windowManager.js';

document.addEventListener("DOMContentLoaded", function () {
    const desktop = document.getElementById("desktop");
    const taskbarApps = document.getElementById("taskbar-apps");

    // open notepad window
    WindowUtils.openWindow({
        url: "windows/notepad.html",
        windowId: "notepad-window",
        iconPath: "./assets/icons/notepad.ico",
        iconName: "Notepad",
        startX: 640,
        startY: 150,
        taskbarId: "notepad-task",
        taskbarApps: taskbarApps,
        desktop: desktop
    });

    // open browser window
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
