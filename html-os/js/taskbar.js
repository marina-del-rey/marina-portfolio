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
            <li class="menu-item programs">
                <img src="./assets/icons/programs.ico" alt="Programs Icon" class="icon">
                <span class="highlight">P</span>rograms
            </li>
            <li class="menu-item documents">
                <img src="./assets/icons/documents.ico" alt="Documents Icon" class="icon">
                <span class="highlight">D</span>ocuments
            </li>
            <li class="menu-item settings">
                <img src="./assets/icons/settings.ico" alt="Settings Icon" class="icon settings">
                <span class="highlight">S</span>ettings
            </li>
            <li class="menu-item find">
                <img src="./assets/icons/find.ico" alt="Find Icon" class="icon">
                <span class="highlight">F</span>ind
            </li>
            <li class="menu-item help">
                <img src="./assets/icons/help.ico" alt="Help Icon" class="icon">
                <span class="highlight">H</span>elp
            </li>
            <li class="menu-item run">
                <img src="./assets/icons/run.ico" alt="Run Icon" class="icon">
                <span class="highlight">R</span>un...
            </li>
            <li class="menu-item shutdown">
                <img src="./assets/icons/shut-down.ico" alt="Shutdown Icon" class="icon">
                Sh<span class="highlight">u</span>t Down...
            </li>
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