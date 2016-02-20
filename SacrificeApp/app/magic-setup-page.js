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
var stackLayout = require("ui/layouts/stack-layout"); 
var labelModule = require("ui/label");

var screenWidth, screenHeight;
var isMagicMenuShown = false;
var mainLayout, magicMenu;

function pageLoaded(args) {

	screenWidth = platformModule.screen.mainScreen.widthDIPs;
	screenHeight = platformModule.screen.mainScreen.heightDIPs;
	
	let page = args.object;
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
   
   	mainLayout.on(gestures.GestureTypes.longPress, function (args) {
		showMagicPopUpMenu([ "Sex", "Drugs", "Money" ], magicMenuWidth, magicMenuHeight);
	});

	mainLayout.on(gestures.GestureTypes.tap, function(args) {
		if(isMagicMenuShown == true) {
			hideMagicPopUpMenu();
		}
	});
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

function showMagicPopUpMenu(menuOptions, width, heigh) {

    magicMenu = new stackLayout.StackLayout();
    magicMenu.width = width;
    magicMenu.height = heigh;
    absoluteLayout.AbsoluteLayout.setLeft(magicMenu, (screenWidth / 2) - (magicMenu.width / 2));
	absoluteLayout.AbsoluteLayout.setTop(magicMenu, (screenHeight / 2) - (magicMenu.height / 2));

    for(let i = 0; i < menuOptions.length; i++) {
	    let menuOption = new labelModule.Label();
	    menuOption.className = "menu-option";
	    menuOption.textWrap = true;
	    menuOption.text = menuOptions[i];
	    menuOption.horizontalAlignment = "center";
	    menuOption.verticalAlignment = "center";

	    menuOption.on(gestures.GestureTypes.tap, magicPopUpMenuHandler);
	    magicMenu.addChild(menuOption);
	}

	mainLayout.addChild(magicMenu);

	isMagicMenuShown = true;
}

function hideMagicPopUpMenu() {
	mainLayout.removeChild(magicMenu);

	isMagicMenuShown = false;
}

function magicPopUpMenuHandler(eventData) {

	console.log(eventData.object.text);
}

exports.pageLoaded = pageLoaded;
