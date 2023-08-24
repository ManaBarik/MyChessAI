class SpriteDisplay {
	constructor(x, y, w, h, src) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = src;
	}
	rn() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(passAndPlay ? board.turn == player ? 0 : Math.PI : 0);
		
		ctx.drawImage(this.image, this.w / -2, this.h / -2, this.w, this.h);
		
		ctx.restore();
	}
}
