class NN{
	constructor(...numbers){ // передаем количество нейронов на каждом слое
		// на первом слое используется нейрон смещения,
		// поэтому первое число передавайте на 1 больше
		// собираетесь использовать 3 входа - первое число 4

		this.layers = []; // массив слоев нейронов
		this.errors = []; // массив ошибок каждого слоя нейронов
		this.weights = []; // массив весов
		this.transWeights = []; // массив транспонированных матриц весов
		this.learningRatio = 0.2; // коэф. обучения

		this.init(...numbers);
		this.setRandomWeights();
	}
	init(...numbers){
		for(let i = 0; i < numbers.length; i++){
			this.layers[i] = new Matrix(numbers[i], 1);
			this.errors[i] = new Matrix(numbers[i], 1);
		}
		for(let i = 0; i < numbers.length - 1; i++){
			this.weights[i] = new Matrix(numbers[i + 1], numbers[i]);
			this.transWeights[i] = new Matrix(numbers[i], numbers[i + 1]);
		}
		this.layers[0][ this.layers[0].length - 1][0] = 1; // нейрон смещения = 1
	}
	sigmoid(x){
		return 1 / (1 + Math.E ** (-x));
	}
	derivative(x){
		return x * (x - 1);
	}
	input(inputData){
		let layer = this.layers[0]; // первый слой нейронов
		for(let i = 0; i < inputData.length; i++){
			layer[i][0] = this.sigmoid(inputData[i]);
		}
		layer[ layer.length - 1][0] = 1; // нейрон смещения равен 1
	}
	activation(layer){ // применить функцию активации к слою нейронов
		for(let i = 0; i < layer.length; i++){
			layer[i][0] = this.sigmoid(layer[i][0]);
		}
	}
	determineTheValueOfNeurons(){
		for(let i = 1; i < this.layers.length; i++){
			this.layers[i] = this.weights[i - 1].multiply( this.layers[i - 1]);

			this.activation( this.layers[i]);
		}
	}
	setRandomWeights(){
		for(let i = 0; i < this.weights.length; i++){
			this.weights[i].random();
			this.transWeights[i] = this.weights[i].trans();
		}
	}
	findError(correctData){
		let layer = this.layers[ this.layers.length - 1]; // последний слой нейронов
		let error = this.errors[ this.errors.length - 1]; // последний слой ошибок нейронов
		// определяем ошибку выходного слоя
		for(let i = 0; i < correctData.length; i++){
			error[i][0] = layer[i][0] - correctData[i];
		}
	}
	backError(){
		for(let i = this.layers.length - 2; i >= 0; i--){
			this.errors[i] = this.transWeights[i].multiply( this.errors[i + 1])
		}
	}
	correctionWeights(){
		for(let j = 0; j < this.layers.length - 1; j++){
			let k = j + 1;
			let error = this.errors[k];
			let d = error.$multiply( this.layers[k].applyFunction( this.derivative) );
	
			let dW = d.multiply( this.layers[j].trans());
			dW.multiply( this.learningRatio);

			this.weights[j] = this.weights[j].summ(dW);
			this.transWeights[j] = this.weights[j].trans();
		}
	}
	learning(inputData, correctData){
		this.input(inputData);
		this.determineTheValueOfNeurons();
		this.findError(correctData);
		this.backError();
		this.correctionWeights();
	}
	out(inputData){
		const last = this.layers.length - 1;
		
		this.input(inputData);
		this.determineTheValueOfNeurons();

		let out = this.layers[last].trans();
		return out[0];
	}
}

// console.time()
a = new NN(6, 3, 2);

function addNull(arr, length){
	let len = length - arr.length;
	for(let i = 0; i < len; i++){
		arr.unshift(0);
	}
	return arr;
}

function binarySystem(number){
	// 12 -> "1100" -> ["1", "1", "0", "0"] -> [1, 1, 0, 0]
	return parseInt(number).toString(2).split('').map((str) => {
		return +str;
	});
}

console.time()
for(let i = 0; i < 3500; i++){
	let num = Math.round(Math.random() * 31);
	let out = (num % 2 == 0) ? [0.8, 0.1] : [0.1, 0.8];
	a.learning( addNull(binarySystem(num), 5), out);
	
}
console.timeEnd()
// for(let i = 0; i < 3500; i++){
// 	let num = Math.random() * 2 * Math.PI - Math.PI;
// 	let out = [Math.sin(num)];
// 	a.learning([ num], out);
// }

// console.log(a.out([1 / 6 * Math.PI]));
// console.log(a.out(addNull(binarySystem(12), 5)));
// console.timeEnd();

