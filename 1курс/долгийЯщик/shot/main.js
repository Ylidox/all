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
	'KeyA': 0,
	'KeyK': 0,
	'KeyJ': 0
};



class Borders{
	constructor(){
		this.arrayBorders = [];
		this.color = 'red';
	}
	draw(){
		this.arrayBorders.forEach((item) => {
			item.draw();
		});
	}
	create(x, y, w, h){
		let border = new Border({
			pos: {x: x, y: y},
			width: w,
			height: h,
			color: this.color
		});
		border.create();
	}
}

let borders = new Borders();

class Border{
	constructor(options){
		this.pos    = options.pos;
		this.width  = options.width;
		this.height = options.height;
		this.color  = options.color;
	}
	draw(){
		ctx.beginPath();
			ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
	}
	create(){
		borders.arrayBorders.push(this);
	}
}

borders.create(0, 0, 800, 20);
borders.create(0, 20, 20, 500);
borders.create(780, 0, 20, 500);
borders.create(0, 480, 800, 20);

class Bullets{
	constructor(){
		this.arrayBullets = [];
	}
	iterateBullets(){
		for(let i = 0; i < this.arrayBullets.length; i++){
			let bullet = this.arrayBullets[i];
			this.move(bullet);
			this.draw(bullet);
			if(this.delete(bullet, i)){
				i--;
			}
		}
	}
	delete(bullet, i){
		if(bullet.x1 > width || bullet.x1 < 0 || bullet.y1 > height || bullet.y1 < 0){
			this.arrayBullets.splice(i, 1);
			return 1;
		}
		return 0;
	}
	move(bullet){
		bullet.x1 += Math.cos(bullet.angle) * bullet.speed;
		bullet.y1 += Math.sin(bullet.angle) * bullet.speed;
		bullet.x2 += Math.cos(bullet.angle) * bullet.speed;
		bullet.y2 += Math.sin(bullet.angle) * bullet.speed;
	}
	draw(bullet){
		ctx.beginPath();
			ctx.moveTo(bullet.x1, bullet.y1);
			ctx.lineTo(bullet.x2, bullet.y2);
			ctx.strokeStyle = 'white';
			ctx.stroke();
		ctx.closePath();
	}
	push(elem){
		this.arrayBullets.push(elem);
	}
}

let bullets = new Bullets();

class Player{
	constructor(options){
		this.pos    = options.pos;
		this.speed  = options.speed;
		this.angle  = options.angle;
		this.radius = options.radius;
		this.color  = options.color;
		this.fov    = options.fov;
	}
	shot(){
		function randomInteger(min, max){
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		}

		let angle = Math.floor(this.angle * 180 / Math.PI * 100); // угол в градусах
		let fov = Math.floor(this.fov * 180 / Math.PI * 100);

		let rand = randomInteger(angle - Math.floor(fov / 2), angle + Math.ceil(fov / 2));
		rand = (rand / 100)*Math.PI / 180;

		bullets.push({
			x1: this.pos.x,
			y1: this.pos.y,
			x2: this.pos.x + Math.cos(rand) * 7,
			y2: this.pos.y + Math.sin(rand) * 7,
			speed: 5,
			angle: rand
		})
	}
	draw(){
		ctx.beginPath();
			ctx.moveTo(this.pos.x, this.pos.y);
			ctx.arc(this.pos.x, this.pos.y, this.radius * 5, this.angle - this.fov / 2, this.angle + this.fov / 2);
			ctx.fillStyle = 'rgba(120, 255, 120, 0.3)';
			ctx.fill();
		ctx.closePath();
		ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
		ctx.beginPath();
			ctx.moveTo(this.pos.x, this.pos.y);
			ctx.lineTo(this.pos.x + this.radius * Math.cos(this.angle), this.pos.y + this.radius * Math.sin(this.angle));
			ctx.stroke();
		ctx.closePath();	
	}
}

class User extends Player{
	constructor(options){
		super(options);
	}
	changeAngle(){
		addEventListener('mousemove', (event) => {
			let x = this.pos.x;
			let y = this.pos.y;
			let x1 = event.offsetX;
			let y1 = event.offsetY;
			let newAngle = Math.atan((y - y1) / (x - x1));

			if(y1 > y && x1 <= x){
				newAngle = Math.PI + newAngle;
				this.angle = newAngle;
				return;
			}
			if(y1 <= y && x1 <= x){
				newAngle = Math.PI + newAngle;
				this.angle = newAngle;
				return;
			}
			this.angle = newAngle;
			
		});
	}
	move(){

		let speed = user.speed;
		let cos = Math.cos(user.angle);
		let sin = Math.sin(user.angle);

		if(key['KeyW']){
			user.pos.y -= speed;
		}
		if(key['KeyD']){
			user.pos.x += speed;
		}
		if(key['KeyS']){
			user.pos.y += speed;
		}
		if(key['KeyA']){
			user.pos.x -= speed;
		}
		if(key['KeyK']){
			user.angle += Math.PI / 32;
			if(user.angle > Math.PI * 2){
				user.angle -= Math.PI * 2;
			}
		}
		if(key['KeyJ']){
			user.angle -= Math.PI / 32;
			if(user.angle < 0){
				user.angle += Math.PI * 2;
			}
		}
	}
}

function drawText(string, x, y){
	ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.font = "20px Verdana";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(string, x, y);
	ctx.closePath();
}

let user = new User({
	pos: {x: width / 2, y: height / 2},
	speed: 5,
	angle: 3 * Math.PI / 2,
	radius: 10,
	color: 'yellow',
	fov: 10 * Math.PI / 180
});

user.changeAngle();

loop = () => {
	ctx.clearRect(0,0, width, height);

	borders.draw();

	user.draw();
	user.move();

	if(key['Space']){
		user.shot();
	}

	bullets.iterateBullets();
	requestAnimationFrame(loop);
}
loop();


// addEventListener('keydown', (e) => {
// 	if(e.code == 'Space'){
// 		user.shot();
// 	}
// })

addEventListener('keydown', (e) => {
	key[e.code] = 1;
})
addEventListener('keyup', (e) => {
	key[e.code] = 0;
})
