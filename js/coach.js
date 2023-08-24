var glyphRange = {
	best: [0, 1],
	good: [1, 20],
	inaccuracy: [20, 170],
	mistake: [170, 260],
	blunder: [260]
}

function setGlyphOnGrid(bestMoveList, move) {
	var { index, fromGrid, toGrid } = getMoveStringInfo(move[0]);
	var bestMoveInfo = getMoveStringInfo(bestMoveList[0].move[0]);
	var bestFrom = bestMoveInfo.fromGrid;
	var bestTo = bestMoveInfo.toGrid;
	var bestCapture = bestMoveInfo.captureIndex;
	var { pieces, pieceGrid, turn, kingIndex } = board;
	
	var moveIndex = 0;
	
	for(var i = 0; i < bestMoveList.length; i++) {
		var m = bestMoveList[i].move;
		
		if(move[0] == m[0]) {
			moveIndex = i;
			
			break;
		}
	}
	
	var moveEvaluation = bestMoveList[moveIndex].score;
	var displayEvaluation = `(${moveEvaluation > 0 ? "+" : ""}${(moveEvaluation / 1000).toFixed(1)})`;
	
	if(useEvalBar) {
		updateEvalBar(moveEvaluation);
	}
	
	if(bestMoveList[moveIndex].score != 0.5) {
		coachTotalMoves[turn == player ? enemy : player] += bestMoveList.length;
		coachTotalMoveInaccuracies[turn == player ? enemy : player] += bestMoveList.length - moveIndex;
	}
	
	updateCoachMessage("");
	
	var playerLegalMoves = generateMoves(board, player);
	var enemyLegalMoves = generateMoves(board, enemy);
	
	var playerGameOver = isGameOver(board, playerLegalMoves, player);
	var enemyGameOver = isGameOver(board, enemyLegalMoves, enemy);
	
	var firstSecondEngineDiff = 0;
	if(bestMoveList.length > 1) {
		firstSecondEngineDiff = Math.abs(bestMoveList[0].score - bestMoveList[1].score);
	}
	
	var scoreDiff = Math.abs(bestMoveList[0].score - bestMoveList[moveIndex].score);
	
	if(bestMoveList[moveIndex].score == 0.5) {
		grids[fromGrid].withGlyph = false;
		grids[fromGrid].glyph = -2;
		grids[toGrid].withGlyph = true;
		grids[toGrid].glyph = -2;
		
		updateCoachMessage("This is a book move!");
	}
	else if(playerGameOver.boolean || enemyGameOver.boolean) {
		var gameOverType = playerGameOver.boolean ? playerGameOver.type : enemyGameOver.type;
		var gameOverTeam = playerGameOver.boolean ? player : enemy;
		var winTeam = gameOverTeam == player ? enemy : player;
		
		grids[pieces[kingIndex[winTeam == player ? "player" : "enemy"]].pos].withGlyph = true;
		grids[pieces[kingIndex[winTeam == player ? "player" : "enemy"]].pos].glyph = 8;
		
		grids[pieces[kingIndex[gameOverTeam == player ? "player" : "enemy"]].pos].withGlyph = true;
		grids[pieces[kingIndex[gameOverTeam == player ? "player" : "enemy"]].pos].glyph = gameOverTeam == player ? 9 : 10;
		
		var accuracy = [];
		
		accuracy[player] = (coachTotalMoveInaccuracies[player] / coachTotalMoves[player]) * 100;
		accuracy[enemy] = (coachTotalMoveInaccuracies[enemy] / coachTotalMoves[enemy]) * 100;
		
		updateCoachMessage(`You've ${gameOverType == 0 ? "won the game" : "made the game a draw"}! The game has an accuracy of <b style="color: white; text-shadow: 0 1px black, 1px 0 black, 0 -1px black, -1px 0 black">${accuracy[player].toFixed(1)}</b> | <b style="color: black; text-shadow: 0 1px white, 1px 0 white, 0 -1px white, -1px 0 white">${accuracy[enemy].toFixed(1)}</b>!`);
	}
	else if(bestMoveList.length <= 1) {
		grids[fromGrid].withGlyph = false;
		grids[fromGrid].glyph = 7;
		grids[toGrid].withGlyph = true;
		grids[toGrid].glyph = 7;
	}
	else if(moveIndex == 0 && firstSecondEngineDiff >= 500 && firstSecondEngineDiff < 1000) {
		grids[fromGrid].withGlyph = false;
		grids[fromGrid].glyph = 0;
		grids[toGrid].withGlyph = true;
		grids[toGrid].glyph = 0;
		
		board.moveHistory[board.moveHistory.length - 1] += "!";
		
		updateCoachMessage(`That is a great move! There is only one good move and you found it! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
	}
	else if(moveIndex == 0 && firstSecondEngineDiff >= 1000) {
		grids[fromGrid].withGlyph = false;
		grids[fromGrid].glyph = 6;
		grids[toGrid].withGlyph = true;
		grids[toGrid].glyph = 6;
		
		board.moveHistory[board.moveHistory.length - 1] += "!!";
		
		updateCoachMessage(`That is a brilliant move! There is only one good move and you found it! <span style="opacity: 0.3">${(displayEvaluation)}</span>`)
	}
	else {
		var best = [
			glyphRange.best[0],
			glyphRange.best[1] + firstSecondEngineDiff
		];
		var good = [
			glyphRange.good[0] + firstSecondEngineDiff,
			glyphRange.good[1] + firstSecondEngineDiff
		];
		var inaccuracy = [
			glyphRange.inaccuracy[0] + firstSecondEngineDiff,
			glyphRange.inaccuracy[1] + firstSecondEngineDiff
		];
		var mistake = [
			glyphRange.mistake[0] + firstSecondEngineDiff,
			glyphRange.mistake[1] + firstSecondEngineDiff
		];
		var blunder = [
			glyphRange.blunder[0] + firstSecondEngineDiff
		];
		
		if(scoreDiff >= best[0] && scoreDiff < best[1]) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 1;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 1;
		}
		else if(scoreDiff >= good[0] && scoreDiff < good[1]) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 2;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 2;
		}
		else if(scoreDiff >= inaccuracy[0] && scoreDiff < inaccuracy[1]) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 3;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 3;
			
			board.moveHistory[board.moveHistory.length - 1] += "?!";
		}
		else if(scoreDiff >= mistake[0] && scoreDiff < mistake[1]) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 4;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 4;
			
			board.moveHistory[board.moveHistory.length - 1] += "?";
		}
		else if(scoreDiff >= blunder[0]) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 5;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 5;
			
			board.moveHistory[board.moveHistory.length - 1] += "??";
		}
		
		if(firstSecondEngineDiff >= 500) {
			grids[fromGrid].withGlyph = false;
			grids[fromGrid].glyph = 11;
			grids[toGrid].withGlyph = true;
			grids[toGrid].glyph = 11;
			
			board.moveHistory[board.moveHistory.length - 1] += "??";
		}
		
		// coach message
		
		if(scoreDiff >= good[0]) {
			var prefix = "";
			
			// prefix message
			
			if(pieceGrid[fromGrid] != undefined && pieceGrid[toGrid] != undefined) {
				if(pieceGrid[fromGrid].isType(piece.queen) && pieceGrid[toGrid].isType(piece.queen) && isGridAttacked(board, toGrid, pieceGrid[fromGrid].team)) {
					prefix = scoreDiff < `${inaccuracy[0] ? "Trading the queen is not the best move!" : "You shouldn't have done a queen trade!"} <span style="opacity: 0.3">${(displayEvaluation)}</span>`;
				}
			}
			
			// doesn't capture anything
			if(bestCapture == -1) {
				// taking over the center | playing c4, d4, or e4
				if((bestFrom == 50 && bestTo == 34) || (bestFrom == 51 && bestTo == 35) || (bestFrom == 52 && bestTo == 36)) {
					updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to control the center! <span style="opacity: 0.3">${(displayEvaluation)}</span>`)
				}
				// developing a knight
				if(pieceGrid[bestFrom] != undefined &&
				pieceGrid[bestFrom].isType(piece.knight) &&
				(((bestFrom == 57 || bestFrom == 62) && turn == player) || (bestFrom == 1 || bestFrom == 6) && turn == enemy)) {
					updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to develop a knight from it's starting square! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
				}
				// developing a bishop
				if(pieceGrid[bestFrom] != undefined &&
				pieceGrid[bestFrom].isType(piece.bishop) &&
				(((bestFrom == 58 || bestFrom == 61) && turn == player) || (bestFrom == 2 || bestFrom == 5) && turn == enemy)) {
					updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to develop a knight from it's starting square! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
				}
			}
			else {
				// didn't capture a piece
				updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to capture a ${isGridAttacked(board, pieces[bestCapture].pos, pieces[bestCapture].team) ? "free" : ""} ${pieceNames[pieces[bestCapture].type]}! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
			}
			// neither for capture nor not capture
			
			// not moving your piece from danger
			if(pieceGrid[bestFrom] != undefined && !pieceGrid[bestFrom].isType(piece.pawn) && !pieceGrid[bestFrom].isType(piece.king)) {
				if(isGridAttacked(board, bestFrom, pieceGrid[bestFrom].team)) {
					updateCoachMessage(`${prefix}You gave away your ${pieceNames[pieceGrid[bestFrom].type]}! <span style="opacity: 0.3">${(displayEvaluation)}</span>`)
				}
				
				// missed an attacking move
				if(pieceGrid[bestFrom] != undefined) {
					var pieceType = pieceGrid[bestFrom].type;
					var pieceTeam = pieceGrid[bestFrom].team;
					//if piece attacker is a bishop
					if(pieceType == piece.bishop) {
						var attackingPieceType = 0;
						for(var i = 4; i < 8; i++) {
							for(var n = 0; n < distToEdge[bestTo][i]; n++) {
								var targetGrid = bestTo + directionOffsets[i] * (n + 1);
								
								if(pieceGrid[targetGrid] != undefined && pieceGrid[targetGrid].isTeam(pieceTeam == player ? enemy : player)) {
									if(!pieceGrid[targetGrid].isType(piece.pawn) &&
									!pieceGrid[targetGrid].isType(piece.king)) {
										attackingPieceType = getPieceValue(pieceGrid[targetGrid].type) >= getPieceValue(attackingPieceType) ? pieceGrid[targetGrid].type : attackingPieceType;
									}
									
									break;
								}
							}
						}
						
						if(attackingPieceType != 0) {
							if(attackingPieceType == piece.bishop) {
								updateCoachMessage(`${prefix}You couldn't have purpose a bishop trade! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
							}
							else {
								updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to attack a ${pieceNames[attackingPieceType]}! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
							}
						}
					}
					
					// if piece attacker is a knight
					if(pieceType == piece.knight) {
						var attackingPieceType = [];
						var totalAttackedPiece = 0;
						var isAttackingMajorPiece = false;
						var isAttackingKing = false;
						
						for(var i = 0; i < knightDir.length; i++) {
							var targetGrid = bestTo + knightDir[i][0];
							
							if(bestTo % 8 + knightDir[i][1] >= 0 && bestTo % 8 + knightDir[i][1] < 8 && targetGrid >= 0 && targetGrid < 64) {
								if(pieceGrid[targetGrid] != undefined &&
								pieceGrid[targetGrid].isTeam(pieceTeam == player ? enemy : player)) {
									if(!pieceGrid[targetGrid].isType(piece.pawn) &&
									!pieceGrid[targetGrid].isType(piece.king)) {
										attackingPieceType = getPieceValue(pieceGrid[targetGrid].type) >= getPieceValue(attackingPieceType) ? pieceGrid[targetGrid].type : attackingPieceType;
										totalAttackedPiece++;
									}
									if(pieceGrid[targetGrid].isType(piece.king)) {
										isAttackingKing = true;
										totalAttackedPiece++;
									}
									if(pieceGrid[targetGrid].isType(piece.rook) || pieceGrid[targetGrid].isType(piece.queen)) {
										isAttackingMajorPiece = true;
									}
								}
							}
						}
						
						if(attackingPieceType != 0) {
							if(totalAttackedPiece == 1) {
								if(attackingPieceType == piece.knight) {
									updateCoachMessage(`${prefix}You ${scoreDiff < inaccuracy[0] ? "couldn't" : "shouldn't"} have purpose a knight trade! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
								}
								else {
									updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to attack a ${pieceNames[attackingPieceType]}! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
								}
							}
							else {
								if(isAttackingKing) {
									updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to fork the king and the ${pieceNames[attackingPieceType]}! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
								}
								else {
									updateCoachMessage(`${prefix}${scoreDiff < inaccuracy[0] ? "You had a chance" : "You missed an opportunity"} to fork the enemy pieces! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
								}
							}
						}
					}
				}
				
				if(firstSecondEngineDiff >= 500) {
					updateCoachMessage(`There was only one good move that work and that is not it! <span style="opacity: 0.3">${(displayEvaluation)}</span>`);
				}
			}
		}
	}
}