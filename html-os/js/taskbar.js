document.addEventListener("DOMContentLoaded", function () {
    initializeStartMenu();
    initializeClock();
    handleDocumentClicks();
});

function initializeStartMenu() {
    const startButton = document.getElementById("start-button");
    const startMenuContainer = createStartMenu();
    document.body.appendChild(startMenuContainer);
    startButton.addEventListener("click", () => toggleStartMenu(startMenuContainer, startButton));
}

function createStartMenu() {
    const startMenuContainer = document.createElement("div");
    startMenuContainer.id = "start-menu-container";
    startMenuContainer.style.display = "none";
    startMenuContainer.setAttribute("aria-hidden", "true");

    const startMenu = document.createElement("div");
    startMenu.id = "start-menu";
    startMenu.innerHTML = `
        <div id="start-menu">
            <ul>
                ${generateMenuItems().join('')}
            </ul>
        </div>
    `;
    startMenuContainer.appendChild(startMenu);
    document.body.appendChild(startMenuContainer);

    // add click listeners to each menu item to close the menu when an item is clicked
    const menuItems = startMenuContainer.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            startMenuContainer.style.display = "none";
            startMenuContainer.setAttribute("aria-hidden", "true");
        });
    });

    return startMenuContainer;
}

function generateMenuItems() {
    const items = [
        { icon: 'programs', text: 'Programs', shortcutIndex: 0 },
        { icon: 'documents', text: 'Documents', shortcutIndex: 0 },
        { icon: 'settings', text: 'Settings', shortcutIndex: 0 },
        { icon: 'find', text: 'Find', shortcutIndex: 0 },
        { icon: 'help', text: 'Help', shortcutIndex: 0 },
        { icon: 'run', text: 'Run...', shortcutIndex: 0 },
        { icon: 'shut-down', text: 'Shut Down...', shortcutIndex: 2 }
    ];
    return items.map(item => `
        <li class="menu-item ${item.icon}">
            <img src="./assets/icons/${item.icon}.ico" alt="${item.text} Icon" class="icon">
            <span>${item.text.substring(0, item.shortcutIndex)}<u>${item.text[item.shortcutIndex]}</u>${item.text.substring(item.shortcutIndex + 1)}</span>
        </li>
    `);
}

function toggleStartMenu(container, button) {
    const isVisible = container.style.display === "block";
    container.style.display = isVisible ? "none" : "block";
    container.setAttribute("aria-hidden", (!isVisible).toString());
    if (!isVisible) {
        button.focus(); // focuses the button when menu is opened
    } else {
        button.blur(); // removes focus when menu is closed
    }
}

function handleDocumentClicks() {
    document.addEventListener("click", function (event) {
        const startMenuContainer = document.getElementById("start-menu-container");
        const startButton = document.getElementById("start-button");
        if (!startButton.contains(event.target) && !startMenuContainer.contains(event.target)) {
            startMenuContainer.style.display = "none";
            startMenuContainer.setAttribute("aria-hidden", "true");
        }
    });
}

function initializeClock() {
    const clockElement = document.getElementById("clock");
    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 6000); // update every minute
    updateClock();
}