const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Map{
	constructor(options){
		this.naturalHeight = options.naturalHeight; // высота карты в пикселях
		this.naturalWidth  = options.naturalWidth;  // ширина карты в пикселях
		this.width         = null; 					// ширина карты в ячейках
		this.height        = null; 					// высота карты в ячейках
		this.box           = options.box; 			// количество пикселей в ячейке
		this.field         = []; 					// сама карта
		this.relief        = options.relief; 		// количество точек неровности карты
		this.distribution  = 23;						// определяем на сколько распрастраняются неровности (нечетное число)
		this.colorRanges   = [[0, 70], [70, 90], [90, 110], [110, 130], [130, 150], [150, 170], [170, 300]];
		this.colors        = ["#09426b", "#186296", "#2299bd", "#2bb5b5", "#d1d426", "#5dd426", "#1cab0f"];
		//["#1c6b09", "#319618", "#2fbd22", "#89b52b", "#d1d426", "#d4ae26", "#d46e26"];
	}
	init(){
		canvas.width  = this.naturalWidth;
		canvas.height = this.naturalHeight;
		this.width    = Math.round(this.naturalWidth / this.box);
		this.height   = Math.round(this.naturalHeight / this.box);

		for(let i = 0; i < this.height; i++){
			this.field[i] = [];
			for(let j = 0; j < this.width; j++){
				this.field[i][j] = {
					biom   : "plain",
					height : 100
				}
			}
		}
	}
	drawMap(){
		for(let i = 0; i < this.height; i++){
			for(let j = 0; j < this.width; j++){
				this.drawCell(j * this.box, i * this.box, this.box, this.box, this.defineCellColor(this.field[i][j]));
			}
		}
	}
	drawCell(x, y, width, height, color){
		ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.fillStyle = color;
			ctx.fill();
		ctx.closePath();
	}
	defineCellColor(cell){
		for(let i = 0; i < this.colorRanges.length; i++){
			if(cell.height > this.colorRanges[i][0] && cell.height <= this.colorRanges[i][1]){
				return this.colors[i];
			}
		}
	}
	generateRelief(){
		for(let n = 0; n < this.relief; n++){
			let uneven = Math.floor(Math.random() * 100 - 42);
			let i = Math.floor(Math.random() * this.height);
			let j = Math.floor(Math.random() * this.width);
			this.distributeUnevenness(j, i, uneven);
		}
	}
	distributeUnevenness(x, y, unevenness){
		let countDist = (this.distribution - 1) / 2; // количество пробежек по клеткам вокруг (x,y)
		let currentUnev = unevenness / (countDist + 1);	 // изменение высоты за каждую пробежку

		for(let m = countDist; m > 0; m--){

			for(let i = y - m; i <= y + m; i++){
				for(let j = x - m; j <= x + m; j++){
					if(this.isReal(j, i)) this.field[i][j].height += currentUnev;
				}
			}

		}

		this.field[y][x].height += currentUnev;
	}
	isReal(j, i){
		if(i >= 0 && i < this.height && j >= 0 && j < this.width) return true;
		return false;
	}
}

const map = new Map({
	naturalWidth:  900, // величина карты в пикселях
	naturalHeight: 600,
	relief:        1500, // количество точек генерации искревления ландшафта
	box:           3     // количество пикселей в одной клетке карты
});
map.init();
map.generateRelief();
map.drawMap();

let up = true;
canvas.addEventListener("click", (event) => {
	let x = Math.floor(event.offsetX / map.box);
	let y = Math.floor(event.offsetY / map.box);
	let unev = 40;
	if(!up){
		unev *= -1;
	}
	map.distributeUnevenness(x, y, unev);
	
	let m = (map.distribution - 1) / 2;

	for(let i = y - m; i <= y + m; i++){
		for(let j = x - m; j <= x + m; j++){
			if(map.isReal(j, i)) 
			map.drawCell(j * map.box, i * map.box, map.box, map.box, map.defineCellColor(map.field[i][j]));
		}
	}
});

addEventListener('keyup', (event) => {
	up = !up;
	console.log(up);
});