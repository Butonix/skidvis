
class Image {

	_src = '';
	_alt = '';
	_title = '';


	constructor() {

	}

	get src() {
		return this._src;
	}

	set src(value) {
		this._src = value;
	}

	get alt() {
		return this._alt;
	}

	set alt(value) {
		this._alt = value;
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}
}
Image.prototype.toJSON = function () {
	return JSON.stringify(this);
}
Image.prototype.fromJSON = function (obj) {
	if (typeof obj == "string") obj = JSON.parse(obj);
	return new Image(obj);
}
export default Image;
