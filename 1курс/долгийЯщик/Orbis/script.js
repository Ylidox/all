createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	window.height = canvas.height = h;
	window.width = canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

createCanvas(800, 500);

let key = {
	'KeyW': 0,
	'KeyD': 0,
	'KeyS': 0,
	'KeyA': 0
};

addEventListener('keydown', (e) => {
	key[e.code] = 1;
})
addEventListener('keyup', (e) => {
	key[e.code] = 0;
})


class Game{
	constructor(){
		this.gravity = 0.05;
	}
	loweringUser(user, planets){
		// user.velocityY += this.gravity;
		for(let i = 0; i < planets.length; i++){
			let distX = user.x - planets[i].x;
			let distY = user.y - planets[i].y;
			let accX = planets[i].mass / distX ** 2;
			let accY = planets[i].mass / distY ** 2;
			user.velocityX += accX;
			user.velocityY += accY
		}
	}
	draw(user, planets){
		user.draw();
		for(let i = 0; i < planets.length; i++){
			planets[i].draw();     
		}
	}
	move(user){
		user.changeVelocity();
		user.move();
		user.restoreFuel(90);
	}
}

class User{
	constructor(options){
		this.x            = options.x;
		this.y            = options.y;
		this.maxFuel      = options.fuel;
		this.fuel         = options.fuel;
		this.velocityX    = options.velocityX;
		this.velocityY    = options.velocityY;
		this.acceleration = options.acceleration;
		this.box		  = options.box;
	}
	move(){
		this.x += this.velocityX;
		this.y += this.velocityY;
	}
	changeVelocity(){
		if(this.fuel < 10) return 0;
		if(key['KeyW']){
			this.velocityY -= this.acceleration;
			this.fuel -= 10;
		}
		if(key['KeyS']){
			this.velocityY += this.acceleration;
			this.fuel -= 10;
		}
		if(key['KeyD']){
			this.velocityX += this.acceleration;
			this.fuel -= 10;
		}
		if(key['KeyA']){
			this.velocityX -= this.acceleration;
			this.fuel -= 10;
		}
	}
	draw(){
		ctx.beginPath();
			ctx.rect(this.x - this.box / 2, this.y - this.box / 2, this.box, this.box);
			ctx.fillStyle = 'yellow';
			ctx.fill();
		ctx.closePath();
	}
	restoreFuel(num){
		for(let item in key){
			if(key[item]) return;
		}
		this.fuel += num;
		if(this.maxFuel < this.fuel) this.fuel = this.maxFuel;
	}
}

class Planet{
	constructor(options){
		this.x      = options.x;
		this.y      = options.y;
		this.mass   = options.mass;
		this.radius = options.radius;
		this.color  = options.color;
	}
	draw(){
		ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
	}
}

let game = new Game();

let user = new User({
	x:            100,
	y:            100,
	fuel:         500,
	velocityX:    0,
	velocityY:    0,
	acceleration: .15,
	box:          40
});

let planets = [];
planets[0] = new Planet({
	x:      400,
	y:      0,
	mass:   100,
	radius: 100,
	color:  'darkred'
});

loop = () => {
	ctx.clearRect(0,0, width, height);
	game.loweringUser(user, planets);
	game.draw(user, planets);
	game.move(user);
	requestAnimationFrame(loop);
}
loop();