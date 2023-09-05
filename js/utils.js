var pawnValue = 100;
var bishopValue = 300;
var knightValue = 300;
var rookValue = 500;
var queenValue = 900;

var mateValue = 1000000;
var bonusDepthEval = 10000;

var mirrorIndex = [
	56, 57, 58, 59, 60, 61, 62, 63,
	48, 49, 50, 51, 52, 53, 54, 55,
	40, 41, 42, 43, 44, 45, 46, 47,
	32, 33, 34, 35, 36, 37, 38, 39,
	24, 25, 26, 27, 28, 29, 30, 31,
	16, 17, 18, 19, 20, 21, 22, 23,
	8,  9,  10, 11, 12, 13, 14, 15,
	0,  1,  2,  3,  4,  5,  6,  7
];

var pieceKey = new Array(12 * 64);
var turnKey;

for(var i = 0; i < pieceKey.length; i++) {
	pieceKey[i] = rand32();
}

turnKey = rand32();

var castleBit = {
	wk: 1,
	wq: 2,
	bk: 4,
	bq: 8
}

var PVENTRIES = 1000;
var NOMOVE = [];

var directionOffsets = [-8, 8, -1, 1, -9, 7, -7, 9];
var distToEdge = [];
var knightDir = [[-17, -1], [-15, 1], [-10, -2], [-6, 2], [6, -2], [10, 2], [15, -1], [17, 1]];
var kingDir = [[-8, 0], [8, 0], [-1, -1], [1, 1], [-9, -1], [7, -1], [-7, 1], [9, 1]];

var posName = [
	"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
	"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
	"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
	"a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
	"a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
	"a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
	"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
	"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
];

var fileIndex = {
	a: 0,
	b: 1,
	c: 2,
	d: 3,
	e: 4,
	f: 5,
	g: 6,
	h: 7
};

function changeTurn(board, changePromotionImageSrc = true, rotatePieces = true) {
	board.turn = board.turn == player ? enemy : player;
	
	if(changePromotionImageSrc) {
		promotion_queenImg.image.src = `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_queen.png`;
		promotion_rookImg.image.src = `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_rook.png`;
		promotion_bishopImg.image.src = `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_bishop.png`;
		promotion_knightImg.image.src = `sprites/${pieceSpriteStyle}/${board.turn == player ? "white" : "black"}_knight.png`;
	}
	
	// updates position key
	
	hashTurn(board);
	
	if(rotatePieces && passAndPlay) {
		board.pieces.forEach(p => {
			p.sprite.style.transform = `rotate(${board.turn == player ? "0" : "180"}deg)`;
		});
	}
	
	return board.turn;
}

function removeCapturePieces(board) {
	var { pieces, kingIndex } = board;
	
	for(var i = 0; i < pieces.length; i++) {
		var p = pieces[i];
		
		if(p.captured) {
			p.sprite.style.opacity = "0";
			r(p);
			function r(p) {
				setTimeout(function() {
					p.sprite.remove();
				}, 500);
			}
			
			pieces.splice(i, 1);
			
			if(i < kingIndex.player) kingIndex.player--;
			if(i < kingIndex.enemy) kingIndex.enemy--;
			
			pieces.forEach(p => {
				if(i < p.index) p.index--;
			});
		}
	}
	
	for(var i = 0; i < pieces.length; i++) {
		var p = pieces[i];
		
		if(!p.captured) {
			p.sprite.style.opacity = "1";
		}
	}
	
	return pieces;
}

function lerp(s, e, t) {
	return s + (e - s) * t;
}

function getAngle(a, b) {
	return Math.atan2(b.y - a.y, b.x - a.x);
}

function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;
  
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
  	
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  
  return array;
}

function getPieceValue(type) {
	switch(type) {
		case piece.pawn:
			return pawnValue;
		break;
		case piece.bishop:
			return bishopValue;
		break;
		case piece.knight:
			return knightValue;
		break;
		case piece.rook:
			return rookValue;
		break;
		case piece.queen:
			return queenValue;
		break;
		default:
			return 0;
		break;
	}
}

