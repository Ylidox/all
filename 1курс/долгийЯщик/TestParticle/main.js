const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = 640;///*window.innerWidth;*/config.box * map[0].length;
let height = canvas.height = 400;///*window.innerHeight;*/config.box * map.length;

class Box{
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.angle = options.angle || 0;
		this.vx    = options.vx    || 0;
		this.vy    = options.vy    || 0;
		this.color = options.color || 'red';
		this.life  = options.life;
	}

	update(){
		this.x += this.vx;
		this.y += this.vy;
	}

	draw(){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = this.color;
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		ctx.restore();
	}
}

class RocketParticle{
	constructor(){
		// this.numberOfPart = 100; // количество частиц
		this.spawnPart = 2; // количество появляющихся частиц в кадр
		this.spawnPoint = {x: 150, y: 100};
		this.colors = ['red', 'orange', 'yellow'];
		this.particles = [];
		this.dirAngle = Math.PI;
		this.FOV = Math.PI / 2;
		this.speedPart = 2;
		this.box = 10;
		this.maxLifePart = 0.5 * 60; // макс. количество кадров жизни частиц, потом частица уничтожается
	}
	random(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}
	choice(array){
		return array[this.random(0, array.length)];
	}
	spawn(){
		for(let i = 0; i < this.spawnPart; i++){
			let angle = this.random((this.dirAngle - this.FOV/2) * 1000,
									(this.dirAngle + this.FOV/2) * 1000) / 1000;
			this.particles.push(new Box({
				x: this.spawnPoint.x,
				y: this.spawnPoint.y,
				w: this.box,
				h: this.box,
				angle: angle,
				vx:    this.speedPart * Math.cos(angle),
				vy:    this.speedPart * Math.sin(angle),
				color: this.choice(this.colors),
				life:  this.random(1, this.maxLifePart)
			}));
		}
	}
	iteratePart(){
		for(let i = 0; i < this.particles.length; i++){
			this.particles[i].update();
			this.particles[i].draw();
			this.particles[i].life--;
			if(!this.particles[i].life){
				this.particles.splice(i, 1);
				i--;
			}
		}
	}
}

let main = new Box({
	x: 200,
	y: 100,
	w: 100,
	h: 50,
	angle: 0// Math.PI / 2
});

let R = new RocketParticle();

function loop(){
	ctx.clearRect(0, 0, width, height);
	
	main.draw();
	R.spawn();
	R.iteratePart();

	requestAnimationFrame(loop);	
}
loop();