'use strict';
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var magicElement = require("./models/magicElement");
var magicElementType = require("./models/magicElementType.js");
var geometry = require("./models/point")
var gestures = require("ui/gestures");
var absoluteLayout = require("ui/layouts/absolute-layout");
var imageModule = require("ui/image");
var platformModule = require("platform");
var vmModule = require("./magic-setup-view-model");
var area = require("rectangle-overlap");

function pageLoaded(args) {

	let imageWidth = 45, imageHeight = 45;
	let geoViewModel = vmModule.magicModel;
	let placeholdersPositions = geoViewModel.pentagramPoints;
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

	 //creating placeHolders
	//  for(let i = 0; i < placeholdersPositions.length; i++) {
	// 		 placeholderImage = new imageModule.Image();
	// 		 placeholderImage.width = imageWidth;
	// 		 placeholderImage.height = imageHeight;
	// 		 placeholderImage.src = "res://magicelementplaceholder";
	// 		 absoluteLayout.AbsoluteLayout.setLeft(placeholderImage, placeholdersPositions[i].x);
	// 		 absoluteLayout.AbsoluteLayout.setTop(placeholderImage, placeholdersPositions[i].y);
	// 		 mainLayout.addChild(placeholderImage);
	// 	}

		makePlaceHolder(placeholdersPositions, imageWidth, imageHeight, mainLayout)

	 let items = args.object.navigationContext.selectedMagicElements;
	 let itemsOnScreen = [];
   for (i = 0; i < items.length; i++) {

   		image = new imageModule.Image();
   		image.width = imageWidth;
   		image.height = imageHeight;
      image.src = items[i].image;
        	absoluteLayout.AbsoluteLayout.setLeft(image, (imageWidth + 5) * i + 5);

      mainLayout.addChild(image);
			itemsOnScreen.push(image);
		}

		for(i = 0; i < items.length; i++){
			image = itemsOnScreen[i];

			//add gesture observer
      image.observe(gestures.GestureTypes.pan, function (eventData) {
	        deltaX = eventData.deltaX;
	        deltaY = eventData.deltaY;

	        newTop = absoluteLayout.AbsoluteLayout.getTop(eventData.object) + deltaY;
	        newLeft = absoluteLayout.AbsoluteLayout.getLeft(eventData.object) + deltaX;

	        absoluteLayout.AbsoluteLayout.setTop(eventData.object, newTop);
	        absoluteLayout.AbsoluteLayout.setLeft(eventData.object, newLeft);

					//check availability of placeHolders
					checkIfPositionsAreOpene(itemsOnScreen, placeholdersPositions, geoViewModel, imageWidth, imageHeight);



	        for(i = 0; i < placeholdersPositions.length; i++) {
	        	overlapResult = area(newLeft, newTop, eventData.object.width, eventData.object.height, placeholdersPositions[i].x,
	         		placeholdersPositions[i].y, imageWidth, imageHeight);

	        	if(overlapResult >= 500 && !geoViewModel.slotFilled[i] ) {

	        		absoluteLayout.AbsoluteLayout.setTop(eventData.object, placeholdersPositions[i].y);
	        		absoluteLayout.AbsoluteLayout.setLeft(eventData.object, placeholdersPositions[i].x);
	        	}
	    		}

  		}, image);
   }
}

function makePlaceHolder(placeholdersPositions, imageWidth, imageHeight, mainLayout){
	for(let i = 0; i < placeholdersPositions.length; i++) {
			let placeholderImage = new imageModule.Image();
			placeholderImage.width = imageWidth;
			placeholderImage.height = imageHeight;
			placeholderImage.src = "res://magicelementplaceholder";
			absoluteLayout.AbsoluteLayout.setLeft(placeholderImage, placeholdersPositions[i].x);
			absoluteLayout.AbsoluteLayout.setTop(placeholderImage, placeholdersPositions[i].y);
			mainLayout.addChild(placeholderImage);
	 }
}
function checkIfPositionsAreOpene(itemsOnScreen, placeholdersPositions, geoViewModel, imageWidth, imageHeight){
	for(let i = 0; i < placeholdersPositions.length; i++) {
		let count = 0;

		for(var k = 0; k < itemsOnScreen.length; k+=1){
			let currentItem = itemsOnScreen[k]
			let top = absoluteLayout.AbsoluteLayout.getTop(currentItem)
			let left = absoluteLayout.AbsoluteLayout.getLeft(currentItem)
			//console.log("Left "+left);
			let overlapResult = area(left, top, currentItem.width, currentItem.height, placeholdersPositions[i].x,
			placeholdersPositions[i].y, imageWidth, imageHeight);

			if(overlapResult >= 500) {
				count+=1;
			}
		}
		if(count>1){
			// console.log("["+g+"]Count: " + count);
			geoViewModel.slotFilled[i] = true
		} else{
			// console.log("Freed ["+g+"]Count: " + count);
			geoViewModel.slotFilled[i] = false
		}
	}
}

exports.pageLoaded = pageLoaded;
