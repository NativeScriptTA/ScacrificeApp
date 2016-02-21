var application = require("application");
var Everlive = require('./everlive.all');
var el = new Everlive('jztlcb7ddhnjpifl');
var dbmanager = require("./dbmanager");

application.mainModule = "menu-page";
application.cssFile = "./app.css";
application.start();

global.everlive = el;
global.dbmanager = new dbmanager.DBManager();
