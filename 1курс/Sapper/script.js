const config = {
	padding            : 1, // отступы между ячейками
	colorNumber       : ['green', 'blue', 'red'], // цвет цифр, отображающих количество мин у соседей
	colorCellOpen     : 'white',
	colorCellHidden   : 'lightGray',
	colorBorderCell   : 'gray',
	numberMine        : 40,
	colorMine         : 'red'
}
const box = 20; // размер клетки в пикселях
const width = 20; // ширина и высота поля в клетках
const height = 20;
const font = 13; // размер шрифта
const fontGAMEOVER = 50;
let field = [];
let arrayMine = []; // сюда занесем все клетки с минами, чтобы удобнее было работать
let numFlag = 0; // количество поставленный флажков

const flag = new Image();
flag.src = "flag.jpg";

let game = true; // если игрок не проиграл

createCanvas = (w, h) => {
	window.canvas = document.createElement('canvas');
	canvas.height = h;
	canvas.width = w;
	document.body.append(canvas);
	window.ctx = canvas.getContext('2d');
}

drawText = (string, x, y, color = 'darkRed', font = 13) => {
	ctx.beginPath();
		ctx.fillStyle = color;
		ctx.font = font + "px CourierNew";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(string, x, y);
	ctx.closePath();
}

clear = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

initField = () => {
	let index = 0;
	for(let i = 0; i < height; i++){
		field[i] = [];
		for(let j = 0; j < width; j++){
			field[i][j] = {
				'neighbors'      : 0,
				'mine'           : false,
				'condition'      : 'hidden', // 'open', 'flage' 
				// определяем состояния ячеек. Скрытый, открытый, поставлен флажек
				'index'          : index, // индекс ячейки, нужен для алгоритма поиска путей
				'flag'			 : false // отмечена ли клетка флажком
			}
			index++;
		}
	}
}
createCanvas(box * width, box * height);
initField();

putFlag = (i, j) => {
	ctx.drawImage(flag, j * box + config.padding, i * box + config.padding, box - 2 * config.padding, box - 2 * config.padding);
	gameOver();
}

showCell = (cell, i, j) => {
	// отрисовка границы
	ctx.beginPath();
		ctx.rect(j * box, i * box, box, box);
		ctx.fillStyle = config.colorBorderCell;
		ctx.fill();
	ctx.closePath();
	// отрисовка ячейки
	ctx.beginPath();
		ctx.rect(j * box + config.padding, i * box + config.padding, box - 2 * config.padding, box - 2 * config.padding);
		if(cell.condition  == 'hidden'){
			ctx.fillStyle = config.colorCellHidden;
		}else if(cell.condition  == 'open' && !cell.mine){
			ctx.fillStyle = config.colorCellOpen;	
		}else if(cell.condition  == 'open' && cell.mine){
			ctx.fillStyle = config.colorMine;
		}
		ctx.fill();
	ctx.closePath();
	// отрисовка числа мин у соседних клеток
	if(cell.condition == 'open' && cell.neighbors != 0 && !cell.mine){
		drawText(cell.neighbors, j * box + box / 2, i * box + box / 2, config.colorNumber[cell.neighbors - 1], font);
	}

	if(cell.flag){
		putFlag(i, j);
	}
}

showField = () => {
	for(let i = 0; i < height; i++){
		for(let j = 0; j < width; j++){
			showCell( field[i][j], i, j);
		}
	}
}

showField();

checkNeighbour = (field) => {
	for(let i = 0; i < height; i++){
		for(let j = 0; j < width; j++){
			field[i][j].neighbors = 0;
		}
	}

	check = 0;
	for(let i = 0; i < field.length; i++){
		for(let j = 0; j < field[i].length; j++){
			let cell = field[i][j];
			for(let m = i - 1; m < i + 2; m++){
				if(typeof field[m] == 'object'){
						for(let n = j - 1; n < j + 2; n++){
						if(typeof field[m][n] == 'object'){
							if(m == i && n == j) continue;
							if(field[m][n].mine){
								cell.neighbors++;
							}
						}
					}
				}
			}

		}
	}
}

generateMine = (x, y) => { // передача координатов клика мыши, чтобы не сгенерировать мину в кликнутой ячейке
	let mine = 0;
	while(mine < config.numberMine){
		let i = Math.floor(Math.random() * height);
		let j = Math.floor(Math.random() * width);

		if( (i == y && j == x) || field[i][j].mine) continue;

		field[i][j].mine = true;
		arrayMine.push(field[i][j]);
		mine++;
	}
}

firstClick = (i, j) => {
	generateMine(j, i);
	checkNeighbour(field);
}

openField = (x, y) => {
	let fifo = []; // очередь
	let vertex = []; // посещенные вершины

	function push(element){
		fifo.push(element);
		vertex.push(element.index);
	}
	function pop(){
		return fifo.shift();
	}

	function openNeighbors(x, y){
		for(let m = y - 1; m < y + 2; m++){
			if(typeof field[m] == 'object'){
				for(let n = x - 1; n < x + 2; n++){
					if(typeof field[m][n] == 'object'){
						if(m == y && n == x) continue;
						
						if(!field[m][n].mine){ // если мы еще не посещали эту клетку

							if(!field[y][x].neighbors) field[m][n].condition = 'open';
							
							if(vertex.indexOf(field[m][n].index) == -1 && !field[m][n].neighbors){
								push(field[m][n]);
							}
						}

					}
				}
			}
		}
	}

	push(field[y][x]); // заносим в очередь стартовую клетку
	function run(){
		while(fifo.length){
			let cell = pop();
			let cellY = Math.floor(+cell.index / height);
			let cellX = Math.floor(+cell.index % width);
			openNeighbors(cellX, cellY);
		} 
	}
	run();
}

let first = true; // первый клик

gameOver = () => {
	let win = true;
	for (let i = 0; i < arrayMine.length; i++) {
		if(arrayMine[i].mine && arrayMine[i].condition == 'open'){
			game = false;

			drawText('GAME OVER', canvas.width / 2, canvas.height / 2, 'red', fontGAMEOVER);

			break;
		}
		if(arrayMine[i].mine && !arrayMine[i].flag){
			win = false; 
		}
	}

	if(win && arrayMine.length && numFlag == arrayMine.length){
		drawText('WIN', canvas.width / 2, canvas.height / 2, 'red', fontGAMEOVER);
		game = false;
	}
}



// обрабатываем событие нажатия на левую кнопку мыши
canvas.addEventListener('click', (event) => {
	if (!game){
		// новая игра
		first = true;
		field = [];
		arrayMine = [];
		initField();
		showField();
		game = true;
		numFlag = 0;
		return;
	}

	let i = Math.floor(event.offsetY / box);
	let j = Math.floor(event.offsetX / box);
	
	field[i][j].condition = 'open';

	if(first){
		firstClick(i, j);
		first = false;
	}

	openField(j, i);

	if(field[i][j].flag){
		field[i][j].flag = false;
		field[i][j].condition = 'hidden';
		numFlag--;
	}

	clear();
	showField();

	gameOver();
});

// обрабатываем событие нажатия на правую кнопку мыши
document.addEventListener('contextmenu', event => {
	if (event.which != 3) return; // выйти, если не нажата правая кнопка мыши
	if (!arrayMine.length) return;
	let i = Math.floor(event.offsetY / box);
	let j = Math.floor(event.offsetX / box);
	field[i][j].flag = true;
	numFlag++;
	putFlag(i, j);

	event.preventDefault()
});