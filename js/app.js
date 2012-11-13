var paused 		= false;
var gameOver 	= false;
var TetrisContext = function(elem) {
	this.ctx_ 		= elem.getContext("2d");
	this.width_		= elem.width;
	this.height_ 	= elem.height;

	this.score_ 	= 0;
	this.next_		= undefined;

	this.blocks_	= [['','','','','','','','','','','','','','','','','','','','']];
	this.active_	= undefined;

	this.WALL_WIDTH 	= 20; //px
	this.WELL_TOP_X	 	= 50; //px
	this.WELL_TOP_Y		= 30; //px

	this.WELL_HEIGHT	= 400; //px
	this.WELL_WIDTH		= 200; //px
};

TetrisContext.prototype.setupContext = function() {
	
	for (var i = 0; i < 30; i++) {
		this.blocks_.push($.extend(true,[],this.blocks_[0]));
	}

};

TetrisContext.prototype.createWell = function() {
	// Blank the Backdrop
	this.ctx_.fillStyle = LIGHT_GREY;
	this.ctx_.fillRect(0, 0, this.width_, this.height_);

	// Create a Tetris Well
	this.ctx_.fillStyle = DARK_ALUMINUM;
	this.ctx_.fillRect(this.WELL_TOP_X - this.WALL_WIDTH, this.WELL_TOP_Y, this.WALL_WIDTH, this.WELL_HEIGHT);
	this.ctx_.fillRect(this.WELL_TOP_X - this.WALL_WIDTH, this.WELL_HEIGHT + this.WELL_TOP_Y, this.WELL_WIDTH + 2 * this.WALL_WIDTH, this.WALL_WIDTH);
	this.ctx_.fillRect(this.WELL_TOP_X + this.WELL_WIDTH, this.WELL_TOP_Y, this.WALL_WIDTH, this.WELL_HEIGHT);

	this.ctx_.font         = '14px UbuntuRegular';
	this.ctx_.fillText('Score', 300, 70);
	this.ctx_.font         = '48px UbuntuRegular';
	this.ctx_.fillText(this.score_, 300, 115);

	this.ctx_.font         = '14px UbuntuRegular';
	this.ctx_.fillText('Next', 300, 150);
	var n = new Tetromino(300, 160, this.next_);
	n.draw(this.ctx_);

	this.ctx_.fillStyle = MED_ALUMINUM;
	this.ctx_.font         = '20px UbuntuRegular';
	this.ctx_.fillText('the game of', 400, 210);
	this.ctx_.fillStyle = DARK_ALUMINUM;
	this.ctx_.font         = '72px UbuntuRegular';
	this.ctx_.fillText("blox*", 410, 275);

};

TetrisContext.prototype.addBlock = function(type) {
	if (type == undefined) {
		if (this.next_ == undefined) {
			type = PIECE_LIST[Math.floor(Math.random() * PIECE_LIST.length)];
		} else {
			type = this.next_;
		}
		this.next_ = PIECE_LIST[Math.floor(Math.random() * PIECE_LIST.length)];
	}
	this.active_ = new Tetromino(110, 30, type);
	if (this.checkCollisions()) {
		this.gameOver();
	}
};

TetrisContext.prototype.gameOver = function() {
	gameOver = true;
	console.log("GAME OVER");
	clearInterval(gameClock);
	this.drawOverlay("game over [r] to restart");
}


TetrisContext.prototype.checkCollisions = function() {
	var wellBottom 	= this.WELL_HEIGHT + this.WELL_TOP_Y;
	var wellLeft 	= this.WELL_TOP_X;
	var wellRight 	= wellLeft + this.WELL_WIDTH;
	if (this.active_.bottom() > wellBottom) {
 		return true;
 	}
 	if (this.active_.left() < wellLeft) {
 		return true;
 	}
 	if (this.active_.right() > wellRight) {
 		return true;
 	}

	var baked = this.active_.bake(this.WELL_TOP_X, this.WELL_TOP_Y);
	for (item in baked) {
		if (this.blocks_[baked[item].y][baked[item].x] != "") {
			return true;
		}
	}
	

	return false;
}

