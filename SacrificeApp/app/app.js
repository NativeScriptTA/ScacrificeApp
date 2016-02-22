'use strict';
var application = require("application");
var Everlive = require('./everlive.all');
var el = new Everlive('jztlcb7ddhnjpifl');
var dbmanager = require("./dbmanager");

global.everlive = el;
global.dbmanager = new dbmanager.DBManager();
global.deviceID = "thisistestid1";
global.currentUser = {};

startApplication();


function startApplication(){
    application.mainModule = "menu-page";
    application.cssFile = "./app.css";
    application.start();

}
