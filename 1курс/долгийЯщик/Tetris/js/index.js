const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width, height; // ширина и высота поля

const config = { 
	fieldWidth: 10, // Ширина поля в клетках
	fieldHeight: 20,// Высота поля в клетках
	box: 20,        // Ширина и высота клетки в пикселях
	ms: 20			// период показывания кадров
}

const field = [];
const figures = [/*'J', 'L', */'S'];

let tetramino; // текущая фигура

const colors = { // цвета уровней
	'1': ['yellow', 'green', 'blue'],
	'2': ['#22e3c4', '#00c39a', '#aeac02']
}

let level = 2;

function choice(array){
	return array[randomInteger(0, array.length - 1)];
}

function randomInteger(min, max){
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

function init(config){
	width = canvas.width = config.fieldWidth * config.box;
	height = canvas.height = config.fieldHeight * config.box;
	canvas.style.border = '5px solid #a3a2a2';

	for(let i = 0; i < config.fieldHeight; i++) {
		field[i] = [];
		for(let j = 0; j < config.fieldWidth; j++){
			field[i][j] = 0;
		}
	}
}

function rect(x, y, width, height, color){
	ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.fillStyle = color;
		ctx.fill();
	ctx.closePath();
}

function drawfield(){
	ctx.clearRect(0, 0, config.box * config.fieldWidth, config.box * config.fieldHeight);
	for(let i = 0; i < config.fieldHeight; i++) {
		for(let j = 0; j < config.fieldWidth; j++){
			if(field[i][j]) rect(j * config.box, i * config.box, config.box, config.box, colors[level][field[i][j] - 1])
		}
	}
}

function respawn(){
	let x = Math.floor((field[0].length - 2) / 2);
	let y = 1;
	type = choice(figures);
	index = randomInteger(1, 3);
	tetramino = new CurrentFigure();
	tetramino.init(type, x, y, index);
	tetramino.spawn();
}

addEventListener('keydown', (event) => {
	switch(event.code){
		case 'KeyV':
			tetramino.left();
			break;
		case 'KeyN':
			tetramino.right();
			break;
		case 'KeyF':
			for(let i = 0; i < config.fieldHeight; i++){
				if(!tetramino.result) break;
				tetramino.down();
			}
			break;
		case 'KeyJ':
			tetramino.turnRight();
			break;
		case 'Space':
			tetramino.down();
	}
	if(!tetramino.result){
		respawn();
		drawfield();
	}
	drawfield();
})

class CurrentFigure{
	constructor(){
		this.figure = null;
		this.result = true;
	}
	init(type, x, y, index){
		switch(type){
			case 'J':
				this.figure = new Figure_J(x, y, index);
				break;
			case 'L':
				this.figure = new Figure_L(x, y, index);
				break;
			case 'S':
				this.figure = new Figure_S(x, y, index);
				break;
		}
	}
	spawn(){
		this.figure.spawn(field);
	}
	turnLeft(){
		this.figure.turnLeft(field);
	}
	turnRight(){
		this.figure.turnRight(field);
	}
	down(){
		this.figure.down(field);
		this.result = this.figure.result;
	}
	left(){
		this.figure.left(field);
	}
	right(){
		this.figure.right(field);
	}
}



init(config);
respawn();
drawfield();