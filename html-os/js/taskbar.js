document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");

    // create the start menu container
    const startMenuContainer = document.createElement("div");
    startMenuContainer.id = "start-menu-container";
    startMenuContainer.style.display = "none";

    const startMenu = document.createElement("div");
    startMenu.id = "start-menu";
    startMenu.innerHTML = `
        <ul>
            <li><span class="highlight">P</span>rograms</li>
            <li><span class="highlight">D</span>ocuments</li>
            <li><span class="highlight">S</span>ettings</li>
            <li><span class="highlight">F</span>ind</li>
            <li><span class="highlight">H</span>elp</li>
            <li><span class="highlight">R</span>un...</li>
            <li>Sh<span class="highlight">u</span>t Down...</li>
        </ul>
    `;
    startMenuContainer.appendChild(startMenu);
    document.body.appendChild(startMenuContainer);

    // toggle the start menu visibility
    startButton.addEventListener("click", function () {
        startMenuContainer.style.display = startMenuContainer.style.display === "none" ? "block" : "none";

        // remove focus from the button after toggling the menu
        if (startMenuContainer.style.display === "none") {
            startButton.blur();
        }
    });

    // close the start menu when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!startButton.contains(event.target) && !startMenuContainer.contains(event.target)) {
            startMenuContainer.style.display = "none";
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
