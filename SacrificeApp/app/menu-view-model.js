'use strict';
var observable = require("data/observable").Observable;
var frame = require("ui/frame");


var pagePaths = {
  "Play": "./acquire-page"
}
var viewModel = new observable({
  buttonLabels: ["Play","Tutorial","About"],
  menuTapCommand: onMenuTapNavigate
})

function onMenuTapNavigate(event){
  let button = event.object;
  let id = button.id;
  let topmost = frame.topmost();
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
