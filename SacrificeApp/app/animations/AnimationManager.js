(function () {
    "use strict";

    let animationModule = require('ui/animation');

    var AnimationManager = (function (_super) {
        __extends(AnimationManager, _super);

        function AnimationManager(definitions) {
            this.definitions = definitions;
        }

        let animations = {
            Crystal: 0,
            AnimalSacrifice: 1,
            HumanSacrifice: 2,
            Mental: 3
        };

        AnimationManager.prototype.applyAnimation = function (views, screenMetrics, animation) {
            switch (animation) {
                case animations.Crystal:

                    break;
                case animations.AnimalSacrifice:
                    break;
                case animations.HumanSacrifice:
                    break;
                case animations.Mental:
                    this.animateMental(views, screenMetrics);
                    break;
            }
        };

        AnimationManager.prototype.animateMental = function (views, screenMetrics) {
            console.log("screen: " + screenMetrics.widthDIPs + " " + screenMetrics.heightDIPs);
            for (let i = 0; i < views.length; i++) {
                console.log("View size: { " + views[i].width + " " + views[i].height + " }");
                animateMental(views[i], screenMetrics);
            }
        };

        function animateMental(view, screenMetrics) {
            view.animate({
                translate: {
                    x: screenMetrics.widthDIPs / 2 - view.width / 2 - view.position.x,
                    y:screenMetrics.heightDIPs / 2 - view.height - view.position.y}
                })
                .then(function () { return view.animate({ opacity: 1 }); })
                .then(function () { return view.animate({ scale: { x: 3, y: 3 } }); })
                .then(function () { return view.animate({ scale: { x: 1, y: 1 } }); })
                .then(function () { return view.animate({ translate: { x: 0, y: 0 } }); })
                .then(function () {
                    console.log("Mental animation finished");
                })
                .catch(function (e) {
                console.log(e.message);
            });
        }

        return AnimationManager;
    }(animationModule.Animation));

    exports.AnimationManager = new AnimationManager();
}());
