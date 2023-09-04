function probePvTable() {
	var index = board.posKey % PVENTRIES;
	
	if(board.pvTable[index].posKey == board.posKey) {
		return board.pvTable[index].move;
	}
	
	return NOMOVE;
}

function storePvTable(move) {
	var index = board.posKey % PVENTRIES;
	
	board.pvTable[index].move = move;
	board.pvTable[index].posKey = board.posKey;
}

function clearPvTable() {
	for(var i = 0; i < PVENTRIES; i++) {
		board.pvTable.push({
			move: NOMOVE,
			posKey: 0
		});
	}
}