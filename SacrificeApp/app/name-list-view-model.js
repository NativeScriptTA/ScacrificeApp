"use strict";

var observable = require("data/observable");
var labelModule = require("ui/label");
var scrollViewModule = require("ui/scroll-view");
var frame = require("ui/frame");

var NamesModel = (function (_super) {
    __extends(NamesModel, _super);

    function NamesModel() {
        _super.call(this);
    }

    NamesModel.prototype.loadNamesOnPage = function (view, names) {
        for (var i = 0; i < names.length; i++) {
            var nameLabel = new labelModule.Label();
            nameLabel.text = names[i];
            nameLabel.className = "name-list-item";
            nameLabel.backgroundColor = i % 2 == 0 ? "silver" : "gray";
            nameLabel.width = "*";
            scrollView.addChild(nameLabel);
        }
    }

    NamesModel.prototype.nameTapCommand = function (event) {
        var acquirePage = './acquire-page';
        let navigationEntry = {
            moduleName: acquirePage,
            animated: true,
            navigationTransition: {
                transition: "flip ",
            }
        };

        //var name = event.target.text;

        console.log(event);
        //console.log(event.target);

        frame.topmost().navigate(navigationEntry);
    }

    NamesModel.prototype.names = [
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
    ];

    return NamesModel;
}) (observable.Observable);

exports.mainViewModel = new NamesModel();
