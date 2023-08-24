var c = document.querySelector("#canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

var main = document.querySelector("main");
var miscCanvas = document.querySelector("#miscCanvas");
miscCanvas.width = window.innerWidth;
miscCanvas.height = window.innerHeight;
var miscCtx = miscCanvas.getContext("2d");
var coachMessageText = document.querySelector("#coachMessageText");
var coachMessageBox = document.querySelector("#coachMessageBox");
var root = document.querySelector(":root");

/*

PIECE SPRITE STYLE:
> cburnett (default) -- used by almost every chess website as default style
> toonchess (custom) -- we made this
> icy_sea
> classic

*/

var pieceSpriteStyle = "icy_sea";

// squareColors = [[dark, light]];
var squareColors = [["#CE5B00", "#E7A848"], ["#CD8543", "#EAC983"], ["#B0CEFF", "white"],
  ["#40C848", "#D8F3DA"]];
var squareColor = 2;

var press = {
	x: 0,
	y: 0,
	pressing: false
}

// piece we are selecting

var selectingIndex = -1;

// if we are dragging pieces

var isDraggingPiece = false;

// player and enemy variables

var player = 0;
var enemy = 1;

// grids

var grids = [];

// current board for storing board info easily

var board = {
	turn: player,
	pieces: [],
	promotionSelection: {
		player: 0,
		enemy: 0
	},
	endgame: false,
	totalMoves: 0,
	moveHistory: [],
	kingIndex: {
		player: 0,
		enemy: 0
	},
	pieceGrid: new Array(64),
	positionHistory: {},
	material: [
		0,
		0
	],
	attackingGridEval: [
		0,
		0
	],
	posKey: 0,
	repetitionMoveHistory: [],
	castlePerm: 15
}

// ai display text

var depthSearchText = 0;

// lists of available moves

var moves = [];

// arrows and highlight

var highlightMode = false;
var arrows = [];
var numberOfArrows = 1;
var highlights = [];
var highlight_fromGrid = -1;
var highlight_toGrid = -1;

// game over

var gameOver = false;
var gameOverType = -1;
var gameOverName = "";

// analysis variables

var analysisMode = false;

var useCoach = false;
var useEvalBar = false;

var bestArrows = [];

var currentMoveString = [];

// coach variables

var coachTotalMoves = [0, 0];
var coachTotalMoveInaccuracies = [0, 0];

// time management

var useTime = false;
var clocks = [
	{
		second: 0,
		minute: 0
	},
	{
		second: 0,
		minute: 0
	}
];
var timerInterval;

var playerTime = 180;
var enemyTime = 180;

// ai on time control

var enemyStartSearch = 0; // to decrease enemy clock after finish searching by Date.now() - enemyStartSearch

var enemySearchSpeed = {
	none: searchOption.time,
	lowerThanPlayer: 2500,
	nearTimeoutLowerThanPlayer: 2000,
	nearTimeoutGreaterThanPlayer: 3000,
	belowTenSecond: 800,
	belowFiveSecond: 200,
	belowThreeSecond: 100,
	opening: 2000
}

var useThinkingTimeDifference = true;

clocks[player].second = playerTime % 60 * 10;
clocks[enemy].second = enemyTime % 60 * 10;

clocks[player].minute = Math.floor(playerTime / 60);
clocks[enemy].minute = Math.floor(enemyTime / 60);

// pass and play

var passAndPlay = false;

// ai options

var PVE = true;

var depth = 128;

var useBook = true;

// settings

// enemyMoveDelay default value is 240
var enemyMoveDelay = 240; // used when using CSS animation

// player playing as black

var PLAY_AS_BLACK_PIECE = false;

// pass and play turns off if PVE is on

if(PVE) passAndPlay = false;

// PVE turns to false if analysisMode is true

if(analysisMode) PVE = false;

// hide coach message box if useCoach is false

if(!useCoach) coachMessageBox.style.display = "none";

// grid indexes to highlight moves from pieces

var moveHighlightGrids = [];

// grid options for loading grids

var gridOffsetX = 0;
var gridOffsetY = 50;
var gridSize = c.width / 8;

var ORIENTATION = player;

for(var rank = 0; rank < 8; rank++) {
	for(var file = 0; file < 8; file++) {
		var color = ((file + rank) % 2 == 0) ? squareColors[squareColor][1] : squareColors[squareColor][0];
		
		grids.push(new Grid(
			ORIENTATION == player ? gridOffsetX + gridSize * file : (gridOffsetX + gridSize * 7) - gridSize * file,
			ORIENTATION == player ? gridOffsetY + gridSize * rank : (gridOffsetY + gridSize * 7) - gridSize * rank,
			gridSize,
			gridSize,
			color
		));
	}
}

// adjust the position of evalBar

document.querySelector("#evalBar").style.top = `${gridOffsetY + gridSize * 8}px`;

if(!useEvalBar) {
	document.querySelector("#evalBar").style.display = "none";
}

// load the board using FEN

var useDefaultFEN = true;

var fen = "3r4/8/3k4/8/8/3K4/8/8";

if(useDefaultFEN) {
	fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
}

loadBoardFromFen(fen);

// set 1 to board.repetitionMoveHistory in current position

board.repetitionMoveHistory[board.posKey] = 1;

// generates available moves

moves = generateMoves(board, board.turn);

// promotion images

var promotion_buttonWidth = c.width / 4

var promotion_queenImg = new SpriteDisplay(lerp(promotion_buttonWidth / 2, c.width - promotion_buttonWidth / 2, (1 / 3) * 0), gridOffsetY - gridSize / 2, gridSize, gridSize, `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_queen.png`);
var promotion_rookImg = new SpriteDisplay(lerp(promotion_buttonWidth / 2, c.width - promotion_buttonWidth / 2, (1 / 3) * 1), gridOffsetY - gridSize / 2, gridSize, gridSize, `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_rook.png`);
var promotion_bishopImg = new SpriteDisplay(lerp(promotion_buttonWidth / 2, c.width - promotion_buttonWidth / 2, (1 / 3) * 2), gridOffsetY - gridSize / 2, gridSize, gridSize, `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_bishop.png`);
var promotion_knightImg = new SpriteDisplay(lerp(promotion_buttonWidth / 2, c.width - promotion_buttonWidth / 2, (1 / 3) * 3), gridOffsetY - gridSize / 2, gridSize, gridSize, `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_knight.png`);

// player as black pieces

if(PLAY_AS_BLACK_PIECE) {
	setTimeout(function() {
		var result = bestMoves(board, depth, board.turn, useBook);
		var bestMove = [];
		
		for(var i = 0; i < 1; i++) {
			bestMove.push(result[i]);
		}
		
		var selected = bestMove[Math.floor(Math.random()*bestMove.length)];
		
		var move = selected.move;
		
		pieces = makeMove(board, move, false);
		
		if(useTime) {
			timerInterval = setInterval(timer, 100);
		}
		
		currentMoveString = move;
		
		var stringCode = boardToStringCode(board);
		
		if(board.positionHistory[stringCode] == null) {
			board.positionHistory[stringCode] = 0;
		}
		else {
			board.positionHistory[stringCode]++;
		}
		
		if(analysisMode && ((!PLAY_AS_BLACK_PIECE && turn == enemy) || (PLAY_AS_BLACK_PIECE && turn == player))) {
			bestArrows = [];
			for(var j = 0; j < bestMove.length; j++) {
				var { fromGrid, toGrid } = getMoveStringInfo(bestMove[j].move[0]);
				
				bestArrows.push(new Arrow(
					fromGrid,
					toGrid,
					`hsl(${lerp(235, 0, j / (bestMove.length - 1))}, 100%, 50%)`
				));
			}
		}
		
		board.moveHistory.push(translateToFileRank(move));
		
		document.querySelector("textarea").value = `\n\t"${board.moveHistory.join(" ")}", // placeholder_name`;
		
		pieces = removeCapturePieces(board);
		
		turn = changeTurn(board);
		
		moves = generateMoves(board, board.turn);
		
		board = updateBoardInfo(board);
		
		var _isGameOver = isGameOver(board, moves, turn);
		if(_isGameOver.boolean) {
			gameOver = true;
			gameOverType = _isGameOver.type;
			gameOverName = _isGameOver.name;
		}
	}, 200);
}

// timer loop

function timer() {
	decreaseTime(1);
}

function decreaseTime(seconds = 1) {
	clocks[board.turn].second -= seconds;
	
	if(clocks[board.turn].second <= 0 && clocks[board.turn].minute > 0) {
		clocks[board.turn].second = 599;
		clocks[board.turn].minute--;
	}
	
	if(clocks[board.turn].second <= 0 && clocks[board.turn].minute <= 0) {
		gameOver = true;
		gameOverType = 2;
		gameOverName = `${board.turn == player ? "White" : "Black"} Timeout`;
		
		clearTimeout(timerInterval);
	}
}

// main loop

function update() {
	requestAnimationFrame(update);
	
	ctx.clearRect(0, 0, c.width, c.height);
	miscCtx.clearRect(0, 0, miscCanvas.width, miscCanvas.height);
	rn();
}

update();

function rn() {
	grids.forEach(grid => grid.rn());
	
	highlights.forEach(highlight => highlight.rn());
	
	// board.pieces.forEach(piece => piece.rn());
	
	/* we don't draw them in the canvas anymore
	moveHighlightGrids.forEach(index => {
		var grid = grids[index];
		ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
		ctx.beginPath();
		ctx.arc(grid.x + grid.w / 2, grid.y + grid.h / 2, gridSize / 5, 0, 2 * Math.PI);
		ctx.fill();
	});
	*/
	
	arrows.forEach(arrow => arrow.rn());
	bestArrows.forEach(arrow => arrow.rn());
	
	// clock
	
	if(useTime) {
		ctx.fillStyle = clocks[player].second > 300 || clocks[player].minute > 0 ? "blue" : "red";
		ctx.fillRect(0, gridOffsetY + gridSize * 8 + (useEvalBar ? 25 : 0), 120, 50);
		
		if(board.turn == player) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "white";
			ctx.fillRect(0, gridOffsetY + gridSize * 8 + (useEvalBar ? 25 : 0), 120, 50);
			ctx.globalAlpha = 1;
		}
		
		ctx.fillStyle = clocks[enemy].second > 300 || clocks[enemy].minute > 0 ? "blue" : "red";
		ctx.fillRect(c.width - 120, gridOffsetY + gridSize * 8 + (useEvalBar ? 25 : 0), 120, 50);
		
		if(board.turn == enemy) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "white";
			ctx.fillRect(c.width - 120, gridOffsetY + gridSize * 8 + (useEvalBar ? 25 : 0), 120, 50);
			ctx.globalAlpha = 1;
		}
		
		ctx.font = "30px 'Ubuntu'";
		ctx.fillStyle = "white";
		ctx.textAlign = "left";
		ctx.fillText(clocks[player].minute.toString() + ":" + (clocks[player].second.toString().length == 1 ? "0" : "") + (clocks[player].second > 300 || clocks[player].minute > 0 ? Math.floor(clocks[player].second / 10).toString() : (clocks[player].second / 10).toString()), 10, gridOffsetY + 35 + gridSize * 8 + (useEvalBar ? 25 : 0));
		
		ctx.textAlign = "right";
		ctx.fillText(clocks[enemy].minute.toString() + ":" + (clocks[enemy].second.toString().length == 1 ? "0" : "") + (clocks[enemy].second > 300 || clocks[enemy].minute > 0 ? Math.floor(clocks[enemy].second / 10).toString() : (clocks[enemy].second / 10).toString()), c.width - 10, gridOffsetY + 35 + gridSize * 8 + (useEvalBar ? 25 : 0));
	}
	
	for(var i = 0; i <= 3; i++) {
		ctx.fillStyle = board.turn == player ? board.promotionSelection.player == i ? "grey" : "dimgrey" : board.promotionSelection.enemy == i ? "grey" : "dimgrey";
		
		ctx.fillRect(lerp(0, c.width - promotion_buttonWidth, i / 3), 0, promotion_buttonWidth, gridOffsetY);
	}
	
	promotion_queenImg.rn();
	promotion_rookImg.rn();
	promotion_bishopImg.rn();
	promotion_knightImg.rn();
	
	ctx.fillStyle = !highlightMode ? "grey" : "orange";
	ctx.fillRect(0, c.height - 50, 50, 50);
	ctx.save();
	ctx.translate(25, c.height - 25);
	ctx.rotate(-Math.PI / 4);
	
	ctx.beginPath();
	ctx.fillStyle = !highlightMode ? "greenyellow" : "gold";
	ctx.moveTo(-22.5, -5);
	ctx.lineTo(8.5, -5);
	ctx.lineTo(8.5, -15);
	ctx.lineTo(22.5, 0);
	ctx.lineTo(8.5, 15);
	ctx.lineTo(8.5, 5);
	ctx.lineTo(-22.5, 5);
	ctx.lineTo(-22.5, -5);
	ctx.fill();
	
	ctx.restore();
	
	grids.forEach(grid => {
		if(grid.glyph != -1 && grid.withGlyph) {
			miscCtx.beginPath();
			miscCtx.fillStyle = ["dodgerblue", "#74E20F", "#CCE62A", "gold", "orangered", "crimson", "darkturquoise", "#CCE62A", "yellow", "white", "black", "#FF3647"][grid.glyph];
			if(grid.glyph == -2) {
				miscCtx.fillStyle = "#77452B";
			}
			miscCtx.arc(grid.x + grid.w, grid.y, grid.w / 4, 0, 2 * Math.PI);
			miscCtx.fill();
			
			if(grid.glyph != -2 && grid.glyph != 1 && grid.glyph != 2 && grid.glyph != 7) {
				var text = ["!", "", "", "?!", "?", "??", "!!", "", "", "#", "#", ""][grid.glyph];
				
				miscCtx.font = "bold 18px 'Ubuntu'";
				miscCtx.fillStyle = grid.glyph == 9 ? "black" : "white";
				miscCtx.textAlign = "center";
				miscCtx.textBaseLine = "middle";
				miscCtx.fillText(text, grid.x + grid.w, grid.y + 7);
			}
			var centerx = grid.x + grid.w;
			var centery = grid.y;
			
			if(grid.glyph == -2) {
				miscCtx.beginPath();
				miscCtx.fillStyle = "white";
				miscCtx.moveTo(centerx - 1, centery + 6);
				miscCtx.lineTo(centerx - 1, centery - 2);
				miscCtx.quadraticCurveTo(centerx - 3, centery - 5, centerx - 8, centery - 5);
				miscCtx.lineTo(centerx - 8, centery + 3)
				miscCtx.fill();
				miscCtx.beginPath();
				miscCtx.fillStyle = "white";
				miscCtx.moveTo(centerx + 1, centery + 6);
				miscCtx.lineTo(centerx + 1, centery - 2);
				miscCtx.quadraticCurveTo(centerx + 3, centery - 5, centerx + 8, centery - 5);
				miscCtx.lineTo(centerx + 8, centery + 3)
				miscCtx.fill();
			}
			if(grid.glyph == 1) {
				miscCtx.beginPath();
				miscCtx.fillStyle = "white";
				miscCtx.moveTo(centerx - 5, centery + 8);
				miscCtx.lineTo(centerx, centery - 9);
				miscCtx.lineTo(centerx + 5, centery + 8);
				miscCtx.lineTo(centerx - 8, centery - 3);
				miscCtx.lineTo(centerx + 8, centery - 3);
				miscCtx.lineTo(centerx - 5, centery + 8);
				miscCtx.fill();
			}
			if(grid.glyph == 2) {
				miscCtx.beginPath();
				miscCtx.strokeStyle = "white";
				miscCtx.lineWidth = 3;
				miscCtx.lineCap = "round";
				miscCtx.lineJoin = "round";
				miscCtx.moveTo(centerx - 5, centery + 1);
				miscCtx.lineTo(centerx - 2, centery + 4);
				miscCtx.lineTo(centerx + 5, centery - 3);
				miscCtx.stroke();
			}
			if(grid.glyph == 7) {
				miscCtx.beginPath();
				miscCtx.fillStyle = "white";
				miscCtx.lineCap = "round";
				miscCtx.lineJoin = "round";
				miscCtx.moveTo(centerx - 8, centery - 3);
				miscCtx.lineTo(centerx, centery - 3);
				miscCtx.lineTo(centerx, centery - 8);
				miscCtx.lineTo(centerx + 8, centery);
				miscCtx.lineTo(centerx, centery + 8);
				miscCtx.lineTo(centerx, centery + 3);
				miscCtx.lineTo(centerx - 8, centery + 3);
				miscCtx.fill();
			}
			if(grid.glyph == 8) {
				miscCtx.beginPath();
				miscCtx.fillStyle = "black";
				miscCtx.moveTo(centerx - 5, centery + 5);
				miscCtx.lineTo(centerx - 7, centery - 5);
				miscCtx.lineTo(centerx - 3, centery);
				miscCtx.lineTo(centerx, centery - 5);
				miscCtx.lineTo(centerx + 3, centery);
				miscCtx.lineTo(centerx + 7, centery - 5);
				miscCtx.lineTo(centerx + 5, centery + 5);
				miscCtx.fill();
			}
			if(grid.glyph == 11) {
				miscCtx.beginPath();
				miscCtx.strokeStyle = "white";
				miscCtx.lineWidth = 3.5;
				miscCtx.lineCap = "round";
				miscCtx.lineJoin = "round";
				miscCtx.moveTo(centerx + 5, centery - 5);
				miscCtx.lineTo(centerx - 5, centery + 5);
				miscCtx.moveTo(centerx - 5, centery - 5);
				miscCtx.lineTo(centerx + 5, centery + 5);
				miscCtx.stroke();
			}
		}
	});
	
	ctx.font = "18px 'Ubuntu'";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText(`Depth searched: ${depthSearchText}`, 5, gridOffsetY + gridSize * 8 + 45);
	
	if(gameOver) {
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		
		ctx.font = "25px 'Ubuntu'";
		ctx.fillText(["Checkmate!", "Draw!", "Timeout!"][gameOverType], c.width / 2, gridOffsetY + gridSize * 8 + 45);
		ctx.font = "18px 'Ubuntu'";
		ctx.fillText(gameOverName, c.width / 2, gridOffsetY + gridSize * 8 + 75);
	}
	else {
		if(PVE) {
			if((board.turn == enemy && !PLAY_AS_BLACK_PIECE) || (board.turn == player && PLAY_AS_BLACK_PIECE)) {
				ctx.font = "25px 'Atkinsno Hyperlegible'";
				ctx.textAlign = "center";
				ctx.fillStyle = "white";
				ctx.fillText("Computer thinking...", c.width / 2, gridOffsetY + gridSize * 8 + 75);
			}
		}
	}
}

