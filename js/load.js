var fenPiece = {
	"p": 0,
	"b": 1,
	"n": 2,
	"r": 3,
	"q": 4,
	"k": 5
}

function isUpperCase(char) {
	return char.toUpperCase() == char;
}

function loadBoardFromFen(fen) {
	var { pieces, pieceGrid, material } = board;
	
	var pieceIndex = -1;
	
	var f = fen.split(" ")[0];
	var rank = 0, file = 0;
	for(var i = 0; i < f.length; i++) {
		var char = f[i];
		
		if(char == "/") {
			file = 0;
			rank++;
		}
		else {
			if(!isNaN(char)) {
				file += parseInt(char);
			}
			else {
				var _v = [
					pawnValue,
					bishopValue,
					knightValue,
					rookValue,
					queenValue,
					0
				];
				var _map;
				
				pieceIndex++;
				
				var type = fenPiece[char.toLowerCase()];
				var team = (isUpperCase(char)) ? player : enemy;
				
				switch(type) {
					case piece.pawn:
						_map = pawnMap;
					break;
					case piece.bishop:
						_map = bishopMap;
					break;
					case piece.knight:
						_map = knightMap;
					break;
					case piece.rook:
						_map = rookMap;
					break;
					case piece.queen:
						_map = queenMap;
					break;
					case piece.king:
						_map = kingMap;
					break;
				}
				
				pieces.push(new Piece(rank * 8 + file, type, team));
				
				material[team] += _v[type] + ((team == player) ? _map[mirrorIndex[pieces[pieces.length - 1].pos]] : _map[pieces[pieces.length - 1].pos]);
				
				pieceGrid[file + rank * 8] = pieces[pieces.length - 1];
				
				pieces[pieces.length - 1].index = pieceIndex;
				
				// sets position key
				
				board.posKey ^= pieceKey[type * (team == player ? 1 : 2) + (rank * 8 + file)];
				
				file++;
				
				if(char.toLowerCase() == "k") {
					if(isUpperCase(char)) {
						board.kingIndex.player = pieceIndex;
					}
					else {
						board.kingIndex.enemy = pieceIndex;
					}
				}
			}
		}
	}
}
