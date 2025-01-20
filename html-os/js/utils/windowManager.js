let zIndexCounter = 100;

export function bringWindowToFront(windowElement) {
    zIndexCounter++;
    windowElement.style.zIndex = zIndexCounter;
}

export function openWindow({
    url, windowId, iconPath, iconName, startX, startY, taskbarId, taskbarApps, desktop
}) {
    let windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.style.display = "block";
        windowElement.style.top = startY + 'px';
        windowElement.style.left = startX + 'px';

        setWindowActiveState(windowId, true);
        bringWindowToFront(windowElement);
        addAppToTaskbar(windowId, iconPath, iconName, taskbarId, taskbarApps);
        setTaskbarActiveState(windowId, true);
        return;
    }

    fetch(url)
        .then(response => response.text())
        .then(html => {
            windowElement = document.createElement("div");
            windowElement.id = windowId;
            windowElement.innerHTML = html;
            desktop.appendChild(windowElement);

            windowElement.style.position = "absolute";
            windowElement.style.top = startY + 'px';
            windowElement.style.left = startX + 'px';
            makeDraggable(windowElement);
            addAppToTaskbar(windowId, iconPath, iconName, taskbarId, taskbarApps);
            setWindowActiveState(windowId, true);
            bringWindowToFront(windowElement);

            // window buttons
            windowElement.querySelector(".minimize").addEventListener("click", function () {
                minimizeWindow(windowElement.id);
            });
            windowElement.querySelector(".maximize").addEventListener("click", function () {
                toggleMaximizeWindow(windowElement.id);
            });
            windowElement.querySelector(".close").addEventListener("click", function () {
                closeWindow(windowElement.id);
            });

            // clicking inside the window activates, brings it to front
            windowElement.addEventListener("mousedown", (e) => {
                e.stopPropagation();
                setWindowActiveState(windowElement.id, true);
                bringWindowToFront(windowElement);
            });

            // fix iframe anchoring issue for browser window
            if (windowId === "browser-window") {
                const iframe = windowElement.querySelector('.iframe-container iframe');
                // console.log(iframe); // DEBUG
                preventIframeScrollOnAnchor(iframe);
            }

        });
}

// makes window draggable
function makeDraggable(element) {
    const titleBar = element.querySelector(".window-nav");
    const innerWindow = element.querySelector(".window-inside");
    let offsetX = 0, offsetY = 0, initialX, initialY;

    titleBar.addEventListener("mousedown", function (e) {
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

        // calculate new window position
        let newTop = element.offsetTop + offsetY;
        let newLeft = element.offsetLeft + offsetX;

        const maxLeft = 0;
        const maxTop = 0;
        const maxRight = desktop.clientWidth - innerWindow.getBoundingClientRect().width - 12;
        const maxBottom = desktop.clientHeight - innerWindow.getBoundingClientRect().height;

        // constrain within boundaries
        if (newTop < maxTop) newTop = maxTop;
        if (newLeft < maxLeft) newLeft = maxLeft;
        if (newTop > maxBottom) newTop = maxBottom;
        if (newLeft > maxRight) newLeft = maxRight;

        element.style.top = `${newTop}px`;
        element.style.left = `${newLeft}px`;
    }

    function stopDragging() {
        document.removeEventListener("mousemove", dragWindow);
        document.removeEventListener("mouseup", stopDragging);
    }
}

// adds app task to taskbar
function addAppToTaskbar(windowId, iconPath, iconName, taskbarId, taskbarApps) {
    let task = document.getElementById(`${windowId.split('-')[0]}-task`);
    if (!task) {
        task = document.createElement("button");
        task.id = `${windowId.split('-')[0]}-task`;
        task.className = "taskbar-app-tab";

        const icon = document.createElement("img");
        icon.src = iconPath;
        icon.alt = `${iconName} Icon`;
        icon.className = "taskbar-icon";

        const textContainer = document.createElement("span");
        textContainer.innerText = iconName;

        task.appendChild(icon);
        task.appendChild(textContainer);
        taskbarApps.appendChild(task);

        task.addEventListener("click", () => {
            const windowElement = document.getElementById(windowId);
            const isVisible = windowElement.style.display !== "none";
            const isWindowInactive = windowElement.classList.contains("inactive");

            if (isVisible) {
                if (isWindowInactive) {
                    windowElement.style.display = "none";
                    setTimeout(() => setActiveState(windowId, false), 100);
                    bringWindowToFront(windowElement);
                } else {
                    windowElement.style.display = "none";
                    setTaskbarActiveState(windowId, false);
                }
            } else {
                windowElement.style.display = "block";
                setTaskbarActiveState(windowId, true);
                bringWindowToFront(windowElement);
            }
        });
    }
}

// sets the active state for the window
function setWindowActiveState(windowId, isActive) {
    const windowElement = document.getElementById(windowId);
    const task = document.getElementById(`${windowId.split('-')[0]}-task`);

    if (!windowElement || !task) return;

    if (isActive) {
        windowElement.classList.remove("inactive");
        windowElement.classList.add("active");
        setTaskbarActiveState(windowId, true);
    } else {
        windowElement.classList.remove("active");
        windowElement.classList.add("inactive");
        setTaskbarActiveState(windowId, false);
    }
}

// sets the active state for the taskbar
function setTaskbarActiveState(windowId, isActive) {
    const task = document.getElementById(`${windowId.split('-')[0]}-task`);
    if (task) {
        if (isActive) {
            task.classList.add("active");
        } else {
            task.classList.remove("active");
        }
    }
}

// minimizes window
function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.style.display = "none";
        setTaskbarActiveState(windowId, false);
    }
}