main.addEventListener("touchstart", ev => {
	ev.preventDefault();
	
	var { pieces, turn } = board;
	
	var { clientX, clientY } = ev.touches[0];
	
	press.x = clientX;
	press.y = clientY;
	
	// promotion selection
	
	if(press.y < gridOffsetY) {
		if(press.x > promotion_buttonWidth * 0 && press.x < promotion_buttonWidth * 1) {
			board.promotionSelection[board.turn == player ? "player" : "enemy"] = 0;
		}
		if(press.x > promotion_buttonWidth * 1 && press.x < promotion_buttonWidth * 2) {
			board.promotionSelection[board.turn == player ? "player" : "enemy"] = 1;
		}
		if(press.x > promotion_buttonWidth * 2 && press.x < promotion_buttonWidth * 3) {
			board.promotionSelection[board.turn == player ? "player" : "enemy"] = 2;
		}
		if(press.x > promotion_buttonWidth * 3 && press.x < c.width) {
			board.promotionSelection[board.turn == player ? "player" : "enemy"] = 3;
		}
	}
	
	if(!highlightMode) {
		if(!gameOver) {
			playerMove();
		}
		
		moveHighlightGrids.forEach(element => {
			element.remove();
		});
		moveHighlightGrids = [];
		grids.forEach(grid => grid.pressed = false);
		
		for(var i = 0; i < pieces.length; i++) {
			var p = pieces[i];
			var grid = grids[p.pos];
			
			if(press.x > grid.x &&
			press.x < grid.x + grid.w &&
			press.y > grid.y &&
			press.y < grid.y + grid.h) {
				selectingIndex = i;
				p.selecting = true;
				grids[p.pos].pressed = true;
				
				if(p.isTeam(turn)) {
					moves.forEach(move => {
						var { index, toGrid, captureIndex } = getMoveStringInfo(move[0]);
						
						if(index == i) {
							var h = document.createElement("div");
							h.classList.add(captureIndex == -1 ? "move-highlight-quiet" : "move-highlight-capture");
							h.style.width = gridSize + "px";
							h.style.height = gridSize + "px";
							h.style.left = grids[toGrid].x + "px";
							h.style.top = grids[toGrid].y + "px";
							moveHighlightGrids.push(h);
							main.appendChild(h);
						}
					});
				}
				
				break;
			}
		}
	}
	else {
		for(var i = 0; i < grids.length; i++) {
			var grid = grids[i];
			
			var { x, y, w, h } = grid;
			
			if(press.x > x && press.x < x + w && press.y > y && press.y < y + h) {
				highlight_fromGrid = i;
				highlight_toGrid = -1;
				
				break;
			}
		}
	}
	
	// selecting highlight button
	
	if(press.x > 0 && press.x < 50 && press.y > c.height - 50 && press.y < c.height) {
		highlightMode = highlightMode ? false : true;
		
		if(!highlightMode) {
			arrows = [];
			highlights = [];
		}
	}
});

