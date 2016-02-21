'use strict';
var dialogs = require("ui/dialogs");
var button = require("ui/button");
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
var stackLayout = require("ui/layouts/stack-layout");
var labelModule = require("ui/label");
var buttonModule = require("ui/button");
var geolocation = require("nativescript-geolocation");

var screenWidth, screenHeight;
var isMagicMenuShown = false;
var mainLayout, magicMenu;
var roundedImageButtonModule = require('./custom_views/RoundedImageButton.js');
var page;
var initMagicButtonClicks = 0;

function pageLoaded(args) {

	screenWidth = platformModule.screen.mainScreen.widthDIPs;
	screenHeight = platformModule.screen.mainScreen.heightDIPs;

	page = args.object;
	let viewModel = new vmModule.MakeMagicModel;

	let geoViewModel = vmModule.magicModel;
	let magicMenuWidth = geoViewModel.magicMenuWidth;
	let magicMenuHeight = geoViewModel.magicMenuHeight;
	let imageWidth = geoViewModel.imageWidth;
	let imageHeight = geoViewModel.imageHeight;
	let placeholdersPositions = geoViewModel.pentagramPoints;
	mainLayout = view.getViewById(page, "mainLayout");

	viewModel.magicElements = args.object.navigationContext.selectedMagicElements;

	page.bindingContext = viewModel;

	//creating placeHolders
	makePlaceHolder(placeholdersPositions, imageWidth, imageHeight, mainLayout)

	let itemsOnScreen = [];
	createItems(args, itemsOnScreen, imageWidth, imageHeight, mainLayout);

	for(let i = 0; i < itemsOnScreen.length; i++) {
		let image = itemsOnScreen[i];
			// add gesture observer
    	  image.observe(gestures.GestureTypes.pan, function (eventData) {
		      let deltaX = eventData.deltaX;
		      let deltaY = eventData.deltaY;

		      let newTop = absoluteLayout.AbsoluteLayout.getTop(eventData.object) + deltaY;
		      let newLeft = absoluteLayout.AbsoluteLayout.getLeft(eventData.object) + deltaX;

		      if(newTop < 0 || newTop + imageHeight > screenHeight) {
		      	return;
		      }

		      if(newLeft < 0 || newLeft + imageWidth > screenWidth) {
		      	return;
		      }

		      absoluteLayout.AbsoluteLayout.setTop(eventData.object, newTop);
		      absoluteLayout.AbsoluteLayout.setLeft(eventData.object, newLeft);

			   // check availability of placeHolders
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

   	mainLayout.on(gestures.GestureTypes.longPress, function (args) {
		showDailog(geoViewModel.focus)
	});


	let compassImage = new imageModule.Image();
	compassImage.width = geoViewModel.compassWidth;
	compassImage.height = geoViewModel.compassHeight;
	compassImage.src = "res://compass";
	absoluteLayout.AbsoluteLayout.setLeft(compassImage, screenWidth - compassImage.width);
	absoluteLayout.AbsoluteLayout.setTop(compassImage, screenHeight - (compassImage.height + 80));
	mainLayout.addChild(compassImage);

	let needleImage = new imageModule.Image();
	needleImage.width = geoViewModel.needleWidth;
	needleImage.height = geoViewModel.needleHeight;
	needleImage.src = "res://needle";
	absoluteLayout.AbsoluteLayout.setLeft(needleImage, screenWidth - needleImage.width);
	absoluteLayout.AbsoluteLayout.setTop(needleImage, screenHeight - (needleImage.height + 80));
	mainLayout.addChild(needleImage);

	let currentDirection;
	let locationOptions = {
        desiredAccuracy: 3,
        updateDistance: 0,
        minimumUpdateTime: 2000,
        maximumAge: 20000
    };

	let watchId = geolocation.watchLocation(
	function (location) {
		if (location) {
	    if (currentDirection != location.direction) {
	    	currentDirection = location.direction;
	    	needleImage.animate({
				rotate: currentDirection,
				duration: 2000
			});
	    }
		}
	},
	function(e){
		console.log("Error: " + e.message);
	},
	locationOptions);
}

function showDailog(focus){
	dialogs.action({
		message: focus.message,
		cancelButtonText: focus.cancelText,
		actions: focus.focusOptions
	}).then(function (result) {
		var container = page.getViewById('mainLayout');
		console.log("Dialog result: " + result);
		addInitMagicButton(container, 60, 60);
		addInitMagicButton(container, 60, 220);
		addInitMagicButton(container, 220, 60);
		addInitMagicButton(container, 220, 220);
	});
}

function addInitMagicButton(container, top, left) {
	var initMagicButton = new buttonModule.Button();
	initMagicButton.width = 50;
	initMagicButton.height = 50;
	initMagicButton.backgroundColor = "red";
	initMagicButton.borderRadius = 50;
	initMagicButton.on(button.Button.tapEvent, function (args) {
		initMagicButtonClicks++;

		if (initMagicButtonClicks == 4) {
			var label = new labelModule.Label();
			label.text = "YOU HAVE CLICKED 4 TIMES!";

			absoluteLayout.AbsoluteLayout.setTop(label, top);
			absoluteLayout.AbsoluteLayout.setLeft(label, left);

			container.addChild(label);
		}

		container._removeView(args.object);
	});

	absoluteLayout.AbsoluteLayout.setTop(initMagicButton, top);
	absoluteLayout.AbsoluteLayout.setLeft(initMagicButton, left);

	container.addChild(initMagicButton);
}

function remoteDataItemsToMagicElements(remoteData) {
	let result = [];
	for(let i = 0; i < remoteData.length; i++) {
		let magicElement = new magicElement.MagicElement(remoteData[i].name, "res://" + remoteData[i].name,
			magicElement.MagicElement.parseElementType(remoteData[i].type));
	}
	return result;
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