// maximizes window
function toggleMaximizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    const desktop = document.getElementById("desktop");
    const innerWindow = windowElement.querySelector(".window-inside");
    const maximizeButton = windowElement.querySelector(".window-button.maximize");

    if (windowElement.classList.contains("maximized")) {
        // restore the original size and position
        innerWindow.style.width = windowElement.dataset.originalWidth;
        innerWindow.style.height = windowElement.dataset.originalHeight;
        windowElement.style.top = windowElement.dataset.originalTop;
        windowElement.style.left = windowElement.dataset.originalLeft;

        windowElement.classList.remove("maximized");
        if (maximizeButton) {
            maximizeButton.classList.remove("maximized");
        }
    } else {
        // store the current size and position
        windowElement.dataset.originalWidth = innerWindow.style.width;
        windowElement.dataset.originalHeight = innerWindow.style.height;
        windowElement.dataset.originalTop = windowElement.style.top;
        windowElement.dataset.originalLeft = windowElement.style.left;

        innerWindow.style.width = `${desktop.clientWidth}px`;
        innerWindow.style.height = `${desktop.clientHeight}px`;
        windowElement.style.top = "0";
        windowElement.style.left = "0";

        windowElement.classList.add("maximized");
        if (maximizeButton) {
            maximizeButton.classList.add("maximized");
        }
    }
}

// closes window
function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    // if exists, hide it
    if (windowElement) {
        windowElement.style.display = "none";
        setTaskbarActiveState(windowId, false);

        const innerWindow = windowElement.querySelector(".window-inside");
        innerWindow.style.width = "";  // reset width
        innerWindow.style.height = ""; // reset height

        if (windowElement.classList.contains("maximized")) {
            const innerWindow = windowElement.querySelector(".window-inside");
            // restore the original size and position
            windowElement.style.top = windowElement.dataset.originalTop;
            windowElement.style.left = windowElement.dataset.originalLeft;

            windowElement.classList.remove("maximized");
            const maximizeButton = windowElement.querySelector(".window-button.maximize");
            maximizeButton.classList.remove("maximized");
        }
    }

    // clear textarea if it is the notepad window
    if (windowId === "notepad-window") {
        const textArea = windowElement.querySelector("textarea");
        if (textArea) {
            textArea.value = "";
        }
    }

    // remove task
    const task = document.getElementById(`${windowId.split('-')[0]}-task`);
    if (task) {
        task.parentElement.removeChild(task);
    }
}

function preventIframeScrollOnAnchor(iframe) {
    let initialScrollPos = 0;

    iframe.addEventListener('load', () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        initialScrollPos = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
        iframeDocument.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                // reset scroll position
                iframeDocument.documentElement.scrollTop = initialScrollPos;
                iframeDocument.body.scrollTop = initialScrollPos;

            }
        });
    });
}

function deactivateAllWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(windowElement => {
        setWindowActiveState(windowElement.id, false);
    });
}

document.getElementById('desktop').addEventListener('mousedown', function (event) {
    // checks if the click was directly on the desktop
    if (event.target === this) {
        deactivateAllWindows();
    }
});
