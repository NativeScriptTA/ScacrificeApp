'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var magicElement = require("./models/magicElement");
var magicElementType = require("./models/magicElementType.js");
var vmModule = require("./main-view-model");
var everlvie = require("./app.js");

let selectedIndicies = [], magicElements = [];
let topmost;

function pageLoaded(args) {

    let i, element;
    let page = args.object;
    let mainViewModel = vmModule.mainViewModel;
    page.bindingContext = mainViewModel;

	topmost = frameModule.topmost();

    let gridLayout = view.getViewById(page, "magicElements");

    for(i = 1; i <= 40; i++) {

    	element = new magicElement.MagicElement("Element " + i + " name name name name", "res://icon", magicElementType.MagicElementType.SOUL);
    	magicElements.push(element);
    }

    mainViewModel.loadMagicElementsOnGrid(gridLayout, magicElements, selectedIndicies);

}

function submitMagicElements(eventData) {

    var navigationEntry = {
        moduleName: "./magic-page",
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