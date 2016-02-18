'use strict';
var observable = require("data/observable");
var imageModule = require("ui/image");
var layout = require("ui/layouts/grid-layout");

var SelectMagicElementsModel = (function (_super) {

    __extends(SelectMagicElementsModel, _super);

    function SelectMagicElementsModel() {
        _super.call(this);
    }

    SelectMagicElementsModel.prototype.loadMagicElementsOnGrid = function(gridLayout, magicElements, selectedIndicies) {

            let numberOfColumns = 4;
            let i, image, gridColumnIndex, gridRowIndex,
            originalElementWidth, originalElementHeight, element, length, greenTicks = [];

            let child = gridLayout.getChildAt(0);
            if(child != null && child != undefined) {
                return;
            }

            length = magicElements.length;

            for(i = 0; i < length; i++) {

                element = magicElements[i];
                image = new imageModule.Image();
                image.src = element.image;

                gridRowIndex = i / numberOfColumns;
                gridColumnIndex = i % numberOfColumns;

                image.index = i;
                image.rowIndex = gridRowIndex;
                image.columnIndex = gridColumnIndex;
                image.isChecked = false;

                image.on("tap", function (eventData) {

                    eventData.object.isChecked = !eventData.object.isChecked;

                    if(eventData.object.isChecked == true) {

                        selectedIndicies.push(eventData.object.index);

                        originalElementWidth = eventData.object.width;
                        originalElementHeight = eventData.object.height;
                        eventData.object.width = 75;
                        eventData.object.height = 75;

                        image = new imageModule.Image();
                        image.width = 20;
                        image.height = 20;
                        image.horizontalAlignment = "right";
                        image.verticalAlignment = "bottom";
                        image.marginLeft = 50;
                        image.src = "res://greentick";
                        image.index = eventData.object.index;
                        greenTicks.push(image);

                        gridLayout.addChild(image);
                        layout.GridLayout.setRow(image, eventData.object.rowIndex);
                        layout.GridLayout.setColumn(image, eventData.object.columnIndex);

                    } else {

                        selectedIndicies.splice(selectedIndicies.indexOf(eventData.object.index), 1);

                        length = greenTicks.length;

                        for(i = 0; i < length; i++) {

                            if(greenTicks[i].index == eventData.object.index) {
                                gridLayout.removeChild(greenTicks[i]);
                                greenTicks.splice(i, 1);
                                break;
                            }
                        }

                        eventData.object.width = originalElementWidth;
                        eventData.object.height = originalElementHeight;
                    }

                }, this);

                gridLayout.addChild(image);

                layout.GridLayout.setRow(image, gridRowIndex);
                layout.GridLayout.setColumn(image, gridColumnIndex);
            }


            for(i = 0; i < numberOfColumns; i++) {
                gridLayout.addColumn(new layout.ItemSpec(1, layout.GridUnitType.star));
            }

            length = magicElements.length;

            for(i = 0; i < length; i++) {
                if(i % numberOfColumns == 0) {
                    gridLayout.addRow(new layout.ItemSpec(1, layout.GridUnitType.star));
            }
        }
    }

    return SelectMagicElementsModel;

}) (observable.Observable);

exports.SelectMagicElementsModel = SelectMagicElementsModel;
exports.mainViewModel = new SelectMagicElementsModel();