main.addEventListener("touchmove", ev => {
	ev.preventDefault();
	
	var { clientX, clientY } = ev.touches[0];
	
	var { pieces } = board;
	
	press.x = clientX;
	press.y = clientY;
	
	setCSSVar("--piece-transition", "none");
	
	pieces.forEach(p => {
		if(p.selecting) {
			var translateX = press.x - grids[p.pos].x - grids[p.pos].w / 2;
			var translateY = press.y - grids[p.pos].y - grids[p.pos].h / 2;
			
			p.sprite.style.transform = `translate(${translateX}px, ${translateY}px)`;
			
			isDraggingPiece = true;
		}
	});
});

main.addEventListener("touchend", ev => {
	ev.preventDefault();
	
	var { pieces, turn } = board;
	
	if(!highlightMode) {
		if(!gameOver) {
			playerMove();
		}
		
		if(isDraggingPiece) {
			moveHighlightGrids.forEach(element => {
				element.remove();
			});
			moveHighlightGrids = [];
			grids.forEach(grid => grid.pressed = false);
		}
	}
	
	for(var i = 0; i < grids.length; i++) {
		var grid = grids[i];
		
		var { x, y, w, h } = grid;
		
		if(press.x > x && press.x < x + w && press.y > y && press.y < y + h) {
			highlight_toGrid = i;
			
			break;
		}
	}
	
	if(highlight_fromGrid != highlight_toGrid) {
		if(highlight_fromGrid != -1 && highlight_toGrid != -1) {
			arrows.push(new Arrow(highlight_fromGrid, highlight_toGrid));
		}
	}
	else {
		if(highlight_fromGrid != -1 && highlight_toGrid != -1) {
			highlights.push(new Highlight(highlight_fromGrid));
		}
	}
	
	isDraggingPiece = false;
	
	highlight_fromGrid = -1;
	highlight_toGrid = -1;
	
	pieces.forEach(p => {
		p.sprite.style.transform = "translate(0, 0)";
	});
	
	setTimeout(() => {
		setCSSVar("--piece-transition", "var(--piece-move-speed) top var(--piece-move-timing-function), var(--piece-move-speed) left var(--piece-move-timing-function), 200ms opacity var(--piece-move-timing-function)");
	}, 0);
});

