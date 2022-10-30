const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

class Car{
	constructor(options){
		this.speed = options.speed;
		this.angle = -Math.PI / 2;
		this.color = options.color;
		this.coord = [];
		this.center = options.coord;
		this.width = options.width;
		this.height = options.height;
		this.init(options);
	}
	init(options){
		let x,y,w,h;
		[x, y] = options.coord;
		[w, h] = [this.width, this.height];
		this.coord = [
			[x - w/2, y - h/2],
			[x + w/2, y - h/2],
			[x - w/2, y + h/2],
			[x + w/2, y + h/2]
		];
	}
	draw(){
		let x1, y1, x2, y2, x3, y3, x4, y4;
		[x1, y1] = this.coord[0];
		[x2, y2] = this.coord[1];
		[x3, y3] = this.coord[2];
		[x4, y4] = this.coord[3];
		ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x4, y4);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x1, y1);
			ctx.fillStyle = this.color;
			ctx.fill();
		ctx.closePath();
	}
	rotate(angle){
		this.angle += angle;
		let x, y; // координаты центра
		[x, y] = this.center;
		let MT = new Matrix(3, 3);
		MT.setValue([1, 0, 0], [0, 1, 0], [-x, -y, 1]);
		let MRT = new Matrix(3, 3);
		MRT.setValue([1, 0, 0], [0, 1, 0], [x, y, 1]);
		const RM = new Matrix(3, 3); // матрица поворота вокруг начала координат
		RM.setValue(
			[Math.cos(angle), Math.sin(angle), 0],
			[-Math.sin(angle), Math.cos(angle), 0],
			[0, 0, 1]);
		let OM = MT.multiply(RM);
		OM = OM.multiply(MRT);

		let x1, y1, x2, y2, x3, y3, x4, y4;
		[x1, y1] = this.coord[0];
		[x2, y2] = this.coord[1];
		[x3, y3] = this.coord[2];
		[x4, y4] = this.coord[3];

		let M1 = new Matrix(1, 3); M1.setValue([x1, y1, 1]);
		let M2 = new Matrix(1, 3); M2.setValue([x2, y2, 1]);
		let M3 = new Matrix(1, 3); M3.setValue([x3, y3, 1]);
		let M4 = new Matrix(1, 3); M4.setValue([x4, y4, 1]);

		M1 = M1.multiply(OM);
		M2 = M2.multiply(OM);
		M3 = M3.multiply(OM);
		M4 = M4.multiply(OM);
		
		this.coord = [
			[M1[0][0], M1[0][1]],
			[M2[0][0], M2[0][1]],
			[M3[0][0], M3[0][1]],
			[M4[0][0], M4[0][1]]
		];
	}
	move(){
		let x, y, x1, y1, x2, y2, x3, y3, x4, y4, sx, sy;
		[x1, y1] = this.coord[0];
		[x2, y2] = this.coord[1];
		[x3, y3] = this.coord[2];
		[x4, y4] = this.coord[3];
		[x, y] = this.center;
		sx = this.speed * Math.cos(this.angle);
		sy = this.speed * Math.sin(this.angle);
		
		x1 += sx; y1 += sy;
		x2 += sx; y2 += sy;
		x3 += sx; y3 += sy;
		x4 += sx; y4 += sy;
		x += sx; y += sy;

		this.coord = [
			[x1, y1],
			[x2, y2],
			[x3, y3],
			[x4, y4]
		];
		this.center = [x, y];
	}
	forward(value){
		this.speed += value;
	}
	back(value){
		this.speed += -value;
	}
	slowDown(value){
		if(this.speed < 0 && this.speed < -0.1){
			this.speed += 0.1;
		}else if(this.speed > 0 && this.speed > 0.1){
			this.speed -= 0.1;
		}else{
			this.speed = 0;
		}
	}
}
// let car = new Car({
// 	speed: 5,
// 	color: 'red',
// 	width: 80,
// 	height: 150,
// 	coord: [300, 450]
// });
// loop = () => {
// 	ctx.clearRect(-1000, -1000, 10000, 10000);
// 	car.move();
// 	car.slowDown();
// 	car.draw();
		
// 	requestAnimationFrame(loop);
// }
// loop();

