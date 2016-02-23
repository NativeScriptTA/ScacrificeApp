(function () {
    'use strict';
    var observable = require("data/observable").Observable,
        frame = require("ui/frame");


    var pagePaths = {
      "Play": "./name-list-page",
      "Tutorial": "./tutorial-page",
      "About": "./status-page"
    };

    var viewModel = new observable({
      buttonLabels: ["Play","Tutorial","About"],
      menuTapCommand: onMenuTapNavigate
    });

    function onMenuTapNavigate(event){
        let button = event.object,
        id = button.id,
        topmost = frame.topmost();

        let navigationEntry = {
          moduleName: pagePaths[id],
          animated: true,
          navigationTransition: {
              transition: "flip ",
          }
        };

        topmost.navigate(navigationEntry);
        console.log(id);
    }

    exports.viewModel = viewModel;
}());
