(function () {
    "use strict";
    
    var regPageViewModel = require('./reg-page-view-model'),
        frame = require("ui/frame"),
        viewModel = regPageViewModel.viewModel;

    function pageLoaded(args) {
        let page = args.object;
        page.bindingContext = viewModel;
        console.log("Reg Page");
    }


    function btnTap(args){
      var name = viewModel.name;

      global.everlive.data('Contestant')
      .create({ 'DeviceId' : global.deviceID, 'UserName': name, 'Health': 100},
        function(data){
          console.log("UserRegisterd");
          var acquirePage = './menu-page';
          let navigationEntry = {
              moduleName: acquirePage,
              animated: true,
              navigationTransition: {
                  transition: "flip ",
              },
              context: {
                  spellInfo: viewModel.dataToBePassed
              }
          };

            frame.topmost().navigate(navigationEntry);
        },
        function(error){
          console.log(JSON.stringify(error));
        });
    }

    exports.pageLoaded = pageLoaded;
    exports.btntTapCommand = btnTap;
}());
