class Arrow {
	constructor(pos1, pos2, color = "#2EBF05") {
		this.pos1 = pos1;
		this.pos2 = pos2;
		this.color = color;
		this.angle = getAngle(grids[this.pos1], grids[this.pos2]);
	}
	rn() {
		var grid1 = grids[this.pos1];
		var grid2 = grids[this.pos2];
		
		var diff = Math.abs(this.pos1 - this.pos2);
		var d = this.pos2 - this.pos1;
		
		miscCtx.strokeStyle = this.color;
		miscCtx.lineWidth = 10;
		miscCtx.lineCap = "butt";
		miscCtx.lineJoin = "round";
		
		if(diff != 10 && diff != 6 && diff != 17 && diff != 15) {
			miscCtx.beginPath();
			miscCtx.moveTo(grid1.x + grid1.w / 2, grid1.y + grid1.h / 2);
			miscCtx.lineTo(grid2.x + grid2.w / 2, grid2.y + grid2.h / 2);
			miscCtx.stroke();
			
			miscCtx.save();
			miscCtx.translate(grid2.x + grid2.w / 2, grid2.y + grid2.h / 2);
			miscCtx.rotate(this.angle);
			
			miscCtx.beginPath();
			miscCtx.fillStyle = this.color;
			miscCtx.moveTo(-9, -13);
			miscCtx.lineTo(7, 0);
			miscCtx.lineTo(-9, 13);
			miscCtx.fill();
			
			miscCtx.restore();
		}
		else {
			if(d == 10 || d == 6) {
				this.angle = Math.PI / 2;
			}
			if(d == -10 || d == -6) {
				this.angle = -Math.PI / 2;
			}
			if(d == 17 || d == -15) {
				this.angle = 0;
			}
			if(d == -17 || d == 15) {
				this.angle = Math.PI;
			}
			
			miscCtx.beginPath();
			miscCtx.moveTo(grid1.x + grid1.w / 2, grid1.y + grid1.h / 2);
			if(diff == 10 || diff == 6) {
				miscCtx.lineTo(grid2.x + grid2.w / 2, grid1.y + grid1.h / 2);
				miscCtx.lineTo(grid2.x + grid2.w / 2, grid2.y + grid2.h / 2);
			}
			else if(diff == 17 || diff == 15) {
				miscCtx.lineTo(grid1.x + grid1.w / 2, grid2.y + grid2.h / 2);
				miscCtx.lineTo(grid2.x + grid2.w / 2, grid2.y + grid2.h / 2);
			}
			miscCtx.stroke();
			
			miscCtx.save();
			miscCtx.translate(grid2.x + grid2.w / 2, grid2.y + grid2.h / 2);
			miscCtx.rotate(this.angle);
			
			miscCtx.beginPath();
			miscCtx.fillStyle = this.color;
			miscCtx.moveTo(-10, -12);
			miscCtx.lineTo(12, 0);
			miscCtx.lineTo(-10, 12);
			miscCtx.fill();
			
			miscCtx.restore();
		}
		
		miscCtx.lineCap = "round";
	}
}

class Highlight {
	constructor(pos, color = "crimson") {
		this.pos = pos;
		this.color = color;
	}
	rn() {
		var grid = grids[this.pos];
		
		var { x, y, w, h } = grid;
		
		ctx.globalAlpha = 0.7;
		
		ctx.fillStyle = this.color;
		ctx.fillRect(x, y, w, h);
		
		ctx.globalAlpha = 1;
	}
}
