export var Input;
(function (Input) {
    Input.buttons = {
        leftMouse: false,
        rightMouse: false,
    };
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('mousedown', (ev) => {
        switch (ev.button) {
            case 0:
                Input.buttons.leftMouse = true;
                break;
            case 2:
                Input.buttons.rightMouse = true;
                break;
        }
    });
    window.addEventListener('mouseup', (ev) => {
        switch (ev.button) {
            case 0:
                Input.buttons.leftMouse = false;
                break;
            case 2:
                Input.buttons.rightMouse = false;
                break;
        }
    });
    window.addEventListener('mousemove', (ev) => {
        Input.lastMousePosition = Input.mousePosition;
        Input.mousePosition = { x: ev.clientX, y: ev.clientY };
    });
    function getMousePositionDelta() {
        return { x: Input.lastMousePosition.x - Input.lastMousePosition.x, y: Input.lastMousePosition.y - Input.lastMousePosition.y };
    }
    Input.getMousePositionDelta = getMousePositionDelta;
})(Input || (Input = {}));
