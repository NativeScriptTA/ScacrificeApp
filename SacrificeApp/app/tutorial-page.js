(function () {
    "use strict";

    var textToSpeechModule = require("nativescript-texttospeech");

    function pageLoaded(args) {
        var page = args.object;
        var tutorialText = page.getViewById("tutorialText").text;
        textToSpeechModule.speak(tutorialText);
    }

    exports.pageLoaded = pageLoaded;
}());