function playerMove() {
	var { pieces, turn } = board;
	
	if(!useTime || (useTime && clocks[turn].second > 0 || clocks[turn].minute > 0)) {
		if(selectingIndex != -1) {
			/*
			if(pieces[selectingIndex].selecting) {
				moveHighlightGrids = [];
			}
			*/
			
			moves.forEach(move => {
				var { index, toGrid } = getMoveStringInfo(move[0]);
				
				if(index == selectingIndex) {
					var grid = grids[toGrid];
					
					if(press.x > grid.x &&
					press.x < grid.x + grid.w &&
					press.y > grid.y &&
					press.y < grid.y + grid.h) {
						var analysisResult, analysisBestMove;
						if(useCoach) {
							analysisResult = bestMoves(board, depth, turn, useBook);
							analysisBestMove = [];
							
							for(var i = 0; i < numberOfArrows; i++) {
								analysisBestMove.push(analysisResult[i]);
							}
						}
						
						pieces = makeMove(board, move, false);
						
						if(board.moveHistory.length == 0 && useTime) {
							timerInterval = setInterval(timer, 100);
						}
						
						if(board.repetitionMoveHistory[board.posKey] >= 3) {
							gameOver = true;
							gameOverType = 1;
							gameOverName = "3 Fold Repetition";
						}
						
						currentMoveString = move;
						
						board.moveHistory.push(translateToFileRank(move));
						
						var stringCode = boardToStringCode(board);
						
						if(board.positionHistory[stringCode] == null) {
							board.positionHistory[stringCode] = 0;
						}
						else {
							board.positionHistory[stringCode]++;
						}
						
						document.querySelector("textarea").value = `\n\t"${board.moveHistory.join(" ")}", // placeholder_name`;
						
						pieces = removeCapturePieces(board);
						
						turn = changeTurn(board);
						
						moves = generateMoves(board, board.turn);
						
						board = updateBoardInfo(board);
						
						if(analysisMode/* && ((!PLAY_AS_BLACK_PIECE && turn == enemy) || (PLAY_AS_BLACK_PIECE && turn == player))*/) {
							bestArrows = [];
							
							setTimeout(function() {
								var { fromGrid, toGrid } = getMoveStringInfo(analysisBestMove[0].move[0]);
								
								bestArrows.push(new Arrow(
									fromGrid,
									toGrid,
									"#7BCB31"
								));
							}, enemyMoveDelay);
						}
						
						if(useCoach) {
							setGlyphOnGrid(analysisResult, currentMoveString);
						}
						
						var _isGameOver = isGameOver(board, moves, turn);
						if(_isGameOver.boolean) {
							gameOver = true;
							gameOverType = _isGameOver.type;
							gameOverName = _isGameOver.name;
							
							clearInterval(timerInterval);
						}
						else {
							if(PVE) {
								setTimeout(function() {
									if(useTime) {
										enemyStartSearch = Date.now();
									}
									
									var result = bestMoves(board, depth, turn, useBook);
									var bestMove = [];
									
									for(var i = 0; i < 1; i++) {
										bestMove.push(result[i]);
									}
									
									var move = bestMove[Math.floor(Math.random()*bestMove.length)].move;
									
									setTimeout(() => {
									
									if(useTime) {
										decreaseTime(Math.floor((Date.now() - enemyStartSearch) / 100));
									}
									
									pieces = makeMove(board, move);
									
									board.moveHistory.push(translateToFileRank(move));
									
									if(board.positionHistory[stringCode] == null) {
										board.positionHistory[stringCode] = 0;
									}
									else {
										board.positionHistory[stringCode]++;
									}
									
									if(board.repetitionMoveHistory[board.posKey] >= 3) {
										gameOver = true;
										gameOverType = 1;
										gameOverName = "3 Fold Repetition";
									}
									
									document.querySelector("textarea").value = `\n\t"${board.moveHistory.join(" ")}", // placeholder_name`;
									
									pieces = removeCapturePieces(board);
									
									turn = changeTurn(board);
									
									moves = generateMoves(board, board.turn);
									
									var _isGameOver = isGameOver(board, moves, turn);
									if(_isGameOver.boolean) {
										gameOver = true;
										gameOverType = _isGameOver.type;
										gameOverName = _isGameOver.name;
										
										clearInterval(timerInterval);
										
										if(useCoach) {
											setGlyphOnGrid(result, move);
										}
									}
									
									}, 0);
									
								}, !isDraggingPiece ? enemyMoveDelay : 0);
							}
						}
					}
				}
			});
			
			if(isDraggingPiece) {
				pieces.forEach(p => {
					p.selecting = false;
				});
			}
		}
	}
}

