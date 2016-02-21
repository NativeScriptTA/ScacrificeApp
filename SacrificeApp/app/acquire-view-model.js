(function () {
    'use strict';
    var observable = require("data/observable");
    var imageModule = require("ui/image");
    var labelModule = require("ui/label");
    var dialogs = require("ui/dialogs");
    var layout = require("ui/layouts/grid-layout");

    var SelectMagicElementsModel = (function (_super) {
        __extends(SelectMagicElementsModel, _super);

        function SelectMagicElementsModel() {
            _super.call(this);
            this.set("selectedName", "No person selected.");
            this.set("selectedIndicies", []);
        }

        SelectMagicElementsModel.prototype.selectedName = "No name selected.";

        SelectMagicElementsModel.prototype.setSelectedName = function (name) {
            this.set("selectedName", name);
        };

        SelectMagicElementsModel.prototype.loadMagicElementsOnGrid = function(gridLayout, magicElements, selectedIndicies) {
            this.set("selectedIndicies", selectedIndicies);
            let numberOfColumns = 4;
            let maxSelectedNumber = 5;
            let i, label, image, gridColumnIndex, gridRowIndex,
            originalElementWidth, originalElementHeight, element, length, greenTicks = [], labels = [];

            let child = gridLayout.getChildAt(0);
            if(child !== null && child !== undefined) {
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
                    var indicies = this.get("selectedIndicies");
                    if(eventData.object.isChecked === false && indicies.length == maxSelectedNumber) {
                        console.log(indicies.length);
                        dialogs.alert("You must select exactly " + maxSelectedNumber + " elements.");
                        return;
                    }

                    eventData.object.isChecked = !eventData.object.isChecked;
                    if(eventData.object.isChecked === true) {
                        indicies.push(eventData.object.index);

                        originalElementWidth = eventData.object.width;
                        originalElementHeight = eventData.object.height;

                        length = labels.length;
                        for(i = 0; i < length; i++) {
                            if(labels[i].index == eventData.object.index) {
                                labels[i].fontSize = 10;
                                labels[i].horizontalAlignment = "center";
                                labels[i].verticalAlignment = "center";
                                labels[i].width = 75;
                                break;
                            }
                        }

                        eventData.object.width = 75;
                        eventData.object.height = 75;

                        image = new imageModule.Image();
                        image.width = 20;
                        image.height = 20;
                        image.horizontalAlignment = "right";
                        image.verticalAlignment = "bottom";
                        image.src = "res://greentick";
                        image.index = eventData.object.index;
                        greenTicks.push(image);

                        gridLayout.addChild(image);
                        layout.GridLayout.setRow(image, eventData.object.rowIndex);
                        layout.GridLayout.setColumn(image, eventData.object.columnIndex);

                    } else {
                        indicies.splice(indicies.indexOf(eventData.object.index), 1);
                        length = greenTicks.length;
                        for(i = 0; i < length; i++) {
                            if(greenTicks[i].index == eventData.object.index) {
                                gridLayout.removeChild(greenTicks[i]);
                                greenTicks.splice(i, 1);
                                break;
                            }
                        }

                        length = labels.length;
                        for(i = 0; i < length; i++) {
                            if(labels[i].index == eventData.object.index) {
                                labels[i].fontSize = 12;
                                labels[i].horizontalAlignment = "center";
                                labels[i].verticalAlignment = "center";
                                labels[i].marginLeft = 0;
                                labels[i].width = originalElementWidth;
                                break;
                            }
                        }

                        eventData.object.width = originalElementWidth;
                        eventData.object.height = originalElementHeight;
                    }

                    this.set("selectedIndicies", indicies);
                }, this);

                gridLayout.addChild(image);

                layout.GridLayout.setRow(image, gridRowIndex);
                layout.GridLayout.setColumn(image, gridColumnIndex);

                label = new labelModule.Label();
                label.fontSize = 12;
                label.textWrap = true;
                label.text = magicElements[i].name;
                label.horizontalAlignment = "center";
                label.verticalAlignment = "center";
                gridLayout.addChild(label);

                layout.GridLayout.setRow(label, gridRowIndex);
                layout.GridLayout.setColumn(label, gridColumnIndex);

                label.index = i;
                labels.push(label);
            }

            for(i = 0; i < numberOfColumns; i++) {
                gridLayout.addColumn(new layout.ItemSpec(1, layout.GridUnitType.star));
            }

            length = magicElements.length;
            for(i = 0; i < length; i++) {
                if(i % numberOfColumns === 0) {
                    gridLayout.addRow(new layout.ItemSpec(1, layout.GridUnitType.star));
                }
            }
        };

        return SelectMagicElementsModel;
    }) (observable.Observable);

    exports.SelectMagicElementsModel = SelectMagicElementsModel;
    exports.mainViewModel = new SelectMagicElementsModel();
}());
