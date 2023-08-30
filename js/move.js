function makeMove(board, moveString, useAnimation = true, drawTrail = true, moveSprite = true) {
	var { pieces, promotionSelection, pieceGrid, material, kingIndex } = board;
	
	if(drawTrail) {
		grids.forEach(grid => {
			grid.trail = false;
			grid.glyph = -1;
			grid.pressed = false;
		});
		
		var fromGrid = FROMSQUARE(moveString[0]);
		var toGrid = TOSQUARE(moveString[0]);
		
		grids[fromGrid].trail = true;
		grids[toGrid].trail = true;
	}
	
	var _v = [
		pawnValue,
		bishopValue,
		knightValue,
		rookValue,
		queenValue,
		0
	];
	
	var _map;
	
	for(var i = 0; i < moveString.length; i++) {
		var index = PIECEINDEX(moveString[i]);
		var fromGrid = FROMSQUARE(moveString[i]);
		var toGrid = TOSQUARE(moveString[i]);
		var captureIndex = CAPTUREINDEX(moveString[i]);
		var isPromoting = ISPROMOTING(moveString[i]);
		var noCapture = NOCAPTURE(moveString[i]);
		
		var king = pieces[kingIndex[pieces[index].team == player ? "player" : "enemy"]];
		var enemyKing = pieces[kingIndex[pieces[index].team == player ? "enemy" : "player"]];
		
		switch(pieces[index].type) {
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
		
		var type = pieces[index].type;
		var team = pieces[index].team;
		
		var isDoublePawn = Math.abs(fromGrid - toGrid) == 16 &&
		pieces[index].isType(piece.pawn);
		
		pieces[index].pos = toGrid;
		pieces[index].hasMoved = true;
		pieces[index].isMoving = true;
		
		pieceGrid[fromGrid] = undefined;
		pieceGrid[toGrid] = pieces[index];
		
		// updates position key
		
		hashPiece(board, type, team, fromGrid);
		hashPiece(board, type, team, toGrid);
		
		material[pieces[index].team] -= ((pieces[index].isTeam(player)) ? _map[mirrorIndex[fromGrid]] : _map[fromGrid]);
		
		material[pieces[index].team] += ((pieces[index].isTeam(player)) ? _map[mirrorIndex[toGrid]] : _map[toGrid]);
		
		if(moveSprite) {
			pieces[index].sprite.style.left = `${grids[toGrid].x}px`;
			pieces[index].sprite.style.top = `${grids[toGrid].y}px`;
		}
		
		// en passant
		
		if(isDoublePawn) {
			var lPawn = pieceGrid[pieces[index].pos - 1];
			var rPawn = pieceGrid[pieces[index].pos + 1];
			
			if(lPawn != null && lPawn.isTeam(team == player ? enemy : player) && pieces[index].pos % 8 - 1 >= 0) {
				var kingIsPinned = false;
				var attackingPiece = false;
				
				var kingLeft = enemyKing.pos < pieces[index].pos;
				
				for(var n = 0; n < distToEdge[pieces[index].pos - (kingLeft ? 0 : 1)][kingLeft ? 3 : 2]; n++) {
					var targetGrid = pieces[index].pos - (kingLeft ? 0 : 1) + directionOffsets[kingLeft ? 3 : 2] * (n + 1);
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != undefined && !targetPiece.capture) {
						if(targetPiece.isTeam(team)) {
							if(targetPiece.isType(piece.rook) || targetPiece.isType(piece.queen)) {
								attackingPiece = true;
							}
						}
						
						break;
					}
				}
				
				for(var n = 0; n < distToEdge[pieces[index].pos - (kingLeft ? 1 : 0)][kingLeft ? 2 : 3]; n++) {
					var targetGrid = pieces[index].pos - (kingLeft ? 1 : 0) + directionOffsets[kingLeft ? 2 : 3] * (n + 1);
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != undefined) {
						if(targetPiece.isTeam(team == player ? enemy : player)) {
							if(targetPiece.isType(piece.king)) {
								if(attackingPiece) {
									kingIsPinned = true;
								}
							}
						}
						
						break;
					}
				}
				
				if(!kingIsPinned) {
					lPawn.enPassantTo = pieces[index].pos + (team == player ? 8 : -8);
					lPawn.enPassantCapture = index;
				}
			}
			if(rPawn != null && rPawn.isTeam(team == player ? enemy : player) && pieces[index].pos % 8 + 1 < 8) {
				var kingIsPinned = false;
				var attackingPiece = false;
				
				var kingLeft = enemyKing.pos < pieces[index].pos;
				
				for(var n = 0; n < distToEdge[pieces[index].pos + (kingLeft ? 1 : 0)][kingLeft ? 3 : 2]; n++) {
					var targetGrid = pieces[index].pos + (kingLeft ? 1 : 0) + directionOffsets[kingLeft ? 3 : 2] * (n + 1);
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != undefined && !targetPiece.capture) {
						if(targetPiece.isTeam(team)) {
							if(targetPiece.isType(piece.rook) || targetPiece.isType(piece.queen)) {
								attackingPiece = true;
							}
						}
						
						break;
					}
				}
				
				for(var n = 0; n < distToEdge[pieces[index].pos + (kingLeft ? 0 : 1)][kingLeft ? 2 : 3]; n++) {
					var targetGrid = pieces[index].pos + (kingLeft ? 0 : 1) + directionOffsets[kingLeft ? 2 : 3] * (n + 1);
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != undefined) {
						if(targetPiece.isTeam(team == player ? enemy : player)) {
							if(targetPiece.isType(piece.king)) {
								if(attackingPiece) {
									kingIsPinned = true;
								}
							}
						}
						
						break;
					}
				}
				
				if(!kingIsPinned) {
					rPawn.enPassantTo = pieces[index].pos + (team == player ? 8 : -8);
					rPawn.enPassantCapture = index;
				}
			}
		}
		
		if(isPromoting) {
			var promotionType = piece.queen;
			
			switch(promotionSelection[(pieces[index].team == player ? "player" : "enemy")]) {
				case 0:
					promotionType = piece.queen;
				break;
				case 1:
					promotionType = piece.rook;
				break;
				case 2:
					promotionType = piece.bishop;
				break;
				case 3:
					promotionType = piece.knight;
				break;
				default:
					promotionType = piece.queen;
				break;
			}
			
			pieces[index].changeType(promotionType);
			
			board.material[pieces[index].team] += getPieceValue(pieces[index].type);
		}
		
		if(useAnimation && i == moveString.length - 1) {
			var f = grids[fromGrid];
			var t = grids[toGrid];
			
			pieces.forEach(p => {
				p.offset.x = 0;
				p.offset.y = 0;
			});
			
			var animationFrame = 0;
			var animationLength = 10;
			
			anim();
			
			function anim() {
				if(animationFrame < animationLength) {
					requestAnimationFrame(anim);
				}
				else {
					pieces.forEach(p => {
						p.offset.x = 0;
						p.offset.y = 0;
					});
				}
				
				pieces[index].offset.x = lerp(f.x - t.x, 0, animationFrame / animationLength);
				pieces[index].offset.y = lerp(f.y - t.y, 0, animationFrame / animationLength);
				
				animationFrame++;
			}
		}
		
		if(!noCapture) {
			pieces[captureIndex].captured = true;
			
			// updates position key
			
			hashPiece(board, pieces[captureIndex].type, pieces[captureIndex].team, pieces[captureIndex].pos);
			
			material[pieces[captureIndex].team] -= getPieceValue(pieces[captureIndex].type) + ((pieces[captureIndex].isTeam(player)) ? _map[mirrorIndex[pieces[captureIndex].pos]] : _map[pieces[captureIndex].pos]);
		}
	}
	
	/*
	if(board.repetitionMoveHistory[board.posKey] == null) {
		board.repetitionMoveHistory[board.posKey] = 0;
	}
	
	board.repetitionMoveHistory[board.posKey]++;
	*/
	
	board.totalMoves++;
	
	return pieces;
}

