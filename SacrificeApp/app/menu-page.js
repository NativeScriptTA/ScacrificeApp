(function () {
    'use strict';
    var view = require("ui/core/view"),
        frameModule = require("ui/frame"),
        menuViewModel = require("./menu-view-model");

    function pageLoaded(args) {

      // var activities = global.everlive.data('Activities');
      //
      //   activities.get(null, function(data) {
      //       console.log(JSON.stringify(data));
      //   }, function(err) {
      //       console.log(err.message);
      //   })

        let users = global.everlive.data('Contestant');

        users.get(null, function(data) {
          let items = data.result;
          let currentUser;

          for (var i = 0; i < items.length; i++) {
            if(global.deviceID === items[i]['DeviceId']){
              currentUser = items[i];
            }
          }
          if(!currentUser){
            global.everlive.data('Contestant')
            .create({ 'DeviceId' : global.deviceID, 'UserName': 'TestUser', 'Health': 100},
              function(data){
                console.log("UserRegisterd");
              },
              function(error){
                console.log(JSON.stringify(error));
              });
          } else {
            console.log("Already Registerd Device");
          }
        }, function(err) {
          console.log(err.message);
      });

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
    exports.pageLoaded = pageLoaded;
}());
