createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	canvas.height = h;
	canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}
createCanvas(800, 600);

class Game{
	constructor(){
		this.numAsteroid = 15;
		this.asteroids = [];
		this.bullets = [];
		this.loop = true;
		this.pause = false;
	}
	createAsteroids(){
		if(this.asteroids.length < this.numAsteroid && Math.random() > 0.8){
			let center = point(randomInt(-100, canvas.width + 100), randomInt(-250, canvas.height + 250));

			// if(dist(center, player.center) < 350) return;
			if( (center.x > 0 && center.x < canvas.width) &&
				(center.y > 0 && center.y < canvas.height)) return;
			
			let scale = randomInt(5, 12);
			let ast = new Asteroid( createPolygone(12, scale, center));
			ast.size = 3;

			let vec = normalize(dif(center, player.center));
			ast.angle = getAngle(vec, point(0, 0));
			ast.vel = randomInt(5, 20) / 10;
			ast.rotationAngle = randomInt(-100, 100) / 5000;
			this.asteroids.push(ast);
		}
	}
	addAsteroid(center){
		let scale = randomInt(5, 12);
		let ast = new Asteroid( createPolygone(8, scale, center));
		ast.size = 3;
		ast.rotationAngle = randomInt(-100, 100) / 5000;
		this.asteroids.push(ast);
	}
	iterateAsteroids(){
		for(let i = 0; i < this.asteroids.length; i++){
			let item = this.asteroids[i];
			item.relocation();
			item.rotate( item.rotationAngle);
			item.move();
			item.draw();
			// drawPoint(item.center);
			if(item.collisionWithPlayer()){
				if(!player.invulnerability){
					player.enableInvulnerability();
					player.life--;
				}
			}

			if(!player.life) this.loop = false;

			for(let j = 0; j < this.bullets.length; j++){
				let bullet = this.bullets[j];
				if(pointInPoly(item.points, bullet.pos.x, bullet.pos.y)){
					let new_ast = item.destruction();
					if(new_ast) this.asteroids = this.asteroids.concat(new_ast);

					this.asteroids.splice(i, 1);
					i--;
					this.bullets.splice(j, 1);
					j--;
				}
			}
		}
	}
	iterateBullets(){
		for(let i = 0; i < this.bullets.length; i++){
			let bullet = this.bullets[i];
			bullet.life--;
			if(bullet.life == 0){
				this.bullets.splice(i, 1);
				i--;
			}
			bullet.draw();
			bullet.move();

		}
	}
}

class Circle{
	constructor(options){
		this.pos = options.pos; // point, центр круга
		this.radius = options.radius; 
		this.angle = options.angle;
		this.vel = options.vel; // number, значение скорости
		this.fillColor = options.fillColor;
	}
	draw(){
		let {x, y} = this.pos;
		ctx.beginPath();

			ctx.arc(x, y, this.radius, 0, 2 * Math.PI);

			if(this.strokeColor){
				ctx.strokeStyle = this.strokeColor;
				ctx.stroke();
			}

			if(this.fillColor){
				ctx.fillStyle = this.fillColor;
				ctx.fill();
			}

		ctx.closePath();
	}
	move(){
		this.pos = sum(this.pos, mul(vectorFromAngle(this.angle), this.vel));
	}
}

class Bullet extends Circle{
	constructor(options){
		super(options);
		this.life = options.life;
	}
}

class Polygone{
	constructor(options){
		this.points = options.points;
		this.center = getCenterMass(options.points);
		this.strokeColor = options.strokeColor;
		this.fillColor = options.fillColor;
		this.angle = options.angle;
		this.vel = options.vel;
	}
	rotate(angle){
		this.angle += angle;
		for(let i = 0; i < this.points.length; i++){
			let {x, y} = dif(this.points[i], this.center);
			let x1 = x * Math.cos(angle) - y * Math.sin(angle);
			let y1 = x * Math.sin(angle) + y * Math.cos(angle);
			this.points[i] = sum(point(x1, y1), this.center);
		}
	}
	draw(){
		let {x, y} = this.points[0];
		ctx.beginPath();

			ctx.moveTo(x, y);
			for(let i = 1; i < this.points.length; i++){
				let {x, y} = this.points[i];
				ctx.lineTo(x, y);
			}
			ctx.lineTo(x, y);

			if(this.strokeColor){
				ctx.strokeStyle = this.strokeColor;
				ctx.stroke();
			}

			if(this.fillColor){
				ctx.fillStyle = this.fillColor;
				ctx.fill();
			}

		ctx.closePath();
	}
	scale(num){
		this.points = this.points.map((point) => {
			return mul(point, num);
		});
		this.center = getCenterMass(this.points);
	}
	movingCenterToPoint(goal){
		this.points = this.points.map((point) => {
			point = dif(point, this.center);
			return sum(point, goal)
		});
		this.center = getCenterMass(this.points);
	}
	move(){
		let dx = mul(vectorFromAngle(this.angle), this.vel);
		this.points = this.points.map((point) => {
			return sum(point, dx)
		});
		this.center = getCenterMass(this.points);
	}
}

