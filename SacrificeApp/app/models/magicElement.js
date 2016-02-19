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
}

exports.MagicElement = MagicElement;