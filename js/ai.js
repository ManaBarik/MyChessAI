var searchOption = {
	start: 0,
	stop: false,
	time: 2000,
	best: [],
	nodes: 0,
	R: 2,
	maxSearchExtension: 4,
	fhf: 0,
	fh: 0
}

var mvvlvaValue = [pawnValue, bishopValue, knightValue, rookValue, queenValue, 0, pawnValue, bishopValue, knightValue, rookValue, queenValue, 0];
var mvvlvaScores = new Array(14 * 14);

function initMVVLVA() {
	var attacker, victim;
	
	for(attacker = 0; attacker < 12; attacker++) {
		for(victim = 0; victim < 12; victim++) {
			mvvlvaScores[victim * 12 + attacker] = mvvlvaValue[victim] + 6 - (mvvlvaValue[attacker] / 100);
		}
	}
}

initMVVLVA();

function pickNextMove(moves, moveIndex) {
	var bestScore = -1;
	var bestIndex = 0;
	
	for(var i = moveIndex; i < moveScores.length; i++) {
		if(moveScores[i] > bestScore) {
			bestScore = moveScores[i];
			bestIndex = i;
		}
	}
	
	if(bestIndex != moveIndex) {
		var switchedScore = moveScores[moveIndex];
		moveScores[moveIndex] = moveScores[bestIndex];
		moveScores[bestIndex] = switchedScore;
		
		var switchedMove = moves[moveIndex];
		moves[moveIndex] = moves[bestIndex];
		moves[bestIndex] = switchedMove;
	}
	
	return { moves, moveScores };
}

function bestMoves(board, depth, firstTurn, useBook = true) {
	var { pieces, turn, moveHistory, promotionSelection } = board;
	
	var bookMoves = [];
	
	if(useBook && useDefaultFEN) {
		bookMoves = getBookFromMoveHistory(moveHistory);
	}
	
	clearForSearch();
	
	// uses minimax
	
	var bestDepth = 0;
	
	for(var currentDepth = 1; currentDepth <= depth; currentDepth++) {
		var bestScore = -Infinity;
		
		if(!useBook || bookMoves.length == 0) {
			useBook = false;
			
			var bestIndex = 0;
			var moveList = [];
			
			var moves = generateMoves(board, turn);
			
			moves = orderMoves(board, moves);
			
			for(var i = 0; i < moves.length; i++) {
				var move = moves[i];
				
				pieces = makeMove(board, move, false, false, false);
				
				if(board.repetitionMoveHistory[board.posKey] == null) {
					board.repetitionMoveHistory[board.posKey] = 0;
				}
				
				board.repetitionMoveHistory[board.posKey]++;
				
				turn = changeTurn(board, false, false);
				
				var score = -alphaBeta(board, currentDepth - 1, -Infinity, Infinity, currentDepth, move, true, 0);
				
				turn = changeTurn(board, false, false);
				
				board.repetitionMoveHistory[board.posKey]--;
				
				pieces = unMakeMove(board, move);
				
				if(searchOption.stop) {
					break;
				}
				
				moveList.push({ move, score });
			}
			
			if(searchOption.stop) {
				bestDepth = currentDepth - 1;
				
				break;
			}
			
			var list = moveList;
			var iteration = moveList.length;
			var newList = [];
			
			for(var i = 0; i < iteration; i++) {
				var bestScore = -Infinity;
				var bestIndex = 0;
				
				for(var j = 0; j < list.length; j++) {
					var l = list[j];
					
					if(l.score > bestScore) {
						bestScore = l.score;
						bestIndex = j;
					}
				}
				
				newList.push({
					move: list[bestIndex].move,
					score: bestScore,
				});
				
				list.splice(bestIndex, 1);
			}
			
			searchOption.best = newList;
		}
		else {
			var newList = [];
			
			for(var i = 0; i < bookMoves.length; i++) {
				var bookMove = bookMoves[i];
				
				newList.push({ move: translateToMoveString(board, bookMove), score: 0.5 });
			}
			
			newList = shuffleArray(newList);
			
			searchOption.best = newList;
		}
	}
	
	depthSearchText = (!useBook || bookMoves.length == 0) ? bestDepth : "Book";
	moveOrderText = (!useBook || bookMoves.length == 0) ? `${((searchOption.fhf / searchOption.fh) * 100).toFixed(2)}%` : "Book";
	
	updateEvalBar(searchOption.best[0].score / 10);
	
	return searchOption.best;
}

