function addMvvlvaScore(victimIndex, attackerType) {
	moveScores.push(victimIndex == -1 ? 0 : (mvvlvaScores[board.pieces[victimIndex].type] * 12 + attackerType + 1000000));
}

function generateMoves(board, team, generateCastlingMoves = true, onlyGenerateCaptures = false) {
	var { pieces, pieceGrid, kingIndex, attackingGridEval } = board;
	
	var moves = [];
	moveScores = [];
	
	attackingGridEval[team] = 0;
	
	var isInCheck = false;
	var hasBeenChecked = false;
	var isDoubleCheck = false;
	var checkingGrid = [
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0
	];
	var attackingGrid = [
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0
	];
	var enPassantInCheckGrid = [
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0
	];
	
	var scannedGrids = [];
	var friendlyPiece = null;
	var enemyTeam = team == player ? enemy : player;
	
	var kingIndex = kingIndex[team == player ? "player" : "enemy"];
	
	var king = pieces[kingIndex];
	
	for(var j = 0; j < pieces.length; j++) {
		var p = pieces[j];
		
		var pos = p.pos;
		
		if(!p.capture && p.isTeam(enemyTeam)) {
			if(p.isType(piece.pawn)) {
				var lTargetGrid = pos + (enemyTeam == player ? -9 : 7);
				var rTargetGrid = pos + (enemyTeam == player ? -7 : 9);
				
				if(pos % 8 - 1 >= 0 && lTargetGrid >= 0 && lTargetGrid < 64) {
					attackingGrid[lTargetGrid] = 1;
					
					if(king.pos == lTargetGrid) {
						if(isInCheck) {
							isDoubleCheck = true;
						}
						
						if(!isDoubleCheck) {
							isInCheck = true;
							hasBeenChecked = true;
						}
						
						checkingGrid[pos] = 1;
						enPassantInCheckGrid[pos + (enemyTeam == player ? 8 : -8)] = 1;
					}
				}
				if(pos % 8 + 1 < 8 && rTargetGrid >= 0 && rTargetGrid < 64) {
					attackingGrid[rTargetGrid] = 1;
					
					if(king.pos == rTargetGrid) {
						if(isInCheck) {
							isDoubleCheck = true;
						}
						
						if(!isDoubleCheck) {
							isInCheck = true;
							hasBeenChecked = true;
						}
						
						checkingGrid[pos] = 1;
						enPassantInCheckGrid[pos + (enemyTeam == player ? 8 : -8)] = 1;
					}
				}
			}
			if(p.isType(piece.knight)) {
				for(var i = 0; i < knightDir.length; i++) {
					var targetGrid = pos + knightDir[i][0];
					
					if(pos % 8 + knightDir[i][1] >= 0 && pos % 8 + knightDir[i][1] < 8 &&
					targetGrid >= 0 && targetGrid < 64) {
						attackingGrid[targetGrid] = 1;
						
						if(king.pos == targetGrid) {
							if(isInCheck) {
								isDoubleCheck = true;
							}
							
							if(!isDoubleCheck) {
								isInCheck = true;
								hasBeenChecked = true;
							}
							
							checkingGrid[pos] = 1;
						}
					}
				}
			}
			if(p.isType(piece.king)) {
				for(var i = 0; i < kingDir.length; i++) {
					var targetGrid = pos + kingDir[i][0];
					
					if(pos % 8 + kingDir[i][1] >= 0 &&
					pos % 8 + kingDir[i][1] < 8 && targetGrid >= 0 && targetGrid < 64) {
						attackingGrid[targetGrid] = 1;
					}
				}
			}
			if(p.isSlidingPiece()) {
				var startDirIndex = (p.isType(piece.bishop)) ? 4 : 0;
				var endDirIndex = (p.isType(piece.rook)) ? 4 : 8;
				
				hasBeenChecked = false;
				var scannedGrids = [];
				var opponentPiece;
				
	for(var i = startDirIndex; i < endDirIndex; i++) {
		opponentPiece = undefined;
		hasBeenChecked = false;
		scannedGrids = [];
		
		for(var n = 0; n < distToEdge[pos][i]; n++) {
			var targetGrid = pos + directionOffsets[i] * (n + 1);
			var targetPiece = pieceGrid[targetGrid];
			
			if(targetPiece != undefined) {
				if(targetPiece.isTeam(team)) {
					if(targetPiece.isType(piece.king)) {
						if(opponentPiece != undefined) {
							opponentPiece.isPinned = true;
							
							opponentPiece.canMoveTo = [
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0, 0, 0, 0, 0
							];
							
							scannedGrids.forEach(index => {
								opponentPiece.canMoveTo[index] = 1;
							});
							
							opponentPiece.canMoveTo[pos] = 1;
						}
						else {
							if(isInCheck) {
								isDoubleCheck = true;
							}
							
							if(!isDoubleCheck) {
								isInCheck = true;
								hasBeenChecked = true;
							}
							
							checkingGrid[pos] = 1;
						}
					}
					else {
						if(opponentPiece != undefined) {
							targetPiece.isPinned = false;
							targetPiece.canMoveTo = [
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1
							];
							
							opponentPiece.isPinned = false;
							opponentPiece.canMoveTo = [
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1,
								1, 1, 1, 1, 1, 1, 1, 1
							];
							
							opponentPiece = undefined;
							
							break;
						}
						
						opponentPiece = targetPiece;
						opponentPiece.isPinned = false;
						
						opponentPiece.canMoveTo = [
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
				}
				else {
					attackingGrid[targetGrid] = 1;
					
					break;
				}
			}
			else {
				if(opponentPiece == undefined) {
					attackingGrid[targetGrid] = 1;
				}
				
				if(!hasBeenChecked) {
					scannedGrids.push(targetGrid);
				}
			}
		}
		
		if(hasBeenChecked) {
			scannedGrids.forEach(index => {
				checkingGrid[index] = 1;
			});
		}
	}
			}
		}
	}
	
	/*
	for(var i = 0; i < attackingGrid.length; i++) {
		if(attackingGrid[i]) {
			grids[i].glyph = 0;
		}
	}
	
	for(var i = 0; i < checkingGrid.length; i++) {
		if(checkingGrid[i]) {
			grids[i].glyph = 5;
		}
	}
	*/
	
	// main move generation
	
	for(var i = 0; i < pieces.length; i++) {
		pieces[i].isMoving = false;
		
		if(pieces[i].isTeam(team) && !pieces[i].captured) {
			if(pieces[i].isSlidingPiece() && !isDoubleCheck) {
				moves = generateSlidingMoves(board, pieces[i].pos, i, moves, checkingGrid, isInCheck, onlyGenerateCaptures);
			}
			if(pieces[i].isType(piece.pawn) && !isDoubleCheck) {
				if(pieces[i].enPassantCapture != -1) {
					if(!isInCheck || (isInCheck && enPassantInCheckGrid[pieces[i].enPassantTo])) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && pieces[i].enPassantCapture != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								pieces[i].enPassantTo,
								pieces[i].enPassantCapture,
								0,
								0
							)]);
						}
					}
				}
				
				var dirOffset = (pieces[i].isTeam(player)) ? -8 : 8;
				
				var targetGrid = pieces[i].pos + dirOffset;
				
				if(targetGrid >= 0 && targetGrid < 64) {
					var _c = false;
					var _c2 = false;
					var Ctl = -1;
					var Ctr = -1;
					
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != null && !targetPiece.captured) {
						targetGridPiece = targetPiece.index;
						_c = true;
					}
					if(pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)] != null && !pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)].captured) {
						targetGridPiece = pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)].index;
						_c2 = true;
					}
					if(pieceGrid[targetGrid - 1] != null && !pieceGrid[targetGrid - 1].isTeam(pieces[i].team) && !pieceGrid[targetGrid - 1].captured && targetGrid % 8 - 1 >= 0) {
						Ctl = pieceGrid[targetGrid - 1].index;
					}
					if(pieceGrid[targetGrid + 1] != null && !pieceGrid[targetGrid + 1].isTeam(pieces[i].team) && !pieceGrid[targetGrid + 1].captured && targetGrid % 8 + 1 < 8) {
						Ctr = pieceGrid[targetGrid + 1].index;
					}
					
					if(!_c) {
						if(!isInCheck) {
							if(pieces[i].canMoveTo[targetGrid] && !onlyGenerateCaptures) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid,
									-1,
									((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
									0
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
						else {
							if(pieces[i].canMoveTo[targetGrid] && checkingGrid[targetGrid] && !onlyGenerateCaptures) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid,
									-1,
									((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
									0
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
						
						// double pawns
						
						if(!_c2 && ((pieces[i].isTeam(player) && pieces[i].pos >= 48) || (pieces[i].isTeam(enemy) && pieces[i].pos < 16))) {
							var doublePawnOffset = (pieces[i].isTeam(player)) ? -8 : 8
							
							if(!isInCheck) {
								if(pieces[i].canMoveTo[targetGrid + doublePawnOffset] && !onlyGenerateCaptures) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid + doublePawnOffset,
										-1,
										0,
										0
									)]);
									
									addMvvlvaScore(-1, pieces[i].type);
								}
							}
							else {
								if(pieces[i].canMoveTo[targetGrid + doublePawnOffset] && checkingGrid[targetGrid + doublePawnOffset] && !onlyGenerateCaptures) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid + doublePawnOffset,
										-1,
										0,
										0
									)]);
									
									addMvvlvaScore(-1, pieces[i].type);
								}
							}
						}
					}
					if(Ctl != -1) {
						if(!isInCheck) {
							if(pieces[i].canMoveTo[targetGrid - 1]) {
								if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid - 1,
										Ctl,
										((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
										0
									)]);
									
									addMvvlvaScore(Ctl, pieces[i].type);
								}
							}
						}
						else {
							if(pieces[i].canMoveTo[targetGrid - 1] && checkingGrid[targetGrid - 1]) {
								if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid - 1,
										Ctl,
										((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
										0
									)]);
									
									addMvvlvaScore(Ctl, pieces[i].type);
								}
							}
						}
					}
					if(Ctr != -1) {
						if(!isInCheck) {
							if(pieces[i].canMoveTo[targetGrid + 1]) {
								if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid + 1,
										Ctr,
										((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
										0
									)]);
									
									addMvvlvaScore(Ctr, pieces[i].type);
								}
							}
						}
						else {
							if(pieces[i].canMoveTo[targetGrid + 1] && checkingGrid[targetGrid + 1]) {
								if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
									moves.push([Move(
										i,
										pieces[i].pos,
										targetGrid + 1,
										Ctr,
										((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
										0
									)]);
									
									addMvvlvaScore(Ctr, pieces[i].type);
								}
							}
						}
					}
				}
			}
			if(pieces[i].isType(piece.knight) && !pieces[i].isPinned && !isDoubleCheck) {
				var t = pieces[i].pos - 16;
				var l = pieces[i].pos - 2;
				var r = pieces[i].pos + 2;
				var b = pieces[i].pos + 16;
				var tl = t - 1, ctl = false, Ctl = -1, tr = t + 1, ctr = false, Ctr = -1;
				var lt = l - 8, clt = false, Clt = -1, lb = l + 8, clb = false, Clb = -1;
				var rt = r - 8, crt = false, Crt = -1, rb = r + 8, crb = false, Crb = -1;
				var bl = b - 1, cbr = false, Cbr = -1, br = b + 1, cbl = false, Cbl = -1;
				
				if(pieceGrid[tl] != null) {
					ctl = true;
					
					if(!pieceGrid[tl].isTeam(team)) {
						Ctl = pieceGrid[tl].index;
					}
				}
				if(pieceGrid[tr] != null) {
					ctr = true;
					
					if(!pieceGrid[tr].isTeam(team)) {
						Ctr = pieceGrid[tr].index;
					}
				}
				if(pieceGrid[lt] != null) {
					clt = true;
					
					if(!pieceGrid[lt].isTeam(team)) {
						Clt = pieceGrid[lt].index;
					}
				}
				if(pieceGrid[lb] != null) {
					clb = true;
					
					if(!pieceGrid[lb].isTeam(team)) {
						Clb = pieceGrid[lb].index;
					}
				}
				if(pieceGrid[rt] != null) {
					crt = true;
					
					if(!pieceGrid[rt].isTeam(team)) {
						Crt = pieceGrid[rt].index;
					}
				}
				if(pieceGrid[rb] != null) {
					crb = true;
					
					if(!pieceGrid[rb].isTeam(team)) {
						Crb = pieceGrid[rb].index;
					}
				}
				if(pieceGrid[bl] != null) {
					cbl = true;
					
					if(!pieceGrid[bl].isTeam(team)) {
						Cbl = pieceGrid[bl].index;
					}
				}
				if(pieceGrid[br] != null) {
					cbr = true;
					
					if(!pieceGrid[br].isTeam(team)) {
						Cbr = pieceGrid[br].index;
					}
				}
				
				if((!ctl || Ctl != -1) && tl >= 0 && tl < 64 && t % 8 - 1 >= 0 && t >= 0) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[tl]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									tl,
									Ctl,
									0,
									0
								)]);
								
								addMvvlvaScore(Ctl, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[tl] && checkingGrid[tl]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									tl,
									Ctl,
									0,
									0
								)]);
								
								addMvvlvaScore(Ctl, pieces[i].type);
							}
						}
					}
				}
				if((!ctr || Ctr != -1) && tr >= 0 && tr < 64 && t % 8 + 1 < 8 && t >= 0) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[tr]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									tr,
									Ctr,
									0,
									0
								)]);
								
								addMvvlvaScore(Ctr, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[tr] && checkingGrid[tr]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									tr,
									Ctr,
									0,
									0
								)]);
								
								addMvvlvaScore(Ctr, pieces[i].type);
							}
						}
					}
				}
				if((!clt || Clt != -1) && lt >= 0 && lt < 64 && pieces[i].pos % 8 - 2 >= 0) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[lt]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clt != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									lt,
									Clt,
									0,
									0
								)]);
								
								addMvvlvaScore(Clt, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[lt] && checkingGrid[lt]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clt != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									lt,
									Clt,
									0,
									0
								)]);
								
								addMvvlvaScore(Clt, pieces[i].type);
							}
						}
					}
				}
				if((!clb || Clb != -1) && lb >= 0 && lb < 64 && pieces[i].pos % 8 - 2 >= 0) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[lb]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clb != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									lb,
									Clb,
									0,
									0
								)]);
								
								addMvvlvaScore(Clb, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[lb] && checkingGrid[lb]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clb != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									lb,
									Clb,
									0,
									0
								)]);
								
								addMvvlvaScore(Clb, pieces[i].type);
							}
						}
					}
				}
				if((!crt || Crt != -1) && rt >= 0 && rt < 64 && pieces[i].pos % 8 + 2 < 8) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[rt]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crt != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									rt,
									Crt,
									0,
									0
								)]);
								
								addMvvlvaScore(Crt, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[rt] && checkingGrid[rt]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crt != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									rt,
									Crt,
									0,
									0
								)]);
								
								addMvvlvaScore(Crt, pieces[i].type);
							}
						}
					}
				}
				if((!crb || Crb != -1) && rb >= 0 && rb < 64 && pieces[i].pos % 8 + 2 < 8) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[rb]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crb != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									rb,
									Crb,
									0,
									0
								)]);
								
								addMvvlvaScore(Crb, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[rb] && checkingGrid[rb]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crb != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									rb,
									Crb,
									0,
									0
								)]);
								
								addMvvlvaScore(Crb, pieces[i].type);
							}
						}
					}
				}
				if((!cbl || Cbl != -1) && bl >= 0 && bl < 64 && b % 8 - 1 >= 0 && b < 64) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[bl]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbl != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									bl,
									Cbl,
									0,
									0
								)]);
								
								addMvvlvaScore(Cbl, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[bl] && checkingGrid[bl]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbl != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									bl,
									Cbl,
									0,
									0
								)]);
								
								addMvvlvaScore(Cbl, pieces[i].type);
							}
						}
					}
				}
				if((!cbr || Cbr != -1) && br >= 0 && br < 64 && b % 8 + 1 < 8 && b < 64) {
					if(!isInCheck) {
						if(pieces[i].canMoveTo[br]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbr != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									br,
									Cbr,
									0,
									0
								)]);
								
								addMvvlvaScore(Cbr, pieces[i].type);
							}
						}
					}
					else {
						if(pieces[i].canMoveTo[br] && checkingGrid[br]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbr != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									br,
									Cbr,
									0,
									0
								)]);
								
								addMvvlvaScore(Cbr, pieces[i].type);
							}
						}
					}
				}
			}
			if(pieces[i].isType(piece.king)) {
				if(generateCastlingMoves) {
					var rooks = [-1, -1];
					
					if(team == player) {
						if(pieceGrid[56] != null && pieceGrid[56].isType(piece.rook) && pieceGrid[56].isTeam(player)) {
							rooks[0] = pieceGrid[56].index;
						}
						if(pieceGrid[63] != null && pieceGrid[63].isType(piece.rook) && pieceGrid[63].isTeam(player)) {
							rooks[1] = pieceGrid[63].index;
						}
					}
					if(team == enemy) {
						if(pieceGrid[0] != null && pieceGrid[0].isType(piece.rook) && pieceGrid[0].isTeam(enemy)) {
							rooks[0] = pieceGrid[0].index;
						}
						if(pieceGrid[7] != null && pieceGrid[7].isType(piece.rook) && pieceGrid[7].isTeam(enemy)) {
							rooks[1] = pieceGrid[7].index;
						}
					}
					
					// castling
					if(!onlyGenerateCaptures) {
						/*
						if(canCastle(board, team, "short")) {
							moves.push([Move(
								i,
								pieces[i].pos,
								pieces[i].pos + 2,
								-1,
								0,
								1
							), Move(
								rooks[1],
								pieces[rooks[1]].pos,
								pieces[i].pos + 1,
								-1,
								0,
								1
							)]);
						}
						if(canCastle(board, team, "long")) {
							moves.push([Move(
								i,
								pieces[i].pos,
								pieces[i].pos - 2,
								-1,
								0,
								1
							), Move(
								rooks[0],
								pieces[rooks[0]].pos,
								pieces[i].pos - 1,
								-1,
								0,
								1
							)]);
						}
						*/
						
						if(team == player &&
						pieceGrid[60] != undefined && pieceGrid[60].isType(piece.king) && pieceGrid[60].isTeam(player) && !isGridAttacked(board, 60, player)) {
							if(pieceGrid[61] == undefined && pieceGrid[62] == undefined &&
							!isGridAttacked(board, 61, player) && !isGridAttacked(board, 62, player) &&
							pieceGrid[63] != undefined && pieceGrid[63].isType(piece.rook) && pieceGrid[63].isTeam(player) &&
							board.castlePerm & castleBit.wk) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos + 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[63].index,
									pieceGrid[63].pos,
									pieces[i].pos + 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
							
							if(pieceGrid[59] == undefined && pieceGrid[58] == undefined && pieceGrid[57] == undefined &&
							!isGridAttacked(board, 59, player) && !isGridAttacked(board, 58, player) &&
							pieceGrid[56] != undefined && pieceGrid[56].isType(piece.rook) && pieceGrid[56].isTeam(player) &&
							board.castlePerm & castleBit.wq) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos - 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[56].index,
									pieceGrid[56].pos,
									pieces[i].pos - 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
						else if(team == enemy &&
						pieceGrid[4] != undefined && pieceGrid[4].isType(piece.king) && pieceGrid[4].isTeam(enemy) && !isGridAttacked(board, 4, enemy)) {
							if(pieceGrid[5] == undefined && pieceGrid[6] == undefined &&
							!isGridAttacked(board, 5, enemy) && !isGridAttacked(board, 6, enemy) &&
							pieceGrid[7] != undefined && pieceGrid[7].isType(piece.rook) && pieceGrid[7].isTeam(enemy) &&
							board.castlePerm & castleBit.bk) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos + 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[7].index,
									pieceGrid[7].pos,
									pieces[i].pos + 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
							
							if(pieceGrid[3] == undefined && pieceGrid[2] == undefined && pieceGrid[1] == undefined &&
							!isGridAttacked(board, 3, enemy) && !isGridAttacked(board, 2, player) &&
							pieceGrid[0] != undefined && pieceGrid[0].isType(piece.rook) && pieceGrid[0].isTeam(enemy) &&
							board.castlePerm & castleBit.bq) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos - 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[0].index,
									pieceGrid[0].pos,
									pieces[i].pos - 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
					}
				}
				for(var dirIndex = 0; dirIndex < 8; dirIndex++) {
					var targetGrid = pieces[i].pos + directionOffsets[dirIndex];
					if(targetGrid >= 0 && targetGrid < 64) {
						var targetGridPiece = -1;
						
						var targetPiece = pieceGrid[targetGrid];
						if(targetPiece != null && !targetPiece.captured) {
							targetGridPiece = targetPiece.index;
						}
						
						var _c = false;
						
						if(targetGridPiece != -1 && pieces[targetGridPiece].isTeam(pieces[i].team) && !pieces[targetGridPiece].captured) {
							_c = true;
						}
						
						var normalizedDir = (directionOffsets[dirIndex] == 1 || directionOffsets[dirIndex] == 9 || directionOffsets[dirIndex] == -7) ? 1 : -1;
						
						if(directionOffsets[dirIndex] % 8 != 0) {
							if(pieces[i].pos % 8 + normalizedDir >= 8) {
								_c = true;
							}
							if(pieces[i].pos % 8 + normalizedDir < 0) {
								_c = true;
							}
						}
						
						if(!_c &&
						!attackingGrid[targetGrid]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && targetGridPiece != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid,
									(targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[i].team) ? targetGridPiece : -1,
									0,
									0
								)]);
								
								addMvvlvaScore((targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[i].team) ? targetGridPiece : -1, pieces[i].type);
							}
						}
					}
				}
			}
			pieces[i].isPinned = false;
			
			pieces[i].canMoveTo = [
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
	}
	
	return moves;
}

