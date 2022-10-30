(() => {
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');

	const width = canvas.width = window.innerWidth;
	const height = canvas.height = window.innerHeight;

	let string = 'JavaScript';
	clear();
	function clear(){
		ctx.beginPath();
			ctx.rect(0, 0, width, height);
			ctx.fillStyle = '#060112';
			ctx.fill()
		ctx.closePath();
	}
	let lastLoop = new Date();
	findFPS = () => {
	    let thisLoop = new Date();
	    fps = 1000 / (thisLoop - lastLoop);
	    fps = fps.toFixed(3);
	    lastLoop = thisLoop;
	    drawText1(fps, 100, 20);
	}
	function drawText1(string, x, y){
		ctx.fillStyle = "red";
		ctx.font = "20px Verdana";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(string, x, y);
	}
	function drawText(){
		ctx.beginPath();
		ctx.fillStyle = "#0ee355";
		ctx.font = "250px Verdana";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(string, width/2, height/2);
		ctx.closePath();
	}
	drawText();

	function getArrayPixel(w, h, channel, dataImage){ // возвращает двумерный массив значений конкретного канала у пикселей
		
		// представляем одномерный массив в двумерный массив значений заданного канала
		let array = [];
		let count = channel; // 0 - red, 1 - blue, 2 - green, 3 - opacity
		for(let i = 0; i < h; i++){
			array[i] = [];
			for(let j = 0; j < w; j++){
				array[i][j] = dataImage.data[count];
				count += 4;
			}
		}
		return array;
	}
	function cutFromPicture(array, x, y, w, h){ // вырезать из картинки двумерный массив
		let arrPix = [];

		if(x + w > array[0].length) w = array[0].length - x;
		if(y + h > array.length) h = array.length - y;

		for(let i = y; i < y + h; i++){
			arrPix.push([]);
			for(let j = x; j < x + w; j++){
				let last = arrPix.length - 1;
				arrPix[last].push(array[i][j]);
			}
		}

		return arrPix;
	}

	//////////////// Сделаем область, в которой будет писаться текст //////////////////

	let areaWidth = width;
	let areaHeight = 250 + 50; // где 250 - размер шрифта
	let box = 10;			   // размер ячейки
	let upGranz = (height - areaHeight) / 2;
	let downGranz = upGranz + areaHeight;

	let condition = [];

	let redPixel = getArrayPixel(width, height, 0, ctx.getImageData(0, 0, width, height));
	let countI = Math.floor(areaHeight / box);
	let countJ = Math.floor(areaWidth / box);

	function updateCondition(){
		redPixel = getArrayPixel(width, height, 0, ctx.getImageData(0, 0, width, height));
		condition = [];
		for(let i = 0; i < countI; i++){
			condition[i] = [];
			for(let j = 0; j < countJ; j++){
				let check = false;
				let currentPixel = cutFromPicture(redPixel, Math.floor(j * box),Math.floor(i * box + upGranz), box, box);
				// console.log(currentPixel)
				for(let m = 0; m < currentPixel.length; m++){
					for(let n = 0; n < currentPixel[m].length; n++){
						
						if(currentPixel[m][n] != 6){
							condition[i][j] = 1;
							check = true;
							break;
						}else{
							condition[i][j] = 0;
						}
					}
					if(check) break;
				}
			}
		}
	}

	function show(){

		ctx.beginPath();
			ctx.rect(0, upGranz, areaWidth, areaHeight);
			ctx.strokeStyle = 'rgda(50, 50, 50, 0.5)';
			ctx.stroke();
		ctx.closePath();
		
		for(let i = 0; i < condition.length; i++){
			for(let j = 0; j < condition[0].length; j++){
				ctx.beginPath();
					ctx.rect(j * box, i * box + upGranz, box, box);
					if(condition[i][j]){
						ctx.fillStyle = 'rgba(200, 200, 200, .5)';
						ctx.fill();
					}
					ctx.stroke();
				ctx.closePath();
			}
		}

	}

	function drawArea(){
		ctx.beginPath();
			ctx.rect(0, (height - areaHeight) / 2, areaWidth, areaHeight);
			ctx.fillStyle = 'rgba(70, 70, 70, 0.5)';
			ctx.fill();
		ctx.closePath();
	}

	updateCondition();
	clear();
	// show();

	//////////////////////////////////////////////////////////////////////

	////////////////// Создаем квадратики ///////////////////////////////

	function random(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}
	
	class Rect{
		constructor(options){
			this.x = options.x;
			this.y = options.y;
			this.constX = options.x;
			this.constY = options.y;

			this.w = options.w;
			this.h = options.h;
			this.angle = options.angle;
			this.mass  = this.w * this.h;
			this.vx = 0;
			this.vy = 0;

		}

		draw(){
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.fillStyle = "#0ee355";
			ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
			ctx.restore();
		}

	}
	let rects = [];
	let rectsInCellConditions = 2;
	function initRects(){
		for(let i = 0; i < condition.length; i++){
			for(let j = 0; j < condition[0].length; j++){
				// if(condition[i][j]){
				// 	for(let k = 0; k < rectsInCellConditions; k++){
				// 	ctx.beginPath();
				// 		ctx.arc(random(j * box, box * (j + 1)), random(i * box, box *( i + 1)) + upGranz, 2, 0, 2 * Math.PI);
				// 		ctx.fillStyle = 'lime';
				// 		ctx.fill();
				// 	ctx.closePath();
				// 	}
				// }
				if( condition[i][j]){
					for(let k = 0; k < rectsInCellConditions; k++){
						rects.push( new Rect({
							x: random(j * box, (j + 1) * box),
							y: random(i * box, (i + 1) * box) + upGranz,
							w: random(1, box),
							h: random(1, box),
							angle: random(0, 2 * Math.floor(Math.PI * 1000)) / 1000
						}));
					}
				}
			}
		}
	}

	initRects();
	
	let dot = {
		x: 0,
		y: 0,
		repulsionRadius : 100
	}

	addEventListener('mousemove', (event) => {
		dot.x = event.offsetX;
		dot.y = event.offsetY;
	});

	function compNum(a, b){
		if(Math.abs(a - b) < 0.01){
			return true;
		}
		return false;
	}

	function updateRects(){
		for (let i = 0; i < rects.length; i++) {
			rects[i].draw();

			let delta = {x: dot.x - rects[i].x, y: dot.y - rects[i].y}
			let dist = Math.sqrt((delta.x)**2 + (delta.y)**2);
			if(dist < dot.repulsionRadius){ // отталкиваем частицу от курсора
				let acc = {x: 0, y: 0};
				let force = rects[i].mass * 0.002;
				acc.x = delta.x * force;
				acc.y = delta.y * force;
				rects[i].vx -= acc.x;
				rects[i].vy -= acc.y;
			}else{ // притягиваем частицу к первоначальной позиции
				if( !(compNum(rects[i].x, rects[i].constX) && compNum(rects[i].y, rects[i].constY))){
					delta = {x: rects[i].constX - rects[i].x, y: rects[i].constY - rects[i].y}
					dist = Math.sqrt((delta.x)**2 + (delta.y)**2);
					let acc = {x: 0, y: 0};
					let force = rects[i].mass * 0.001;
					acc.x = delta.x * force;
					acc.y = delta.y * force;
					rects[i].vx += acc.x;
					rects[i].vy += acc.y;
				}
			}
			rects[i].vx *= 0.65;
			rects[i].vy *= 0.65;
			rects[i].x += rects[i].vx;
			rects[i].y += rects[i].vy;
		}
	}


	function loop(){
		clear();
		// drawText();
		findFPS();
		updateRects();
		requestAnimationFrame(loop);	
	}
	loop();

})()