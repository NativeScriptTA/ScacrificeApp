'use strict';
var sqlite = require('nativescript-sqlite');

var DBManager = (function () {

	var dbname = "sacrifice_db.sqlite";
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
	    });
	}

	DBManager.prototype.insertMagicInfo = function(magicName, magicData) {
		 db.execSQL('insert into magicsHistory (MagicName, MagicData) values ("' + magicName + '", "' + encodeData(JSON.stringify(magicData)) + '" )');
	}

	DBManager.prototype.getMagicInfoByName = function(name, callback) {
		db.all('select MagicData from magicsHistory where MagicName = "' + name + '"', function (err, loadedData) {
			var result = [];
	        if (err) {
	            console.log(err);
	        } else {
	        	for(let i = 0; i < loadedData.length; i++) {
	        		result.push(JSON.parse(decodeData(loadedData[i].MagicData)));
	        	}
	        }
	        callback(result);
    	});
	}

	function encodeData(data) {
		return data.replace(/'/g, "&#39;").replace(/"/g,"&quot;");
	}

	function decodeData(data) {
		return data.replace(/&#39;/g, '\'').replace(/&quot;/g,"\"");
	}

	return DBManager;

})();

exports.DBManager = DBManager;