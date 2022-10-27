export var Logger;
(function (Logger) {
    let Color;
    (function (Color) {
        Color["WHITE"] = "0";
        Color["BLACK"] = "30";
        Color["RED"] = "31";
        Color["GREEN"] = "32";
        Color["YELLOW"] = "33";
        Color["BLUE"] = "34";
        Color["MAGENTA"] = "35";
        Color["CYAN"] = "36";
        Color["GRAY"] = "37";
    })(Color = Logger.Color || (Logger.Color = {}));
    function LogInit(moduleName) {
        Logger.Log(`${moduleName} module initialized`, Color.GREEN);
    }
    Logger.LogInit = LogInit;
    function Log(text, color = Color.WHITE) {
        console.log(`\x1B[${color}m${text}`);
    }
    Logger.Log = Log;
})(Logger || (Logger = {}));
