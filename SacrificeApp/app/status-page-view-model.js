"use strict";
var observable = require("data/observable").Observable;
var status = new observable({
  name: global.currentUser.UserName,
  health: global.currentUser.Health
});



exports.viewModel = status;
