function choice(array){
	return array[randomInteger(0, array.length - 1)];
}

function randomInteger(min, max){
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

class Plane extends Matrix{
	constructor(){
		super(3, 4);
	}
}

class ModelConstructor{
	constructor(){
		this.planes = []; // массив полигонов модели
		this.center = new Matrix(1, 4); // центр модели
		this.points = []; // массив вершин модели
		this.lines = []; // массив ребер модели
		this.hashLines = {}; // массив хешей линий
	}
	pointComparison(p1, p2){
		let p = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
		function comp(a, b){
			if(Math.abs(a - b) < 0.0001) return true;
			else return false;
		}
		if(comp(p[0], 0) && comp(p[1], 0) && comp(p[2], 0)) return true;
		else return false;
	}
	pushPoint(p){
		let id = 0
		for(; id < this.points.length; id++){
			if(this.pointComparison(p, this.points[id])) return id;
		}	
		this.points.push(p);
		return id;
	}
	generateHashLine(id1, id2){
		return Math.floor((id1 % id2) * Math.hypot(id1, id2));
	}
	pushLine(id1, id2){
		let hash  = this.generateHashLine(id1, id2);
		if(!this.hashLines[hash]){
			this.hashLines[hash] = [id1, id2];
		}else{
			for(let i = 0; i < this.hashLines[hash].length; i++){
				let line = this.hashLines[hash][i];
				if( line[0] == id1 && line[1] == id2 ||
					line[1] == id1 && line[0] == id2) return false;
			}
			this.hashLines[hash].push([id1, id2]);
		}
		this.lines.push([id1, id2]);
	}
	init(){
		for(let i = 0; i < this.planes.length; i++){
			let plane = this.planes[i];
			let id = [];
			for(let j = 0; j < 3; j++){
				let point = plane[j];
				id.push(this.pushPoint(point));
			}
			this.pushLine(id[0], id[1]);
			this.pushLine(id[0], id[2]);
			this.pushLine(id[1], id[2]);
		}
		for(let id = 0; id < this.points.length; id++){
			let m = new Matrix(1, 4);
			m.setValue(this.points[id]);
			this.points[id] = m;
		}
	}
	null(){
		this.planes = [];
		this.center = new Matrix(1, 4);
		this.points = [];
		this.lines = [];
	}
	generateMatrixPoints(arrP){
		this.points = new Matrix(arrP.length, 4);
		this.points.setValue(...arrP);
	}
}

class Model{
	constructor(options = null){
		if(!options){
			this.center = new Matrix(1, 4);
			this.points = [];
			this.lines = [];
		}
		this.center = options?.center;
		this.points = options?.points;
		this.lines = options?.lines;
	}
	move(delta){
		// let deltaM = new Matrix(1, 4);
		// deltaM.setValue(delta);
		for(let id = 0; id < this.points.length; id++){
			this.points[id][0] += delta[0];
			this.points[id][1] += delta[1];
			this.points[id][2] += delta[2];
			// this.points[id] = this.points[id].summ(deltaM);
		}
		this.center = this.center.summ(deltaM);
	}
	rotateX(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0, z0) в начало координат (0,0, 0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-center[0][0], -center[0][1], -center[0][2], 1]);

		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [center[0][0], center[0][1], center[0][2], 1]);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[1, 0, 0, 0],
			[0, Math.cos(angle), Math.sin(angle), 0],
			[0, -Math.sin(angle), Math.cos(angle), 0],
			[0, 0, 0, 1]);

		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);

		// for(let id = 0; id < this.points.length; id++){
		// 	this.points[id] = this.points[id].multiply(outMatrix);
		// }
		this.points = this.points.multiply(outMatrix);
	}
	rotateY(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0, z0) в начало координат (0,0, 0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-center[0][0], -center[0][1], -center[0][2], 1]);

		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [center[0][0], center[0][1], center[0][2], 1]);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[Math.cos(angle), 0, -Math.sin(angle), 0],
			[0, 1, 0, 0],
			[Math.sin(angle), 0, Math.cos(angle), 0],
			[0, 0, 0, 1]);

		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);

		// for(let id = 0; id < this.points.length; id++){
		// 	this.points[id] = this.points[id].multiply(outMatrix);
		// }
		this.points = this.points.multiply(outMatrix);
	}
	rotateZ(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0, z0) в начало координат (0,0, 0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-center[0][0], -center[0][1], -center[0][2], 1]);

		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [center[0][0], center[0][1], center[0][2], 1]);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[Math.cos(angle), Math.sin(angle), 0, 0],
			[-Math.sin(angle), Math.cos(angle), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]);

		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);

		// for(let id = 0; id < this.points.length; id++){
		// 	this.points[id] = this.points[id].multiply(outMatrix);
		// }
		this.points = this.points.multiply(outMatrix);
	}
}

