'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var menuViewModel = require("./menu-view-model")

function pageLoaded(args) {

  // var activities = global.everlive.data('Activities');
  //
  //   activities.get(null, function(data) {
  //       console.log(JSON.stringify(data));
  //   }, function(err) {
  //       console.log(err.message);
  //   })

    let someMagicData = ["data 1", "data 2", "data 3"];
    global.dbmanager.insertMagicInfo("name of magic", someMagicData, 245.92, "source source");
    global.dbmanager.getMagicInfoByName("name of magic", function(data) {
      console.dump(data);
    });

    global.dbmanager.setRegistrationStatus(1337);
    global.dbmanager.getRegistrationStatus(function(status) {
      console.log(status);
    });

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
