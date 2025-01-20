import * as WindowUtils from './utils/windowManager.js';

document.addEventListener("DOMContentLoaded", function () {
    const desktop = document.getElementById("desktop");
    const taskbarApps = document.getElementById("taskbar-apps");
    const notepadIcon = document.getElementById("notepad-icon");
    let notepadWindow = null;

    // opens notepad
    notepadIcon.addEventListener("click", function () {
        WindowUtils.openWindow({
            url: "windows/notepad.html",
            windowId: "notepad-window",
            iconPath: "./assets/icons/notepad.ico",
            iconName: "Notepad",
            startX: 100,
            startY: 100,
            taskbarId: "notepad-task",
            taskbarApps: taskbarApps,
            desktop: desktop
        });
    });
});