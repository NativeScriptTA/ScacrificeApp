'use strict';
var application = require("application");
var Everlive = require('./everlive.all');
var el = new Everlive('jztlcb7ddhnjpifl');
var dbmanager = require("./dbmanager");
var platformModule = require("platform");

global.everlive = el;
global.dbmanager = new dbmanager.DBManager();
global.deviceID = platformModule.device.uuid;
global.currentUser = {};

startApplication();


function startApplication(){
    console.log('start -> ' + global.deviceID);
    application.mainModule = "menu-page";
    application.cssFile = "./app.css";
    application.start();

}
