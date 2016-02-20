'use strict';
var observable = require("data/observable");

var MakeMagicModel = (function (_super) {

    __extends(MakeMagicModel, _super);

    function MakeMagicModel() {
        _super.call(this);
    }

    return MakeMagicModel;

}) (observable.Observable);

exports.MakeMagicModel = MakeMagicModel;
exports.mainViewModel = new MakeMagicModel();
