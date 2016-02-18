'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var menuViewModel = require("./menu-view-model")

function pageLoaded(args) {

    let page = args.object;
    let mainViewModel = menuViewModel.mainViewModel;
    page.bindingContext = menuViewModel.viewModel;

    let topmost = frameModule.topmost();

}

exports.pageLoaded = pageLoaded;
