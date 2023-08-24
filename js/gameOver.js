function isGameOver(board, moves, turn) {
	var { pieces } = board;
	
	var boolean = false;
	var type = -1; // checkmate 0 or draw 1
	var name = "";
	
	// checkmate or stalemate draw
	
	if(moves.length == 0) {
		boolean = true;
		if(inCheck(board, turn)) {
			type = 0;
			name = "Checkmate";
		}
		else {
			type = 1;
			name = "Stalemate";
		}
		return { boolean, type, name };
	}
	
	// insufficient material
	
	var whiteMaterials = 0;
	var blackMaterials = 0;
	
	for(var i = 0; i < pieces.length; i++) {
		if(pieces[i].isTeam(player)) {
			if(pieces[i].isType(piece.pawn)) {
				whiteMaterials += 4; // 4 instead of 1 so it won't draw if there are only pawns even if its value is less than a bishop or a knight (that will result in a draw)
			}
			if(pieces[i].isType(piece.bishop) || pieces[i].isType(piece.knight)) {
				whiteMaterials += 3;
			}
			if(pieces[i].isType(piece.rook)) {
				whiteMaterials += 7;
			}
			if(pieces[i].isType(piece.queen)) {
				whiteMaterials += 9;
			}
		}
		if(pieces[i].isTeam(enemy)) {
			if(pieces[i].isType(piece.pawn)) {
				blackMaterials += 4;
			}
			if(pieces[i].isType(piece.bishop) || pieces[i].isType(piece.knight)) {
				blackMaterials += 3;
			}
			if(pieces[i].isType(piece.rook)) {
				blackMaterials += 7;
			}
			if(pieces[i].isType(piece.queen)) {
				blackMaterials += 9;
			}
		}
	}
	
	if(whiteMaterials <= 3 && blackMaterials <= 3) {
		boolean = true;
		type = 1;
		name = "Insufficient material"
		return { boolean, type, name };
	}
	
	boolean = false;
	
	return { boolean, type, name };
}
