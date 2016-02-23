(function () {
    'use strict';
    let view = require("ui/core/view"),
        frameModule = require("ui/frame"),
        magicElement = require("./models/magicElement"),
        dialogs = require("ui/dialogs"),
        vmModule = require("./acquire-view-model"),
        gestures = require("ui/gestures");

    let page,
        requiredSelectedElements = 5,
        selectedIndicies = [], magicElements = [],
        topmost,
        mainViewModel = vmModule.mainViewModel;

    function pageLoaded(args) {
        let i, element;
        page = args.object;
        initITemsIfNeeded();
    	  topmost = frameModule.topmost();
        page.bindingContext = mainViewModel;
        //console.log(args.object.navigationContext.spellInfo.spellName);
        let submitImage = view.getViewById(page, "submitImage");
        submitImage.on(gestures.GestureTypes.tap, submitMagicElements);
    }

    exports.onNavigatedTo = function (args) {
        // var selectedNameString = "What do you want to use on " +
        // args.object.navigationContext.name + "?";
        // args.object.bindingContext.setSelectedName(selectedNameString);
    };

    function initITemsIfNeeded(){
      console.log('Items recovered');

      global.dbmanager.getAllItems(function(data){
        console.log('items ----> ');
        let gridLayout = view.getViewById(page, "magicElements");
        console.log('items ----> grid found');
        for(var i = 0; i < data.length; i++) {
          console.log('items ----> ' + i);
          console.log('items ----> ' + data[i].name);
          console.log('items ----> ' + data[i].type);
        	let element = new magicElement.MagicElement( data[i].name, "res://"+data[i].name, magicElement.MagicElement.parseElementType(data[i].type));
          console.log(magicElements.length);
        	magicElements.push(element);
        }
        console.log('items ----> grid found!!!!');

        mainViewModel.loadMagicElementsOnGrid(gridLayout, magicElements, selectedIndicies);
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
}());
