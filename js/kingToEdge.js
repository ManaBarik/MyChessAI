function kingToEdge(board, team, weight = 1) {
	var { endgame } = board;
	
	if(!endgame) {
		return 0;
	}
	var { pieces, kingIndex } = board;
	
	var evaluation = 0;
	
	var opponentKing = pieces[kingIndex[team == player ? "enemy" : "player"]];
	var king = pieces[kingIndex[team == player ? "player" : "enemy"]];
	
	var opponentKingFile = opponentKing.pos % 8;
	var opponentKingRank = Math.floor(opponentKing.pos / 8);
	
	var opponentKingDstCenterFile = Math.max(3 - opponentKingFile, opponentKingFile - 4);
	var opponentKingDstCenterRank = Math.max(3 - opponentKingRank, opponentKingRank - 4);
	var opponentKingFromCenter = opponentKingDstCenterFile + opponentKingDstCenterRank;
	
	evaluation += opponentKingFromCenter;
	
	var kingFile = king.pos % 8;
	var kingRank = Math.floor(king.pos / 8);
	
	var dstBetweenKingsFile = Math.abs(kingFile - opponentKingFile);
	var dstBetweenKingsRank = Math.abs(kingRank - opponentKingRank);
	var dstBetweenKings = dstBetweenKingsFile + dstBetweenKingsRank;
	evaluation += 14 - dstBetweenKings;
	
	return 100 * evaluation * weight;
}
