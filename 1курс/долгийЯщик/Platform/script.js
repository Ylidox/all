createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	window.height = canvas.height = h;
	window.width = canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

createCanvas(800, 500);

class Hitbox{
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
		this.color = options.color || 'red';
		this.onshow = true;
	}
	intersection(box){
		return ( this.y < (box.y + box.height) ||
			(this.y + this.height) > box.y ||
			(this.x + this.width) < box.x ||
			this.x > (box.x + box.width) );
	}
	show(){
		if(this.onshow){
			ctx.beginPath();
				ctx.rect(this.x, this.y, this.width, this.height);
				ctx.strokeStyle = this.color;
				ctx.stroke();
			ctx.closePath();
		}
	}
}

class BlockEarth extends Hitbox{
	constructor(options){
		super(options);
	}
}

class FallingBlock{
	constructor(options){
		super(options);
		this.isFall = false;
	}
	fall(){
		
	}
}

let a = new Hitbox({
	x: 100,
	y: 100,
	width: 50,
	height: 50,
	color: 'blue'
});

let b = new Hitbox({
	x: 150,
	y: 150,
	width: 50,
	height: 50
});

// a.show();
// b.show();

console.log(a.intersection(b));