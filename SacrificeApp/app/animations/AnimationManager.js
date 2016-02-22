(function () {
    "use strict";

    let animationModule = require('ui/animation');
    var DefaultAnimations = require('./DefaultAnimations').DefaultAnimations;

    var AnimationManager = (function (_super) {
        __extends(AnimationManager, _super);

        function AnimationManager() { }

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
                    this.animateAnimalSacrifice(views, screenMetrics);
                    break;
                case animations.HumanSacrifice:
                    this.animateHumanSacrifice(views, screenMetrics);
                    break;
                case animations.Mental:
                    this.animateMental(views, screenMetrics);
                break;
            }
        };

        AnimationManager.prototype.animateAnimalSacrifice = function (views, screenMetrics) {
            scale(views)
                .then(function () {
                    animateCrystal(views, screenMetrics)
                        .then(function () {
                            for (var i = 0; i < views.length; i++) {
                                rotate(views[i]);
                                releaseSoft(views[i], 4000);
                            }
                        });
                });
        };

        AnimationManager.prototype.animateHumanSacrifice = function (views, screenMetrics) {
            animateCrystal(views, screenMetrics)
                .then(function () {
                    for (var i = 0; i < views.length; i++) {
                        animateMental(views[i], screenMetrics)
                            .then(function () {
                                scale(views);
                                rotate(views);
                                releaseSoft(views);
                            });
                    }
                });
        };

        AnimationManager.prototype.animateCrystal = function (views, screenMetrics) {
            animateCrystal(views, screenMetrics)
                .then(function () {
                    for (var i = 0; i < views.length; i++) {
                        releaseSoft(views[i]);
                    }
                });
        };

        AnimationManager.prototype.animateMental = function (views, screenMetrics) {
            let animationsCompleted = 0;
            for (let i = 0; i < views.length; i++) {
                animateMental(views[i], screenMetrics)
                    .then(function () {
                        releaseSoft(views[i]);
                    });
            }
        };

        function animateCrystal(views, screenMetrics) {
            return new Promise(function (resolve, reject) {
                let translateTopMiddle = {
                    target: views[0],
                    translate: DefaultAnimations.topMiddle(views[0], screenMetrics),
                    duration: 1000
                };

                let translateTopLeft = {
                    target: views[1],
                    translate: DefaultAnimations.topLeft(views[1], screenMetrics),
                    duration: 1000
                };

                let translateTopRight = {
                    target: views[2],
                    translate: DefaultAnimations.topRight(views[2], screenMetrics),
                    duration: 1000
                };

                let translateBotLeft = {
                    target: views[3],
                    translate: DefaultAnimations.botLeft(views[3], screenMetrics),
                    duration: 1000
                };

                let translateBotRight = {
                    target: views[4],
                    translate: DefaultAnimations.botRight(views[4], screenMetrics),
                    duration: 1000
                };

                let definitions = [
                    translateTopMiddle,
                    translateTopLeft,
                    translateTopRight,
                    translateBotLeft,
                    translateBotRight
                ];

                let animationSet = new animationModule.Animation(definitions);
                animationSet.play().then(function () {
                    resolve();
                    return;
                })
                    .catch(function (e) {
                    console.log(e.message);
                });
            });
        }

        function animateMental(view, screenMetrics) {
            return new Promise(function (resolve, reject) {
                view.animate({
                    translate: {
                        x: screenMetrics.widthDIPs / 2 - view.width / 2 - view.position.x,
                        y: screenMetrics.heightDIPs / 2 - view.height - view.position.y},
                    duration: 1000})
                    .then(function () { return view.animate({ scale: { x: 3, y: 3 }, duration: 4000 }); })
                    .then(function () { return view.animate({ scale: { x: 1, y: 1 }, duration: 200 }); })
                    .then(function () { return view.animate({ rotate: 15, duration: 100 }); })
                    .then(function () { return view.animate({ rotate: -15, duration: 100 }); })
                    .then(function () { return view.animate({ rotate: 15, duration: 200 }); })
                    .then(function () { return view.animate({ rotate: -15, duration: 200 }); })
                    .then(function () { return view.animate({ rotate: 0, duration: 300 }); })
                    .then(function () { return view.animate({ translate: { x: 0, y: 0 }, duration: 1000 }); })
                    .then(function () {
                        console.log("Mental animation completed!");
                        resolve();
                        return;
                    })
                    .catch(function (e) {
                    console.log(e.message);
                });
            });
        }

        function scale(viewContext, times, duration) {
            return new Promise(function (resolve, reject) {
                if (viewContext.length) {
                    let definitions = [];
                    for (let i = 0; i < viewContext.length; i++) {
                        definitions.push({
                            scale: {
                                x: times || 2,
                                y: times || 2
                            },
                            duration: duration || 500,
                            target: viewContext[i]
                        });
                    }

                    let animationSet = new animationModule.Animation(definitions);
                    animationSet.play().then(function () {
                        resolve();
                        return;
                    })
                        .catch(function (e) {
                        console.log(e.message);
                    });
                } else {
                    viewContext.animate({
                        scale: {
                            x: times || 2,
                            y: times || 2
                        },
                        duration: duration || 500,
                        target: views[i]
                    })
                    .then(resolve());
                }
            });
        }

        function rotate(viewContext) {
            return new Promise(function (resolve, reject) {
                if (viewContext.length) {
                    let definitions = [];
                    for (let i = 0; i < viewContext.length; i++) {
                        definitions.push({
                            target: viewContext[i],
                            rotate: 360,
                            duration: 2000,
                            iterations: 2
                        });
                    }

                    let animationSet = new animationModule.Animation(definitions);
                    animationSet.play().then(function () {
                        resolve();
                        return;
                    })
                        .catch(function (e) {
                        console.log(e.message);
                    });
                }

                viewContext.animate({
                    rotate: 360,
                    duration: 2000,
                    iterations: 2
                });

                resolve();
            });
        }

        function releaseSoft(viewContext, duration) {
            if (viewContext.length) {
                for (let i = 0; i < viewContext.length; i++) {
                    viewContext[i].animate({
                        opacity: 0,
                        duration: 2000
                    });
                }
            } else {
                viewContext.animate({
                    opacity: 0,
                    duration: duration || 2000
                });
            }

            console.log("Item Released...");
        }

        return AnimationManager;
    }(animationModule.Animation));

    exports.AnimationManager = new AnimationManager();
}());
