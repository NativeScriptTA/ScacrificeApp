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
                    this.animateCrystal(views, screenMetrics);
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

        AnimationManager.prototype.animateCrystal = function (views, screenMetrics) {
            animateCrystal(views, screenMetrics);
        };

        AnimationManager.prototype.animateMental = function (views, screenMetrics) {
            for (let i = 0; i < views.length; i++) {
                animateMental(views[i], screenMetrics);
            }
        };

        function animateCrystal(views, screenMetrics) {
            views[0].animate({
                translate: {
                    x: screenMetrics.widthDIPs / 2 - views[0].width / 2 - views[0].position.x,
                    y: -views[0].position.y}
            })
            .then(function (view) {
                views[0].animate({
                    opacity: 0,
                    duration: 2000
                });
            });

            views[1].animate({
                translate: {
                    x: - views[1].position.x,
                    y: -views[1].position.y}
            })
            .then(function (view) {
                views[1].animate({
                    opacity: 0,
                    duration: 2000
                });
            });

            views[2].animate({
                translate: {
                    x: screenMetrics.widthDIPs - views[2].width - views[2].position.x,
                    y: - views[2].position.y}
            })
            .then(function (view) {
                views[2].animate({
                    opacity: 0,
                    duration: 2000
                });
            });

            views[3].animate({
                translate: {
                    x: -views[3].position.x,
                    y: screenMetrics.heightDIPs - 3 * views[3].height - views[3].position.y}
            })
            .then(function (view) {
                views[3].animate({
                    opacity: 0,
                    duration: 2000
                });
            });

            views[4].animate({
                translate: {
                    x: screenMetrics.widthDIPs - views[4].width - views[4].position.x,
                    y: screenMetrics.heightDIPs - views[4].height * 3 - views[4].position.y}
            })
            .then(function () {
                views[4].animate({
                    opacity: 0,
                    duration: 2000
                });
            });
        }

        function animateMental(view, screenMetrics) {
            view.animate({
                translate: {
                    x: screenMetrics.widthDIPs / 2 - view.width / 2 - view.position.x,
                    y: screenMetrics.heightDIPs / 2 - view.height - view.position.y}
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
