let zIndexCounter = 100;

export function bringWindowToFront(windowElement) {
    zIndexCounter++;
    windowElement.style.zIndex = zIndexCounter;
}
