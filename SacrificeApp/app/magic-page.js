'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var magicElement = require("./models/magicElement");
var magicElementType = require("./models/magicElementType.js");
var gestures = require("ui/gestures");
var absoluteLayout = require("ui/layouts/absolute-layout");
var imageModule = require("ui/image");
var platformModule = require("platform");
var vmModule = require("./magic-view-model");
var area = require("rectangle-overlap");

function pageLoaded(args) {

	let imageWidth = 45, imageHeight = 45;
	let placeholdersPositions = [ { X: 150, Y: 200 }, { X: 50, Y: 150 }, { X: 250, Y: 150 } ];
	let placeholderImage, overlapResult;
	let image, i, mainLayout, deltaX, deltaY, newTop, newLeft;
	let page = args.object;
	let viewModel = new vmModule.MakeMagicModel;

	console.log(viewModel);
	viewModel.magicElements = args.object.navigationContext.selectedMagicElements;

   page.bindingContext = viewModel;
   console.log(viewModel.magicElements);
   console.log("Count of selected magic elements: " + args.object.navigationContext.selectedMagicElements.length);
   console.log("Elements names:");
   mainLayout = view.getViewById(page, "mainLayout");

   for(i = 0; i < placeholdersPositions.length; i++) {
		placeholderImage = new imageModule.Image();
		placeholderImage.width = imageWidth;
		placeholderImage.height = imageHeight;
		placeholderImage.src = "res://magicelementplaceholder";
		absoluteLayout.AbsoluteLayout.setLeft(placeholderImage, placeholdersPositions[i].X);
		absoluteLayout.AbsoluteLayout.setTop(placeholderImage, placeholdersPositions[i].Y);
		mainLayout.addChild(placeholderImage);
   }

   for (i = 0; i < args.object.navigationContext.selectedMagicElements.length; i++) {

   		image = new imageModule.Image();
   		image.width = imageWidth;
   		image.height = imageHeight;
        image.src = args.object.navigationContext.selectedMagicElements[i].image;
        absoluteLayout.AbsoluteLayout.setLeft(image, (imageWidth + 5) * i + 5);

        mainLayout.addChild(image);

        image.observe(gestures.GestureTypes.pan, function (eventData) {

	        deltaX = eventData.deltaX;
	        deltaY = eventData.deltaY;

	        newTop = absoluteLayout.AbsoluteLayout.getTop(eventData.object) + deltaY;
	        newLeft = absoluteLayout.AbsoluteLayout.getLeft(eventData.object) + deltaX;

	        absoluteLayout.AbsoluteLayout.setTop(eventData.object, newTop);
	        absoluteLayout.AbsoluteLayout.setLeft(eventData.object, newLeft);

	        for(i = 0; i < placeholdersPositions.length; i++) {
	        	overlapResult = area(newLeft, newTop, eventData.object.width, eventData.object.height, placeholdersPositions[i].X,
	         		placeholdersPositions[i].Y, placeholderImage.width, placeholderImage.height);

	        	if(overlapResult >= 500) {

	        		absoluteLayout.AbsoluteLayout.setTop(eventData.object, placeholdersPositions[i].Y);
	        		absoluteLayout.AbsoluteLayout.setLeft(eventData.object, placeholdersPositions[i].X);
	        	}
	    	}

  		}, image); 
   }
}

exports.pageLoaded = pageLoaded;
