import { bringWindowToFront } from './windowManager.js';

document.addEventListener("DOMContentLoaded", function () {
    const taskbarApps = document.getElementById("taskbar-apps");
    const notepadIcon = document.getElementById("notepad-icon");
    let notepadWindow = null;

    // opens notepad
    function openNotepad() {
        if (notepadWindow) {
            notepadWindow.style.display = "block";
            addNotepadTaskbarIcon();
            setActiveState(true);
            bringWindowToFront(notepadWindow);
            return;
        }

        fetch("windows/notepad.html")
            .then(response => response.text())
            .then(html => {
                const desktop = document.getElementById("desktop");
                notepadWindow = document.createElement("div");
                notepadWindow.innerHTML = html;
                desktop.appendChild(notepadWindow);

                notepadWindow.style.position = "absolute";
                notepadWindow.style.top = "100px";
                notepadWindow.style.left = "100px";
                makeDraggable(notepadWindow);
                bringWindowToFront(notepadWindow);

                addNotepadTaskbarIcon();
                setActiveState(true);

                // buttons
                notepadWindow.querySelector(".minimize").addEventListener("click", minimizeNotepad);
                notepadWindow.querySelector(".maximize").addEventListener("click", toggleMaximizeNotepad);
                notepadWindow.querySelector(".close").addEventListener("click", closeNotepad);

                // click inside the window to activate it
                notepadWindow.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    setActiveState(true);
                    bringWindowToFront(notepadWindow);
                });
            });
    }

    // makes window draggable
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

    // adds notepad icon to taskbar
    function addNotepadTaskbarIcon() {
        let notepadTask = document.getElementById("notepad-task");
        if (!notepadTask) {
            notepadTask = document.createElement("button");
            notepadTask.id = "notepad-task";
            notepadTask.className = "taskbar-app-tab";

            // icon image
            const icon = document.createElement("img");
            icon.src = "./assets/icons/notepad.ico";
            icon.alt = "Notepad Icon";
            icon.className = "taskbar-icon";

            // text container
            const textContainer = document.createElement("span");
            textContainer.innerText = "Untitled - Notepad";

            notepadTask.appendChild(icon);
            notepadTask.appendChild(textContainer);

            taskbarApps.appendChild(notepadTask);

            // taskbar icon click to toggle notepad window visibility
            notepadTask.addEventListener("click", () => {
                const isVisible = notepadWindow.style.display !== "none";
                const isWindowInactive = notepadWindow.classList.contains("inactive");

                if (isVisible) {
                    if (isWindowInactive) {
                        setTaskbarActiveState(true);
                        notepadWindow.style.display = "none";
                        setTimeout(() => setTaskbarActiveState(false), 100);
                    } else {
                        notepadWindow.style.display = "none";
                        setTaskbarActiveState(false);
                    }
                } else {
                    notepadWindow.style.display = "block";
                    setActiveState(true);
                }
            });
        }
    }

    // closes notepad
    function closeNotepad() {
        // if exists, hide it
        if (notepadWindow) {
            notepadWindow.style.display = "none";
            setTaskbarActiveState(false);

            const innerWindow = notepadWindow.querySelector(".window-inside");
            innerWindow.style.width = "";  // reset width
            innerWindow.style.height = ""; // reset height

            if (notepadWindow.classList.contains("maximized")) {
                const innerWindow = notepadWindow.querySelector(".window-inside");

                // restore the original size and position
                notepadWindow.style.top = notepadWindow.dataset.originalTop;
                notepadWindow.style.left = notepadWindow.dataset.originalLeft;

                notepadWindow.classList.remove("maximized");
                const maximizeButton = notepadWindow.querySelector(".window-button.maximize");
                maximizeButton.classList.remove("maximized");
            }

            // clear the text in the textarea when closing
            const textArea = notepadWindow.querySelector("textarea");
            if (textArea) {
                textArea.value = "";
            }
        }

        // hide the taskbar icon
        const notepadTask = document.getElementById("notepad-task");
        if (notepadTask) {
            notepadTask.style.display = "none";
        }
    }

    // minimizes notepad
    function minimizeNotepad() {
        if (notepadWindow) {
            notepadWindow.style.display = "none";
            setTaskbarActiveState(false);
        }
    }

    // maximize/restore the notepad window
    function toggleMaximizeNotepad() {
        if (!notepadWindow) return;

        const desktop = document.getElementById("desktop");
        const innerWindow = notepadWindow.querySelector(".window-inside");
        const maximizeButton = notepadWindow.querySelector(".window-button.maximize");

        if (notepadWindow.classList.contains("maximized")) {
            // restore the original size and position
            innerWindow.style.width = notepadWindow.dataset.originalWidth;
            innerWindow.style.height = notepadWindow.dataset.originalHeight;
            notepadWindow.style.top = notepadWindow.dataset.originalTop;
            notepadWindow.style.left = notepadWindow.dataset.originalLeft;

            notepadWindow.classList.remove("maximized");
            maximizeButton.classList.remove("maximized");
        } else {
            // store the current size and position
            notepadWindow.dataset.originalWidth = innerWindow.style.width;
            notepadWindow.dataset.originalHeight = innerWindow.style.height;
            notepadWindow.dataset.originalTop = notepadWindow.style.top;
            notepadWindow.dataset.originalLeft = notepadWindow.style.left;

            innerWindow.style.width = `${desktop.clientWidth}px`;
            innerWindow.style.height = `${desktop.clientHeight}px`;
            notepadWindow.style.top = "0";
            notepadWindow.style.left = "0";

            notepadWindow.classList.add("maximized");
            maximizeButton.classList.add("maximized");
        }
    }

    // shows the taskbar icon
    function showNotepadTaskbarIcon() {
        const notepadTask = document.getElementById("notepad-task");
        if (notepadTask) {
            notepadTask.style.display = "flex";
        }
    }

    // used for styling task button
    function setTaskbarActiveState(isActive) {
        const notepadTask = document.getElementById("notepad-task");
        if (notepadTask) {
            if (isActive) {
                notepadTask.classList.add("active");
            } else {
                notepadTask.classList.remove("active");
            }
        }
    }

    // sets the active state for the notepad window
    function setActiveState(isActive) {
        if (notepadWindow) {
            if (isActive) {
                notepadWindow.classList.remove("inactive");
                setTaskbarActiveState(true);
                bringWindowToFront(notepadWindow);
            } else {
                notepadWindow.classList.add("inactive");
                setTaskbarActiveState(false);
            }
        }
    }

    // clicks outside notepad window deactivates it
    document.addEventListener("mousedown", (event) => {
        if (notepadWindow && !notepadWindow.contains(event.target) && !taskbarApps.contains(event.target)) {
            setActiveState(false);
        }
    });

    notepadIcon.addEventListener("click", () => {
        openNotepad();
        showNotepadTaskbarIcon();
    });

});