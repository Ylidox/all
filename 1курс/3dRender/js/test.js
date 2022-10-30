class Camera3d{
	constructor(canvas){
		this.center = new Matrix(1, 4);							// точка наблюдения
		this.projectionPlane = new Matrix(3, 4);				// плоскость проекции
		this.planeCharacteristics = {A: 0, B: 0, C: 0, D: 0};	// характеристики плоскости проекции
		this.straightToPlane = {t: 0}; // из точки наблюдения проводим перпендикуляр к плоскости проекции
		// с помощью уравнения прямой находим параметр t, чтобы найти точку пересечения прямой и плоскости
		this.intersectionPoint = new Matrix(3, 3); // точка пересечения перпендикуляра и плоскости,
		// записанная трижды

		this.scale = 150;										// масштаб
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.translate(this.canvas.width * 0.5, this.canvas.height * 0.5); // переносим начало координат в центр экрана
	}
	getCharacteristics(plane){
		let dx1 = plane[1][0] - plane[0][0];
		let dx2 = plane[2][0] - plane[1][0];
		let dy1 = plane[1][1] - plane[0][1];
		let dy2 = plane[2][1] - plane[1][1];
		let dz1 = plane[1][2] - plane[0][2];
		let dz2 = plane[2][2] - plane[1][2];

		let A, B, C, D;
		A = dy1 * dz2 - dy2 * dz1;
		B = dz1 * dx2 - dz2 * dx1;
		C = dx1 * dy2 - dx2 * dy1;
		D = -plane[0][0] * A - plane[0][1] * B - plane[0][2] * C;

		return {A: A, B: B, C: C, D: D};
	}
	initCharacteristics(){
		
		this.planeCharacteristics = this.getCharacteristics( this.projectionPlane);
		let {A, B, C, D} = this.planeCharacteristics;

		let [x0, y0, z0] = this.center[0];
		let t = - (D + A * x0 + B * y0 + C * z0) / (A ** 2 + B ** 2 + C ** 2);
		this.straightToPlane = {t: t};

		this.intersectionPoint.setValue([A * t + x0, B * t + y0, C * t + z0],
										[A * t + x0, B * t + y0, C * t + z0],
										[A * t + x0, B * t + y0, C * t + z0]);
	}
	move(arrayDX){ // массив смещений по координатам dx, dy, dz
		let [dx, dy, dz] = arrayDX;
		this.center[0][0] += dx;
		this.center[0][1] += dy;
		this.center[0][2] += dz;

		for(let i = 0; i < this.projectionPlane.length; i++){
			for(let j = 0; j < 3; j++){
				this.projectionPlane[i][j] += arrayDX[j];
			}
		}
		this.initCharacteristics();
	}
	rotateX( angle){ 
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0) в начало координат (0,0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-this.center[0][0], -this.center[0][1], -this.center[0][2], 1]);
		// console.log( matrixTransfer);
		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [this.center[0][0], this.center[0][1], this.center[0][2], 1]);
		// console.log( matrixRTransfer);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[1, 0, 0, 0],
			[0, Math.cos(angle), Math.sin(angle), 0],
			[0, -Math.sin(angle), Math.cos(angle), 0],
			[0, 0, 0, 1]);
		// console.log( rotateMatrix);

		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);
		// console.log(outMatrix);
		this.projectionPlane = this.projectionPlane.multiply(outMatrix);
		this.initCharacteristics();
		// console.log(out);
		// return out;
	}
	rotateZ( angle){ 
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0) в начало координат (0,0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-this.center[0][0], -this.center[0][1], -this.center[0][2], 1]);
		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [this.center[0][0], this.center[0][1], this.center[0][2], 1]);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[Math.cos(angle), Math.sin(angle), 0, 0],
			[-Math.sin(angle), Math.cos(angle), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]);


		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);
		this.projectionPlane = this.projectionPlane.multiply(outMatrix);
		this.initCharacteristics();
	}
	projectToPlane(face){
		let {A, B, C, D} = this.planeCharacteristics;
		let faceInProject = new Matrix(3, 3);
		// проводим прямые из вершин передаваемой плоскости в центр камеры
		// и находим точки пересечения этих прямых с плоскостью проекции,
		// а потом возвращаем эти точки
		let x0, y0, z0;
		[x0, y0, z0] = this.center[0];

		for(let i = 0; i < 3; i++){
			// найдем уравнение прямой от центра до точки плоскости
			let x1, y1, z1;
			[x1, y1, z1] = face[i];

			let m, n, p; // характеристики прямой
			m = x1 - x0;
			n = y1 - y0;
			p = z1 - z0;

			let t = -(A * x0 + B * y0 + C * z0 + D) / (A * m + B * n + C * p)

			faceInProject[i] = [m * t + x0, n * t + y0, p * t + z0];
		}
		
		// console.log(faceInProject)
		return faceInProject;
	}
	compNum(a, b){ // comparing numbers сравнение чисел
		if( Math.abs(a - b) < 0.1) return true;
		return false;
	}
	getDistanceFromPointToPlane(point, plane){
		let [x0, y0, z0] = point[0];
		let {A, B, C, D} = this.getCharacteristics(plane);
		return Math.abs(A*x0 + B*y0 + C*z0 + D) / Math.sqrt(A**2 + B**2 + C**2);
	}
	drawFace(faceInProject){
		faceInProject = faceInProject.diff(this.intersectionPoint);
		// выбираем координату, которую мы не будем учитывать при отрисовки
		// let ignorDir = 0;
		// if( this.compNum(faceInProject[0][0], 0) && this.compNum(faceInProject[1][0], 0) && this.compNum(faceInProject[2][0], 0)) ignorDir = 0;
		// if( this.compNum(faceInProject[0][1], 0) && this.compNum(faceInProject[1][1], 0) && this.compNum(faceInProject[2][1], 0)) ignorDir = 1;
		// if( this.compNum(faceInProject[0][2], 0) && this.compNum(faceInProject[1][2], 0) && this.compNum(faceInProject[2][2], 0)) ignorDir = 0;

		let points = new Matrix(3, 2);
		points.setValue([faceInProject[0][0], faceInProject[0][2]],
						[faceInProject[1][0], faceInProject[1][2]],
						[faceInProject[2][0], faceInProject[2][2]]);
		// switch(ignorDir){
		// 	case 0:
		// 		points.setValue([faceInProject[0][1], faceInProject[0][2]],
		// 						[faceInProject[1][1], faceInProject[1][2]],
		// 						[faceInProject[2][1], faceInProject[2][2]]);
		// 		break;
		// 	case 1:
		// 		points.setValue([faceInProject[0][0], faceInProject[0][2]],
		// 						[faceInProject[1][0], faceInProject[1][2]],
		// 						[faceInProject[2][0], faceInProject[2][2]]);
		// 		break;
		// 	case 2:
		// 		points.setValue([faceInProject[0][0], faceInProject[0][1]],
		// 						[faceInProject[1][0], faceInProject[1][1]],
		// 						[faceInProject[2][0], faceInProject[2][1]]);
		// 		break;
		// }
		this.ctx.beginPath();
		this.ctx.moveTo(points[0][0] * this.scale, points[0][1] * this.scale);
		for(let i = 1; i < 3; i++){
			this.ctx.lineTo(points[i][0] * this.scale, points[i][1] * this.scale);
		}
		this.ctx.closePath();
		this.ctx.strokeStyle = 'lime';
		this.ctx.stroke();
	}
	drawObject(object){
		for(let i = 0; i < object.faces.length; i++){
			let face = object.faces[i];

			// // расстояние от точки наблюдения до передаваемой плоскости
			// let h1 = this.getDistanceFromPointToPlane(this.center, face);
			// // расстояние от точки пересечения до передаваемой плоскости
			// let h2 = this.getDistanceFromPointToPlane(this.intersectionPoint, face);
			// if(h1 < h2) continue;

			face = this.projectToPlane(face);
			this.drawFace(face);
		}
	}
	clear(){
		this.ctx.clearRect(-this.canvas.width * 0.5, -this.canvas.height * 0.5, this.canvas.width, this.canvas.height);
	}
}

