function inCheck(board, team) {
	var { pieces, pieceGrid, kingIndex } = board;
	
	var kingId = kingIndex[team == player ? "player" : "enemy"];
	
	var king = pieces[kingId];
	
	/*
	var moves = generateMoves(board, (team == player) ? enemy : player, false);
	
	var check = false;
	var _c = false;
	
	for(var i = 0; i < moves.length; i++) {
		var move = moves[i];
		
		for(var j = 0; j < move.length; j++) {
			var m = move[j];
			
			var { toGrid } = getMoveStringInfo(m);
			
			check = toGrid == king.pos;
			
			if(check) {
				_c = true;
				
				break;
			}
		}
		
		if(_c) break;
	}
	
	return check;
	*/
	
	return isGridAttacked(board, king.pos, team);
}
