(function () {
    "use strict";

    var textToSpeechModule = require("nativescript-texttospeech"),
        view = require("ui/core/view"),
        absoluteLayout = require("ui/layouts/absolute-layout");

    function pageLoaded(args) {
        let page = args.object,
            tutorialText = page.getViewById("tutorialText").text,
            mainLayout = view.getViewById(page, "tutorialMainLayout"),
            stopTutorialButton = view.getViewById(page, "stopTutorial");

        textToSpeechModule.speak(tutorialText);
        absoluteLayout.AbsoluteLayout.setTop(stopTutorialButton, 500);
		absoluteLayout.AbsoluteLayout.setLeft(stopTutorialButton, 150);

		stopTutorialButton.on("tap", function() {
			textToSpeechModule.speak("");
		});
    }

    exports.pageLoaded = pageLoaded;
}());
