document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");
    const startMenu = document.createElement("div");
    startMenu.id = "start-menu";
    startMenu.innerHTML = `
        <ul>
            <li>Programs</li>
            <li>Documents</li>
            <li>Settings</li>
            <li>Find</li>
            <li>Help</li>
            <li>Run...</li>
            <li>Shut Down...</li>
        </ul>
    `;
    startMenu.style.display = "none";
    document.body.appendChild(startMenu);

    // toggles the start menu visibility
    startButton.addEventListener("click", function () {
        startMenu.style.display = startMenu.style.display === "none" ? "block" : "none";
        startMenu.style.position = "absolute";
        startMenu.style.bottom = "40px";
        startMenu.style.left = "5px";

        // remove focus from the button after toggling the menu
        if (startMenu.style.display === "none") {
            startButton.blur();
        }
    });

    // close the start menu when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
            startMenu.style.display = "none";
        }
    });

    const clockElement = document.getElementById("clock");

    // updates clock time
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        clockElement.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
