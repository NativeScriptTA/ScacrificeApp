'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var magicElement = require("./models/magicElement");
var magicElementType = require("./models/magicElementType.js");

function pageLoaded(args) {

   console.log("Count of selected magic elements: " + args.object.navigationContext.selectedMagicElements.length);
   console.log("Elements names:");
   for(let i = 0; i < args.object.navigationContext.selectedMagicElements.length; i++) {
   		console.log(args.object.navigationContext.selectedMagicElements[i].name);
   }
}

exports.pageLoaded = pageLoaded;