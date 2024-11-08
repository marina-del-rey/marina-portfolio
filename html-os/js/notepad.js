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
            return;
        }

        fetch("windows/notepad.html")
            .then(response => response.text())
            .then(html => {
                const desktop = document.getElementById("desktop");
                notepadWindow = document.createElement("div");
                notepadWindow.innerHTML = html;
                desktop.appendChild(notepadWindow);

                // position and make the window draggable
                notepadWindow.style.position = "absolute";
                notepadWindow.style.top = "100px";
                notepadWindow.style.left = "100px";
                makeDraggable(notepadWindow);

                // add taskbar icon
                addNotepadTaskbarIcon();

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

            notepadTask.appendChild(icon); // Append icon first
            notepadTask.appendChild(textContainer); // Append text

            taskbarApps.appendChild(notepadTask);

            // taskbar icon click to toggle notepad window visibility
            notepadTask.addEventListener("click", () => {
                notepadWindow.style.display =
                    notepadWindow.style.display === "none" ? "block" : "none";
            });
        }
    }

    // closes notepad
    function closeNotepad() {
        // if exists, hide it
        if (notepadWindow) {
            notepadWindow.classList.remove("inactive");

            notepadWindow.style.display = "none";
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
            notepadTask.style.display = "inline-block";
        }
    }

    notepadIcon.addEventListener("click", () => {
        openNotepad();
        showNotepadTaskbarIcon();
    });

    // change color of window nav background when click outside
    document.addEventListener("click", (e) => {
        if (notepadWindow) {
            if (notepadWindow.contains(e.target)) {
                notepadWindow.classList.remove("inactive");
            } else {
                notepadWindow.classList.add("inactive");
            }
        }
    });
});