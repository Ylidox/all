createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	window.height = canvas.height = h;
	window.width = canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

createCanvas(800, 500);

class Particles extends Array{
	constructor(){
		super();
		this.x        	= width / 2;		// позиция центра
		this.y			= height / 2;
		this.colors     = ['green', 'lightgreen', '#205040']; // цвета частиц
		this.radius     = 70;				// радиус распространения частиц
		this.fov        = 360;				// угол на который разлетаются частицы
		this.box 		= 10;				// размер частиц
		this.direction  = -90;				// направление в котором разлетаются частицы
		this.countPart  = 50;				// количество частиц
		this.speedPart  = 3;				// скорость частиц
		this.numberOfCreatedParticles = 0;	// количество созданных частиц
	}
	createParticles(){
		function randomInteger(min, max){
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		}

		let angle = this.direction;
		let fov = this.fov;

		if(this.numberOfCreatedParticles < this.countPart){
			for(let i = 0; i < 2; i++){
				let rand = randomInteger(angle - Math.floor(fov / 2), angle + Math.ceil(fov / 2));
				rand *= Math.PI / 180;
				let x = this.x;
				let y = this.y;
				let speed = randomInteger(0, this.speedPart * 100) / 100;
				this.push({
					x: 	   x,
					y: 	   y,
					speed: speed,
					angle: rand, // угол в радианах
					color: this.colors[randomInteger(0, this.colors.length)]
				});
				this.numberOfCreatedParticles++;
			}
		}
	}
	iteratePart(){
		for(let i = 0; i < this.length; i++){
			// сдвинем частицу
			this[i].x += this.speedPart * Math.cos(this[i].angle);
			this[i].y += this.speedPart * Math.sin(this[i].angle);
			// при необходимости уничтожим частицу
			let dx = Math.abs(this.x - this[i].x);
			let dy = Math.abs(this.y - this[i].y);
			if(dx ** 2 + dy ** 2 > this.radius ** 2){
				this.splice(i, 1);
				i--;
				this.countPart--;
				continue;
			}
			// отрисуем частицу
			ctx.beginPath();
				ctx.rect(this[i].x - this.box / 2, this[i].y - this.box / 2, this.box, this.box);
				ctx.fillStyle = this[i].color;
				ctx.fill();
			ctx.closePath();
		}
	}
}

let part = new Particles();

loop = () => {
	ctx.clearRect(0,0, width, height);
	part.createParticles();
	part.iteratePart();
	requestAnimationFrame(loop);
}
loop();


addEventListener('click', (event) => {
	part = new Particles();
	part.x = event.offsetX;
	part.y = event.offsetY;
});