function updateBoardInfo(board) {
	var whiteMaterial = countMaterial(board, player);
	var blackMaterial = countMaterial(board, enemy);
	
	var maxMaterialForEndgame = rookValue + knightValue;
	
	if(whiteMaterial < maxMaterialForEndgame || blackMaterial < maxMaterialForEndgame) {
		if(!board.endgame) {
			kingMap = [
				0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 6, 4, 4, 6, 0, 0,
				0, 0, 4, 9, 9, 4, 0, 0,
				0, 0, 4, 9, 9, 4, 0, 0,
				0, 0, 6, 4, 4, 6, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0
			];
			
			pawnMap = [
				0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0,
				1, 1, 1, 1, 1, 1, 1, 1,
				10,10,10,10,10,10,10,10,
				15,15,15,15,15,15,15,15,
				20,20,20,20,20,20,20,20,
				25,25,25,25,25,25,25,25,
				0, 0, 0, 0, 0, 0, 0, 0
			];
			
			pawnValue = 200;
			knightValue = 400;
			bishopValue = 400;
		}
		
		board.endgame = true;
	}
	
	var aiTeam = PLAY_AS_BLACK_PIECE ? player : enemy;
	var playerTeam = PLAY_AS_BLACK_PIECE ? enemy : player;
	
	if(useTime && useThinkingTimeDifference) {
		if(board.totalMoves <= 20) {
			searchOption.time = enemySearchSpeed.opening;
		}
		else {
			if(clocks[aiTeam].minute > 0 || clocks[aiTeam].second > 300) {
				if(clocks[aiTeam].second < clocks[playerTeam].second || (clocks[aiTeam].minute < clocks[playerTeam].minute)) {
					searchOption.time = enemySearchSpeed.lowerThanPlayer;
				}
				else {
					searchOption.time = enemySearchSpeed.none;
				}
			}
			else {
				if(clocks[aiTeam].second < clocks[playerTeam].second || (clocks[aiTeam].minute < clocks[playerTeam].minute)) {
					searchOption.time = enemySearchSpeed.nearTimeoutLowerThanPlayer;
				}
				else {
					searchOption.time = enemySearchSpeed.nearTimeoutGreaterThanPlayer;
				}
				
				if(clocks[aiTeam].second <= 100 && clocks[aiTeam].second > 50) {
					searchOption.time = enemySearchSpeed.belowTenSecond
				}
				if(clocks[aiTeam].second <= 50 && clocks[aiTeam].second > 30) {
					searchOption.time = enemySearchSpeed.belowFiveSecond
				}
				if(clocks[aiTeam].second <= 30) {
					searchOption.time = enemySearchSpeed.belowThreeSecond
				}
			}
		}
	}
	
	return board;
}

function translateToFileRank(moveString) {
	var fromGrid = FROMSQUARE(moveString[0]);
	var toGrid = TOSQUARE(moveString[0]);
	
	var string = "";
	
	if(moveString.length == 1) {
		var fileChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
		
		var fromFile = fileChar[fromGrid % 8];
		var fromRank = 7 - Math.floor(fromGrid / 8) + 1;
		var toFile = fileChar[toGrid % 8];
		var toRank = 7 - Math.floor(toGrid / 8) + 1;
		
		string = `${fromFile}${fromRank}${toFile}${toRank}`;
	}
	else {
		var kingPosOrigin = board.pieceGrid[toGrid].isTeam(player) ? 60 : 4;
		if(fromGrid == kingPosOrigin) {
			if(toGrid == kingPosOrigin + 2) {
				string = "O-O";
			}
			else {
				string = "O-O-O";
			}
		}
	}
	
	return string;
}

var fileRankValue = {};

for(var rank = 0; rank < 8; rank++) {
	for(var file = 0; file < 8; file++) {
		fileRankValue[`${["a", "b", "c", "d", "e", "f", "g", "h"][file]}${8 - rank}`] = file + rank * 8;
	}
}

