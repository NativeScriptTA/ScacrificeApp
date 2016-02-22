
    "use strict";

    var observable = require("data/observable"),
        observableArrayModule = require('data/observable-array'),
        labelModule = require("ui/label"),
        scrollViewModule = require("ui/scroll-view"),
        frame = require("ui/frame");

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
        };

    NamesModel.prototype.names = new observableArrayModule.ObservableArray(
    []
  );

        return NamesModel;
    }) (observable.Observable);



var newNamesModel = new observable.Observable({
  names: [],
  tapCommand : tapCommand
});

function tapCommand (args) {
    var target = {
      id: args.object.id,
      health: +args.object.name
    }
    global.target = target;
    console.log(global.targeId);
    var acquirePage = './acquire-page';
    let navigationEntry = {
        moduleName: acquirePage,
        animated: true,
        navigationTransition: {
            transition: "flip ",
        }
    };

    frame.topmost().navigate(navigationEntry);
}

exports.mainViewModel = new NamesModel();
exports.newViewModel = newNamesModel;
