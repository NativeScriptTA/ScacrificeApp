(function () {
    "use strict";

    var DefaultAnimations = (function (_super) {
        __extends(DefaultAnimations, _super);

        let bottomMargin = 150;
        let edgeMargin = 15;

        function DefaultAnimations() { }

        DefaultAnimations.prototype.topMiddle = function (view, screenMetrics) {
            return {
                x: screenMetrics.widthDIPs / 2 - view.width / 2 - view.position.x,
                y: -view.position.y + edgeMargin
            };
        };

        DefaultAnimations.prototype.topLeft = function (view, screenMetrics) {
            return {
                x: - view.position.x + edgeMargin,
                y: - view.position.y + edgeMargin
            };
        };

        DefaultAnimations.prototype.topRight = function (view, screenMetrics) {
            return {
                x: screenMetrics.widthDIPs - view.width - view.position.x - edgeMargin,
                y: - view.position.y + edgeMargin
            };
        };

        DefaultAnimations.prototype.botLeft = function (view, screenMetrics) {
            return {
                x: -view.position.x + edgeMargin,
                y: screenMetrics.heightDIPs - 3 * view.height - view.position.y - bottomMargin - edgeMargin
            };
        };

        DefaultAnimations.prototype.botRight = function (view, screenMetrics) {
            return {
                x: screenMetrics.widthDIPs - view.width - view.position.x - edgeMargin,
                y: screenMetrics.heightDIPs - view.height * 3 - view.position.y - bottomMargin - edgeMargin
            };
        };

        DefaultAnimations.prototype.rotation = function (iterationsCount) {
            return {
                rotate: 360,
                duration: 1500,
                iterations: 1,
                curve: view.ios ? UIViewAnimationCurve.UIViewAnimationCurveLinear : new android.view.animation.LinearInterpolator()
            };
        };

        return DefaultAnimations;
    }({}));

    exports.DefaultAnimations = new DefaultAnimations();
}());
