createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	canvas.height = h;
	canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

class Circle{
	constructor(options){
		this.pos = options.pos; // point, центр круга
		this.radius = options.radius; 
		this.dir = options.dir; // vector, направление движения круга
		this.vel = options.vel; // number, значение скорости
		this.color = options.color;
	}
	draw(fill = true){
		let {x, y} = this.pos;
		ctx.beginPath();
			ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
			if(fill){
				ctx.fillStyle = this.color;
				ctx.fill();
			}else{
				ctx.strokeStyle = this.color;
				ctx.stroke();
			}
		ctx.closePath();
	}
	move(){
		this.pos = sum(this.pos, mul(this.dir, this.vel));
	}
	collisionWithCanvas(){
		let {x, y} = this.pos;
		let r = this.radius;

		if(x - r < 0 || x + r > canvas.width) this.dir.x *= -1;
		if(y - r < 0 || y + r > canvas.height) this.dir.y *= -1;
	}
}

class Circles extends Array{
	constructor(){
		super();
	}
	iterate(){
		for(let i = 0; i < this.length; i++){
			this[i].move();
			this[i].collisionWithCanvas();
			this[i].draw();
		}
	}
}

let circles = new Circles();

let a = new Circle({
	pos: point(100, 100),
	radius: 20,
	dir: normalize(vector(5, 3)),
	vel: 1.5,
	color: 'lightGreen'
});

let b = new Circle({
	pos: point(300, 200),
	radius: 20,
	dir: normalize(vector(-5, 4)),
	vel: 2.5,
	color: 'lightBlue'
});

circles.push(a);
circles.push(b);

createCanvas(400, 400);

loop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	circles.iterate();
	
	requestAnimationFrame(loop);	
}
loop();

