var application = require("application");
var Everlive = require('./everlive.all');
var el = new Everlive('jztlcb7ddhnjpifl');
application.mainModule = "menu-page";
application.cssFile = "./app.css";
application.start();

exports.everlive = el;
