var books = [
	/* e4 games */
	
	"e2e4 e7e5 g1f3 b8c6 f1c4 f8c5", // italian game
	"e2e4 e7e5 g1f3 b8c6 f1b5", // ruy lopez / spanish game
	
	/* vienna game variations */
	"e2e4 e7e5 b1c3 g8f6", // falbeer defence
	"e2e4 e7e5 b1c3 b8c6", // max lange defence
	"e2e4 e7e5 b1c3 b8c6 g1f3 g8f6 f1c4 f8c5", // transposed to four knights game: guicco piano
	"e2e4 e7e5 b1c3 g8f6 d2d4 b8c6",
	"e2e4 e7e5 b1c3 g8f6 f2f4 d7d6 g1f3 b8c6 d2d4 e5d4 f3d4",
	"e2e4 e7e5 b1c3 f8c5 g1f3 g8f6 f1c4 d7d6",
	"e2e4 e7e5 b1c3 f8b4 d2d4 e5d4 d1d4 b4c3 d4c3 d8f6 c3f6 g8f6 e4e5 f6d5",
	"e2e4 e7e5 b1c3 f8b4 d2d4 b4c3 b2c3 e5d4 c3d4 d7d5 e4e5",
	"e2e4 e7e5 b1c3 g8f6 d2d3 f8c5 f2f4 d7d6 g1f3 b8c6",
	
	/* scandinavian defence variations */
	"e2e4 d7d5 e4d5 d8d5 b1c3 d5e5 g1e2 b8c6 f2f4 e5d6", // Qxd5 (and then black attacks white continuously with their queen and then back off by a knight attack)
	"e2e4 d7d5 e4d5 d8d5 b1c3 d5d8", // Qxd5 (and then black retreat their queen, most common move for pro players)
	"e2e4 d7d5 g1f3 d5e4 f3g5 g8f6 b1c3 h7h6", // réti opening: tennison gambit
	"e2e4 d7d5 e4d5 d8d5 b1c3 d5a5", // mieceskotrč variation (main line)
	"e2e4 d7d5 e4d5 g8f6 c2c4 c7c6 d5c6 b8c6", // modern variation
	"e2e4 d7d5 e4e5 c8f5 d2d4 e7e6 g1f3 c7c5 c2c3 d8b6",
	"e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 d2d4 c7c6 c1d2 a5c7 g1f3 g8f6 f1d3 c8g4 h2h3 g4h5",
	"e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 g1f3 g8f6 d2d4 c7c6 c1d2 a5c7 f1d3 c8g4",
	
	/* sicilian defence variations */
	"e2e4 c7c5 g1f3 e7e6 c2c4 b8c6 b1c3 g8f6 f1e2", // kramnik variation
	"e2e4 c7c5 d2d4 c5d4 c2c3 d4d3", // smith  morra gambit: 3...d3
	"e2e4 c7c5 d2d4 c5d4 c2c3 g8f6", // smith  morra gambit: 3...Nf6
	"e2e4 c7c5 d2d4 c5d4 c2c3 d7d5", // smith  morra gambit: 3...d5
	"e2e4 c7c5 g1f3 e7e6 b1c3 d7d5 e4d5 e6d5", // 2...e6
	"e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 a7a6 b1c3 d8c7", // open sicilian
	"e2e4 c7c5 b1c3 a7a6 g1e2 d7d6 g2g3 g8f6 f1g2 e7e5 d2d3 b7b5", // top engine line by stockfish
	// custom lines
	"e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 b1c3 d7d6 c1g5",
	"e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e5 d4f3 b8c6",
	"e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 b8d7 f1c4 a7a6",
	"e2e4 c7c5 b1c3 d7d6 g1f3 g8f6 d2d4 c5d4 f3d4 b8c6 d4c6 b7c6",
	"e2e4 c7c5 g1f3 b8c6 f1b5 g7g6 b5c6 d7c6 b1c3 f8g7 d2d3 e7e5",
	"e2e4 c7c5 f2f4 d7d5 e4d5 d8d5 b1c3 d5d8 g1f3",
	"e2e4 c7c5 b1c3 b8c6 f1b5 d7d6 g1f3 g7g6 b5c6 b7c6 d2d3 f8g7",
	"e2e4 c7c5 f1c4 b8c6 b1c3 e7e6 g1f3 g7g6 d2d4 c5d4 f3d4 f8g7",
	// alapin variations
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 d7d6",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 e7e6",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6b4",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6b8 b1c3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6b8 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6a5 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6a5 b1c3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6b4 a2a3 b4a6 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 c5d4 c3d4 g7g6 d4d5 c6b4 a2a3 b4a6 b1c3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 d2d4 b7b6 d4c5 b6c5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 e7e6 d4c5 f8c5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 b7b6 d4d5 c6a5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 e7e6 d4d5 e6d5 e4d5 c6a5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 d7d5 e4d5 d8d5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 d7d5 d4c5 e7e6 f1b5 f8c5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 d7d5 d4c5 e7e6 b2b4 a7a5 b4a5 c6a5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 d7d5 d4c5 e7e6 b2b4 a7a5 b4b5 c6e5",
	"e2e4 c7c5 c2c3 b8c6 d2d4 d7d5 d4c5 e7e6 e4d5 e6d5 f1b5 f8c5",
	"e2e4 c7c5 c2c3 b8c6 g1f3 e7e5 d2d4",
	"e2e4 c7c5 c2c3 b8c6 f1b5 e7e5 b5c6 d7c6",
	"e2e4 c7c5 c2c3 b8c6 f1b5 a7a6 b5a4 e7e5",
	"e2e4 c7c5 c2c3 b8c6 f1c4 e7e5",
	"e2e4 c7c5 c2c3 b8c6 f1c4 g8f6",
	"e2e4 c7c5 c2c3 b8c6 f1c4 d7d6",
	"e2e4 c7c5 c2c3 b8c6 f1b5 g7g6 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 f1b5 g7g6 b5c6 d7c6 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 f1c4 g7g6 g1f3 f8g7",
	"e2e4 c7c5 c2c3 b8c6 h2h3 e7e5",
	"e2e4 c7c5 c2c3 b8c6 a2a3 e7e5",
	"e2e4 c7c5 c2c3 b8c6 d2d3 d7d5 e4d5 d8d5 c3c4 d5d8",
	"e2e4 c7c5 c2c3 b8c6 d2d3 e7e5",
	"e2e4 c7c5 c2c3 b8c6 a2a3 e7e5 b2b4 c5b4 a3b4 a7a6",
	"e2e4 c7c5 c2c3 b8c6 a2a3 d7d5 e4d5 d8d5 c3c4 d5d8",
	"e2e4 c7c5 c2c3 d7d6 d2d4 c5d4 c3d4 g8f6",
	"e2e4 c7c5 c2c3 d7d6 h2h3 e7e5 g1f3 g8f6",
	"e2e4 c7c5 c2c3 d7d6 h2h3 e7e5 f1c4 b8c6",
	"e2e4 c7c5 c2c3 d7d6 h2h3 e7e5 g1f3 b8c6",
	"e2e4 c7c5 c2c3 d7d6 h2h3 e7e5 f1c4 g8f6",
	"e2e4 c7c5 c2c3 d7d6 f1b5 c8d7 b5d7 b8d7",
	"e2e4 c7c5 c2c3 d7d6 f1b5 b8c6 b5c6 b7c6",
	"e2e4 c7c5 c2c3 d7d6 d2d3 e7e5",
	"e2e4 c7c5 c2c3 d7d6 d2d3 g8f6 g1f3 e7e5",
	"e2e4 c7c5 c2c3 d7d6 d2d3 b8c6 g1f3 e7e5",
	"e2e4 c7c5 c2c3 d7d6 d2d3 g8f6 g1f3 c8g4",
	"e2e4 c7c5 c2c3 d7d6 d2d3 b8c6 g1f3 c8g4",
	"e2e4 c7c5 c2c3 b7b6 d2d4 c5d4 c3d4",
	"e2e4 c7c5 c2c3 b7b6 d2d4 d7d6 d4c5 b6c5",
	"e2e4 c7c5 c2c3 b7b6 g1f3 d7d5 e4d5 d8d5 c3c4 d5d8",
	"e2e4 c7c5 c2c3 b7b6 g1f3 c8b7 d2d3",
	"e2e4 c7c5 c2c3 b7b6 d2d4 c8b7 d4c5 b6c5",
	
	/* french defence */
	"e2e4 e7e6 d2d4 d7d5 e4d5 e6d5", // exchange variation
	"e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 f1b5 b8c6 b5c6 b7c6 g1f3 d8b6", // advance variation
	"e2e4 e7e6 d2d4 d7d5 b1d2 c7c5 g1f3 c5d4 f3d4 g8f6 e4d5 f6d5 d2f3",
	"d2d4 e7e6 e2e4 d7d5 b1c3",
	"e2e4 e7e6 f2f4 d7d5 e4e5 g8h6 c2c3 c7c5 d2d4",
	"e2e4 e7e6 d2d4 d7d5 b1d2 c7c5 e4d5 e6d5 g1f3 b8c6",
	"e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 d8b6 g1f3 b8c6",
	
	/* king's gambit variations */
	/* declined variation */
	"e2e4 e7e5 f2f4 d7d5 e4d5 e5e4 b1c3 g8f6 d2d3 e4d3 c2d3", // falkbeer countergambit: 3...e4
	/* accepted variation */
	"e2e4 e7e5 f2f4 e5f4 g1f3 b8c6 b1c3 f8c5",
	"e2e4 e7e5 f2f4 e5f4 g1f3 d7d5 e4d5 d8d5 b1c3 d5d8 d2d3 f8b4 c1f4",
	"e2e4 e7e5 f2f4 e5f4 d2d4 g7g5 b1c3 c7c6",
	
	"e2e4 e7e5 d1h5 b8c6 f1c4 g7g6 h5f3 g8f6", //wayward queen attack
	
	"e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 f8c5 d4c6 b7c6", // scotch gambit
	
	/* bishop opening */
	"e2e4 e7e5 f1c4 b8c6 d2d4 d7d6 d4e5 d6e5 d1d8 c6d8",
	"e2e4 e7e5 f1c4 g8f6 d2d3 f8e7 c1g5 b8c6",
	
	"e2e4 e7e5 g1f3 b8c6 b1c3 g8f6 f1c4 f8c5", // four knights game: guicco piano
	
	"e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5 d7d5 e4d5 c6a5 d2d3 h7h6", // fried liver attack
	
	/* modern defence */
	"e2e4 g7g6 d2d4 f8g7 b1c3 d7d6 c1e3 c7c6 d1d2 b7b5 f1d3 b8d7",	
	"e2e4 g7g6 d2d4 f8g7 g1f3 d7d6 b1c3 c8g4 f1e2 g4f3 e2f3",
	"e2e4 g7g6 d2d4 f8g7 b1c3 c7c6 g1f3 d7d5 c1f4 d5e4 c3e4",
	"e2e4 g7g6 b1c3 f8g7 d2d4 d7d6 f2f4 g8f6 g1f3 c7c5",
	"e2e4 g7g6 d2d4 f8g7 g1f3 d7d6 b1c3 g8f6 f1e2 c7c6",
	"e2e4 g7g6 d2d4 f8g7 c2c4 d7d6 b1c3 g8f6 g1f3 c8g4 f1e2 b8d7",
	"e2e4 g7g6 d2d4 d7d6 b1c3 f8g7 f2f4 g8f6 f1d3 b8c6 e4e5 d6e5 f4e5 f6d5 g1f3",
	
	/* van't kruijs opening variations
	"e2e3 e7e5 b1c3 d7d5 d2d4 e5d4 e3d4 g8f6",
	"e2e3 e7e5 d2d4 d7d6 c2c4 b8d7 d4e5 d7e5",
	"g1f3 b7b6 e2e4 c8b7 b1c3 e7e6 d2d4",
	"e2e3 e7e5 d2d4 d7d6 c2c3 g8f6",
	"e2e3 e7e5 d2d4 d7d6 g1f3 e5d4 e3d4 c8g4",
	"e2e3 e7e5 d2d4 e5e4 b1c3 d7d5 f2f3 e4f3 g1f3 c8g4",
	"e2e3 e7e5 d2d4 e5e4 b1c3 d7d5 f2f3 e4f3 g1f3 g8f6",
	"e2e3 e7e5 d2d4 e5e4 b1c3 d7d5 f2f3 f7f5",
	"e2e3 e7e5 d2d4 d7d6 c2c4 b8c6",
	*/
	/* caro kann */
	"e2e4 c7c6 b1c3 d7d5 d2d4 d5e4 c3e4 c8f5 e4g3 f5g6",
	"e2e4 c7c6 g1f3 d7d5 e4d5 c6d5",
	"e2e4 c7c6 d2d4 d7d5 e4d5 c6d5",
	"e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 f1e2", // advance variation
	"e2e4 c7c6 f1c4 d7d5 e4d5 c6d5 c4b3 g8f6",
	"e2e4 c7c6 c2c4 d7d5 c4d5 c6d5 e4d5 d8d5 b1c3 d5a5 d2d4 g8f6",
	"e2e4 c7c6 c2c4 d7d5 e4d5 c6d5 c4d5 d8d5 b1c3 d5a5 d2d4 g8f6",
	
	/* pirc defence */
	"e2e4 d7d6 d2d4 g8f6 b1c3 e7e5 d4e5 d6e5 d1d8 e8d8 f1c4 f8b4",
	"e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 g1f3 f8g7",
	"e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 f1c4 f8g7",
	"e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 c1g5 f8g7",
	"e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 f1d3 f8g7",
	"e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 c1e3 f8g7",
	"e2e4 d7d6 d2d4 g8f6 b1c3 e7e6 g1f3 b8c6",
	"e2e4 d7d6 d2d4 g8f6 b1c3 c7c6 g1f3 d8a5",
	"e2e4 d7d6 d2d4 g8f6 b1c3 c7c6 g1f3 c8g4",
	"e2e4 d7d6 d2d4 g8f6 b1c3 c7c6 g1f3 g7g6",
	"e2e4 d7d6 b1c3 c7c5 f1b5 c8d7 b5d7 b8d7",
	"e2e4 d7d6 g1f3 c8g4 b1c3 b8c6 f1b5 g8f6 d2d3",
	"e2e4 d7d6 g1f3 g8f6 b1c3 e7e5 d2d4 e5d4 d1d4 b8c6 d4d1",
	"e2e4 d7d6 b1c3 c7c5 g1f3 b8c6 f1b5 g7g6",
	"e2e4 d7d6 b1c3 c7c5 g1f3 b8c6 f1c4 g8f6",	"e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 f1d3 f5d3 d1d3 e7e6 g1f3 c6c5 c2c3",
	
	/* d4 games */
	
	/* king's indian defence variations */
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 g1f3", // kasparov variation
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 c1g5", // leningrad variation
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 a2a3 b4c3 b2c3", // sämisch variation
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 g2g3 c7c5 g1f3", // fianchetto variation: 4...c5
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 g2g3 d7d5 c4d5 f6d5", // fianchetto variation: 4...d5 cxd5 5. Nxd5
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 c1d2 b4c3 d2c3 f6e4", // 4...Bd2
	"d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3",
	"d2d4 g8f6 c2c4 g7g6 b1c3 f8g7",
	"d2d4 g8f6 c2c4 g7g6 g1f3 f8g7",
	"d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 f2f3 c7c5",
	"d2d4 g8f6 g1f3 d7d5 c1f4 c7c5 e2e3 b8c6 b1d2 c5d4 e3d4 c8f5 c2c3 e7e6",
	"d2d4 g8f6 c2c4 e7e6 g1f3 d7d5 b1c3",
	"d2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3 e6d5 c4d5 d7d6 e2e4 f8e7",
	
	/* queen's gambit variations */
	
	/* declined variation */
	"d2d4 d7d5 c2c4 e7e5 d4e5 d5d4 g1f3 b8c6 g2g3", // albin countergambit: 5...g3
	/* slav defence */
	"d2d4 d7d5 c2c4 c7c6 c4d5 c6d5 b1c3 g8f6",
	"d2d4 d7d5 c2c4 c7c6 c4d5 c6d5 g1f3 c8f5",
	"d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 e2e3 c8g4 d1b3",
	"d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 e7e6 c1g5 b8d7 e2e3 d8a5 f3d2 f8b4 d1c2", // I'LL BE BACK TO YOU AFTER I MAKE CASTLING FOR BOOK MOVES!
	
	/* london system "punish"
	"d2d4 d7d5 c1f4 b8c6 g1f3 f7f6 b1c3 e7e5 d4e5 f6e5 f4g3 g8f6", */ // london system punish
	/* london systems */
	"d2d4 d7d5 c1f4 g8f6 g1f3 e7e6 e2e3 c7c5 c2c3 b8c6 f1d3 f8d6 f4g3 c8d7 b1d2",
	"d2d4 g8f6 c1f4 e7e6 g1f3 d7d5 e2e3 f8d6 f4g3 c7c5 c2c3 b8c6 f1d3 c8d7 b1d2",
	"d2d4 d7d5 c2c4 e7e6 c1f4 g8f6 g1f3 c7c6 e2e3 b8d7 f1d3 f8e7 b1c3",
	"d2d4 g8f6 c1f4 d7d5 e2e3 e7e6 g1f3 c7c6 c2c4 b8d7 f1d3 f8e7 b1c3",
	"d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1f4 c7c6 g1f3 f8d6 f4d6 d8d6 e2e3 b8d7 f1d3",
	"d2d4 d7d5 c1f4 g8f6 e2e3 e7e6 f1d3 c7c5 c2c3 c5c4 d3c2 b8c6",
	
	/* english opening variations */
	"c2c4 e7e5 b1c3 g8f6 g1f3 e5e4 f3g5", // ...Ng5
	"c2c4 e7e5 b1c3 g8f6 g1f3 f8c5",
	"c2c4 e7e5 b1c3 g8f6 g1f3 d7d5",
	"c2c4 e7e5 b1c3 g8f6 g1f3 b8c6",
	"c2c4 e7e5 b1c3 g8f6 g1f3 d8e7",
	"c2c4 e7e5 b1c3 g8f6 c3d5 f6d5 c4d5",
	"c2c4 c7c5 b1c3 g8f6 g1f3 e7e6 g2g3 b7b6 f1g2 c8b7", // symmetrical variation
	"c2c4 d7d5 c4d5 c7c6 d5c6 b8c6 e2e3 e7e5 b1c3 g8f6 g1f3 f8d6 d2d4", // anglo scandanavian defence
	"c2c4 g8f6 b1c3 e7e5 g1f3 b8c6 e2e3 f8b4 d1c2 b4c3 b2c3",
	"c2c4 e7e6 b1c3 d7d5 c4d5 e6d5 d2d4 g8f6 e2e3 f8d6 f1d3",
	
	/* dutch defence */
	"d2d4 f7f5 g2g3 g8f6 f1g2 g7g6 g1f3 f8g7",
	"d2d4 f7f5 c2c4 g7g6 h2h4 f8g7 h4h5", // with g6
	"d2d4 f7f5 c2c4 e7e6 b1c3 g8f6 a2a3",
	"d2d4 f7f5 c2c4 g8f6 g1f3 g7g6 g2g3 f8g7 f1g2",
	
	/* trompowsky attack */
	"d2d4 g8f6 c1g5 f6e4 h2h4 h7h6 g5f4 c7c5",
	
	/* b or g games */
	
	/* king's indian variation */
	"g1f3 g8f6 g2g3 g7g6 f1g2 f8g7", // symmetrical variation
	"g1f3 d7d5 d2d4 b8c6 b1c3 g8f6",
	"g1f3 d7d5 d2d4 g8f6 c1g5 b8c6 g5f6 e7f6",
	"g1f3 d7d5 d2d4 g8f6 c1g5 b8c6 g5f6 g7f6",
	"g1f3 d7d5 d2d4 c8f5 b1c3 e7e6",
	"g1f3 g7g6 e2e4 f8g7 d2d4 c7c6 b1c3 d7d5 e4d5 c6d5",
	"d2d4 g8f6 c2c4 e7e6 g1f3 d7d5",
	
	/* from our games */
	"d2d4 d7d5 c2c4 d5c4 e2e3 e7e6 f1c4",
	"e2e4 e7e5 g1f3 b8c6 b1c3 f8b4 d2d4",
	"e2e4 e7e5 g1f3 b8c6 b1c3 g8f6 f1c4",
	"e2e4 e7e5 g1f3 g8f6 f3e5 f6e4 d2d4 d7d5",
	"e2e4 e7e5 f1c4 b8c6 d1f3 g8f6", // Napoleon attack	
	"e2e4 e7e5 g1f3 b8c6 b1c3 f8b4 f1c4",
	"d2d4 d7d5 c2c4 d5c4 b1c3 g8f6 e2e3 c8f5",
	"e2e4 e7e5 g1f3 b8c6 d2d4 g8f6 d4d5",
	"e2e4 e7e5 g1f3 b8c6 d2d4 g8f6 d4e5",
	"e2e4 e7e5 g1f3 b8c6 d2d4 h7h6",
	"e2e4 e7e5 g1f3 b8c6 d2d4 a7a6",
	"e2e4 e7e5 g1f3 b8c6 d2d4 h7h5",
	"e2e4 e7e5 g1f3 b8c6 d2d4 a7a5",
	"e2e4 e7e5 g1f3 b8c6 d2d4 g8e7",
	"e2e4 e7e5 g1f3 b8c6 d2d4 b7b6",
	"d2d4 d7d5 c2c4 e7e5 d4e5 d5d4 g1f3 b8c6",
	"d2d4 d7d5 c2c4 e7e5 d4e5 d5d4 e2e3 f8b4 c1d2 b4d2 b1d2",
	"e2e4 e7e6 d2d4 d7d5 b1c3 d5e4 c3e4",
	"e2e4 e7e6 d2d4 d7d5 e4e5 b8c6 g1f3",
];

function getBookFromMoveHistory(moveHistory) {
	var availableMoves = [];
	var moveHistoryString = moveHistory.join(" ");
	
	for(var i = 0; i < books.length; i++) {
		var book = books[i];
		
		if(book.slice(0, moveHistoryString.length) == moveHistoryString) {
			var split = book.split(" ");
			
			var alreadyExisted = false;
			for(var j = 0; j < availableMoves.length; j++) {
				if(availableMoves[j] == split[moveHistory.length]) {
					alreadyExisted = true;
					
					break;
				}
			}
			
			if(!alreadyExisted) {
				if(split[moveHistory.length] != null) {
					availableMoves.push(split[moveHistory.length]);
				}
			}
		}
	}
	
	return availableMoves;
}