class Camera3d{
	constructor(canvas){
		this.angles = new Float32Array(3); // массив, содержащий углы поворота по осям X, Y, Z
		this.center = new Matrix(1, 4);

		this.color = 'lime';
		this.scale = 30; // масштаб
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		
		this.matrixTransformCoordinates = new Matrix(4, 4);

		this.distance = 10; // растояние от точки наблюдения до плоскости проекции
	}
	init(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx.transform(1, 0, 0, -1, 0, this.canvas.height);
		this.ctx.translate(this.canvas.width * 0.5, this.canvas.height * 0.5); // переносим начало координат в центр экрана
		
	}
	move(delta){
		let deltaM = new Matrix(1, 4);
		deltaM.setValue(delta);
		this.center = this.center.summ(deltaM);
	}
	drawAxes(axes){
		// let O, X, Y, Z;
		// try{
		// 	[O, X, Y, Z] = axes.points;
		// }catch{}
		
		// console.log(O[0]);
	/*
		X = this.transformCoordinates(X);
		X = this.projectToPlane(X);

		Y = this.transformCoordinates(Y);
		Y = this.projectToPlane(Y);

		Z = this.transformCoordinates(Z);
		Z = this.projectToPlane(Z);

		O = this.transformCoordinates(O);
		O = this.projectToPlane(O);

		this.drawLine(O, X, 'red');
		this.drawLine(O, Y, 'blue');
		this.drawLine(O, Z, 'green');
		*/
	}
	clear(){
		this.ctx.clearRect(-this.canvas.width * 0.5, -this.canvas.height * 0.5, this.canvas.width, this.canvas.height);
	}
	createMatrixTransformCoordinates(){
		let center = this.center;
		let angles = this.angles;

		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0, z0) в начало координат (0,0, 0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-center[0][0], -center[0][1], -center[0][2], 1]);

		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [center[0][0], center[0][1], center[0][2], 1]);

		let rotateMatrixX = new Matrix(4, 4); // матрица поворота вокруг начала координат отн-но OX
		rotateMatrixX.setValue(
			[1, 0, 0, 0],
			[0, Math.cos(angles[0]), Math.sin(angles[0]), 0],
			[0, -Math.sin(angles[0]), Math.cos(angles[0]), 0],
			[0, 0, 0, 1]);

		let rotateMatrixY = new Matrix(4, 4); // матрица поворота вокруг начала координат отн-но OY
		rotateMatrixY.setValue(
			[Math.cos(angles[1]), 0, -Math.sin(angles[1]), 0],
			[0, 1, 0, 0],
			[Math.sin(angles[1]), 0, Math.cos(angles[1]), 0],
			[0, 0, 0, 1]);

		let rotateMatrixZ = new Matrix(4, 4); // матрица поворота вокруг начала координат отн-но OZ
		rotateMatrixZ.setValue(
			[Math.cos(angles[2]), Math.sin(angles[2]), 0, 0],
			[-Math.sin(angles[2]), Math.cos(angles[2]), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]);

		let outMatrix = matrixTransfer.multiply(rotateMatrixX)
									.multiply(rotateMatrixY)
									.multiply(rotateMatrixZ);

		// outMatrix = outMatrix.multiply(matrixRTransfer);

		this.matrixTransformCoordinates = outMatrix;
	}
	transformCoordinates(points){
		return points.multiply( this.matrixTransformCoordinates);
	}
	projectToPlane(points){
		let pPoints = [];
		for(let i = 0; i < points.length; i++){
			let [x, y, z] = points[i];
			pPoints.push([this.distance * x / (y + 1), this.distance * z / (y + 1)]);
		}
		return pPoints;
		// let [x, y, z] = point[0];
		// return [this.distance * x / (y + 1), this.distance * z / (y + 1)];
	}
	drawLine(p1, p2, color){
		this.ctx.beginPath();
			this.ctx.moveTo(p1[0] * this.scale, p1[1] * this.scale);
			this.ctx.lineTo(p2[0] * this.scale, p2[1] * this.scale);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
		this.ctx.closePath();
	}
	clippingLines(p1, p2){
		let scale = this.scale;
		let canvas = this.canvas;
		function pointInScreen(p){
			if( p[0] * scale > -canvas.width / 2 &&
				p[0] * scale < canvas.width / 2 &&
				p[1] * scale > -canvas.height / 2 &&
				p[1] * scale < canvas.height / 2)
				return true;
			else return false;
		}
		if(pointInScreen(p1) && pointInScreen(p2)) return false;
		else{
			count++;
			return true;
		}
	}
	drawModel(projPoints, lines, color = this.color){
		for(let i = 0; i < lines.length; i++){
			let line = lines[i];
			let p1 = projPoints[line[0]];
			let p2 = projPoints[line[1]];

			if(this.clippingLines(p1, p2)) continue;

			this.drawLine(p1, p2, color);
		}
	}
	render(models){
		console.time()
		for(let i = 0; i < models.length; i++){
			let points = [];
			points = this.transformCoordinates(models[i].points);
			points = this.projectToPlane(points);

			this.drawModel(points, models[i].lines);
		}
		console.timeEnd();
	}
}
var count = 0;

let camera = new Camera3d(document.querySelector('canvas'));
camera.init();
// camera.angles[0] = -Math.PI / 10;
camera.ctx.lineWidth = 0.2
camera.move([15, -70, 140]);
camera.createMatrixTransformCoordinates();

let venera = new Model();
window.points = [];
window.faces = [];

let mc;
function drawVenera(){
	mc = new ModelConstructor();
	mc.generateMatrixPoints(points);
	for(let i = 0; i < faces.length; i++){
		let lines = [];
		let [p1, p2, p3, p4] = faces[i];

		mc.pushLine(p1 - 1, p2 - 1);
		mc.pushLine(p2 - 1, p3 - 1);
		mc.pushLine(p3 - 1, p4 - 1);
		mc.pushLine(p4 - 1, p1 - 1);
	}

	venera = new Model(mc);
	camera.render([venera]);
}