function alphaBeta(board, depth, alpha, beta, startDepth, lastMove, useNullMove = true, numExtension = 0) {
	var { turn } = board;

	var perspective = turn == player ? 1 : -1;
	
	if(depth <= 0) {
		return evaluate(board, lastMove) * perspective;
	}
	
	if(board.repetitionMoveHistory[board.posKey] >= 3) {
		return 0;
	}
	
	if(searchOption.nodes % 1000 == 0) {
		checkTime(searchOption);
	}
	
	searchOption.nodes++;
	
	var isInCheck = inCheck(board, turn);
	
	// null move pruning
	
	if(useNullMove && !isInCheck && depth > 2) {
		var score = alphaBeta(board, depth - searchOption.R, -beta, -beta + pawnValue, startDepth, lastMove, false, numExtension);
		
		if(score >= beta) {
			return beta;
		}
	}
	
	var moves = generatePseudoLegalMoves(board, turn);
	
	moves = orderMoves(board, moves);
	
	var legal = 0;
	var oldAlpha = alpha;
	var bestMove = NOMOVE;
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		var score;
		
		pieces = makeMove(board, move, false, false, false);
		
		if(inCheck(board, turn)) {
			pieces = unMakeMove(board, move);
			
			continue;
		}
		
		if(board.repetitionMoveHistory[board.posKey] == null) {
			board.repetitionMoveHistory[board.posKey] = 0;
		}
		
		board.repetitionMoveHistory[board.posKey]++;
		
		legal++;
		
		turn = changeTurn(board, false, false);
		
		var extension = numExtension < searchOption.maxSearchExtension && inCheck(board, turn) ? 1 : 0;
		
		score = -alphaBeta(board, depth - 1 + extension, -beta, -alpha, startDepth, move, useNullMove, numExtension + extension);
		
		turn = changeTurn(board, false, false);
		
		board.repetitionMoveHistory[board.posKey]--;
		
		pieces = unMakeMove(board, move);
		
		if(searchOption.stop) {
			return 0;
		}
		
		if(score > alpha) {
			if(score >= beta) {
				if(legal == 1) {
					searchOption.fhf++;
				}
				searchOption.fh++;
				
				// updates killer move
				
				return beta;
			}
			
			alpha = score;
			
			bestMove = move;
			
			// updates history table
		}
	}
	
	if(legal == 0) {
		if(isInCheck) {
			return -mateValue + 100 * (startDepth - depth);
		}
		
		return 0;
	}
	
	if(alpha != oldAlpha) {
		storePvTable(bestMove);
	}
	
	return alpha;
}

function checkTime(searchOption) {
	if(Date.now() - searchOption.start >= searchOption.time) {
		searchOption.stop = true;
	}
}

// some sort of quiescenceSearch
// it doesn't continue searching but to evaluate immediately as a "one ply search"

function quiescenceSearch(alpha, beta, lastMove, numExtension = 0) {
	var { turn } = board;

	var perspective = turn == player ? 1 : -1;
	
	if(board.repetitionMoveHistory[board.posKey] >= 3) {
		return 0;
	}
	
	if(searchOption.nodes % 1000 == 0) {
		checkTime(searchOption);
	}
	
	searchOption.nodes++;
	
	var score = evaluate(board, lastMove) * perspective;
	
	if(score >= beta) {
		return beta;
	}
	
	if(score > alpha) {
		alpha = score;
	}
	
	var moves = generatePseudoLegalMoves(board, turn, true, true);
	
	moves = orderMoves(board, moves);
	
	var legal = 0;
	var oldAlpha = alpha;
	var bestMove = NOMOVE;
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		var score;
		
		pieces = makeMove(board, move, false, false, false);
		
		if(inCheck(board, turn)) {
			pieces = unMakeMove(board, move);
			
			continue;
		}
		
		if(board.repetitionMoveHistory[board.posKey] == null) {
			board.repetitionMoveHistory[board.posKey] = 0;
		}
		
		board.repetitionMoveHistory[board.posKey]++;
		
		legal++;
		
		turn = changeTurn(board, false, false);
		
		var extension = numExtension < searchOption.maxSearchExtension && inCheck(board, turn) ? 1 : 0;
		
		score = evaluate(board, lastMove) * (turn == player ? 1 : -1);
		
		turn = changeTurn(board, false, false);
		
		board.repetitionMoveHistory[board.posKey]--;
		
		pieces = unMakeMove(board, move);
		
		if(searchOption.stop) {
			return 0;
		}
		
		if(score > alpha) {
			if(score >= beta) {
				if(legal == 1) {
					searchOption.fhf++;
				}
				searchOption.fh++;
				
				return beta;
			}
			
			alpha = score;
			
			bestMove = move;
		}
	}
	
	if(alpha != oldAlpha) {
		storePvTable(bestMove);
	}
	
	return alpha;
}

function clearForSearch() {
	for(var i = 0; i < 14 * 64; i++) {
		board.searchHistory[i] = 0;
	}
	
	for(var i = 0; i < 3 * 2048; i++) {
		board.searchKillers[i] = 0;
	}
	
	clearPvTable();
	
	Object.assign(searchOption, {
		start: Date.now(),
		stop: false,
		best: NOMOVE,
		nodes: 0,
		fhf: 0,
		fh: 0
	});
}