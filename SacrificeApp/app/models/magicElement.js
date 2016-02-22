'use strict';
var magicElementType = require("./magicElementType");


class MagicElement {

	constructor(name, image, type) {
		this._name = name;
		this._image = image;
		this._type = type;
	}

	get name() {
		return this._name;
	}

	get image() {
		return this._image;
	}

	get type() {
		return this._type;
	}

	static parseElementType(name) {
		switch(name) {
			case "earth": return magicElementType.MagicElementType.EARTH;
			case "fire": return magicElementType.MagicElementType.FIRE;
			case "air": return magicElementType.MagicElementType.WIND;
			case "water": return magicElementType.MagicElementType.WATER;
			case "soul": return magicElementType.MagicElementType.SOUL;
			default: return -1;
		}
	}
}

exports.MagicElement = MagicElement;
