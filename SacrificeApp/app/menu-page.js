'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var menuViewModel = require("./menu-view-model")
var everlive = require("./app.js").everlive;

function pageLoaded(args) {

  // var activities = everlive.data('Activities');
  //
  //   activities.get(null, function(data) {
  //       console.log(JSON.stringify(data));
  //   }, function(err) {
  //       console.log(err.message);
  //   })

    let page = args.object;
    let mainViewModel = menuViewModel.mainViewModel;
    page.bindingContext = menuViewModel.viewModel;

    let topmost = frameModule.topmost();

}

function doSomethingPLS(){
  console.log('Hello');
}

exports.doSomethingPLS = doSomethingPLS;
exports.pageLoaded = pageLoaded;
