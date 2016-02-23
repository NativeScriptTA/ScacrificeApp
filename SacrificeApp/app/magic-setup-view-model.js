(function () {
    'use strict';
    let observable = require("data/observable"),
        geometry = require("./models/point");

    let startPoint = new geometry.Point(150,150),
        height = 200,
        pentagramPoints = [
      new geometry.Point(startPoint.x,startPoint.y),
      new geometry.Point(startPoint.x - height/2 ,startPoint.y + height/2.5),
      new geometry.Point(startPoint.x + height/2 ,startPoint.y + height/2.5),
      new geometry.Point(startPoint.x - height/4 ,startPoint.y + height),
      new geometry.Point(startPoint.x + height/4 ,startPoint.y + height)
    ];

    var taken = [0, 0, 0, 0, 0];

    var magicSetupModel = new observable.Observable({
      pentagramPoints: pentagramPoints,
      slotFilled: taken,
      imageWidth: 45,
      imageHeight: 45,
      magicMenuWidth: 300,
      magicMenuHeight: 300,
      compassWidth: 150,
      compassHeight: 150,
      needleWidth: 150,
      needleHeight: 150,
      focus: {
        cancelFocusSelectionText: "Go Back",
        focusOptions: ['Crystal', 'Animal Sacrifice', 'Human Sacrifice', 'Mental'],
        message: "Pick your focus"
      },
      nameOfTarget: ""
    });

    var MakeMagicModel = (function (_super) {

        __extends(MakeMagicModel, _super);

        function MakeMagicModel() {
            _super.call(this);
        }

        return MakeMagicModel;
    }) (observable.Observable);

    exports.MakeMagicModel = MakeMagicModel;
    exports.magicModel = magicSetupModel;
    exports.mainViewModel = new MakeMagicModel();
}());