setTimeout(() => {
	setTimeout(u, 0);
	function u() {
		if(useTime) {
			enemyStartSearch = Date.now();
		}
		
		board = updateBoardInfo(board);
		
		var result = bestMoves(board, depth, board.turn, useBook);
		var bestMove = [];
		
		for(var i = 0; i < 1; i++) {
			if(result[i] != null) {
				bestMove.push(result[i]);
			}
		}
		
		var move = bestMove[Math.floor(Math.random()*bestMove.length)].move;
		
		setTimeout(() => {
			if(useTime) {
				decreaseTime(Math.floor((Date.now() - enemyStartSearch) / 100));
			}
			
			pieces = makeMove(board, move, false);
			
			if(board.moveHistory.length == 0 && useTime) {
				timerInterval = setInterval(timer, 100);
			}
			
			if(board.repetitionMoveHistory[board.posKey] == null) {
				board.repetitionMoveHistory[board.posKey] = 0;
			}
			
			board.repetitionMoveHistory[board.posKey]++;
			
			if(board.repetitionMoveHistory[board.posKey] >= 3) {
				gameOver = true;
				gameOverType = 1;
				gameOverName = "3 Fold Repetition";
			}
			
			currentMoveString = move;
			
			var stringCode = boardToStringCode(board);
			
			if(board.positionHistory[stringCode] == null) {
				board.positionHistory[stringCode] = 0;
			}
			else {
				board.positionHistory[stringCode]++;
			}
			
			board.moveHistory.push(translateToFileRank(move));
			
			//document.querySelector("textarea").value = `\n\t"${board.moveHistory.join(" ")}", // placeholder_name`;
			document.querySelector("textarea").value = `"${board.moveHistory.join(" ")}"`;
			
			pieces = removeCapturePieces(board);
			
			turn = changeTurn(board);
			
			moves = generateMoves(board, board.turn);
			
			board = updateBoardInfo(board);
			
			if(useCoach) {
				setGlyphOnGrid(result, move);
			}
			
			bestArrows = [];
			for(var j = 0; j < numberOfArrows; j++) {
				var { fromGrid, toGrid } = getMoveStringInfo(result[j].move[0]);
				
				bestArrows.push(new Arrow(
					fromGrid,
					toGrid,
					(numberOfArrows > 1) ? `hsl(${lerp(235, 0, j / (result.length - 1))}, 100%, 50%)` : "#7BCB31"
				));
			}
			
			if(!gameOver) {
				var _isGameOver = isGameOver(board, moves, turn);
				if(_isGameOver.boolean) {
					gameOver = true;
					gameOverType = _isGameOver.type;
					gameOverName = _isGameOver.name;
					
					clearInterval(timerInterval);
				}
				else {
					if(!gameOver) {
						//depth = turn == player ? 3 : 2;
						setTimeout(u, enemyMoveDelay);
					}
				}
			}
		}, 0);
	}
}, 1000);
