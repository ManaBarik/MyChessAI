var piece = {
	pawn: 0,
	bishop: 1,
	knight: 2,
	rook: 3,
	queen: 4,
	king: 5
}

var pieceNames = [
	"pawn",
	"bishop",
	"knight",
	"rook",
	"queen",
	"king"
];

class Piece {
	constructor(pos, type, team) {
		this.pos = pos;
		this.type = type;
		this.team = team;
		this.index = 0;
		
		this.sprite = new Image();
		this.sprite.src = `sprites/${pieceSpriteStyle}/${this.team == player ? "white" : "black"}_${pieceNames[this.type]}.png`;
		
		this.sprite.classList.add("piece");
		this.sprite.width = gridSize;
		this.sprite.height = gridSize;
		this.sprite.style.left = grids[this.pos].x + "px";
		this.sprite.style.top = grids[this.pos].y + "px";
		
		main.appendChild(this.sprite);
		
		this.selecting = false;
		
		this.captured = false;
		
		this.hasMoved = false;
		this.isMoving = false;
		
		this.offset = {
			x: 0,
			y: 0
		}
		
		this.enPassantTo = 0;
		this.enPassantCapture = -1;
		
		this.isPinned = false;
		this.canMoveTo = [
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1
		];
	}
	rn() {
		if(!this.selecting) {
			var grid = grids[this.pos];
			ctx.drawImage(this.sprite, grid.x + this.offset.x, grid.y + this.offset.y, grid.w, grid.h);
		}
		else {
			ctx.drawImage(this.sprite, press.x - gridSize / 2, press.y - gridSize / 2, gridSize, gridSize);
		}
	}
	isSlidingPiece() {
		return this.type == piece.bishop || this.type == piece.rook || this.type == piece.queen;
	}
	isType(type) {
		return this.type == type;
	}
	isTeam(team) {
		return this.team == team;
	}
	changeType(type) {
		hashPiece(board, this.type, this.team, this.pos);
		
		this.type = type;
		this.sprite.src = `sprites/${pieceSpriteStyle}/${this.isTeam(player) ? "white" : "black"}_${pieceNames[type]}.png`;
		
		hashPiece(board, this.type, this.team, this.pos);
	}
}
