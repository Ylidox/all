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
		this.points = {}; // асс-ый массив вершин модели
		this.lines = []; // массив ребер модели
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
	generateId(len = 5){
		let letters = ('qazxswedcvfrtgbnhyujmikolp0123456789').split('');
		let id = '';

		function gen(){
			let out = '';
			for(let i = 0; i < len; i++){
				out += choice(letters);
			}
			return out;
		}

		do{
			id = gen();
		}while(this.points[id] != undefined);

		return id;
	}
	pushPoint(p){
		for(let id in this.points){
			if(this.pointComparison(p, this.points[id])) return id;
		}
		let id = this.generateId();
		this.points[id] = p;
		return id;
	}
	pushLine(id1, id2){
		for(let i = 0; i < this.lines.length; i++){
			let line = this.lines[i];
			if( line[0] == id1 && line[1] == id2 ||
				line[1] == id1 && line[0] == id2) return false;
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
		for(let id in this.points){
			let m = new Matrix(1, 4);
			m.setValue(this.points[id]);
			this.points[id] = m;
		}
	}
	null(){
		this.planes = [];
		this.center = new Matrix(1, 4);
		this.points = {};
		this.lines = [];
	}
}

class Model{
	constructor(options){
		this.center = options.center;
		this.points = options.points;
		this.lines = options.lines;
	}
	move(delta){
		let deltaM = new Matrix(1, 4);
		deltaM.setValue(delta);
		for(let id in this.points){
			this.points[id] = this.points[id].summ(deltaM);
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

		for(let id in this.points){
			this.points[id] = this.points[id].multiply(outMatrix);
		}
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

		for(let id in this.points){
			this.points[id] = this.points[id].multiply(outMatrix);
		}
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

		for(let id in this.points){
			this.points[id] = this.points[id].multiply(outMatrix);
		}
	}
}

class Axes{
	constructor(){
		this.points = [];
		this.init();
	}
	init(){
		let O = new Matrix(1, 4);
		let X = new Matrix(1, 4);
		let Y = new Matrix(1, 4);
		let Z = new Matrix(1, 4);
		O.setValue([0, 0, 0, 1]);
		X.setValue([1, 0, 0, 1]);
		Y.setValue([0, 1, 0, 1]);
		Z.setValue([0, 0, 1, 1]);
		this.points = [O, X, Y, Z];
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

		this.distance = -10; // растояние от точки наблюдения до плоскости проекции

	}
	init(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
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
		this.drawLine(O, Z, 'green');*/
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
	transformCoordinates(point){
		return point.multiply( this.matrixTransformCoordinates);
	}
	projectToPlane(point){
		let [x, y, z] = point[0];
		if(Math.abs(y) < 0.001 ) y = 0.1;
		return [this.distance * x / y, this.distance * z / y];
	}
	drawLine(p1, p2, color = this.color){
		this.ctx.beginPath();
			this.ctx.moveTo(p1[0] * this.scale, p1[1] * this.scale);
			this.ctx.lineTo(p2[0] * this.scale, p2[1] * this.scale);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
		this.ctx.closePath();
	}
	drawModel(projModel){
		for(let i = 0; i < projModel.lines.length; i++){
			let line = projModel.lines[i];
			let p1 = projModel.points[line[0]];
			let p2 = projModel.points[line[1]];
			this.drawLine(p1, p2);
		}
	}
	render(models){
		console.time()
		for(let i = 0; i < models.length; i++){
			let model = new Model(models[i]);
			for(let id in model.points){
				model.points[id] = this.transformCoordinates(model.points[id]);
				model.points[id] = this.projectToPlane(model.points[id]);
			}
			this.drawModel(model);
			// console.log(model)
		}
		console.timeEnd();
	}
}

let modelConstructor = new ModelConstructor();
let p1 = new Matrix(1, 4);
p1.setValue([1.0001, 0.9999, 1.0002, 1]);
let p2 = new Matrix(1, 4);
p2.setValue([2, 3.00012, 1.00009888, 1]);

// console.log(model.pushPoint(p1));
// console.log(model.pushPoint(p2));

// console.log(model.generateId(4));
// console.log(model.generateId(4));
// console.log(model.generateId(4));
// console.log(model.generateId(4));

let Plane1 = new Plane();
Plane1.setValue([2, 0, 0, 1], [2, 2, 0, 1], [2, 0, 2, 1]);
let Plane2 = new Plane();
Plane2.setValue([2, 0, 2, 1], [2, 2, 2, 1], [2, 2, 0, 1]);

let Plane3 = new Plane();
Plane3.setValue([2, 2, 2, 1], [2, 2, 0, 1], [0, 2, 0, 1]);
let Plane4 = new Plane();
Plane4.setValue([2, 2, 2, 1], [0, 2, 2, 1], [0, 2, 0, 1]);

let Plane5 = new Plane();
Plane5.setValue([0, 0, 0, 1], [0, 2, 0, 1], [0, 2, 2, 1]);
let Plane6 = new Plane();
Plane6.setValue([0, 0, 0, 1], [0, 0, 2, 1], [0, 2, 2, 1]);

let Plane7 = new Plane();
Plane7.setValue([0, 0, 0, 1], [2, 0, 0, 1], [2, 0, 2, 1]);
let Plane8 = new Plane();
Plane8.setValue([0, 0, 0, 1], [0, 0, 2, 1], [2, 0, 2, 1]);

let Plane9 = new Plane();
Plane9.setValue([0, 0, 0, 1], [2, 0, 0, 1], [2, 0, 2, 1]);
let Plane10 = new Plane();
Plane10.setValue([0, 0, 0, 1], [0, 0, 2, 1], [2, 0, 2, 1]);

modelConstructor.planes = [Plane1, Plane2, Plane3, Plane4, Plane5, Plane6, Plane7, Plane8, Plane9, Plane10];
modelConstructor.init();

let model = new Model(modelConstructor);
model.move([-1, 3, -1]);
// model.rotateZ(0.15);

let axes = new Axes();

let camera = new Camera3d(document.querySelector('canvas'));
camera.init();
// camera.angles[2] = -Math.PI / 10;
camera.move([0, 0, 1.5]);
camera.createMatrixTransformCoordinates();
camera.drawAxes(axes);

camera.drawAxes();
camera.render([model]);