class Object{
	constructor(){
		this.faces = [];
		this.center = new Matrix(1, 4);
	}
	rotateX(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0) в начало координат (0,0).
		matrixTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [-center[0][0], -center[0][1], -center[0][2], 1]);
		// console.log( matrixTransfer);
		let matrixRTransfer = new Matrix(4, 4); // перенос точки в исходное положение путём обратного переноса.
		matrixRTransfer.setValue([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [center[0][0], center[0][1], center[0][2], 1]);
		// console.log( matrixRTransfer);

		let rotateMatrix = new Matrix(4, 4); // матрица поворота вокруг начала координат
		rotateMatrix.setValue(
			[1, 0, 0, 0],
			[0, Math.cos(angle), Math.sin(angle), 0],
			[0, -Math.sin(angle), Math.cos(angle), 0],
			[0, 0, 0, 1]);
		// console.log( rotateMatrix);

		let outMatrix = matrixTransfer.multiply(rotateMatrix)
		outMatrix = outMatrix.multiply(matrixRTransfer);
		for(let i = 0; i < this.faces.length; i++){
			this.faces[i] = this.faces[i].multiply(outMatrix);
			// console.log(this.faces[i])
		}
	}
	rotateY(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0) в начало координат (0,0).
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
		for(let i = 0; i < this.faces.length; i++){
			this.faces[i] = this.faces[i].multiply(outMatrix);
		}
	}
	rotateZ(angle){
		let center = this.center;
		let matrixTransfer = new Matrix(4, 4); // перенос точки с координатами (x0, y0) в начало координат (0,0).
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
		for(let i = 0; i < this.faces.length; i++){
			this.faces[i] = this.faces[i].multiply(outMatrix);
		}
	}
}

