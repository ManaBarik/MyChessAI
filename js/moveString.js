function Move(pieceIndex, fromGrid, toGrid, capturePiece, isPromoting, isCastling) {
	return `${pieceIndex.toString()},${fromGrid.toString()},${toGrid.toString()},${capturePiece.toString()},${isPromoting.toString()},${isCastling.toString()}`;
}

function getMoveStringInfo(moveString) {
	var split = moveString.split(",");
	var index = parseInt(split[0]);
	var fromGrid = parseInt(split[1]);
	var toGrid = parseInt(split[2]);
	var captureIndex = parseInt(split[3]);
	var isPromoting = parseInt(split[4]);
	var isCastling = parseInt(split[5]);
	
	return { index, fromGrid, toGrid, captureIndex, isPromoting, isCastling };
}
