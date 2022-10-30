createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	canvas.height = h;
	canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

class Clock{
	constructor(x, y, radius, colors){
		this.pos = [x, y];
		this.radius = radius;
		this.colors = colors;
		this.hour = 0;
		this.minute = 0;
		this.second = 0;
		this.lineWidth = 10;
		this.lengthArrows = [70, 90, 100];
	}
	updateTime(){
		this.hour = (new Date()).getHours();
		this.minute = (new Date()).getMinutes();
		this.second = (new Date()).getSeconds() + (new Date).getMilliseconds() / 1000;
	}
	drawSectors(){
		let partSecond = this.second / 60 || 1;
		let partMinute = this.minute / 60 || 1;
		let partHour = this.hour / 12  || 1;
		if(partHour > 1) partHour -= 1;

		this.drawSector(partSecond, 60, this.colors[2]);
		this.drawSector(partMinute, 30, this.colors[1]);
		this.drawSector(partHour, 0, this.colors[0]);
	}
	drawSector(part, dy, color){
		let sector = Math.floor(part * 360);
		let radius = this.radius - dy / 2;
		let x = this.pos[0];
		let y = this.pos[1] - radius;
		this.arc(x, y, color);
		ctx.beginPath();
			ctx.moveTo(x, y);
			for(let i = -90; i < sector - 90; i++){
				let angle = i * Math.PI / 180;
				x = this.pos[0] + radius * Math.cos(angle);
				y = this.pos[1] + radius * Math.sin(angle);
				ctx.lineTo(x, y);
			}
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = color;
			ctx.stroke();
		ctx.closePath();
		this.arc(x, y, color);
	}
	drawArrows(){
		let angleSecond = this.second / 60 * 2 * Math.PI - Math.PI / 2;
		let angleMinute = this.minute / 60 * 2 * Math.PI - Math.PI / 2;
		let angleHour = this.hour / 12;
		if(angleHour > 1) angleHour -= 1;
		angleHour = angleHour * 2 * Math.PI - Math.PI / 2;

		this.line(this.pos[0], this.pos[1], this.pos[0] + this.lengthArrows[2] * Math.cos(angleSecond),
											this.pos[1] + this.lengthArrows[2] * Math.sin(angleSecond), this.colors[2]);
		this.line(this.pos[0], this.pos[1], this.pos[0] + this.lengthArrows[1] * Math.cos(angleMinute),
											this.pos[1] + this.lengthArrows[1] * Math.sin(angleMinute), this.colors[1]);
		this.line(this.pos[0], this.pos[1], this.pos[0] + this.lengthArrows[0] * Math.cos(angleHour),
											this.pos[1] + this.lengthArrows[0] * Math.sin(angleHour), this.colors[0]);
	}
	line(x1, y1, x2, y2, color){
		this.arc(x1, y1, color);
		ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.strokeStyle = color;
			ctx.lineWidth = this.lineWidth;
			ctx.stroke();
		ctx.closePath();
		this.arc(x2, y2, color);
	}
	arc(x, y, color){
		ctx.beginPath();
			ctx.arc(x, y, this.lineWidth / 2, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.fill();
		ctx.closePath();
	}
	main(){
		this.updateTime();
		this.drawArrows();
		this.drawSectors();
	}
}

createCanvas(320, 320);

let clock = new Clock(160, 160, 150, ['#5718FF', '#18FF75','#FDE910']);
loop = () => {
	ctx.clearRect(0, 0, 320, 320);
	clock.main();
	requestAnimationFrame(loop);
}
loop();