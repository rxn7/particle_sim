export var random;
(function (random) {
    random.range = (min, max) => Math.random() * (max - min) + min;
})(random || (random = {}));
