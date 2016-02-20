"use strict";

var observable = require("data/observable");
var observableArrayModule = require('data/observable-array');
var labelModule = require("ui/label");
var scrollViewModule = require("ui/scroll-view");
var frame = require("ui/frame");

var NamesModel = (function (_super) {
    __extends(NamesModel, _super);

    function NamesModel() {
        _super.call(this);
    }

    NamesModel.prototype.nameTapCommand = function (args) {
        console.log(this.names.getItem(args.index));

        var acquirePage = './acquire-page';
        let navigationEntry = {
            moduleName: acquirePage,
            animated: true,
            navigationTransition: {
                transition: "flip ",
            },
            context: {
                name: this.names.getItem(args.index)
            }
        };

        frame.topmost().navigate(navigationEntry);
    }

    NamesModel.prototype.names = new observableArrayModule.ObservableArray([
        "Archie	Bradley",
        "Colleen Park",
        "Tamara	Newton",
        "Marion	Woods",
        "Ignacio Salazar",
        "Elisa Murray",
        "Bernard Mack",
        "Jeffrey Lynch",
        "Myrtle	Lambert",
        "Malcolm Hammond",
        "Archie	Bradley",
        "Colleen Park",
        "Tamara	Newton",
        "Marion	Woods",
        "Ignacio Salazar",
        "Elisa Murray",
        "Bernard Mack",
        "Jeffrey Lynch",
        "Myrtle	Lambert",
        "Malcolm Hammond",
        "Archie	Bradley",
        "Colleen Park",
        "Tamara	Newton",
        "Marion	Woods",
        "Ignacio Salazar",
        "Elisa Murray",
        "Bernard Mack",
        "Jeffrey Lynch",
        "Myrtle	Lambert",
        "Malcolm Hammond",
    ]);

    return NamesModel;
}) (observable.Observable);

exports.mainViewModel = new NamesModel();
