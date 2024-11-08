document.addEventListener("DOMContentLoaded", function () {
    const taskbarApps = document.getElementById("taskbar-apps");
    const notepadIcon = document.getElementById("notepad-icon");
    let notepadWindow = null;

    // opens notepad
    function openNotepad() {
        if (notepadWindow) {
            notepadWindow.style.display = "block";
            notepadWindow.style.zIndex = 10;
            addNotepadTaskbarIcon();
            setTaskbarActiveState(true);
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

                addNotepadTaskbarIcon();
                setTaskbarActiveState(true);

                // buttons
                notepadWindow.querySelector(".minimize").addEventListener("click", minimizeNotepad);
                notepadWindow.querySelector(".maximize").addEventListener("click", toggleMaximizeNotepad);
                notepadWindow.querySelector(".close").addEventListener("click", closeNotepad);
            });
    }

    // makes window draggable
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
                notepadWindow.style.display = isVisible ? "none" : "block";
                setTaskbarActiveState(!isVisible);
            });
        }
    }

    // closes notepad
    function closeNotepad() {
        // if exists, hide it
        if (notepadWindow) {
            notepadWindow.style.display = "none";
            setTaskbarActiveState(false);
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
        if (!notepadWindow.classList.contains("maximized")) {
            // store current position and size
            notepadWindow.dataset.prevTop = notepadWindow.style.top;
            notepadWindow.dataset.prevLeft = notepadWindow.style.left;
            notepadWindow.dataset.prevWidth = notepadWindow.style.width;
            notepadWindow.dataset.prevHeight = notepadWindow.style.height;

            // maximize the window
            notepadWindow.style.top = "0";
            notepadWindow.style.left = "0";
            notepadWindow.style.width = "100vw";
            notepadWindow.style.height = "100vh";
            notepadWindow.classList.add("maximized");
        } else {
            // restore the previous position and size
            notepadWindow.style.top = notepadWindow.dataset.prevTop;
            notepadWindow.style.left = notepadWindow.dataset.prevLeft;
            notepadWindow.style.width = notepadWindow.dataset.prevWidth;
            notepadWindow.style.height = notepadWindow.dataset.prevHeight;
            notepadWindow.classList.remove("maximized");
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

    notepadIcon.addEventListener("click", () => {
        openNotepad();
        showNotepadTaskbarIcon();
    });


});