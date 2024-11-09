document.addEventListener("DOMContentLoaded", () => {
    const desktopIcons = document.querySelectorAll(".desktop-icon");

    function deselectAllIcons() {
        desktopIcons.forEach(icon => icon.classList.remove("selected"));
    }

    desktopIcons.forEach(icon => {
        icon.addEventListener("click", (event) => {
            event.stopPropagation();
            deselectAllIcons();
            icon.classList.add("selected");
        });
    });

    document.addEventListener("click", () => {
        deselectAllIcons();
    });
});