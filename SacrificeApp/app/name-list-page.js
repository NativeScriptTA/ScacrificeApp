"use strict";
var namesViewModel = require('./name-list-view-model');
var viewModel = namesViewModel.newViewModel;

function pageLoaded(args) {
    let page = args.object;
    let mainViewModel = namesViewModel.mainViewModel;

    page.bindingContext = viewModel;
    getUsers(viewModel);
}

function getUsers(newViewModel){
  let users = global.everlive.data('Contestant');
  users.get()
    .then(function(data){
    let userNames = [];

    let items = data.result;
    for (var i = 0; i < items.length; i++) {
      //console.log(items[i]['UserName']);
      userNames.push(items[i]['UserName'])
    }
    console.log(userNames);
    newViewModel.names = userNames;
  }, function(err) {
    console.log(err.message);
  })

}

exports.pageLoaded = pageLoaded;
exports.tapCommand = viewModel.tapCommand
