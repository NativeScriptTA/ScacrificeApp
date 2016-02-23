"use strict";
var regPageViewModel = require('./status-page-view-model');
var frame = require("ui/frame");
var viewModel = regPageViewModel.viewModel;

function pageLoaded(args) {
    let page = args.object;
    page.bindingContext = viewModel;
    console.log("Status Page");
    //getSpells(viewModel);
}



exports.pageLoaded = pageLoaded;
//exports.tapCommand = tapCommand
