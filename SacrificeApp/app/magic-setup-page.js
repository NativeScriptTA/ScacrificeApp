(function () {
	'use strict';
	var dialogs = require("ui/dialogs");
	var button = require("ui/button");
	var view = require("ui/core/view");
	var frameModule = require("ui/frame");
	var magicElement = require("./models/magicElement");
	var magicElementType = require("./models/magicElementType.js");
	var geometry = require("./models/point");
	var gestures = require("ui/gestures");
	var absoluteLayout = require("ui/layouts/absolute-layout");
	var imageModule = require("ui/image");
	var platformModule = require("platform");
	var vmModule = require("./magic-setup-view-model");
	var area = require("rectangle-overlap");
	var stackLayout = require("ui/layouts/stack-layout");
	var labelModule = require("ui/label");
	var buttonModule = require("ui/button");
	var animationManager = require('./animations/AnimationManager.js').AnimationManager;
	var toastModule = require("nativescript-toast");

	var geolocation;
	var needleImage;
	var screenWidth, screenHeight;
	var isMagicMenuShown = false;
	var mainLayout, magicMenu;
	var page;
	var initMagicButtonClicks = 0;
	var occupiedAreas = [];
	var itemsOnScreen = [];
	var magicButtons = [];
	var dialogResult = "";
	var workingSpells = [];
	var geoViewModel = vmModule.magicModel;
	var items = [];
	var elementMagicalPositions = [];
	var chosenFocus = '';

	function pageLoaded(args) {

		screenWidth = platformModule.screen.mainScreen.widthDIPs;
		screenHeight = platformModule.screen.mainScreen.heightDIPs;
		isMagicMenuShown = false;
		initMagicButtonClicks = 0;
		occupiedAreas = [];
		itemsOnScreen = [];
		magicButtons = [];
		dialogResult = "";
		workingSpells = [];
		geoViewModel = vmModule.magicModel;
		items = [];
		elementMagicalPositions = [];

		getWorkingSpells();
		page = args.object;
		let viewModel = new vmModule.MakeMagicModel();
		let magicMenuWidth = geoViewModel.magicMenuWidth;
		let magicMenuHeight = geoViewModel.magicMenuHeight;
		let imageWidth = geoViewModel.imageWidth;
		let imageHeight = geoViewModel.imageHeight;
		let placeholdersPositions = geoViewModel.pentagramPoints;
		mainLayout = view.getViewById(page, "mainLayout");

		console.log("itemsOnScreen");
		console.log(itemsOnScreen.length);
		viewModel.magicElements = args.object.navigationContext.selectedMagicElements;
		geoViewModel.nameOfTarget = args.object.navigationContext.name;
		page.bindingContext = viewModel;

		//creating placeHolders
		makePlaceHolder(placeholdersPositions, imageWidth, imageHeight, mainLayout);


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
					clearPositions(geoViewModel);

			      for(let k = 0; k < placeholdersPositions.length; k++) {
			        let overlapResult = area(newLeft, newTop, eventData.object.width, eventData.object.height, placeholdersPositions[k].x,
			         	placeholdersPositions[k].y, imageWidth, imageHeight);

				        if(overlapResult >= 500 && geoViewModel.slotFilled[k]===1 ) {
									elementMagicalPositions[k] = items[i].type;
				        	absoluteLayout.AbsoluteLayout.setTop(eventData.object, placeholdersPositions[k].y);
				        	absoluteLayout.AbsoluteLayout.setLeft(eventData.object, placeholdersPositions[k].x);
				        }
			       }

	  		}, image);
	   }

	   	mainLayout.on(gestures.GestureTypes.longPress, function (args) {
			showDailog(geoViewModel.focus);
		});


		let compassImage = new imageModule.Image();
		compassImage.width = geoViewModel.compassWidth;
		compassImage.height = geoViewModel.compassHeight;
		compassImage.src = "res://compass";
		absoluteLayout.AbsoluteLayout.setLeft(compassImage, screenWidth - compassImage.width);
		absoluteLayout.AbsoluteLayout.setTop(compassImage, screenHeight - (compassImage.height + 80));
		mainLayout.addChild(compassImage);

		needleImage = new imageModule.Image();
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

 		geolocation = require("nativescript-geolocation");

 		console.log("will rotate");
		let watchId = geolocation.watchLocation(
		function (location) {
			if (location) {
		    if (currentDirection != location.direction) {
		    	currentDirection = location.direction;
		    	console.log("rotating");
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

	function clearPositions(geoViewModel){
		for (var i = 0; i < geoViewModel.slotFilled.length; i++) {
			console.log(geoViewModel.slotFilled);
			if(geoViewModel.slotFilled[i] === 0){
				elementMagicalPositions[i]=null;
			}
		}
	}

	function getWorkingSpells(){
		console.log('Spells ----> Getting Spells');
		let rituals = global.everlive.data('Rituals');
		rituals.get()
			.then(function(data){

			let items = data.result;
			for (var i = 0; i < items.length; i++) {
				//console.log(items[i]['UserName']);
				let spell = {
					loc: items[i]['Elements'],
					heading: items[i]['Heading'],
					source: items[i]['Source']
				}
				workingSpells.push(spell);
			}
			console.log(workingSpells[0].loc);
		}, function(err) {
			console.log(err.message);
		})
	}

	function checkIfMagicIsSuccessful(){
		for (var i = 0; i < workingSpells.length; i++) {
			let isCorrect = true;
			for (var j = 0; j < elementMagicalPositions.length; j++) {
				console.log(workingSpells[i].loc[j]);
				if(elementMagicalPositions[j] !== parse(workingSpells[i].loc[j])){
					console.log("Mismathc "+(elementMagicalPositions[j] + " vs " +  parse(workingSpells[i].loc[j])));
					isCorrect = false;
				}
			}
			if(isCorrect){
				return true;
			}
		}
		return false;
	}

	function parse(name){
		switch(name) {
			case "Earth": return magicElementType.MagicElementType.EARTH;
			case "Fire": return magicElementType.MagicElementType.FIRE;
			case "Air": return magicElementType.MagicElementType.WIND;
			case "Water": return magicElementType.MagicElementType.WATER;
			case "Spirit": return magicElementType.MagicElementType.SOUL;
			default: return -1;
		}
	}

	function showDailog(focus){
		dialogs.action({
			message: focus.message,
			cancelButtonText: focus.cancelText,
			actions: focus.focusOptions
		}).then(function (result) {
			let container = page.getViewById('mainLayout');
			console.log("Dialog result: " + result);
			dialogResult = result;
			magicButtons = [];
			let pos = getRandomPositionForItem(50, 50);
			addInitMagicButton(container, pos.X, pos.Y);
			pos = getRandomPositionForItem(50, 50);
			addInitMagicButton(container, pos.X, pos.Y);
			pos = getRandomPositionForItem(50, 50);
			addInitMagicButton(container, pos.X, pos.Y);
			pos = getRandomPositionForItem(50, 50);
			addInitMagicButton(container, pos.X, pos.Y);

			let isErrorShown = false;
			for(let i = 0; i < magicButtons.length; i++) {
				magicButtons[i].animate({
					scale: {x: 0, y: 0},
					duration: 5000
				}).then(function() {
					if (isErrorShown) {
						return;
					}
					isErrorShown = true;

					let isThereNotClickedButton = false;
					for(let j = 0; j < magicButtons.length; j++) {
						if(!magicButtons[i].isClicked) {
							isThereNotClickedButton = true;
							break;
						}
					}

					if(!isThereNotClickedButton) {

						return;
					}

					container._removeView(needleImage);
					dialogs.alert({
						title: "Maybe next time",
						message: "Failed to cast that spell",
						okButtonText: "Damn it!"
					});
				});
			}
		});
	}

	function addInitMagicButton(container, left, top) {
		let initMagicButton = new buttonModule.Button();
		initMagicButton.width = 50;
		initMagicButton.height = 50;
		initMagicButton.backgroundColor = "red";
		initMagicButton.borderRadius = 50;
		initMagicButton.isClicked = false;
		magicButtons.push(initMagicButton);
		initMagicButton.on(button.Button.tapEvent, function (args) {
			args.object.isClicked = true;
			initMagicButtonClicks++;

			if (initMagicButtonClicks == 4) {
				initMagicButtonClicks = 0;
				var doMagic = checkIfMagicIsSuccessful();
				var text;
				if(doMagic){
					text = 'Yea!!!!';
				} else {
					text = 'Damn!!!'
				}
				makeToast(text);

				let images = itemsOnScreen;
				for (let i = 0; i < images.length; i++) {
					images[i].position = {
						x: absoluteLayout.AbsoluteLayout.getLeft(images[i]),
						y: absoluteLayout.AbsoluteLayout.getTop(images[i])
					};
				}

				var focusOptions = geoViewModel.focus.focusOptions;
				var chosenAnimation = focusOptions.indexOf(dialogResult);

				animationManager.applyAnimation(images, platformModule.screen.mainScreen, chosenAnimation);
				container._removeView(needleImage);
			}

			releaseItemArea(absoluteLayout.AbsoluteLayout.getLeft(args.object), absoluteLayout.AbsoluteLayout.getTop(args.object),
				args.object.width, args.object.height);
			container._removeView(args.object);
		});

		absoluteLayout.AbsoluteLayout.setTop(initMagicButton, top);
		absoluteLayout.AbsoluteLayout.setLeft(initMagicButton, left);

		container.addChild(initMagicButton);
	}

	function makeToast(text){
    console.log("my-experience-page -> makeToast");
    var toast = toastModule.makeText(text);
    toast.show();
}

function releaseItemArea(itemLeft, itemTop, itemWidth, itemHeight) {
		for(let i = 0; i < occupiedAreas.length; i++) {
			if(area(occupiedAreas[i].left, occupiedAreas[i].top, itemWidth, itemHeight, itemLeft,
		         	itemTop, itemWidth, itemHeight) > 0) {
				occupiedAreas.splice(i, 1);
				break;
			}
		}
	}

	function getRandomPositionForItem(itemWidth, itemHeight) {
		let position = {};

		while(1) {
			position.X = Math.floor(Math.abs(Math.abs((screenWidth * Math.random())) - itemWidth));
			position.Y = Math.floor(Math.abs(Math.abs((screenHeight * Math.random())) - (itemHeight + 80)));

			let isValid = true;
			for(let i = 0; i < occupiedAreas.length; i++) {
				if(area(occupiedAreas[i].left, occupiedAreas[i].top, itemWidth, itemHeight, position.X,
			         	position.Y, itemWidth, itemHeight) > 0) {
					isValid = false;
					break;
				}
			}

			if(!isValid) {
				continue;
			}

			let occupiedArea = {};
			occupiedArea.left = position.X;
			occupiedArea.right = position.X + itemWidth;
			occupiedArea.top = position.Y;
			occupiedArea.bottom = position.Y + itemHeight;
			occupiedAreas.push(occupiedArea);
			break;
		}

		console.log("Position: " + position.X + " " + position.Y);
		return position;
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
		items = args.object.navigationContext.selectedMagicElements;
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
			let index = -1;

			for(var k = 0; k < itemsOnScreen.length; k+=1){
				let currentItem = itemsOnScreen[k];
				let top = absoluteLayout.AbsoluteLayout.getTop(currentItem);
				let left = absoluteLayout.AbsoluteLayout.getLeft(currentItem);
				//console.log("Left "+left);
				let overlapResult = area(left, top, currentItem.width, currentItem.height, placeholdersPositions[i].x,
				placeholdersPositions[i].y, imageWidth, imageHeight);

				if(overlapResult >= 500) {
					count+=1;
					index = k;
					console.log(elementMagicalPositions);
				}
			}
			geoViewModel.slotFilled[i] = count;
			// if(count>1){
			// 	// console.log("["+g+"]Count: " + count);
			// 	geoViewModel.slotFilled[i] = true;
			//
			// } else{
			// 	// console.log("Freed ["+g+"]Count: " + count);
			//
			// 	geoViewModel.slotFilled[i] = false;
			// }
		}
	}

	exports.pageLoaded = pageLoaded;
}());