function generateSlidingMoves(board, pos, index, moves, checkingGrid, isInCheck, onlyGenerateCaptures) {
	var { pieces, pieceGrid, attackingGridEval } = board;
	
	var startDirIndex = (pieces[index].isType(piece.bishop)) ? 4 : 0;
	var endDirIndex = (pieces[index].isType(piece.rook)) ? 4 : 8;
	
	for(var i = startDirIndex; i < endDirIndex; i++) {
		for(var n = 0; n < distToEdge[pos][i]; n++) {
			var targetGrid = pos + directionOffsets[i] * (n + 1);
			var targetGridPiece = -1;
			
			// evaluates total attacking squares
			
			if(pieces[index].isType(piece.bishop)) {
				attackingGridEval[pieces[index].team] += 1;
			}
			
			if(pieces[index].isType(piece.rook)) {
				if(i == 0 || i == 1) {
					attackingGridEval[pieces[index].team] += 0.1;
				}
			}
			
			if(pieceGrid[targetGrid] != null && !pieceGrid[targetGrid].captured) {
				targetGridPiece = pieceGrid[targetGrid].index;
			}
			
			if(targetGridPiece != -1 && pieces[targetGridPiece].isTeam(pieces[index].team) && !pieces[targetGridPiece].captured) {
				break;
			}
			
			if(!isInCheck) {
				if(pieces[index].canMoveTo[targetGrid]) {
					if(!onlyGenerateCaptures || (onlyGenerateCaptures && targetGridPiece != -1)) {
						moves.push([Move(
							index,
							pieces[index].pos,
							targetGrid,
							(targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1,
							0,
							0
						)]);
						
						addMvvlvaScore((targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1, pieces[index].type);
					}
				}
			}
			else {
				if(checkingGrid[targetGrid] && pieces[index].canMoveTo[targetGrid]) {
					if(!onlyGenerateCaptures || (onlyGenerateCaptures && targetGridPiece != -1)) {
						moves.push([Move(
							index,
							pieces[index].pos,
							targetGrid,
							(targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1,
							0,
							0
						)]);
						
						addMvvlvaScore((targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1, pieces[index].type);
					}
				}
			}
			
			if(targetGridPiece != -1 && !pieces[targetGridPiece].isTeam(pieces[index].team) && !pieces[targetGridPiece].captured) {
				break;
			}
		}
	}
	
	return moves;
}

function orderMoves(board, moves) {
	var { pieces, promotionSelection, turn, pieceGrid } = board;
	/*
	var sortedMoves = new Array(64);
	var newMoves = [];
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		
		var index = PIECEINDEX(move[0]);
		var fromGrid = FROMSQUARE(move[0]);
		var toGrid = TOSQUARE(move[0]);
		var captureIndex = CAPTUREINDEX(move[0]);
		var isPromoting = ISPROMOTING(move[0]);
		var noCapture = NOCAPTURE(move[0]);
		
		var moveScoreGuess = 0;
		var movePieceType = pieces[index].type;
		var capturePieceType = 0;
		var pos = pieces[index].pos;
		var team = pieces[index].team;
		var enemyTeam = team == player ? enemy : player;
		
		if(captureIndex != -1) {
			capturePieceType = pieces[captureIndex].type;
			
			moveScoreGuess += getPieceValue(capturePieceType) - getPieceValue(movePieceType);
		}
		
		moveScoreGuess += [pawnMap, bishopMap, knightMap, rookMap, queenMap, kingMap][movePieceType][toGrid];
		
		var lPawn = pieceGrid[pos + (team == player ? -9 : 7)];
		var rPawn = pieceGrid[pos + (team == player ? -7 : 9)];
		
		if(pos % 8 - 1 >= 0 &&
		lPawn != undefined && lPawn.isType(piece.pawn) && lPawn.isTeam(enemyTeam)) {
			moveScoreGuess -= getPieceValue(pieces[index]) / 10;
		}
		
		if(pos % 8 + 1 < 8 &&
		rPawn != undefined && rPawn.isType(piece.pawn) && rPawn.isTeam(enemyTeam)) {
			moveScoreGuess -= getPieceValue(pieces[index]) / 10;
		}
		
		if(isPromoting) {
			var selection = promotionSelection[turn == player ? "player" : "enemy"];
			
			moveScoreGuess += getPieceValue([piece.queen, piece.rook, piece.bishop, piece.knight][selection]);
		}
		
		sortedMoves.splice(50 - moveScoreGuess, 0, move);
		
		moveScoreGuess = 0;
		movePieceType = 0;
		capturePieceType = 0;
	}
	
	sortedMoves.forEach(value => {
		if(value != null) newMoves.push(value);
	});
	*/
	
	var newMoves = [];
	var newMoveScores = [];
	
	var iteration = moveScores.length;
	
	for(var i = 0; i < iteration; i++) {
		var bestScore = -Infinity;
		var bestIndex = 0;
		
		for(var j = 0; j < moveScores.length; j++) {
			if(moveScores[j] > bestScore) {
				bestScore = moveScores[j];
				bestIndex = j;
			}
		}
		
		newMoves.push(moves[bestIndex]);
		newMoveScores.push(moveScores[bestIndex]);
		
		moves.splice(bestIndex, 1);
		moveScores.splice(bestIndex, 1);
	}
	
	moveScores = newMoveScores;
	
	return newMoves;
}

function generatePseudoLegalMoves(board, team, generateCastlingMoves = true, onlyGenerateCaptures = false) {
	var { pieces, pieceGrid, kingIndex, attackingGridEval } = board;
	
	var moves = [];
	moveScores = [];
	
	// main move generation
	
	for(var i = 0; i < pieces.length; i++) {
		pieces[i].isMoving = false;
		
		if(pieces[i].isTeam(team) && !pieces[i].captured) {
			if(pieces[i].isSlidingPiece()) {
				moves = generatePseudoLegalSlidingMoves(board, pieces[i].pos, i, moves, onlyGenerateCaptures);
			}
			if(pieces[i].isType(piece.pawn)) {
				if(pieces[i].enPassantCapture != -1) {
					if(!onlyGenerateCaptures || (onlyGenerateCaptures && pieces[i].enPassantCapture != -1)) {
						moves.push([Move(
							i,
							pieces[i].pos,
							pieces[i].enPassantTo,
							pieces[i].enPassantCapture,
							0,
							0
						)]);
						
						addMvvlvaScore(pieces[i].enPassantCapture, pieces[i].type);
					}
				}
				
				var dirOffset = (pieces[i].isTeam(player)) ? -8 : 8;
				
				var targetGrid = pieces[i].pos + dirOffset;
				
				if(targetGrid >= 0 && targetGrid < 64) {
					var _c = false;
					var _c2 = false;
					var Ctl = -1;
					var Ctr = -1;
					
					var targetPiece = pieceGrid[targetGrid];
					
					if(targetPiece != null && !targetPiece.captured) {
						targetGridPiece = targetPiece.index;
						_c = true;
					}
					if(pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)] != null && !pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)].captured) {
						targetGridPiece = pieceGrid[targetGrid + (pieces[i].isTeam(player) ? -8 : 8)].index;
						_c2 = true;
					}
					if(pieceGrid[targetGrid - 1] != null && !pieceGrid[targetGrid - 1].isTeam(pieces[i].team) && !pieceGrid[targetGrid - 1].captured && targetGrid % 8 - 1 >= 0) {
						Ctl = pieceGrid[targetGrid - 1].index;
					}
					if(pieceGrid[targetGrid + 1] != null && !pieceGrid[targetGrid + 1].isTeam(pieces[i].team) && !pieceGrid[targetGrid + 1].captured && targetGrid % 8 + 1 < 8) {
						Ctr = pieceGrid[targetGrid + 1].index;
					}
					
					if(!_c) {
						if(pieces[i].canMoveTo[targetGrid] && !onlyGenerateCaptures) {
							moves.push([Move(
								i,
								pieces[i].pos,
								targetGrid,
								-1,
								((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
								0
							)]);
							
							addMvvlvaScore(-1, pieces[i].type);
						}
						
						// double pawns
						
						if(!_c2 && ((pieces[i].isTeam(player) && pieces[i].pos >= 48) || (pieces[i].isTeam(enemy) && pieces[i].pos < 16))) {
							var doublePawnOffset = (pieces[i].isTeam(player)) ? -8 : 8
							
							if(pieces[i].canMoveTo[targetGrid + doublePawnOffset] && !onlyGenerateCaptures) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid + doublePawnOffset,
									-1,
									0,
									0
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
					}
					if(Ctl != -1) {
						if(pieces[i].canMoveTo[targetGrid - 1]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid - 1,
									Ctl,
									((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
									0
								)]);
								
								addMvvlvaScore(Ctl, pieces[i].type);
							}
						}
					}
					if(Ctr != -1) {
						if(pieces[i].canMoveTo[targetGrid + 1]) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid + 1,
									Ctr,
									((pieces[i].isTeam(player) && targetGrid < 8) || (pieces[i].isTeam(enemy) && targetGrid >= 56) ? 1 : 0),
									0
								)]);
								
								addMvvlvaScore(Ctr, pieces[i].type);
							}
						}
					}
				}
			}
			if(pieces[i].isType(piece.knight)) {
				var t = pieces[i].pos - 16;
				var l = pieces[i].pos - 2;
				var r = pieces[i].pos + 2;
				var b = pieces[i].pos + 16;
				var tl = t - 1, ctl = false, Ctl = -1, tr = t + 1, ctr = false, Ctr = -1;
				var lt = l - 8, clt = false, Clt = -1, lb = l + 8, clb = false, Clb = -1;
				var rt = r - 8, crt = false, Crt = -1, rb = r + 8, crb = false, Crb = -1;
				var bl = b - 1, cbr = false, Cbr = -1, br = b + 1, cbl = false, Cbl = -1;
				
				if(pieceGrid[tl] != null) {
					ctl = true;
					
					if(!pieceGrid[tl].isTeam(team)) {
						Ctl = pieceGrid[tl].index;
					}
				}
				if(pieceGrid[tr] != null) {
					ctr = true;
					
					if(!pieceGrid[tr].isTeam(team)) {
						Ctr = pieceGrid[tr].index;
					}
				}
				if(pieceGrid[lt] != null) {
					clt = true;
					
					if(!pieceGrid[lt].isTeam(team)) {
						Clt = pieceGrid[lt].index;
					}
				}
				if(pieceGrid[lb] != null) {
					clb = true;
					
					if(!pieceGrid[lb].isTeam(team)) {
						Clb = pieceGrid[lb].index;
					}
				}
				if(pieceGrid[rt] != null) {
					crt = true;
					
					if(!pieceGrid[rt].isTeam(team)) {
						Crt = pieceGrid[rt].index;
					}
				}
				if(pieceGrid[rb] != null) {
					crb = true;
					
					if(!pieceGrid[rb].isTeam(team)) {
						Crb = pieceGrid[rb].index;
					}
				}
				if(pieceGrid[bl] != null) {
					cbl = true;
					
					if(!pieceGrid[bl].isTeam(team)) {
						Cbl = pieceGrid[bl].index;
					}
				}
				if(pieceGrid[br] != null) {
					cbr = true;
					
					if(!pieceGrid[br].isTeam(team)) {
						Cbr = pieceGrid[br].index;
					}
				}
				
				if((!ctl || Ctl != -1) && tl >= 0 && tl < 64 && t % 8 - 1 >= 0 && t >= 0) {
					if(pieces[i].canMoveTo[tl]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctl != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								tl,
								Ctl,
								0,
								0
							)]);
							
							addMvvlvaScore(Ctl, pieces[i].type);
						}
					}
				}
				if((!ctr || Ctr != -1) && tr >= 0 && tr < 64 && t % 8 + 1 < 8 && t >= 0) {
					if(pieces[i].canMoveTo[tr]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Ctr != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								tr,
								Ctr,
								0,
								0
							)]);
							
							addMvvlvaScore(Ctr, pieces[i].type);
						}
					}
				}
				if((!clt || Clt != -1) && lt >= 0 && lt < 64 && pieces[i].pos % 8 - 2 >= 0) {
					if(pieces[i].canMoveTo[lt]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clt != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								lt,
								Clt,
								0,
								0
							)]);
							
							addMvvlvaScore(Clt, pieces[i].type);
						}
					}
				}
				if((!clb || Clb != -1) && lb >= 0 && lb < 64 && pieces[i].pos % 8 - 2 >= 0) {
					if(pieces[i].canMoveTo[lb]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Clb != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								lb,
								Clb,
								0,
								0
							)]);
							
							addMvvlvaScore(Clb, pieces[i].type);
						}
					}
				}
				if((!crt || Crt != -1) && rt >= 0 && rt < 64 && pieces[i].pos % 8 + 2 < 8) {
					if(pieces[i].canMoveTo[rt]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crt != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								rt,
								Crt,
								0,
								0
							)]);
							
							addMvvlvaScore(Crt, pieces[i].type);
						}
					}
				}
				if((!crb || Crb != -1) && rb >= 0 && rb < 64 && pieces[i].pos % 8 + 2 < 8) {
					if(pieces[i].canMoveTo[rb]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Crb != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								rb,
								Crb,
								0,
								0
							)]);
							
							addMvvlvaScore(Crb, pieces[i].type);
						}
					}
				}
				if((!cbl || Cbl != -1) && bl >= 0 && bl < 64 && b % 8 - 1 >= 0 && b < 64) {
					if(pieces[i].canMoveTo[bl]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbl != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								bl,
								Cbl,
								0,
								0
							)]);
							
							addMvvlvaScore(Cbl, pieces[i].type);
						}
					}
				}
				if((!cbr || Cbr != -1) && br >= 0 && br < 64 && b % 8 + 1 < 8 && b < 64) {
					if(pieces[i].canMoveTo[br]) {
						if(!onlyGenerateCaptures || (onlyGenerateCaptures && Cbr != -1)) {
							moves.push([Move(
								i,
								pieces[i].pos,
								br,
								Cbr,
								0,
								0
							)]);
							
							addMvvlvaScore(Cbr, pieces[i].type);
						}
					}
				}
			}
			if(pieces[i].isType(piece.king)) {
				if(generateCastlingMoves) {
					var rooks = [-1, -1];
					
					if(team == player) {
						if(pieceGrid[56] != null && pieceGrid[56].isType(piece.rook) && pieceGrid[56].isTeam(player)) {
							rooks[0] = pieceGrid[56].index;
						}
						if(pieceGrid[63] != null && pieceGrid[63].isType(piece.rook) && pieceGrid[63].isTeam(player)) {
							rooks[1] = pieceGrid[63].index;
						}
					}
					if(team == enemy) {
						if(pieceGrid[0] != null && pieceGrid[0].isType(piece.rook) && pieceGrid[0].isTeam(enemy)) {
							rooks[0] = pieceGrid[0].index;
						}
						if(pieceGrid[7] != null && pieceGrid[7].isType(piece.rook) && pieceGrid[7].isTeam(enemy)) {
							rooks[1] = pieceGrid[7].index;
						}
					}
					
					// castling
					if(!onlyGenerateCaptures) {
						/*
						if(canCastle(board, team, "short")) {
							moves.push([Move(
								i,
								pieces[i].pos,
								pieces[i].pos + 2,
								-1,
								0,
								1
							), Move(
								rooks[1],
								pieces[rooks[1]].pos,
								pieces[i].pos + 1,
								-1,
								0,
								1
							)]);
						}
						if(canCastle(board, team, "long")) {
							moves.push([Move(
								i,
								pieces[i].pos,
								pieces[i].pos - 2,
								-1,
								0,
								1
							), Move(
								rooks[0],
								pieces[rooks[0]].pos,
								pieces[i].pos - 1,
								-1,
								0,
								1
							)]);
						}
						*/
						
						if(team == player &&
						pieceGrid[60] != undefined && pieceGrid[60].isType(piece.king) && pieceGrid[60].isTeam(player) && !isGridAttacked(board, 60, player)) {
							if(pieceGrid[61] == undefined && pieceGrid[62] == undefined &&
							!isGridAttacked(board, 61, player) && !isGridAttacked(board, 62, player) &&
							pieceGrid[63] != undefined && pieceGrid[63].isType(piece.rook) && pieceGrid[63].isTeam(player) &&
							board.castlePerm & castleBit.wk) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos + 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[63].index,
									pieceGrid[63].pos,
									pieces[i].pos + 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
							
							if(pieceGrid[59] == undefined && pieceGrid[58] == undefined && pieceGrid[57] == undefined &&
							!isGridAttacked(board, 59, player) && !isGridAttacked(board, 58, player) &&
							pieceGrid[56] != undefined && pieceGrid[56].isType(piece.rook) && pieceGrid[56].isTeam(player) &&
							board.castlePerm & castleBit.wq) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos - 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[56].index,
									pieceGrid[56].pos,
									pieces[i].pos - 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
						else if(team == enemy &&
						pieceGrid[4] != undefined && pieceGrid[4].isType(piece.king) && pieceGrid[4].isTeam(enemy) && !isGridAttacked(board, 4, enemy)) {
							if(pieceGrid[5] == undefined && pieceGrid[6] == undefined &&
							!isGridAttacked(board, 5, enemy) && !isGridAttacked(board, 6, enemy) &&
							pieceGrid[7] != undefined && pieceGrid[7].isType(piece.rook) && pieceGrid[7].isTeam(enemy) &&
							board.castlePerm & castleBit.bk) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos + 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[7].index,
									pieceGrid[7].pos,
									pieces[i].pos + 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
							
							if(pieceGrid[3] == undefined && pieceGrid[2] == undefined && pieceGrid[1] == undefined &&
							!isGridAttacked(board, 3, enemy) && !isGridAttacked(board, 2, player) &&
							pieceGrid[0] != undefined && pieceGrid[0].isType(piece.rook) && pieceGrid[0].isTeam(enemy) &&
							board.castlePerm & castleBit.bq) {
								moves.push([Move(
									i,
									pieces[i].pos,
									pieces[i].pos - 2,
									-1,
									0,
									1
								), Move(
									pieceGrid[0].index,
									pieceGrid[0].pos,
									pieces[i].pos - 1,
									-1,
									0,
									1
								)]);
								
								addMvvlvaScore(-1, pieces[i].type);
							}
						}
					}
				}
				for(var dirIndex = 0; dirIndex < 8; dirIndex++) {
					var targetGrid = pieces[i].pos + directionOffsets[dirIndex];
					if(targetGrid >= 0 && targetGrid < 64) {
						var targetGridPiece = -1;
						
						var targetPiece = pieceGrid[targetGrid];
						if(targetPiece != null && !targetPiece.captured) {
							targetGridPiece = targetPiece.index;
						}
						
						var _c = false;
						
						if(targetGridPiece != -1 && pieces[targetGridPiece].isTeam(pieces[i].team) && !pieces[targetGridPiece].captured) {
							_c = true;
						}
						
						var normalizedDir = (directionOffsets[dirIndex] == 1 || directionOffsets[dirIndex] == 9 || directionOffsets[dirIndex] == -7) ? 1 : -1;
						
						if(directionOffsets[dirIndex] % 8 != 0) {
							if(pieces[i].pos % 8 + normalizedDir >= 8) {
								_c = true;
							}
							if(pieces[i].pos % 8 + normalizedDir < 0) {
								_c = true;
							}
						}
						
						if(!_c) {
							if(!onlyGenerateCaptures || (onlyGenerateCaptures && targetGridPiece != -1)) {
								moves.push([Move(
									i,
									pieces[i].pos,
									targetGrid,
									(targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[i].team) ? targetGridPiece : -1,
									0,
									0
								)]);
								
								addMvvlvaScore((targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[i].team) ? targetGridPiece : -1, pieces[i].type);
							}
						}
					}
				}
			}
		}
	}
	
	return moves;
}

