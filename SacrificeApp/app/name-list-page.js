(function () {
    "use strict";
    var namesViewModel = require('./name-list-view-model');

    function pageLoaded(args) {
        let page = args.object;
        let mainViewModel = namesViewModel.mainViewModel;
        page.bindingContext = mainViewModel;
    }

    exports.pageLoaded = pageLoaded;
}());