function translateToMoveString(board, fileRankString) {
	var { pieces, turn } = board;
	
	var fromGrid = fileRankValue[fileRankString.slice(0, 2)];
	var toGrid = fileRankValue[fileRankString.slice(2, 4)];
	
	var moveIndex = 0;
	var captureIndex = -1;
	
	for(var i = 0; i < pieces.length; i++) {
		var p = pieces[i];
		
		if(p.pos == fromGrid && p.isTeam(turn)) {
			moveIndex = i;
		}
		if(p.pos == toGrid && !p.isTeam(turn)) {
			captureIndex = i;
		}
	}
	
	return [Move(moveIndex, fromGrid, toGrid, captureIndex, 0, 0)];
}

var pieceInFEN = [
	"p",
	"b",
	"n",
	"r",
	"q",
	"k"
];

function convertToFEN(board) {
	var { pieceGrid } = board;
	
	var newFEN = "";
	
	var gap = 0;
	for(var rank = 0; rank < 8; rank++) {
		for(var file = 0; file < 8; file++) {
			var p = pieceGrid[file + rank * 8];
			
			if(p == null) {
				gap++;
			}
			else {
				if(gap != 0) {
					newFEN += gap.toString();
					
					gap = 0;
				}
				newFEN += (p.isTeam(player)) ? pieceInFEN[p.type].toUpperCase() : pieceInFEN[p.type];
			}
		}
		
		if(gap != 0) {
			newFEN += gap.toString();
			
			gap = 0;
		}
		
		if(rank < 7) {
			newFEN += "/";
		}
	}
	
	return newFEN;
}

function boardToStringCode(board) {
	var { pieces } = board;
	
	var stringCode = "";
	
	pieces.forEach(p => {
		var team = p.team;
		var char = team == player ? pieceInFEN[p.type].toUpperCase() : pieceInFEN[p.type];
		
		stringCode += `${char}${p.pos}`;
	});
	
	return stringCode;
}

function precomputeMoveData() {
	for(var rank = 0; rank < 8; rank++) {
		for(var file = 0; file < 8; file++) {
			distToEdge.push([]);
			
			var up = rank;
			var down = 7 - rank;
			var left = file;
			var right = 7 - file;
			
			var gridIndex = rank * 8 + file;
			
			distToEdge[gridIndex][0] = up;
			distToEdge[gridIndex][1] = down;
			distToEdge[gridIndex][2] = left;
			distToEdge[gridIndex][3] = right;
			distToEdge[gridIndex][4] = Math.min(up, left);
			distToEdge[gridIndex][5] = Math.min(down, left);
			distToEdge[gridIndex][6] = Math.min(up, right);
			distToEdge[gridIndex][7] = Math.min(down, right);
		}
	}
}

precomputeMoveData();

/*
function mirrorIndex(index) {
	return (56 + index % 8) - Math.floor(index / 8) * 8;
}
*/

function updateCoachMessage(message) {
	coachMessageText.innerHTML = message
}

