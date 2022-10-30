const config = { 
	fieldWidth: 10, // Ширина поля в клетках
	fieldHeight: 20,// Высота поля в клетках
	box: 20,        // Ширина и высота клетки в пикселях
	ms: 20,			// период показывания кадров
	pointsForLines: [100, 300, 700, 1500]	// очки за линии, где индекс+1 
											// количество соженных линий
}

function choice(array){
	return array[randomInteger(0, array.length - 1)];
}

function randomInteger(min, max){
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

function isACell(i, j){
	if(typeof field[i] != 'undefined' && typeof field[i][j] != 'undefined'){
		return true;
	}
	return false;
}

function isAValueInCell(i, j){
	if(isACell(i, j) && field[i][j]){
		return true;
	}
	return false;
}

class Field extends Array{
	constructor(){
		super();
	}
	init(){
		for(let i = 0; i < config.fieldHeight; i++) {
			this[i] = [];
			for(let j = 0; j < config.fieldWidth; j++){
				this[i][j] = 0;
			}
		}
	}
	checkAllUnitsInLine(i){
		for(let j = 0; j < this[i].length; j++){
			if(!this[i][j]) return false;
		}
		return true;
	}
	burnLines(){
		let lines = 0;
		for(let i = 0; i < this.length; i++){
			if(this.checkAllUnitsInLine(i)){
				lines++;
				this.splice(i, 1);
				this.unshift([]);
				for(let j = 0; j < config.fieldWidth; j++){
					this[0][j] = 0;
				}
			}
		}
		return lines;
	}
}

class FigureManager{
	constructor(){
		this.arrayFigures = ['J', 'L', 'O', 'Z', 'S', 'I', 'T'];
	}
	insertFigure(figure){
		for(let i = 0; i < figure.state.length; i++){
			for(let j = 0; j < figure.state[0].length; j++){
				if(figure.state[i][j]) field[i + figure.y][j + figure.x] = figure.index;
			}
		}
	}
	spawn(){
		let f = choice(figureManager.arrayFigures);

		let out;
		switch(f){
			case 'J':
				out = new Figure_J();
				break;
			case 'L':
				out = new Figure_L();
				break;
			case 'O':
				out = new Figure_O();
				break;
			case 'Z':
				out = new Figure_Z();
				break;
			case 'S':
				out = new Figure_S();
				break;
			case 'T':
				out = new Figure_T();
				break;
			case 'I':
				out = new Figure_I();
				break;
		}
		out.type = f;
		out.changeFigureIndex();
		return out;
	}
}

class LevelManager{
	constructor(){
		this.colors = { // цвета уровней
			'1': ['#ea0d0d', '#224de5', '#dcdcdc'], // красный синий белый
			'2': ['#CC6600', '#FF9900', '#C13100'], // оранжевый
			'3': ['#3b9a9c', '#fef4a9', '#78fee0'], // бирюзовый
			'4': ['#F54EA2', '#A94CAF', '#4f2ba1'], // фиолетовый
			'5': ['#003a44', '#66a4ac', '#06565b'], // болотный
			'6': ['#263859', '#dadada', '#ff6768'], // теракотовый
			'7': ['#fef4a9', '#3b9a9c', '#78fee0'] // теракотовый

		}
		this.pointsForLevels = [0, 3500, 8000, 12000, 16000, 19000, 22000];
		this.msForLevel = [130, 115, 100, 90, 80, 70, 65];
		this.level = 1;
	}
	changeLevel(){
		for(let i = 0; i < this.pointsForLevels.length; i++){
			if(statistic.points > this.pointsForLevels[i]) this.level = i + 1;
		}
	}
}

class Display{
	constructor(){
		this.canvas = document.querySelector('#main');
		this.ctx = this.canvas.getContext('2d');
		this.width = 0;
		this.height = 0;

		this.nextCanvas = document.querySelector('#nextFigure');
		this.nextCtx = this.nextCanvas.getContext('2d');
	}

	init(){
		this.width = this.canvas.width = config.fieldWidth * config.box;
		this.height = this.canvas.height = config.fieldHeight * config.box;

		this.nextCanvas.width  = config.box * 4;
		this.nextCanvas.height = config.box * 4;
	}

	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	drawNextFigure(){
		let canvas = this.canvas;
		this.canvas = this.nextCanvas;
		this.ctx = this.nextCtx;
		this.clear();

		let m;
		if(nextFigure.type != 'I') m = 1;
		else m = 0;
		for(let i = 0; i < nextFigure.state.length; i++) {
			for(let j = 0; j < nextFigure.state[0].length; j++){
				if(nextFigure.state[i][j]) this.drawCell(i + m, j, nextFigure.state[i][j]);
			} 
		}
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
	}

	rect(x, y, width, height, color){
		this.ctx.beginPath();
			this.ctx.rect(x, y, width, height );
			this.ctx.fillStyle = color;
			this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
			this.ctx.rect(x, y, 6, 6);
			this.ctx.fillStyle = 'white';
			this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
			this.ctx.rect(x + 4, y + 4, 2, 2);
			this.ctx.fillStyle = color;
			this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
			this.ctx.rect(x + 1, y + 1, width - 2, height - 2);
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = 'black';
			this.ctx.stroke();
		this.ctx.closePath();
	}

	drawCell(i, j, index){
		this.rect(j * config.box, i * config.box, config.box, config.box, 
					levelManager.colors[ levelManager.level][index - 1]);
	}

	drawField(){
		this.ctx.clearRect(0, 0, config.box * config.fieldWidth, config.box * config.fieldHeight);
		for(let i = 0; i < config.fieldHeight; i++) {
			for(let j = 0; j < config.fieldWidth; j++){
				if(field[i][j]) this.drawCell(i, j, field[i][j]);
			}
		}
	}

	drawFigure(figure){
		for(let i = 0; i < figure.state.length; i++) {
			for(let j = 0; j < figure.state[0].length; j++){
				if(figure.state[i][j]) this.drawCell(i + figure.y, j + figure.x, figure.state[i][j]);
			} 
		}
	}
}

class Keys{
	constructor(){
		this.down = 'Space';
		this.left = 'KeyF';
		this.right = 'KeyJ';
		this.turn = 'KeyI';
		this.keyPause = 'KeyO';
		this.pause = false;
		this.pressedKeys = {}
	}
	init(){
		addEventListener('keydown', (event) => {
			this.pressedKeys[event.code] = 1;
			display.clear();
			display.drawField();
			keys.move();
			display.drawFigure(figure);

			// ставим на паузу и снимаем с нее по нажатию клавиши
			if(event.code == this.keyPause) this.pause = !this.pause;
			// если игра стоит на паузе, то снимаем с нее по нажатию любой клавиши
			else if(this.pause) this.pause = false;
		});

		addEventListener('keyup', (event) => {
			this.pressedKeys[event.code] = 0;
		})
	}
	move(){
		if(this.pressedKeys[this.left]) figure.left();
		if(this.pressedKeys[this.right]) figure.right();
		if(this.pressedKeys[this.turn]) figure.turn();
		if(this.pressedKeys[this.down]){
			if(!figure.down()){
				figureManager.insertFigure(figure);

				let lines = 0;
				lines = field.burnLines();
				statistic.lines += lines;
				statistic.countingOfPoints(lines);

				levelManager.changeLevel();

				figure = nextFigure;
				nextFigure = figureManager.spawn();

				if(figure.type != 'I') statistic.drought++;
				else statistic.drought = 0;

				display.drawNextFigure();

				display.drawField();
			}
		}
	}
}

class Statistic{
	constructor(){
		this.linesInTetris = 0; // линии, соженные в тетрисе
		this.trt = 0;		// отношение линий, соженных в тетрисе, ко всем соженным линиям
		this.lines = 0;		// количество соженных линий
		this.points = 0;	// очки
		this.drought = 0;	// засуха, количество фигур без палки
	}
	countingOfPoints(n){
		if(n == 0) return;
		if(n == 4) {
			this.linesInTetris += 4;
		}
		this.trt = Math.round(this.linesInTetris / this.lines * 100);
		this.points += config.pointsForLines[n - 1];
	}
	showStatistics(){
		let score = document.getElementById('score');
		let lines = document.getElementById('lines');
		let level = document.getElementById('level');
		let trt = document.getElementById('trt');
		let drought = document.getElementById('drought');

		score.innerHTML = this.points;
		lines.innerHTML = `lines: ${this.lines}`; 
		level.innerHTML = `level: ${levelManager.level}`;
		trt.innerHTML = `trt: ${this.trt}%`;
		drought.innerHTML = `dr: ${this.drought}`;
	}
}

let field = new Field();
let display = new Display();
let statistic = new Statistic();
let keys = new Keys();
let levelManager = new LevelManager();
let figureManager = new FigureManager();
let nextFigure = figureManager.spawn();
let figure = figureManager.spawn();

display.init();
field.init();
keys.init();
keys.pause = true;

display.drawField();
display.drawFigure(figure);
display.drawNextFigure();

function move(){
	display.clear();
	display.drawField();

	if(!figure.down() && !figure.prohibitDescent){

		figureManager.insertFigure(figure);

		let lines = 0;
		lines = field.burnLines();
		statistic.lines += lines;
		statistic.countingOfPoints(lines);

		levelManager.changeLevel();

		figure = nextFigure;
		nextFigure = figureManager.spawn();

		if(figure.type != 'I') statistic.drought++;
		else statistic.drought = 0;

		display.drawNextFigure();

		display.drawField();
	}

	display.drawFigure(figure);
	figure.prohibitDescent--;
	if(figure.prohibitDescent < 0) figure.prohibitDescent = 0;

	statistic.showStatistics();
	if(gameOver()){
		newGame();
		keys.pause = true;
	}
};

function newGame(){
	field = new Field();
	display = new Display();
	statistic = new Statistic();
	keys = new Keys();
	levelManager = new LevelManager();
	figureManager = new FigureManager();
	figure = nextFigure;
	nextFigure = figureManager.spawn();

	if(figure.type != 'I') statistic.drought++;
	else statistic.drought = 0;

	display.init();
	field.init();
	keys.init();
	display.drawField();
	display.drawFigure(figure);
	
	display.drawNextFigure();
}

function gameOver(){
	for(let j = 0; j < field[0].length; j++){
		if(field[0][j]){
			return true;
		}
	}
}

let timer = setTimeout(function tick() {
	if(!keys.pause)	move();

	timer = setTimeout(tick, levelManager.msForLevel[ levelManager.level - 1]);
}, levelManager.msForLevel[ levelManager.level - 1]);