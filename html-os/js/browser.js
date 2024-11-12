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

                const iframe = browserWindow.querySelector('.iframe-container iframe');
                preventIframeScrollOnAnchor(iframe);


                // buttons
                browserWindow.querySelector(".minimize").addEventListener("click", minimizeBrowser);
                browserWindow.querySelector(".maximize").addEventListener("click", toggleMaximizeBrowser);
                browserWindow.querySelector(".close").addEventListener("click", closeBrowser);

                // click inside the window to activate it
                browserWindow.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    setActiveState(true);
                });
            });
    }

    function preventIframeScrollOnAnchor(iframe) {
        let initialScrollPos = 0;

        iframe.addEventListener('load', () => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            initialScrollPos = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;

            iframeDocument.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                    e.preventDefault();

                    // Reset scroll position directly on the iframe's document
                    iframeDocument.documentElement.scrollTop = initialScrollPos;
                    iframeDocument.body.scrollTop = initialScrollPos;

                }
            });
        });
    }

    function makeDraggable(element) {
        const titleBar = element.querySelector(".window-nav");
        let offsetX = 0, offsetY = 0, initialX, initialY;
        const innerWindow = element.querySelector(".window-inside");

        titleBar.addEventListener("mousedown", (e) => {
            e.preventDefault();
            initialX = e.clientX;
            initialY = e.clientY;

            document.addEventListener("mousemove", dragWindow);
            document.addEventListener("mouseup", stopDragging);
        });

        function dragWindow(e) {
            const desktop = document.getElementById("desktop");
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

    // closes browser
    function closeBrowser() {
        // if exists, hide it
        if (browserWindow) {
            browserWindow.style.display = "none";
            setTaskbarActiveState(false);

            const innerWindow = browserWindow.querySelector(".window-inside");
            innerWindow.style.width = "";  // reset width
            innerWindow.style.height = ""; // reset height

            if (browserWindow.classList.contains("maximized")) {
                const innerWindow = browserWindow.querySelector(".window-inside");

                // restore the original size and position
                browserWindow.style.top = browserWindow.dataset.originalTop;
                browserWindow.style.left = browserWindow.dataset.originalLeft;

                browserWindow.classList.remove("maximized");
                const maximizeButton = browserWindow.querySelector(".window-button.maximize");
                maximizeButton.classList.remove("maximized");
            }
        }

        // hide the taskbar icon
        const browserTask = document.getElementById("browser-task");
        if (browserTask) {
            browserTask.style.display = "none";
        }
    }

    // minimizes notepad
    function minimizeBrowser() {
        if (browserWindow) {
            browserWindow.style.display = "none";
            setTaskbarActiveState(false);
        }
    }

    // maximize/restore the notepad window
    function toggleMaximizeBrowser() {
        if (!browserWindow) return;

        const desktop = document.getElementById("desktop");
        const innerWindow = browserWindow.querySelector(".window-inside");
        const maximizeButton = browserWindow.querySelector(".window-button.maximize");

        if (browserWindow.classList.contains("maximized")) {
            // restore the original size and position
            innerWindow.style.width = browserWindow.dataset.originalWidth;
            innerWindow.style.height = browserWindow.dataset.originalHeight;
            browserWindow.style.top = browserWindow.dataset.originalTop;
            browserWindow.style.left = browserWindow.dataset.originalLeft;

            browserWindow.classList.remove("maximized");
            maximizeButton.classList.remove("maximized");
        } else {
            // store the current size and position
            browserWindow.dataset.originalWidth = innerWindow.style.width;
            browserWindow.dataset.originalHeight = innerWindow.style.height;
            browserWindow.dataset.originalTop = browserWindow.style.top;
            browserWindow.dataset.originalLeft = browserWindow.style.left;

            innerWindow.style.width = `${desktop.clientWidth}px`;
            innerWindow.style.height = `${desktop.clientHeight}px`;
            browserWindow.style.top = "0";
            browserWindow.style.left = "0";

            browserWindow.classList.add("maximized");
            maximizeButton.classList.add("maximized");
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

    // clicks outside browser window deactivates it
    document.addEventListener("mousedown", (event) => {
        if (browserWindow && !browserWindow.contains(event.target) && !taskbarApps.contains(event.target)) {
            setActiveState(false);
        }
    });

    browserIcon.addEventListener("click", () => {
        openBrowser();
        showBrowserTaskbarIcon();
    });
});
