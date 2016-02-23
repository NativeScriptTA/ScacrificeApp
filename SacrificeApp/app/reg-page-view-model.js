(function () {
    "use strict";
    
    var observable = require("data/observable").Observable,
        reg = new observable({
            name: "",
            dataToBePassed: {}
        });

    exports.viewModel = reg;
}());
