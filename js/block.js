PIECE_LIST = [	"LINE",
			 	"L", 
			 	"REV_L", 
			 	"SQUARE", 
			 	"S", 
			 	"REV_S", 
			 	"T"
];
PIECES = {
	"LINE" 		: [[[0,0], [1,0], [2,0], [3,0]], 
					[[0,0], [0,1], [0,2], [0,3]], 
					[[0,0], [1,0], [2,0], [3,0]], 
					[[0,0], [0,1], [0,2], [0,3]]
				],
	"L"			: [[[0,0], [0,1], [0,2], [1,2]], 
					[[0,0], [1,0], [2,0], [0,1]], 
					[[0,0], [1,0], [1,1], [1,2]], 
					[[0,1], [1,1], [2,1], [2,0]]
				],
	"REV_L" 	: [[[1,0], [1,1], [1,2], [0,2]], 
					[[0,0], [0,1], [1,1], [2,1]], 
					[[0,0], [0,1], [0,2], [1,0]], 
					[[0,0], [1,0], [2,0], [2,1]]
				],
	"SQUARE"	: [[[0,0], [0,1], [1,0], [1,1]], 
					[[0,0], [0,1], [1,0], [1,1]], 
					[[0,0], [0,1], [1,0], [1,1]], 
					[[0,0], [0,1], [1,0], [1,1]]
				],
	"S"			: [[[1,0], [2,0], [0,1], [1,1]], 
					[[0,0], [0,1], [1,1], [1,2]], 
					[[1,0], [2,0], [0,1], [1,1]], 
					[[0,0], [0,1], [1,1], [1,2]]
				],
	"REV_S"		: [[[0,0], [1,0], [1,1], [2,1]], 
					[[1,0], [1,1], [0,1], [0,2]], 
					[[0,0], [1,0], [1,1], [2,1]], 
					[[1,0], [1,1], [0,1], [0,2]]
				],
	"T"			: [[[0,0], [1,0], [2,0], [1,1]], 
					[[0,1], [1,0], [1,1], [1,2]], 
					[[1,0], [0,1], [1,1], [2,1]], 
					[[0,0], [0,1], [0,2], [1,1]]
				]
}
PIECE_COLOURS = {
	"LINE" 		: MED_SKY_BLUE,
	"L"			: MED_ORANGE,
	"REV_L" 	: MED_CHOCOLATE,
	"SQUARE"	: MED_RED,
	"S"			: MED_CHAMELEON,
	"REV_S"		: MED_BUTTER,
	"T"			: MED_PLUM
}

var Tetromino = function(x, y, type) {
	this.x_ = x;
	this.y_ = y;
	this.orientation_ = 0;
	this.allCoords_ = $.extend(true, [], PIECES[type]);
	this.coords_ = this.allCoords_[this.orientation_];
	this.colour_ = PIECE_COLOURS[type];

	this.falling = true;

	this.BLOCK_WIDTH = 20; //px
	this.BORDER 	 = 1; //px
};

Tetromino.prototype.draw = function(ctx) {
	ctx.fillStyle = this.colour_;
	for (var i = 0; i < this.coords_.length; i++) {
		ctx.fillRect(
			this.x_ + this.coords_[i][0] * this.BLOCK_WIDTH + this.BORDER, 
			this.y_ + this.coords_[i][1] * this.BLOCK_WIDTH + this.BORDER,
			this.BLOCK_WIDTH - 2 * this.BORDER,
			this.BLOCK_WIDTH - 2 * this.BORDER
		);
	}
};


Tetromino.prototype.updatePosition = function(x ,y) {
	this.x_ += this.BLOCK_WIDTH * x;
	this.y_ += this.BLOCK_WIDTH * y;
};

Tetromino.prototype.update = function(context, buttons) {
	//this.gravity();
	this.draw(context);
};

Tetromino.prototype.bottom = function() {
	var bottom = 0;
	for (var i = 0; i < this.coords_.length; i++) {
		if (this.coords_[i][1] > bottom) {
			bottom = this.coords_[i][1];
		}
	}
	return bottom * this.BLOCK_WIDTH + this.y_ + 1;
};

Tetromino.prototype.right = function() {
	var right = 0;
	for (var i = 0; i < this.coords_.length; i++) {
		if (this.coords_[i][0] > right) {
			right = this.coords_[i][0];
		}
	}
	return right * this.BLOCK_WIDTH + this.x_ + 1;
};

Tetromino.prototype.left = function() {
	return this.x_;
};

Tetromino.prototype.rotate = function(amt) {
	this.orientation_ = (this.orientation_ + amt) % this.allCoords_.length;
	this.coords_ = this.allCoords_[this.orientation_];
};

Tetromino.prototype.bake = function(xTopLeft, yTopLeft) {
	var baked = [];
	for (var i = 0; i < this.coords_.length; i++) {
		baked.push({ 
			x : (this.x_ - xTopLeft) / this.BLOCK_WIDTH + this.coords_[i][0],
			y : (this.y_ - yTopLeft) / this.BLOCK_WIDTH + this.coords_[i][1],
			c : this.colour_
		});
	}
	return baked;
};