// addEventListener('keypress', (e) => {
// 	switch(e.code){
// 		case 'KeyW':
// 			car.forward(3);
// 			break;
// 		case 'KeyD':
// 			car.rotate(Math.PI/6);
// 			break;
// 		case 'KeyA':
// 			car.rotate(-Math.PI/6);
// 			break;
// 		case 'KeyS':
// 			car.back(3);
// 			break;
// 	}
// });


class Turtle{
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.lineSize = options.lineSize;
		this.fill = false;
		this.radius = 10;
		this.angle = options.angle;
		this.fillStyle = options.fillStyle;
		this.strokeStyle = options.strokeStyle;
	}
	show(){
		let x, y, sx, sy;
		[x, y] = [this.x, this.y];
		[sx, sy] = [x + this.radius * Math.cos(this.angle), y + this.radius * Math.sin(this.angle)]
		// рисуем окружность
		ctx.beginPath();
			ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = 'red';
			ctx.fill();
		ctx.closePath();
		// рисуем направление
		ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(sx, sy);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.stroke();
		ctx.closePath();
	}
	begin(){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
	}
	close(){
		if(this.fill){
			ctx.fillStyle = this.fillStyle;
			ctx.fill();
			ctx.closePath();
		}else{
			ctx.lineWidth = this.lineSize;
			ctx.strokeStyle = this.strokeStyle;
			ctx.stroke();
			ctx.closePath();
		}
	}
	step(value){
		let x,y;
		[x, y] = [this.x + value * Math.cos(this.angle), this.y + value * Math.sin(this.angle)];
		this.x = x;
		this.y = y;
	}
	forward(value){
		let x, y;
		[x, y] = [this.x + value * Math.cos(this.angle), this.y + value * Math.sin(this.angle)];
		this.x = x;
		this.y = y;
		ctx.lineTo(x, y);
	}
	rotate(angle){
		this.angle += angle;
	}
}

let turtle = new Turtle({
	x: 150,
	y: 550,
	lineSize: 3,
	angle: -Math.PI/2,
	strokeStyle: 'white'
});

ctx.scale(.1251025, .1251025);
ctx.translate(4340, 4340);

let stack = [];
function push(value){
	stack.push(value);
}
function pop(){
	return stack.pop();
}
const dict = {
	// 'F': 'FF-[-F+F+F]+[+F-F-F]'
	// 'F': 'F[+F]F[-F][F]'
	// 'X': 'F[+X][-X]FX',
	// 'F': 'FF'
	// 'X': 'F-[[X]+X]+F[+FX]-X',
	// 'F': 'FF'
	'F': 'F-F++F-F'
}
const n = 3;
const angle = 60 * Math.PI / 180;
const str = 'F++F++F';

function convert(str){
	let out = '';
	let arr = str.split('');
	for(let i = 0; i < arr.length; i++){
		if(dict[ arr[i] ] != undefined){
			arr[i] = dict[ arr[i] ];
		}
	}
	return arr.join('');
}
function draw(n, angle, str){
	let out_str = str;
	for(let i = 0; i < n; i++){
		out_str = convert(out_str);
	}
	turtle.begin();
	let len = 0;
	let x, y, a;
	let arr = out_str.split('');
	for(let i = 0; i < arr.length; i++){
		switch(arr[i]){
			case '-':
				turtle.rotate(-angle);
				break;
			case '+':
				turtle.rotate(angle);
				break;
			case 'F':
				turtle.forward(15);
				len += 15;
				break;
			case 'f':
				turtle.close();
				turtle.step(15);
				turtle.begin();
				break;
			case '[':
				turtle.close();
				turtle.begin();
				push([turtle.x, turtle.y, turtle.angle]);
				break;
			case ']':
				[turtle.x, turtle.y, turtle.angle] = pop();
				turtle.close();
				turtle.begin();
				break;
		}
	}
	console.log(len);
	turtle.close();
}
console.time();
draw(n, -angle,  str);
console.timeEnd();
// ctx.scale(0.5, 0.5);
// addEventListener('keypress', (e) => {
// 	switch(e.code){
// 		case 'KeyW':
// 			ctx.translate(0, -100);
// 			break;
// 		case 'KeyD':
// 			ctx.translate(100, 0);
// 			break;
// 		case 'KeyA':
// 			ctx.translate(-100, 0);
// 			break;
// 		case 'KeyS':
// 			ctx.translate(0, 100);
// 			break;
// 	}
// 	ctx.clearRect(-10000, -10000, 20000, 20000);
// 	draw(n, -angle,  str);
// });

