var searchOption = {
	start: 0,
	stop: false,
	time: 3000,
	best: [],
	nodes: 0,
	R: 2,
	maxSearchExtension: 4
}

function bestMoves(board, depth, firstTurn, useBook = true) {
	var { pieces, turn, moveHistory, promotionSelection } = board;
	
	var bookMoves = [];
	
	if(useBook && useDefaultFEN) {
		bookMoves = getBookFromMoveHistory(moveHistory);
	}
	
	searchOption.start = Date.now();
	searchOption.stop = false;
	searchOption.best = [];
	searchOption.nodes = 0;
	
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
				
				turn = changeTurn(board, false, false);
				
				var score = -minimax(board, currentDepth - 1, -Infinity, Infinity, firstTurn, currentDepth, move, true, 0);
				
				turn = changeTurn(board, false, false);
				
				pieces = unMakeMove(board, move);
				
				moveList.push({ move, score });
				
				if(searchOption.stop) {
					break;
				}
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
	updateEvalBar(searchOption.best[0].score / 10);
	
	return searchOption.best;
}

function minimax(board, depth, alpha, beta, firstTurn, startDepth, lastMove, useNullMove = true, numExtension = 0) {
	var { turn, positionHistory } = board;

	var perspective = turn == player ? 1 : -1;
	
	if(depth <= 0) {
		return evaluate(board, lastMove) * perspective;
	}
	
	if(board.repetitionMoveHistory[board.posKey] >= 3) {
		return 0;
	}
	
	searchOption.nodes++;
	
	if(searchOption.nodes % 500 == 0) {
		checkTime(searchOption);
	}
	
	// null move pruning to
	
	if(useNullMove && !inCheck(board, turn) && depth > 2) {
		var score = minimax(board, depth - searchOption.R, -beta, -alpha, firstTurn, startDepth, false);
		
		if(score >= beta) {
			return beta;
		}
	}
	
	var moves = generateMoves(board, turn, true);
	
	moves = orderMoves(board, moves);
	
	var g = isGameOver(board, moves, turn);
	
	if(g.boolean) {
		if(g.type == 0) {
			return -mateValue + 100 * (startDepth - depth);
		}
		return 0;
	}
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		var score;
		
		pieces = makeMove(board, move, false, false, false);
		
		turn = changeTurn(board, false, false);
		
		var extension = numExtension < searchOption.maxSearchExtension && inCheck(board, turn) ? 1 : 0;
		
		score = -minimax(board, depth - 1 + extension, -beta, -alpha, firstTurn, startDepth, move, useNullMove, numExtension + extension);
		
		turn = changeTurn(board, false, false);
		
		pieces = unMakeMove(board, move);
		
		alpha = Math.max(alpha, score);
		
		if(score >= beta) {
			return beta;
		}
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

function quiescenceSearch(board, alpha, beta, firstTurn, startDepth, lastMove) {
	var { turn, pieces } = board;
	
	var perspective = turn == player ? 1 : -1;
	
	checkTime(searchOption);
	
	var evaluation = evaluate(board, lastMove) * perspective;
	
	if(evaluation >= beta) {
		return beta;
	}
	
	alpha = Math.max(alpha, evaluation);
	
	var moves = generateMoves(board, turn, true, true);
	moves = orderMoves(board, moves);
	
	var g = isGameOver(board, moves, turn);
	
	if(g.boolean) {
		if(g.type == 0) {
			return -mateValue + 1000 * (startDepth - depth);
		}
		return 0;
	}
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		
		pieces = makeMove(board, move, false, false, false);
		
		turn = changeTurn(board, false, false);
		
		perspective = board.turn == player ? 1 : -1;
		
		var score = evaluate(board, lastMove) * perspective;
		
		turn = changeTurn(board, false, false);
		
		perspective = board.turn == player ? 1 : -1;
		
		pieces = unMakeMove(board, move);
		
		alpha = Math.max(alpha, score);
		
		if(score >= beta) {
			return beta;
		}
	}
	
	return alpha;
}