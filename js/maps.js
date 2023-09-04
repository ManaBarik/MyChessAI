var pawnMap = [
	0, 0, 0, 0, 0, 0, 0, 0,
	3, 2,-2,-9,-9, 4, 4, 3,
	1, 2, 6, 7, 7, 5, 2, 1,
	1, 3, 6,10,10, 7, 1, 1,
	4, 8, 4, 9, 9, 4, 8, 1,
	9,10, 6,10,10, 6,10, 9,
	90,90,90,90,90,90,90,90,
	10,10,10,10,10,10,10,10
];
var knightMap = [
	-6,-6,-2, 0, 0,-2,-6,-6,
	-3, 3, 2, 5, 5, 2, 3,-3,
	-4, 2, 5, 5, 5, 6, 2,-4,
	-3, 3, 6, 6, 6, 6, 3,-3,
	-3, 4, 6, 6, 6, 6, 4,-3,
	-4, 4, 4, 4, 4, 5, 4,-4,
	-5, 2, 3, 3, 3, 3, 2,-5,
	-6,-8,-8,-8,-8,-8,-8,-6,
];
var bishopMap = [
	3, 4,-5, 2, 2,-5, 4, 3,
	2,10, 3, 3, 3, 3,10, 2,
	0, 5, 5, 4, 4, 5, 5, 0,
	-1,4, 6, 5, 5, 6, 4,-1,
	-1,1, 3, 5, 5, 3, 1,-1,
	-2,1, 1, 4, 4, 1, 1,-2,
	-2,1, 3, 2, 2, 3, 1,-2,
	-2,1, 2, 2, 3, 2, 1,-2,
];
var rookMap = [
	3, 1, 2, 6, 6, 3, 1, 3,
	1, 4, 2, 2, 2, 2, 4, 1,
	2, 2, 3, 2, 2, 2, 2, 1,
	0, 2, 3, 3, 5, 3, 2, 0,
	0, 2, 4, 4, 4, 3, 3, 0,
	0, 3, 3, 3, 3, 3, 3, 0,
	3, 5, 5, 5, 5, 5, 5, 4,
	5, 5, 5, 5, 5, 5, 5, 5,
];
var queenMap = [
	-1,1, 1, 1, 1, 1, 1,-1,
	0, 1, 2, 3, 1, 2, 1, 0,
	0, 1, 2, 3, 3, 2, 1, 0,
	-1, 1, 2, 3, 3, 2, 1, 0,
	0, 1, 1, 2, 2, 1, 1, 0,
	0, 2, 1, 0, 0, 1, 2, 0,
	0, 2, 1, 1, 1, 1, 2, 0,
	-1,0, 1, 2, 2, 1, 0,-1,
];
var kingMap = [
	2, 4, 4,-6,-3, 0, 5, 2,
	2,-3,-8,-8,-8,-8,-3, 2,
	0,-3,-8,-8,-8,-8,-3, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
];
var outpostMap = [
	-5, -5, -5, -5, -5, -5, -5, -5,
	-5, -3,  0,  1,  1,  0, -3, -5,
	-5,  0,  2,  3,  3,  2,  0, -5,
	-5,  1,  3,  3,  3,  3,  1, -5,
	-5,  1,  3,  3,  3,  3,  1, -5,
	-5,  0,  2,  3,  3,  2,  0, -5,
	-5, -3,  0,  1,  1,  0, -3, -5,
	-5, -5, -5, -5, -5, -5, -5, -5,
];

var mutateMaps = false;
var mutateAmount = 120;

if(mutateMaps) {
	pawnMap.map(val => {
		return val + (mutateAmount / 2 + Math.random()*(mutateAmount * 2));
	});
	bishopMap.map(val => {
		return val + (mutateAmount / 2 + Math.random()*(mutateAmount * 2));
	});
	knightMap.map(val => {
		return val + (mutateAmount / 2 + Math.random() * (mutateAmount * 2));
	});
	rookMap.map(val => {
		return val + (mutateAmount / 2 + Math.random() * (mutateAmount * 2));
	});
	queenMap.map(val => {
		return val + (mutateAmount / 2 + Math.random() * (mutateAmount * 2));
	});
	kingMap.map(val => {
		return val + (mutateAmount / 2 + Math.random() * (mutateAmount * 2));
	});
}
/*
pawnMap.map(value => {
	return value * 10;
});

bishopMap.map(value => {
	return value * 10;
});

knightMap.map(value => {
	return value * 10;
});

rookMap.map(value => {
	return value * 10;
});

queenMap.map(value => {
	return value * 10;
});

kingMap.map(value => {
	return value * 10;
});
*/