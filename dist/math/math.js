export var Math;
(function (Math) {
    function clamp(v, min, max) {
        if (v < min)
            return min;
        if (v > max)
            return max;
        return v;
    }
    Math.clamp = clamp;
})(Math || (Math = {}));
