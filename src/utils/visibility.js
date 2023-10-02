let listeners = [];

function onVisibilityChanged() {
    if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) {
        // The tab has lost focus
        listeners.forEach(listener => listener(false))
    } else {
        listeners.forEach(listener => listener(true))
    }
}

document.addEventListener("visibilitychange", onVisibilityChanged, false);
document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
document.addEventListener("msvisibilitychange", onVisibilityChanged, false);

export function onVisibilityUpdate(clb) {
    listeners.push(clb);
}

export function offVisibilityUpdate(clb) {
    const index = listeners.indexOf(clb);
    if (index > -1) {
        listeners.splice(index, 1);
    }
}
