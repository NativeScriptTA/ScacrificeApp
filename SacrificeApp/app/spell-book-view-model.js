"use strict";
var observable = require("data/observable").Observable;
var spells = new observable({
  spells: [],
  dataToBePassed: {}
});



exports.viewModel = spells;
