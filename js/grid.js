class Grid {
	constructor(x, y, w, h, color) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.color = color;
		this.trail = false;
		this.pressed = false;
		
		this.withGlyph = false;
		this.glyph = -1;
	}
	rn() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		
		if(this.trail || this.glyph != -1 || this.pressed) {
			ctx.globalAlpha = 0.5;
			if(this.glyph == -1) {
				// 8th glyph is win icon
				ctx.fillStyle = "yellow";
			}
			else if(this.glyph == -2) {
				ctx.fillStyle = "#995B3B";
			}
			else {
				ctx.fillStyle = ["dodgerblue", "#74E20F", "#CCE62A", "gold", "orangered", "crimson", "turquoise", "#CCE62A", "transparent", "transparent", "transparent", "#FF3647"][this.glyph];
			}
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.globalAlpha = 1;
		}
	}
}
