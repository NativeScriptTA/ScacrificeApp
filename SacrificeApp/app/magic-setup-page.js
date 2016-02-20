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

	let page = args.object;
	let viewModel = new vmModule.MakeMagicModel;

	let geoViewModel = vmModule.magicModel;
	let imageWidth = geoViewModel.imageWidth;
	let imageHeight = geoViewModel.imageHeight;
	let placeholdersPositions = geoViewModel.pentagramPoints;
	let mainLayout = view.getViewById(page, "mainLayout");


	viewModel.magicElements = args.object.navigationContext.selectedMagicElements;

  page.bindingContext = viewModel;

	//creating placeHolders
	makePlaceHolder(placeholdersPositions, imageWidth, imageHeight, mainLayout)

	let itemsOnScreen = [];
	createItems(args, itemsOnScreen, imageWidth, imageHeight, mainLayout);

	for(let i = 0; i < itemsOnScreen.length; i++){
		let image = itemsOnScreen[i];

			//add gesture observer
    image.observe(gestures.GestureTypes.pan, function (eventData) {
	      let deltaX = eventData.deltaX;
	      let deltaY = eventData.deltaY;

	      let newTop = absoluteLayout.AbsoluteLayout.getTop(eventData.object) + deltaY;
	      let newLeft = absoluteLayout.AbsoluteLayout.getLeft(eventData.object) + deltaX;

	      absoluteLayout.AbsoluteLayout.setTop(eventData.object, newTop);
	      absoluteLayout.AbsoluteLayout.setLeft(eventData.object, newLeft);

				//check availability of placeHolders
				checkIfPositionsAreOpene(itemsOnScreen, placeholdersPositions, geoViewModel, imageWidth, imageHeight);



	      for(let k = 0; k < placeholdersPositions.length; k++) {
	        let overlapResult = area(newLeft, newTop, eventData.object.width, eventData.object.height, placeholdersPositions[k].x,
	         	placeholdersPositions[k].y, imageWidth, imageHeight);

	        if(overlapResult >= 500 && !geoViewModel.slotFilled[k] ) {

	        	absoluteLayout.AbsoluteLayout.setTop(eventData.object, placeholdersPositions[k].y);
	        	absoluteLayout.AbsoluteLayout.setLeft(eventData.object, placeholdersPositions[k].x);
	        }
	    	}

  		}, image);
   }
}
function createItems(args, itemsOnScreen, imageWidth, imageHeight, mainLayout){
	let items = args.object.navigationContext.selectedMagicElements;
	for (let i = 0; i < items.length; i++) {

		 let image = new imageModule.Image();
		 image.width = imageWidth;
		 image.height = imageHeight;
		 image.src = items[i].image;
				 absoluteLayout.AbsoluteLayout.setLeft(image, (imageWidth + 5) * i + 5);

		 mainLayout.addChild(image);
		 itemsOnScreen.push(image);
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
