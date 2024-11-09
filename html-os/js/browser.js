document.addEventListener("DOMContentLoaded", function () {
    const taskbarApps = document.getElementById("taskbar-apps");
    const browserIcon = document.getElementById("browser-icon");
    let browserWindow = null;

    // opens browser
    function openBrowser() {
        if (browserWindow) {
            browserWindow.style.display = "block";
            browserWindow.style.zIndex = 10;
            addNotepadTaskbarIcon();
            setActiveState(true);
            return;
        }

        fetch("windows/browser.html")
            .then(response => response.text())
            .then(html => {
                const desktop = document.getElementById("desktop");
                browserWindow = document.createElement("div");
                browserWindow.innerHTML = html;
                desktop.appendChild(browserWindow);

                browserWindow.style.position = "absolute";
                browserWindow.style.top = "100px";
                browserWindow.style.left = "100px";
                makeDraggable(browserWindow);

                //addNotepadTaskbarIcon();
                //setActiveState(true);

                // buttons
                //browserWindow.querySelector(".minimize").addEventListener("click", minimizeNotepad);
                //browserWindow.querySelector(".maximize").addEventListener("click", toggleMaximizeNotepad);
                //browserWindow.querySelector(".close").addEventListener("click", closeNotepad);

                // click inside the window to activate it
                browserWindow.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    //setActiveState(true);
                });
            });
    }

    function makeDraggable(element) {
        const titleBar = element.querySelector(".window-nav");
        let offsetX = 0, offsetY = 0, initialX, initialY;

        titleBar.addEventListener("mousedown", (e) => {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;

            document.addEventListener("mousemove", dragWindow);
            document.addEventListener("mouseup", stopDragging);
        });

        function dragWindow(e) {
            offsetX = e.clientX - initialX;
            offsetY = e.clientY - initialY;
            initialX = e.clientX;
            initialY = e.clientY;

            element.style.top = `${element.offsetTop + offsetY}px`;
            element.style.left = `${element.offsetLeft + offsetX}px`;
        }

        function stopDragging() {
            document.removeEventListener("mousemove", dragWindow);
            document.removeEventListener("mouseup", stopDragging);
        }
    }

    browserIcon.addEventListener("click", () => {
        openBrowser();
    });
});