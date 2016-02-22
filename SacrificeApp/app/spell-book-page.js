"use strict";
var spellViewModel = require('./spell-book-view-model');
var frame = require("ui/frame");
var viewModel = spellViewModel.viewModel;

function pageLoaded(args) {
    let page = args.object;
    console.log("->>>>>"+args.object.navigationContext.name);
    viewModel.dataToBePassed.name = args.object.navigationContext.name;
    page.bindingContext = viewModel;
    getSpells(viewModel);
}

function getSpells(viewModel){
  viewModel.spells = ['spell1','spell2'];
  console.log(viewModel.spells);
}

function btnTap(args){
  viewModel.dataToBePassed.spellName = 'newSpell';
  var acquirePage = './acquire-page';
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
}
function tapCommand (args) {
    var spellName = args.object.text;
    viewModel.dataToBePassed.spellName = spellName;

    console.log(viewModel.dataToBePassed.name);
    var acquirePage = './acquire-page';
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
}

exports.pageLoaded = pageLoaded;
exports.tapCommand = tapCommand
exports.btntTapCommand = btnTap