TetrisContext.prototype.updateScene = function() {
	this.active_.updatePosition(0, 1);
 	if (this.checkCollisions()) {
 		this.active_.updatePosition(0, -1);
 		var baked = this.active_.bake(this.WELL_TOP_X, this.WELL_TOP_Y);
		for (item in baked) {
			this.blocks_[baked[item].y][baked[item].x] = baked[item].c;
		}
		this.checkTetris();
 		this.addBlock();
 	}
}

 TetrisContext.prototype.drawScene = function() {
 	this.createWell();
	this.active_.draw(this.ctx_, undefined);
	for (var i = 0; i < this.blocks_.length; i++) {
		for (var j = 0; j < this.blocks_[i].length; j++) {
			if (this.blocks_[i][j] != '') {
				this.ctx_.fillStyle = this.blocks_[i][j];
				this.ctx_.fillRect(
					this.WELL_TOP_X + j * 20 + 1,
					this.WELL_TOP_Y + i * 20 + 1,
					18,
					18
				);
			}
		}
	}
 };

 TetrisContext.prototype.checkTetris = function() {
 	for (var i = 0; i < this.blocks_.length; i++) {
 		var popCount = 0;
 		for (var j = 0; j < this.blocks_[i].length; j++) {
 			if (this.blocks_[i][j] != "") {
 				popCount++;
 			}
 		}
 		if (popCount == 10) {
 			this.score_ += 100;
 			for (var n = i; n > 0; n--) {
 				this.blocks_[n] = this.blocks_[n-1];
 			}
 			this.blocks_[0] = ['','','','','','','','','',''];
 		}
 	}
 };


 TetrisContext.prototype.tick = function() {
 	this.updateScene();
 	if (!gameOver) {
 		this.drawScene();
 	}
 };

 TetrisContext.prototype.updateActivePosition = function(x,y) {
 	this.active_.updatePosition(x,y);
 	if (this.checkCollisions()) {
 		this.active_.updatePosition(-x,-y);
 	}
 	this.drawScene();
 };

 TetrisContext.prototype.rotateActive = function() {
 	this.active_.rotate(1);
 	var i;
 	for (i = 0; i < 4; i++) {
 		if (this.checkCollisions() == false) {
 			i = 0;
 			break;
 		}
 		this.active_.updatePosition(-1,0);
 	}
 	console.log(i);
 	this.active_.updatePosition(i,0);
 	if (this.checkCollisions()) {
 		this.active_.rotate(-1);
 	}
 };

 TetrisContext.prototype.dropActive = function() {
 	while (!this.checkCollisions()) {
 		this.active_.updatePosition(0,1);
 	}
 	this.active_.updatePosition(0,-1);
 };

 TetrisContext.prototype.drawOverlay = function(text) {
 	this.ctx_.fillStyle = "rgba(200,200,200,0.6)";
 	this.ctx_.fillRect(this.WELL_TOP_X, this.WELL_TOP_Y, this.WELL_WIDTH, this.WELL_HEIGHT);
 	this.ctx_.fillStyle = DARK_ALUMINUM;
	this.ctx_.font         = '10px UbuntuRegular';
	this.ctx_.fillText(text, 110, 220);
	console.log("OVERLAY: " + text);
 };

 var keyPress = function(e) {
 	if (e.keyCode == 80) {
 		paused = paused ? false : true;
 		if (paused) {
 			clearInterval(gameClock);
 			myCtx.drawOverlay("[press p to resume]");
 		} else {
 			gameClock = setInterval("myCtx.tick()", 250);
 		}
 	}
 	if (e.keyCode == 82) {
 		paused = false;
 		gameOver = false;
 		myCtx = new TetrisContext(c);
		myCtx.setupContext();
		myCtx.addBlock();
		clearInterval(gameClock);
		gameClock = setInterval("myCtx.tick()", 250);
 	}

 	if (paused || gameOver) {
 		return;
 	}
 	if (e.keyCode == 39) {
 		myCtx.updateActivePosition(1,0);
 	}
 	if (e.keyCode == 37) {
 		myCtx.updateActivePosition(-1,0);
 	}
 	if (e.keyCode == 38) {
 		myCtx.rotateActive();
 		myCtx.drawScene();
 	}
 	if (e.keyCode == 32) {
 		myCtx.dropActive();
 		myCtx.drawScene();
 	}
 }