class Asteroid extends Polygone{
	constructor(options){
		super(options);
		this.rotationAngle = options.rotationAngle;
		this.size = options.size; // 3 - big, 2 - medium, 1 - small
	}
	rotate(angle){
		for(let i = 0; i < this.points.length; i++){
			let {x, y} = dif(this.points[i], this.center);
			let x1 = x * Math.cos(angle) - y * Math.sin(angle);
			let y1 = x * Math.sin(angle) + y * Math.cos(angle);
			this.points[i] = sum(point(x1, y1), this.center);
		}
	}
	crash(){
		// возвращает массивы точек новых астероидов,
		// которые образуются после попадания пули в астероид
		// или false, если астероид пора уничтожить
		if(this.size == 1 || this.points.length <= 4) return false;
		else this.size--;

		let c4 = 0; // количество новых полигонов с 4 вершинами исходного полигона
		let c3 = 0; // количество новых полигонов с 3 вершинами исходного полигона
		let d = Math.floor(this.points.length / 3);
		let i = this.points.length % 3;
		switch(i){
			case 0: c4 = d; break;
			case 1: 
				c4 = d - 1;
				c3 = 2;
				break;
			case 2:
				c4 = d;
				c3 = 1;
		}
		let new_pn = []; // массив точек новых полигонов
		let index = 0;
		for(let j = c4; j > 0; j--){
			let out = [];
			out.push(this.center);
			out.push(this.points[index++]);
			out.push(this.points[index++]);
			out.push(this.points[index++]);
			if(j != 1 || (j == 1 && c3 > 0)) out.push(this.points[index]);
			if(j == 1 && c3 == 0) out.push(this.points[0]);
			new_pn.push(out);
		}
		for(let j = c3; j > 0; j--){
			let out = [];
			out.push(this.center);
			out.push(this.points[index++]);
			out.push(this.points[index++]);
			if(j != 1) out.push(this.points[index]);
			else out.push(this.points[0]);
			new_pn.push(out);
		}


		return new_pn;
	}
	destruction(){
		let arrPoint = this.crash();
		if(!arrPoint) return false;

		let out = [];
		for(let i = 0; i < arrPoint.length; i++){
			out[i] = new Asteroid(this);
			out[i].points = arrPoint[i];
			out[i].center = getCenterMass(out[i].points);
			let vec = normalize(dif(out[i].center, this.center));
			let dir = vectorFromAngle(this.angle);
			let new_dir = sum(vec, dir);
			out[i].angle = getAngle(point(0, 0), new_dir);
		}
		return out;
	}
	collisionWithPlayer(){
		for(let i = 0; i < player.points.length; i++){
			let point = player.points[i];
			if(pointInPoly(this.points, point.x, point.y)) return true;
		}
		return false;
	}
	relocation(){
		if(this.center.x + 150 < 0){
			this.movingCenterToPoint(point(canvas.width + 150, this.center.y));
		}
		if(this.center.x - 150 > canvas.width){
			this.movingCenterToPoint(point(-150, this.center.y));
		}
		if(this.center.y + 150 < 0){
			this.movingCenterToPoint(point(this.center.x, canvas.height + 150));
		}
		if(this.center.y - 150 > canvas.height){
			this.movingCenterToPoint(point(this.center.x, -150));
		}
	}
}

