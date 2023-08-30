/*
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
*/

/*

Move structure

0000 0000 0000 0000 0000 0000 0000 0000
   7 6544 4444 3333 3332 2222 2211 1111

1. pieceIndex: 6 bits
2. fromGrid: 7 bits
3. toGrid: 7 bits
4. capturePiece: 6 bits
5. isPromoting: 1 bit
6. isCastling: 1 bit
7. noCapture: 1 bit

*/

function Move(pieceIndex, fromGrid, toGrid, capturePiece, isPromoting, isCastling) {
	return (pieceIndex | (fromGrid << 6) | (toGrid << 13) | ((capturePiece != -1 ? capturePiece : 0) << 20) | (isPromoting << 26) | (isCastling << 27)) | ((capturePiece == -1) << 28);
}

function PIECEINDEX(move) {
	return move & 0x3F;
}

function FROMSQUARE(move) {
	return (move >> 6) & 0x7F;
}

function TOSQUARE(move) {
	return (move >> 13) & 0x7F;
}

function CAPTUREINDEX(move) {
	return (move >> 20) & 0x3F;
}

function ISPROMOTING(move) {
	return (move >> 26) & 0x1;
}

function ISCASTLING(move) {
	return (move >> 27) & 0x1;
}

function NOCAPTURE(move) {
	return (move >> 28) & 0x1;
}