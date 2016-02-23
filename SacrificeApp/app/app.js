(function () {
    'use strict';
    var application = require("application"),
        Everlive = require('./everlive.all'),
        el = new Everlive('jztlcb7ddhnjpifl'),
        dbmanager = require("./dbmanager"),
        platformModule = require("platform");

    global.everlive = el;
    global.dbmanager = new dbmanager.DBManager();
    global.deviceID = platformModule.device.uuid;
    global.currentUser = {};
    global.target = {};

    startApplication();

    function startApplication(){
        console.log('start -> ' + global.deviceID);
        application.mainModule = "menu-page";
        application.cssFile = "./app.css";
        application.start();
    }
}());