function generatePseudoLegalSlidingMoves(board, pos, index, moves, onlyGenerateCaptures) {
	var { pieces, pieceGrid, attackingGridEval } = board;
	
	var startDirIndex = (pieces[index].isType(piece.bishop)) ? 4 : 0;
	var endDirIndex = (pieces[index].isType(piece.rook)) ? 4 : 8;
	
	for(var i = startDirIndex; i < endDirIndex; i++) {
		for(var n = 0; n < distToEdge[pos][i]; n++) {
			var targetGrid = pos + directionOffsets[i] * (n + 1);
			var targetGridPiece = -1;
			
			if(pieceGrid[targetGrid] != null && !pieceGrid[targetGrid].captured) {
				targetGridPiece = pieceGrid[targetGrid].index;
			}
			
			if(targetGridPiece != -1 && pieces[targetGridPiece].isTeam(pieces[index].team) && !pieces[targetGridPiece].captured) {
				break;
			}
			
			if(pieces[index].canMoveTo[targetGrid]) {
				if(!onlyGenerateCaptures || (onlyGenerateCaptures && targetGridPiece != -1)) {
					moves.push([Move(
						index,
						pieces[index].pos,
						targetGrid,
						(targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1,
						0,
						0
					)]);
					
					addMvvlvaScore((targetGridPiece != -1 && pieces[targetGridPiece].team != pieces[index].team) ? targetGridPiece : -1, pieces[index].type);
				}
			}
			
			if(targetGridPiece != -1 && !pieces[targetGridPiece].isTeam(pieces[index].team) && !pieces[targetGridPiece].captured) {
				break;
			}
		}
	}
	
	return moves;
}