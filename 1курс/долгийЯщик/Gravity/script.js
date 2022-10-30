const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max){
	return Math.floor(Math.random() * (max - min) + min);
}

function clear(){
	ctx.clearRect(0, 0,  width, height);
}

function compNum(a, b){
	if(Math.abs(a - b) < 0.0001){
		return true;
	}
	return false;
}

class Gravity{
	constructor(){
		this.objects = [];
		this.G = 0.000000002;
	}
	updateObject(){
		let m = 1;
		for(let i = 0; i < this.objects.length - 1; i++){
			this.objects[i].draw();
			for(let j = m; j < this.objects.length; j++){
				let a = this.objects[i];
				let b = this.objects[j];
				
				let delta = {x: a.x - b.x, y: a.y - b.y}
				let dist = Math.sqrt((delta.x)**2 + (delta.y)**2);
				// if(compNum(delta.x, 0)) delta.x = 200;
				// if(compNum(delta.y, 0)) delta.y = 200;

				let acc = {x: 0, y: 0};
				let force = b.mass * this.G;
				acc.x = force * (delta.x )// ** 2);
				acc.y = force * (delta.y )// ** 2);
				
				a.vx -= acc.x;
				a.vy -= acc.y;
				b.vx += acc.x;
				b.vy += acc.y;

				a.update();
				b.update();

				ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.strokeStyle = 'red';
					ctx.stroke();
				ctx.closePath();
			}
			m += 1;
		}
		this.objects[m - 1].draw();
	}
}

class Object{
	constructor(options){
		this.mass = options.mass;
		this.x = options.pos.x;
		this.y = options.pos.y;
		this.vx = options.vel.x;
		this.vy = options.vel.y;
		this.ax = options.acc.x;
		this.ay = options.acc.y;
	}
}

class Rect extends Object{
	constructor(options){
		super(options);
		this.w = options.w;
		this.h = options.h;
		this.color = options.color;
	}
	draw(){
		ctx.beginPath();
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
	}
	update(){
		this.x += this.vx;
		this.y += this.vy;
	}
}

class Circle extends Object{
	constructor(options){
		super(options);
		this.radius = options.radius;
		this.color = options.color;
	}
	draw(){
		ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
	}
	update(){
		this.x += this.vx;
		this.y += this.vy;
	}
}

class Rocket extends Rect{
	constructor(options){
		super(options);
		this.fuel = options.fuel;
		this.angle = options.angle;
		this.mass += this.fuel;
		this.fuelConsumption = options.fuelConsumption;
		this.engineThrust = options.engineThrust;
	}
	draw(){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = this.color;
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		ctx.restore();
	}
	drive(){
		if(this.fuel > 0){
			this.mass -= this.fuelConsumption;
			this.fuel -= this.fuelConsumption;

			this.ax = this.engineThrust * Math.cos(this.angle);
			this.ay = this.engineThrust * Math.sin(this.angle);

			this.vx += this.ax;
			this.vy += this.ay;
		}
		console.clear();
		console.log(this.fuel)
	}
	nullingAcc(){
		this.ax = 0;
		this.ay = 0;
	}
	rotate(angle){
		this.angle += angle;
	}
	update(){
		this.nullingAcc();
		this.x += this.vx;
		this.y += this.vy;
	}
}

let world = new Gravity();

world.objects[0] = new Rocket({
	pos: {x: random(1,width), y: random(1, height)},
	vel: {x: 0, y: 0},
	acc: {x: 0, y: 0},
	w: 20,
	h: 10,
	mass: 10,
	fuel: 50,
	fuelConsumption: 0.5,
	engineThrust: 0.1,
	color: 'green',
	angle: Math.PI / 2
});

/*for(let i = 0; i < 10; i++){
	world.objects.push(new Rect({
		pos: {x: random(1, width), y: random(1, height)},
		vel: {x: 0, y: 0},
		acc: {x: 0, y: 0},
		w: random(1, 20),
		h: random(1, 20),
		mass: random(1, 10),
		color: 'green'
	}));
}*/

addEventListener('keypress', (e) => {
	
	switch(e.code){
		case 'KeyW':
			world.objects[0].drive();
			break;
		case 'KeyD':
			world.objects[0].rotate(Math.PI/6);
			break;
		case 'KeyA':
			world.objects[0].rotate(-Math.PI/6);
			break;
		case 'KeyS':
			//r.back(3);
			break;
	}
});

world.objects.push(new Circle({
	pos: {x: random(1,10), y: random(1, 10)},
	vel: {x: 0, y: -0},
	acc: {x: 0, y: 0},
	radius: random(15, 25),
	mass: random(9000, 10000) / 1,
	color: 'green'
}));

world.objects.push(new Circle({
	pos: {x: random(width - 10, width), y: random( height - 10, height)},
	vel: {x: 0, y: 0},
	acc: {x: 0, y: 0},
	radius: random(1, 5),
	mass: random(100, 10000) / 1000,
	color: 'red'
}));


function loop(){
	 clear();
	world.updateObject();
	requestAnimationFrame(loop);	
}
loop();