function unMakeMove(board, moveString) {
	var { pieces, pieceGrid, material } = board;
	
	var _v = [
		pawnValue,
		bishopValue,
		knightValue,
		rookValue,
		queenValue,
		0
	];
	
	var _map;
	
	// board.repetitionMoveHistory[board.posKey]--;
	
	for(var i = 0; i < moveString.length; i++) {
		var index = PIECEINDEX(moveString[i]);
		var fromGrid = FROMSQUARE(moveString[i]);
		var toGrid = TOSQUARE(moveString[i]);
		var captureIndex = CAPTUREINDEX(moveString[i]);
		var isPromoting = ISPROMOTING(moveString[i]);
		var noCapture = NOCAPTURE(moveString[i]);
		
		switch(pieces[index].type) {
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
		
		var type = pieces[index].type;
		var team = pieces[index].team;
		
		if(isPromoting) {
			board.material[pieces[index].team] -= getPieceValue(pieces[index].type);
			
			pieces[index].changeType(piece.pawn);
		}
		
		pieces[index].pos = fromGrid;
		if(pieces[index].isMoving) {
			pieces[index].hasMoved = false;
			pieces[index].isMoving = false;
		}
		
		pieceGrid[toGrid] = undefined;
		pieceGrid[fromGrid] = pieces[index];
		
		// updates position key
		
		hashPiece(board, type, team, toGrid);
		hashPiece(board, type, team, fromGrid);
		
		material[pieces[index].team] -= ((pieces[index].isTeam(player)) ? _map[mirrorIndex[toGrid]] : _map[toGrid]);
		
		material[pieces[index].team] += ((pieces[index].isTeam(player)) ? _map[mirrorIndex[fromGrid]] : _map[fromGrid]);
		
		if(pieceGrid[toGrid - 1] != undefined) {
			pieceGrid[toGrid - 1].enPassantTo = 0;
			pieceGrid[toGrid - 1].enPassantCapture = -1;
		}
		if(pieceGrid[toGrid + 1] != undefined) {
			pieceGrid[toGrid + 1].enPassantTo = 0;
			pieceGrid[toGrid + 1].enPassantCapture = -1;
		}
		
		if(!noCapture) {
			pieces[captureIndex].captured = false;
			
			pieceGrid[pieces[captureIndex].pos] = pieces[captureIndex];
			
			// updates position key
			
			hashPiece(board, pieces[captureIndex].type, pieces[captureIndex].team, pieces[captureIndex].pos);
			
			material[pieces[captureIndex].team] += _v[pieces[captureIndex].type] + ((pieces[captureIndex].isTeam(player)) ? _map[mirrorIndex[pieces[captureIndex].pos]] : _map[pieces[captureIndex].pos]);
		}
	}
	
	board.totalMoves--;
	
	return pieces;
}