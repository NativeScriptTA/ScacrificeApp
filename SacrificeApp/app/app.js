'use strict';
var application = require("application");
var Everlive = require('./everlive.all');
var el = new Everlive('jztlcb7ddhnjpifl');
var dbmanager = require("./dbmanager");

global.everlive = el;
global.dbmanager = new dbmanager.DBManager();
global.deviceID = "thisistestid";

startApplication();


function startApplication(){

  console.log("AppStart");

    application.mainModule = "menu-page";
    application.cssFile = "./app.css";
    application.start();

}