class Face extends Matrix{
	constructor(){
		super(3, 4);
	}
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let camera = new Camera3d(canvas);
camera.center.setValue([1, -5, 1, 1]);
camera.projectionPlane.setValue([-1, -2, -3, 1],
								[3, -2, 3, 1],
								[3, -2, -1, 1]);
camera.initCharacteristics();
console.log(camera)

let object1 = new Object();
object1.center.setValue([1,1,1,1]);

let face1 = new Face();
face1.setValue([2, 0, 0, 1], [2, 2, 0, 1], [2, 0, 2, 1]);
let face2 = new Face();
face2.setValue([2, 0, 2, 1], [2, 2, 2, 1], [2, 2, 0, 1]);

let face3 = new Face();
face3.setValue([2, 2, 2, 1], [2, 2, 0, 1], [0, 2, 0, 1]);
let face4 = new Face();
face4.setValue([2, 2, 2, 1], [0, 2, 2, 1], [0, 2, 0, 1]);

let face5 = new Face();
face5.setValue([0, 0, 0, 1], [0, 2, 0, 1], [0, 2, 2, 1]);
let face6 = new Face();
face6.setValue([0, 0, 0, 1], [0, 0, 2, 1], [0, 2, 2, 1]);

let face7 = new Face();
face7.setValue([0, 0, 0, 1], [2, 0, 0, 1], [2, 0, 2, 1]);
let face8 = new Face();
face8.setValue([0, 0, 0, 1], [0, 0, 2, 1], [2, 0, 2, 1]);

let face9 = new Face();
face9.setValue([0, 0, 0, 1], [2, 0, 0, 1], [2, 0, 2, 1]);
let face10 = new Face();
face10.setValue([0, 0, 0, 1], [0, 0, 2, 1], [2, 0, 2, 1]);

object1.faces = [face1, face2, face3, face4, face5, face6, face7, face8, face9, face10];

console.time();
camera.drawObject(object1);
console.timeEnd();

object2 = new Object();
object2.center.setValue([5, 6, 4, 1]);

face1 = new Matrix(3, 4);
face1.setValue([4, 5, 1, 1], [6, 5, 1, 1], [5, 6, 4, 1]);

face2 = new Matrix(3, 4);
face2.setValue([4, 5, 1, 1], [4, 7, 1, 1], [5, 6, 4, 1]);

face3 = new Matrix(3, 4);
face3.setValue([6, 7, 1, 1], [4, 7, 1, 1], [5, 6, 4, 1]);

face4 = new Matrix(3, 4);
face4.setValue([6, 7, 1, 1], [6, 5, 1, 1], [5, 6, 4, 1]);

object2.faces = [face1, face2, face3, face4];

console.time();
camera.drawObject(object2);
console.timeEnd();

addEventListener('keydown', (event) => {
	switch(event.code){
		case 'KeyA':
			// console.clear();
			camera.clear();
			// camera.move([-2, 0, 0]);
			camera.rotateZ(0.04);
			camera.initCharacteristics();
			camera.drawObject(object1);
			camera.drawObject(object2);
			break;
		case 'KeyD':
			camera.clear();
			camera.rotateZ(-0.04);
			// camera.move([2, 0, 0]);
			camera.initCharacteristics();
			camera.drawObject(object1);
			camera.drawObject(object2);
			break;

		case 'KeyJ':
			camera.clear();
			console.time();
			object1.rotateY(0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
			break;
		case 'KeyK':
			camera.clear();
			console.time();
			object1.rotateY(-0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
			break;

		case 'KeyI':
			camera.clear();
			console.time();
			object1.rotateX(0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
			break;
		case 'KeyO':
			camera.clear();
			console.time();
			object1.rotateX(-0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
			break;

		case 'KeyN':
			camera.clear();
			console.time();
			object1.rotateZ(0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
			break;
		case 'KeyM':
			camera.clear();
			console.time();
			object1.rotateZ(-0.04);
			camera.drawObject(object1);
			camera.drawObject(object2);
			console.timeEnd();
	}
});