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

                // close button
                notepadWindow.querySelector(".close-button").addEventListener("click", closeNotepad);
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
            notepadTask.innerText = "Notepad";
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
            notepadWindow.style.display = "none";
        }

        // hide the taskbar icon
        const notepadTask = document.getElementById("notepad-task");
        if (notepadTask) {
            notepadTask.style.display = "none";
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
});
