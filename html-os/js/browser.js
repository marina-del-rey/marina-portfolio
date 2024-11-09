document.addEventListener("DOMContentLoaded", function () {
    const taskbarApps = document.getElementById("taskbar-apps");
    const browserIcon = document.getElementById("browser-icon");
    let browserWindow = null;

    // opens browser
    function openBrowser() {
        if (browserWindow) {
            browserWindow.style.display = "block";
            browserWindow.style.zIndex = 10;
            addBrowserTaskToTaskbar();
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

                addBrowserTaskToTaskbar();
                setActiveState(true);

                // buttons
                //browserWindow.querySelector(".minimize").addEventListener("click", minimizeNotepad);
                //browserWindow.querySelector(".maximize").addEventListener("click", toggleMaximizeNotepad);
                //browserWindow.querySelector(".close").addEventListener("click", closeNotepad);

                // click inside the window to activate it
                browserWindow.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    setActiveState(true);
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

    // add task to taskbar
    function addBrowserTaskToTaskbar() {
        let browserTask = document.getElementById("browser-task");
        if (!browserTask) {
            browserTask = document.createElement("button");
            browserTask.id = "browser-task";
            browserTask.className = "taskbar-app-tab";

            // icon image
            const icon = document.createElement("img");
            icon.src = "./assets/icons/browser.ico";
            icon.alt = "Browser Icon";
            icon.className = "taskbar-icon";

            // text container
            const textContainer = document.createElement("span");
            textContainer.innerText = "Browser";

            browserTask.appendChild(icon);
            browserTask.appendChild(textContainer);

            taskbarApps.appendChild(browserTask);

            // taskbar icon click to toggle browser window visibility
            browserTask.addEventListener("click", () => {
                const isVisible = browserWindow.style.display !== "none";
                const isWindowInactive = browserWindow.classList.contains("inactive");

                if (isVisible) {
                    if (isWindowInactive) {
                        setTaskbarActiveState(true);
                        browserWindow.style.display = "none";
                        setTimeout(() => setTaskbarActiveState(false), 100);
                    } else {
                        browserWindow.style.display = "none";
                        setTaskbarActiveState(false);
                    }
                } else {
                    browserWindow.style.display = "block";
                    setActiveState(true);
                }
            });
        }
    }

    // shows the taskbar icon
    function showBrowserTaskbarIcon() {
        const browserTask = document.getElementById("browser-task");
        if (browserTask) {
            browserTask.style.display = "flex";
        }
    }

    // used for styling task button
    function setTaskbarActiveState(isActive) {
        const browserTask = document.getElementById("browser-task");
        if (browserTask) {
            if (isActive) {
                browserTask.classList.add("active");
            } else {
                browserTask.classList.remove("active");
            }
        }
    }

    // sets the active state for the browser window
    function setActiveState(isActive) {
        if (browserWindow) {
            if (isActive) {
                browserWindow.classList.remove("inactive");
                setTaskbarActiveState(true);
            } else {
                browserWindow.classList.add("inactive");
                setTaskbarActiveState(false);
            }
        }
    }

    browserIcon.addEventListener("click", () => {
        openBrowser();
        showBrowserTaskbarIcon();
    });
});