function KeyboardContext(elem) {
	this.elem_ 			= elem;
	this.holdBindings_	= {};
	this.pressBindings_ = {};
	this.keytimers_		= {};
	this.active_ 		= true;
	this.elem_.onkeydown = function(e) {
		if (this.active_ === false) {
			return;
		}
		if (this.holdBindings_[e.keyCode] === undefined) {
			return;
		}
		this.keytimers_[e.keyCode] = setInterval(this.holdBindings_[e.keyCode].cb, this.holdBindings_[e.keyCode].duration);
	};
	this.elem_.onkeyup = function(e) {
		if (this.keytimers_[e.keyCode] !== undefined) {
			clearInterval(this.keytimers_[e.keyCode]);
		}
	};
	//this.elem_.onkeypress 	= this.keypress;
}

KeyboardContext.prototype.bindKey = function(keycode, callback, params) {
	if (params.holdAction == "default") {
		this.pressBindings_[keycode] = {
			cb : callback
		};
	} else if (params.holdAction == "repeat") {
		this.holdBindings_[keycode] = {
			cb 			: callback,
			duration 	: params.duration
		}
	} else if (params.holdAction == "no-repeat") {
		this.holdBindings_[keycode] = {
			cb 			: callback
		}
	}
}
/*
KeyboardContext.prototype.keydown = function(e) {
	if (this.active_ === false) {
		return;
	}
	if (this.holdBindings_[e.keyCode] === undefined) {
		return;
	}
	this.keytimers_[e.keyCode] = setInterval(this.holdBindings_[e.keyCode].cb, this.holdBindings_[e.keyCode].duration);
}

KeyboardContext.prototype.keyup = function(e) {
	if (this.keytimers_[e.keyCode] !== undefined) {
		clearInterval(this.keytimers_[e.keyCode]);
	}
}

KeyboardContext.prototype.keypress = function(e) {
	
}

*/