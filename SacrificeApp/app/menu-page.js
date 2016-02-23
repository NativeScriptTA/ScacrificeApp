(function () {
    'use strict';
    var view = require("ui/core/view"),
        frameModule = require("ui/frame"),
        menuViewModel = require("./menu-view-model");

    function pageLoaded(args) {

        let users = global.everlive.data('Contestant');

        users.get(null, function(data) {
          let items = data.result;
          let userIndex = -1;
          console.log("-------> " + items.length);
          for (var i = 0; i < items.length; i++) {
            console.log("-------> " + i);
            if(global.deviceID === items[i].DeviceId){
              console.log("-------> " + items[i].DeviceId);
              userIndex = i;
            }
          }

          if(userIndex < 0){

            var acquirePage = './reg-page';
            let navigationEntry = {
                moduleName: acquirePage,
                animated: true,
                navigationTransition: {
                    transition: "flip ",
                }
            };
            frameModule.topmost().navigate(navigationEntry);
          } else {
            global.currentUser = items[userIndex];
            console.log("Already Registerd Device");
          }
        }, function(err) {
          console.log(err.message);
      });

        // let someMagicData = ["data 1", "data 2", "data 3"];
        // global.dbmanager.insertMagicInfo("name of magic", someMagicData, 245.92, "source source");
        // global.dbmanager.getMagicInfoByName("name of magic", function(data) {
        //   console.dump(data);
        // });

        let page = args.object;
        let mainViewModel = menuViewModel.mainViewModel;
        page.bindingContext = menuViewModel.viewModel;

        let topmost = frameModule.topmost();

    }


    exports.pageLoaded = pageLoaded;
}());
