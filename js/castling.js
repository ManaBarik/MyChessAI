/**
 * @method {canCastle}
 * @param {"short"|"long"} castlingType
 */

function canCastle(board, team, castlingType) {
	var { pieces, kingIndex, pieceGrid } = board;
	
	var attackingSquareOnPath = false;
	var kingInCheck = inCheck(board, team);
	var piecesInWay = false;
	
	var kingIndex = kingIndex[team == player ? "player" : "enemy"];
	var king = pieces[kingIndex];
	var rooks = new Array(2);
	
	// gets the rooks index
	if(team == player) {
		if(pieceGrid[63] != null && pieceGrid[63].isType(piece.rook) && pieceGrid[63].isTeam(team)) {
			rooks[1] = pieceGrid[63];
		}
		if(pieceGrid[56] != null && pieceGrid[56].isType(piece.rook) && pieceGrid[56].isTeam(team)) {
			rooks[0] = pieceGrid[56];
		}
	}
	if(team == enemy) {
		if(pieceGrid[7] != null && pieceGrid[7].isType(piece.rook) && pieceGrid[7].isTeam(team)) {
			rooks[1] = pieceGrid[7];
		}
		if(pieceGrid[0] != null && pieceGrid[0].isType(piece.rook) && pieceGrid[0].isTeam(team)) {
			rooks[0] = pieceGrid[0];
		}
	}
	
	// checks if a piece is in castling path
	if(castlingType == "short") {
		if(team == player) {
			if((pieceGrid[62] != null && !pieceGrid[62].captured) || (pieceGrid[61] != null && !pieceGrid[61].captured)) {
				piecesInWay = true;
			}
		}
		else {
			if((pieceGrid[6] != null && !pieceGrid[6].captured) || (pieceGrid[5] != null && !pieceGrid[5].captured)) {
				piecesInWay = true;
			}
		}
	}
	if(castlingType == "long") {
		if(team == player) {
			if((pieceGrid[57] != null && !pieceGrid[57].captured) || (pieceGrid[58] != null && !pieceGrid[58].captured) || (pieceGrid[59] != null && !pieceGrid[59].captured)) {
				piecesInWay = true;
			}
		}
		else {
			if((pieceGrid[1] != null && !pieceGrid[1].captured) || (pieceGrid[2] != null && !pieceGrid[2].captured) || (pieceGrid[3] != null && !pieceGrid[3].captured)) {
				piecesInWay = true;
			}
		}
	}
	/*
	var moves = generateMoves(board, team == player ? enemy : player, false);
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		
		for(var j = 0; j < move.length; j++) {
			var m = move[j];
			
			var { toGrid } = getMoveStringInfo(m);
			
			if(castlingType == "short") {
				if(team == player) {
					if(toGrid == 61 || toGrid == 62) {
						attackingSquareOnPath = true;
					}
				}
				else {
					if(toGrid == 5 || toGrid == 6) {
						attackingSquareOnPath = true;
					}
				}
			}
			if(castlingType == "long") {
				if(team == player) {
					if(toGrid == 58 || toGrid == 59) {
						attackingSquareOnPath = true;
					}
				}
				else {
					if(toGrid == 2 || toGrid == 3) {
						attackingSquareOnPath = true;
					}
				}
			}
		}
	}
	*/
	
	if(castlingType == "short") {
		if(team == player) {
			var a = isGridAttacked(board, 61, player);
			
			if(a) {
				attackingSquareOnPath = true;
			}
			else {
				attackingSquareOnPath = isGridAttacked(board, 62, player);
			}
		}
		else if(team == enemy) {
			var a = isGridAttacked(board, 5, enemy);
			
			if(a) {
				attackingSquareOnPath = true;
			}
			else {
				attackingSquareOnPath = isGridAttacked(board, 6, enemy);
			}
		}
	}
	if(castlingType == "long") {
		if(team == player) {
			var a = isGridAttacked(board, 58, player);
			
			if(a) {
				attackingSquareOnPath = true;
			}
			else {
				attackingSquareOnPath = isGridAttacked(board, 59, player);
			}
		}
		else if(team == enemy) {
			var a = isGridAttacked(board, 2, enemy);
			
			if(a) {
				attackingSquareOnPath = true;
			}
			else {
				attackingSquareOnPath = isGridAttacked(board, 3, enemy);
			}
		}
	}
	
	if(castlingType == "short" && rooks[1] != null) {
		//console.log(`kingInCheck: ${kingInCheck}\nkingHasMoved: ${king.hasMoved}\nrookHasMoved: ${rooks[1].hasMoved}\npiecesInWay: ${piecesInWay}\nattackingSquareOnPath: ${attackingSquareOnPath}\ncan castle? : ${!kingInCheck && !king.hasMoved && !rooks[1].hasMoved && !piecesInWay && !attackingSquareOnPath ? "Yes!" : "No!"}`);
		return !kingInCheck /*&& !king.hasMoved && !rooks[1].hasMoved*/ && !piecesInWay && !attackingSquareOnPath && king.pos == (king.isTeam(player) ? 60 : 4);
	}
	if(castlingType == "long" && rooks[0] != null) {
		return !kingInCheck /*&& !king.hasMoved && !rooks[0].hasMoved*/ && !piecesInWay && !attackingSquareOnPath && king.pos == (king.isTeam(player) ? 60 : 4);
	}
}
