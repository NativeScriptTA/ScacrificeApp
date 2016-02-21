"use strict";

var stackLayoutModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var borderModule = require("ui/border");

var RoundedImageButton = (function (_super) {
    __extends(RoundedImageButton, _super);

    function RoundedImageButton() {
        _super.call(this);

        var btn = new buttonModule.Button();
        btn.text = "Tap me!";
        btn.width = 50;
        btn.height = 50;
        btn.backgroundColor = "red";
        btn.backgroundRadius = 5;
        this.backgroundRadius = 5;

        this.addChild(btn);
    }

    return RoundedImageButton;
})(stackLayoutModule.StackLayout);


exports.RoundedImageButton = new RoundedImageButton;