class Player extends Polygone{
	constructor(options){
		super(options);
		this.keys = {};
		this.life = options.life;
		this.invulnerability = options.invulnerability; // неуязвимость,
		// включается после столкновения с астероидом
	}
	action(){
		if(this.keys['KeyW']) player.move();
		if(this.keys['KeyD']) player.rotate(0.12);
		if(this.keys['KeyA']) player.rotate(-0.12);
		if(this.keys['Space']) player.shot();
	}
	shot(){
		let l = counter();

		if( l % 10 != 0) return;

		game.bullets.push(new Bullet({
			pos: this.points[0],
			radius: 2,
			angle: this.angle + (2 * Math.random() - 1) / 10,
			vel: 10,
			fillColor: 'white',
			life: 60 
		}));
	}
	relocation(){
		if(this.center.x < 0){
			this.movingCenterToPoint(point(canvas.width, this.center.y));
		}
		if(this.center.x > canvas.width){
			this.movingCenterToPoint(point(0, this.center.y));
		}
		if(this.center.y < 0){
			this.movingCenterToPoint(point(this.center.x, canvas.height));
		}
		if(this.center.y > canvas.height){
			this.movingCenterToPoint(point(this.center.x, 0));
		}
	}
	enableInvulnerability(){ // включить неуязвимость
		this.invulnerability = 60 * 3;
	}
	reduceInvulnerability(){
		if(this.invulnerability > 0){
			let del = this.invulnerability % 10;
			this.fillColor = `rgba(255, 255, 255, ${del/10})`
			this.invulnerability--;
		}
		if(!this.invulnerability) this.fillColor = 'rgba(255, 255, 255, 0.1)';
	}
}

makeCounter = () => {
  let count = 0;

  return function() {
    return count++;
  };
}
let counter = makeCounter();

randomInt = (min, max) => {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

createPolygone = (numVertex, scale, center) => {
	let angles = [];
	let maxAngle = 2 * Math.PI / (numVertex - 1);
	let sumAngle = 0;
	while(sumAngle < 2 * Math.PI){
		let angle = Math.random() * maxAngle;
		if(angle + sumAngle < Math.PI * 2){
			sumAngle += angle;
			angles.push(angle);
		}else{
			break;
		}
	}
	sumAngle = 0;

	let points = [];
	for(let i = 0; i < angles.length; i++){
		sumAngle += angles[i];
		let vec = vectorFromAngle(sumAngle);
		let len;
		if(i % 3 == 0) len = randomInt(50, 60) / 10;
		else len = randomInt(60, 80) / 10;
		let point = sum(center, mul(vec, len));
		points.push(point);
	}

	let p = new Polygone({
		points: points,
		strokeColor: 'lime',
		fillColor: 'rgba(0, 255, 0, 0.1)',
		angle: 0,
		vel: 0
	});
	p.scale( scale);
	p.movingCenterToPoint(center);

	return p;
}

pointInPoly = (polyCords, pointX, pointY) => {
	// https://ru.wikibooks.org/wiki/%D0%A0%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D0%BE%D0%B2/%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0_%D0%BE_%D0%BF%D1%80%D0%B8%D0%BD%D0%B0%D0%B4%D0%BB%D0%B5%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%82%D0%BE%D1%87%D0%BA%D0%B8_%D0%BC%D0%BD%D0%BE%D0%B3%D0%BE%D1%83%D0%B3%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D0%BA%D1%83#%D0%9E%D1%87%D0%B5%D0%BD%D1%8C_%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC
	let i, j, c = 0;
 
	for (i = 0, j = polyCords.length - 1; i < polyCords.length; j = i++)
	{
		if ((((polyCords[i].y <= pointY) && (pointY < polyCords[j].y)) || ((polyCords[j].y <= pointY) && (pointY < polyCords[i].y))) &&
        (((polyCords[j].y - polyCords[i].y) != 0) && (pointX > ((polyCords[j].x - polyCords[i].x) * (pointY - polyCords[i].y) / (polyCords[j].y - polyCords[i].y) + polyCords[i].x))))
		 	c = !c;
	}
 
	return c;
}

drawPoint = (point, color = 'red') => {
	ctx.beginPath();
		ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
	ctx.closePath();
}

newGame = () => {
	player = new Player({
		life: 3,
		points: [point(2, 2), point(1, 5), point(2, 6), point(3, 5)],
		strokeColor: 'white',
		fillColor: 'rgba(255, 255, 255, 0.1)',
		angle: 3/2*Math.PI,
		vel: 4,
		invulnerability: 0
	});

	player.scale(15);
	player.movingCenterToPoint(point(canvas.width / 2, canvas.height / 2));

	game = new Game();
}

let player, game;
newGame();

loop = () => {
	if(game.loop && !game.pause){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.createAsteroids();
	
		game.iterateAsteroids();
		game.iterateBullets();

		player.relocation();
		player.draw();
		player.reduceInvulnerability();
	
		player.action();

	}
	requestAnimationFrame(loop);	
}
loop();

addEventListener('keydown', (event) => {
	if(event.code == 'Enter' && player.life == 0) newGame();

	game.pause = false;
	player.keys[event.code] = 1;
});

addEventListener('keyup', (event) => {
	player.keys[event.code] = 0;
});


