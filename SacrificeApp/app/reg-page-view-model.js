"use strict";
var observable = require("data/observable").Observable;
var reg = new observable({
  name: "",
  dataToBePassed: {}
});



exports.viewModel = reg;
