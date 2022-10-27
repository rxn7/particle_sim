export var Debug;
(function (Debug) {
    const debugRootElement = document.getElementById('debug');
    const particleCountElement = document.getElementById('debug-particle-count');
    const fpsElement = document.getElementById('debug-fps');
    const frameTimeElement = document.getElementById('debug-frame-time');
    let isHidden = false;
    function update(data) {
        if (debugRootElement.hidden)
            return;
        fpsElement.innerText = `fps: ${Math.trunc(1.0 / data.timeDelta)}`;
        particleCountElement.innerText = `particle count: ${data.particleCount}`;
        frameTimeElement.innerText = `frame time: ${data.timeDelta.toFixed(5)}ms`;
    }
    Debug.update = update;
    window.addEventListener('keypress', (ev) => {
        if (ev.key === 'p')
            toggleHide();
    });
    function toggleHide() {
        if (!isHidden) {
            debugRootElement.style.visibility = 'hidden';
            isHidden = true;
        }
        else {
            debugRootElement.style.visibility = 'visible';
            isHidden = false;
        }
    }
})(Debug || (Debug = {}));
