(function () {
    "use strict";

    var textToSpeechModule = require("nativescript-texttospeech");
    var view = require("ui/core/view");
    var absoluteLayout = require("ui/layouts/absolute-layout");

    function pageLoaded(args) {
        let page = args.object;
        let tutorialText = page.getViewById("tutorialText").text;
        textToSpeechModule.speak(tutorialText);

        let mainLayout = view.getViewById(page, "tutorialMainLayout");
        let stopTutorialButton = view.getViewById(page, "stopTutorial");

        absoluteLayout.AbsoluteLayout.setTop(stopTutorialButton, 500);
		absoluteLayout.AbsoluteLayout.setLeft(stopTutorialButton, 150);

		stopTutorialButton.on("tap", function() {
			textToSpeechModule.speak("");
		});
    }

    exports.pageLoaded = pageLoaded;
}());
