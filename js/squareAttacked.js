function isGridAttacked(board, gridIndex, team) {
	var { pieceGrid } = board;
	
	var lp = pieceGrid[gridIndex + (team == player ? -9 : 7)];
	var rp = pieceGrid[gridIndex + (team == player ? -7 : 9)];
	if(lp != undefined && !lp.captured && lp.isTeam(team == player ? enemy : player) && lp.isType(piece.pawn) && gridIndex % 8 - 1 >= 0) {
		return true;
	}
	if(rp != undefined && !rp.captured && rp.isTeam(team == player ? enemy : player) && rp.isType(piece.pawn) && gridIndex % 8 + 1 < 8) {
		return true;
	}
	
	for(var i = 0; i < directionOffsets.length; i++) {
		for(var n = 0; n < distToEdge[gridIndex][i]; n++) {
			var targetGrid = gridIndex + directionOffsets[i] * (n + 1);
			
			if(pieceGrid[targetGrid] != undefined) {
				if(pieceGrid[targetGrid].isTeam(team == player ? enemy : player) && !pieceGrid[targetGrid].captured) {
					if(i < 4 && (pieceGrid[targetGrid].isType(piece.rook) || pieceGrid[targetGrid].isType(piece.queen))) {
						return true;
					}
					if((i >= 4 && i < 8) && (pieceGrid[targetGrid].isType(piece.bishop) || pieceGrid[targetGrid].isType(piece.queen))) {
						return true;
					}
				}
				
				break;
			}
		}
		var targetGrid = gridIndex + directionOffsets[i];
		
		if(pieceGrid[targetGrid] != undefined) {
			if(pieceGrid[targetGrid].isTeam(team == player ? enemy : player) && !pieceGrid[targetGrid].captured) {
				if(pieceGrid[targetGrid].isType(piece.king)) return true;
			}
		}
	}
	
	function inRange(v) {
		return v >= 0 && v < 64;
	}
	function a(v, o) {
		return pieceGrid[v] != undefined && !pieceGrid[v].captured && pieceGrid[v].isTeam(team == player ? enemy : player) && pieceGrid[v].isType(piece.knight) && gridIndex % 8 + o >= 0 && gridIndex % 8 + o < 8 && inRange(v);
	}
	
	var tl = gridIndex - 17,
	tr = gridIndex - 15,
	rt = gridIndex - 6,
	rb = gridIndex + 10,
	bl = gridIndex + 15,
	br = gridIndex + 17,
	lt = gridIndex - 10,
	lb = gridIndex + 6;
	if(a(tl, -1)) return true;
	if(a(tr, 1)) return true;
	if(a(rt, 2)) return true;
	if(a(rb, 2)) return true;
	if(a(bl, -1)) return true;
	if(a(br, 1)) return true;
	if(a(lt, -2)) return true;
	if(a(lb, -2)) return true;
	
	return false;
}
