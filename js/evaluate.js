function evaluate(board, lastMove) {
	var { pieces, attackingGridEval } = board;
	var lastMoveIndex = PIECEINDEX(lastMove[0]);
	var lastMoveToGrid = TOSQUARE(lastMove[0]);
	
	var whiteEval = countMaterial(board, player);
	var blackEval = countMaterial(board, enemy);
	
	whiteEval += kingToEdge(board, player, (countMaterial(board, player) - countMaterial(board, enemy)) / 1000);
	blackEval += kingToEdge(board, enemy, (countMaterial(board, enemy) - countMaterial(board, player)) / 1000);
	
	whiteEval += attackingGridEval[player];
	blackEval += attackingGridEval[enemy];
	
	if(isGridAttacked(board, lastMoveToGrid, pieces[lastMoveIndex].team) && !pieces[lastMoveIndex].isType(piece.pawn)) {
		if(pieces[lastMoveIndex].isTeam(player)) {
			whiteEval -= getPieceValue(pieces[lastMoveIndex].type);
		}
		else {
			blackEval -= getPieceValue(pieces[lastMoveIndex].type);
		}
	}
	
	var evaluation = whiteEval - blackEval;
	
	return evaluation;
}

function countMaterial(board, turn) {
	/*
	var { pieces, pieceGrid } = board;
	
	var isPlayer = turn == player;
	
	var evaluation = 0;
	
	var darkBishopPresent = false;
	var lightBishopPresent = false;
	
	var totalDarkPawn = 0;
	var totalLightPawn = 0;
	
	var darkBishopExtra = 0;
	var lightBishopExtra = 0;
	
	for(var i = 0; i < pieces.length; i++) {
		var p = pieces[i];
		
		if(p.isTeam(turn) && !p.captured) {
			if(p.isType(piece.pawn)) {
				evaluation += pawnValue + ((isPlayer) ? pawnMap[((Math.floor(p.pos / 8) * 8) - 1) - p.pos % 8] : pawnMap[p.pos]);
				
				if(p.pos % 2 == 0) {
					// light square pawn
					
					totalLightPawn++;
				}
				else {
					// dark square pawn
					
					totalDarkPawn++;
				}
			}
			if(p.isType(piece.bishop)) {
				evaluation += bishopValue + ((isPlayer) ? bishopMap[bishopMap.length - 1 - p.pos] : bishopMap[p.pos]);
				
				// outpost evaluation
				
				var lPawn = pieceGrid[p.pos + (isPlayer ? 8 : -8) - 1];
				var rPawn = pieceGrid[p.pos + (isPlayer ? 8 : -8) + 1];
				
				if((p.pos % 8 - 1 >= 0 && p.pos >= 0 && p.pos < 64 && lPawn != undefined && lPawn.isType(piece.pawn) && lPawn.isTeam(turn == player ? enemy : player)) ||
				(p.pos % 8 + 1 < 8 && p.pos >= 0 && p.pos < 64 && rPawn != undefined && rPawn.isType(piece.pawn) && rPawn.isTeam(turn == player ? enemy : player))) {
					evaluation += outpostMap[p.pos];
				}
				
				if(p.pos % 2 == 0) {
					// light square present
					
					lightBishopPresent = true;
				}
				else {
					// dark square present
					
					darkBishopPresent = true;
				}
			}
			if(p.isType(piece.knight)) {
				evaluation += knightValue + ((isPlayer) ? knightMap[knightMap.length - 1 - p.pos] : knightMap[p.pos]);
				
				// outpost evaluation
				
				var lPawn = pieceGrid[p.pos + (isPlayer ? 8 : -8) - 1];
				var rPawn = pieceGrid[p.pos + (isPlayer ? 8 : -8) + 1];
				
				if((p.pos % 8 - 1 >= 0 && p.pos >= 0 && p.pos < 64 && lPawn != undefined && lPawn.isType(piece.pawn) && lPawn.isTeam(turn == player ? enemy : player)) ||
				(p.pos % 8 + 1 < 8 && p.pos >= 0 && p.pos < 64 && rPawn != undefined && rPawn.isType(piece.pawn) && rPawn.isTeam(turn == player ? enemy : player))) {
					evaluation += outpostMap[p.pos];
				}
			}
			if(p.isType(piece.rook)) {
				evaluation += rookValue + ((isPlayer) ? rookMap[rookMap.length - 1 - p.pos] : rookMap[p.pos]);
			}
			if(p.isType(piece.queen)) {
				evaluation += queenValue + ((isPlayer) ? queenMap[queenMap.length - 1 - p.pos] : queenMap[p.pos]);
			}
		}
	}
	
	lightBishopExtra = (totalDarkPawn - totalLightPawn) * 10;
	darkBishopExtra = (totalLightPawn - totalDarkPawn) * 10;
	
	if(lightBishopPresent) {
		evaluation += lightBishopExtra;
	}
	if(darkBishopPresent) {
		evaluation += darkBishopExtra;
	}
	
	return evaluation;
	*/
	
	return board.material[turn];
}