function countAttacker(board, pos, team) {
	var { pieceGrid } = board;
	
	var totalAttackers = 0;
	
	// checking for pawn attacks
	
	var lpawnpos = pos + (team == player ? -9 : 7);
	var rpawnpos = pos + (team == player ? -7 : 9);
	
	if(pos % 8 - 1 >= 0 && pieceGrid[lpawnpos] != undefined && pieceGrid[lpawnpos].isType(piece.pawn) && pieceGrid[lpawnpos].isTeam(team == player ? enemy : player)) {
		totalAttackers++;
	}
	if(pos % 8 + 1 < 8 && pieceGrid[rpawnpos] != undefined && pieceGrid[rpawnpos].isType(piece.pawn) && pieceGrid[rpawnpos].isTeam(team == player ? enemy : player)) {
		totalAttackers++;
	}
	
	// checking for sliding piece attacks
	
	for(var i = 0; i < directionOffsets.length; i++) {
		for(var n = 0; n < distToEdge[pos][i]; n++) {
			var targetGrid = pos + directionOffsets[i] * (n + 1);
			
			if(i < 4) {
				if(pieceGrid[targetGrid] != undefined && [false, false, false, true, true][pieceGrid[targetGrid].type]) {
					break;
				}
				else {
					totalAttackers++;
				}
			}
			else {
				if(pieceGrid[targetGrid] != undefined && [false, true, false, false, true][pieceGrid[targetGrid].type]) {
					break;
				}
				else {
					totalAttackers++;
				}
			}
		}
	}
	
	// checking for knight attacks
	
	for(var i = 0; i < knightDir.length; i++) {
		var targetGrid = pos + knightDir[i][0];
		if(pos % 8 + knightDir[i][1] >= 0 && pos % 8 + knightDir[i][1] < 8 &&
		targetGrid >= 0 && targetGrid < 64) {
			if(pieceGrid[targetGrid] != undefined) {
				if(pieceGrid[targetGrid].isType(piece.knight) && pieceGrid[targetGrid].isTeam(team == player ? enemy : player)) {
					totalAttackers++;
				}
			}
		}
	}
	
	return totalAttackers;
}

function hashPiece(board, type, team, pos) {
	board.posKey ^= pieceKey[type + (team == player ? 1 : 6) + pos];
}

function hashTurn(board) {
	board.posKey ^= turnKey;
}

function rand32() {
	return (Math.floor((Math.random()*255) + 1) << 23) | (Math.floor((Math.random()*255) + 1) << 16) | (Math.floor((Math.random()*255) + 1) << 8) | (Math.floor((Math.random()*255) + 1) << 1)
}

function setCSSVar(property, value) {
	root.style.setProperty(property, value);
}

function convertToAlgebraic(board, SAN) {
	var { turn, pieceGrid } = board;
	
	var fromGrid = 0;
	var toGrid = 0;
	
	toGrid = fileRankValue[SAN.slice(SAN.length - 2, SAN.length)];
	
	if(SAN.charAt(0) == "a" ||
	SAN.charAt(0) == "b" ||
	SAN.charAt(0) == "c" ||
	SAN.charAt(0) == "d" ||
	SAN.charAt(0) == "e" ||
	SAN.charAt(0) == "f" ||
	SAN.charAt(0) == "g" ||
	SAN.charAt(0) == "h") {
		if(SAN.length > 2) {
			if(turn == player) {
				fromGrid = toGrid + 8 + (fileIndex[SAN.charAt(0)] - fileIndex[SAN.charAt(SAN.length - 2)]);
			}
			else {
				fromGrid = toGrid - 8 + (fileIndex[SAN.charAt(0)] - fileIndex[SAN.charAt(SAN.length - 2)]);
			}
		}
		else {
			if(turn == player) {
				if(pieceGrid[toGrid + 8] != undefined) {
					fromGrid = toGrid + 8;
				}
				else if(pieceGrid[toGrid + 16] != undefined) {
					fromGrid = toGrid + 16;
				}
			}
			else {
				if(pieceGrid[toGrid - 8] != undefined) {
					fromGrid = toGrid - 8;
				}
				else if(pieceGrid[toGrid - 16] != undefined) {
					fromGrid = toGrid - 16;
				}
			}
		}
	}
	else if(SAN.charAt(0) == "N") {
		if(SAN.length == 3) {
			
		}
		else if(SAN.charAt(1) == "x") {
			
		}
		else if(SAN.charAt(2) == "x") {
			
		}
	}
	
	grids[fromGrid].glyph = 11;
	grids[toGrid].glyph = 11;
	arrows = [];
	arrows.push(new Arrow(fromGrid, toGrid, "tomato"));
}

function updateEvalBar(evaluation) {
	document.getElementById("evalBarContent").style.width = `calc(50% + ${(Math.abs(evaluation) != Infinity) ? ((evaluation / 100) * 50) : (evaluation >= 0 ? "50%" : "-50%")}%)`;
}
