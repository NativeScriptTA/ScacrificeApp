'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var magicElement = require("./models/magicElement");
var magicElementType = require("./models/magicElementType.js");
var dialogs = require("ui/dialogs");
var vmModule = require("./acquire-view-model");
var everlvie = require("./app.js");

let requiredSelectedElements = 5;
let selectedIndicies = [], magicElements = [];
let topmost;
let mainViewModel = vmModule.mainViewModel;

function pageLoaded(args) {
    let i, element;
    let page = args.object;
    initITemsIfNeeded();
	  topmost = frameModule.topmost();
    page.bindingContext = mainViewModel;

    let gridLayout = view.getViewById(page, "magicElements");
    for(i = 1; i <= 40; i++) {
    	element = new magicElement.MagicElement("Element " + i + " name name name name", "res://icon", magicElementType.MagicElementType.SOUL);
    	magicElements.push(element);
    }

    vmModule.mainViewModel.loadMagicElementsOnGrid(gridLayout, magicElements, selectedIndicies);
}

exports.onNavigatedTo = function (args) {
    // funny note
    var selectedNameString = "What do you want to use on " +
            args.object.navigationContext.name + "?";
    args.object.bindingContext.setSelectedName(selectedNameString);
}

function initITemsIfNeeded(){
  console.log('Here');
  global.dbmanager.getAllItems(function(data){
     console.dump(data);
  });

}

function submitMagicElements(eventData) {

    if(selectedIndicies.length != requiredSelectedElements) {
        dialogs.alert("You must select exactly " + requiredSelectedElements + " elements.");
        return;
    }

    var navigationEntry = {
        moduleName: "./magic-setup-page",
        context: {
        	selectedMagicElements: []
        },
        animated: true,
        navigationTransition: {
            transition: "flip ",
        }
    };

    for(let i = 0; i < selectedIndicies.length; i++) {
    	navigationEntry.context.selectedMagicElements.push(magicElements[selectedIndicies[i]]);
    }

    topmost.navigate(navigationEntry);
}

exports.pageLoaded = pageLoaded;
exports.submitMagicElements = submitMagicElements;
