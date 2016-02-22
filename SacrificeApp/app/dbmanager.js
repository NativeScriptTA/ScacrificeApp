(function () {
	'use strict';

	var sqlite = require('nativescript-sqlite');

	var DBManager = (function () {

		var dbname = "sacrifice_db_v2.db";
		var db = null;

		function DBManager() {

			if (!sqlite.exists(dbname)) {
		        sqlite.copyDatabase(dbname);
		  	}

		  new sqlite(dbname, function(err, dbConnection) {
			if (err) {
		    console.log(err);
			}
		  db = dbConnection;
	    db.resultType(sqlite.RESULTSASOBJECT);
	    db.valueType(sqlite.VALUESARENATIVE);
	    //db.execSQL('insert into RegistrationStatus (Status) values (0)');
		  });
		}

		DBManager.prototype.insertMagicInfo = function(magicName, magicData, degree, source) {
			 db.execSQL('insert into Rituals (MagicName, MagicData, Degree, Source) values ("' +
			  magicName +
			  '", "' +
			  encodeData(JSON.stringify(magicData)) +
			  '",' +
			  degree +
			  ', "' +
			  source +
			  '")');
		};

		DBManager.prototype.insertItem = function(name, type) {
			 db.execSQL('insert into Items (Name, Type) values ("' +
			  name +
			  '", "' +
			  type +
				'")');
		};

		DBManager.prototype.getAllItems = function(callback) {
			db.all('select Name, Type from Items', function (err, loadedData) {
				var result = [];
		        if (err) {
		            console.log(err);
		        }
						else {
		        	for(let i = 0; i < loadedData.length; i++) {
		        		let data = {};
		        		data.name = loadedData[i].Name;
		        		data.type = loadedData[i].Type;

		        		result.push(data);

		        	}
		        }
						console.log("Before callback");
		        callback(result);
	    	});
		};

		DBManager.prototype.getItemByName = function(name, callback) {
			db.all('select Name, Type from Items where Name = "' + name + '"', function (err, loadedData) {
				var result = [];
		        if (err) {
		            console.log(err);
		        } else {
		        	for(let i = 0; i < loadedData.length; i++) {
		        		let data = {};
								data.name = JloadedData[i].Name;
		        		data.type = loadedData[i].Type;
		        		result.push(data);
		        	}
		        }
		        callback(result);
	    	});
		};

		DBManager.prototype.getMagicInfoByName = function(name, callback) {
			db.all('select MagicData, Degree, Source from Rituals where MagicName = "' + name + '"', function (err, loadedData) {
				var result = [];
		        if (err) {
		            console.log(err);
		        } else {
		        	for(let i = 0; i < loadedData.length; i++) {
		        		let data = {};
		        		data.magicData = JSON.parse(decodeData(loadedData[i].MagicData));
		        		data.degree = loadedData[i].Degree;
		        		data.source = loadedData[i].Source;
		        		result.push(data);
		        	}
		        }
		        callback(result);
	    	});
		};

		// DBManager.prototype.setRegistrationStatus = function(status) {
		// 	db.execSQL('update RegistrationStatus set Status = ' +  status + ' where Id = 1');
		// };
		//
		// DBManager.prototype.getRegistrationStatus = function(callback) {
		// 	db.get('select Status from RegistrationStatus where Id = 1', function(err, loadedData) {
		// 		let result = "unregistered";
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			if(loadedData.Status > 0) {
		// 				result = "registered";
		// 			}
		// 		}
		//
		// 		callback(result);
		// 	});
		// };

		function encodeData(data) {
			return data.replace(/'/g, "&#39;").replace(/"/g,"&quot;");
		}

		function decodeData(data) {
			return data.replace(/&#39;/g, '\'').replace(/&quot;/g,"\"");
		}

		return DBManager;

	})();

	exports.DBManager = DBManager;
}());
