class NN{
	constructor(...numbers){
		this.neurons = [],
		this.weight = [],
		this.learningRatio = .2
		this.createNeurons(...numbers);
	}
	createNeurons(...numbers){
		// добавляем нейроны
		for(let i = 0; i < numbers.length; i++){
			this.neurons[i] = [];
			for(let j = 0; j < numbers[i]; j++){
				this.neurons[i][j] = {
					value: 0,
					error: 0
				};
				if(i == 0 && j == numbers[0] - 1){
					this.neurons[i][j] = {
						value: 1,
						error: 0
					};
				}
			}
		}
		// добавляем веса
		for(let i = 0; i < this.neurons.length - 1; i++){ // для каждого нейрона создаем
			this.weight[i] = [];                          // связи с нейронами следущего слоя
			for(let j = 0; j < this.neurons[i].length; j++){ 
				this.weight[i][j] = [];

				for(let k = 0; k < this.neurons[i + 1].length; k++){
					this.weight[i][j].push( Math.random());
				}

			}
		}
	}
	sigmoid(x){
		return 1 / (1 + Math.E ** (-x));
	}
	derivative(x){
		return x * (x - 1);
	}
	determineTheValueOfNeurons(){
		for(let i = 1; i < this.neurons.length; i++){
			for(let j = 0; j < this.neurons[i].length; j++){

				this.neurons[i][j].value = 0;

				for(let k = 0; k < this.neurons[i - 1].length; k++){
					this.neurons[i][j].value += this.weight[i - 1][k][j] * this.neurons[i - 1][k].value;
				}

				this.neurons[i][j].value = this.sigmoid( this.neurons[i][j].value);
			}
		}
	}
	input(inputData){
		for (let i = 0; i < this.neurons[0].length - 1; i++) {
			this.neurons[0][i].value = inputData[i];//this.sigmoid();
		}
	}
	findError(correctData){
		let last = this.neurons.length - 1;
		for(let i = 0; i < correctData.length; i++){
			this.neurons[last][i].error = correctData[i] - this.neurons[last][i].value;
		}
	}	
	backError(){
		for(let i = this.neurons.length - 1; i > 0; i--){
			for(let j = 0; j < this.neurons[i].length; j++){

				for(let k = 0; k < this.neurons[i - 1].length; k++){
					this.neurons[i - 1][k].error += this.weight[i - 1][k][j] * this.neurons[i][j].error;
				}

			}
		}
	}
	correctionsOfCommunicationWeights(){
		for (let i = 0; i < this.neurons.length - 1; i++) {
			for (let j = 0; j < this.neurons[i].length; j++) {
			
				for(let k = 0; k < this.neurons[i + 1].length; k++){
					this.weight[i][j][k] -= this.learningRatio * this.neurons[i + 1][k].error * 
											this.derivative(this.neurons[i + 1][k].value) * this.neurons[i][j].value;
				}

			}
		}
	}
	nullingError(){
		for(let i = 0; i < this.neurons.length; i++){
			for(let j = 0; j < this.neurons[i].length; j++){
				this.neurons[i][j].error = 0;
			}
		}
	}
	learning(inputData, correctData){
		this.input(inputData);
		this.determineTheValueOfNeurons();
		this.findError(correctData);
		this.backError();
		this.correctionsOfCommunicationWeights();
		this.nullingError();
	}
	out(inputData){
		const last = this.neurons.length - 1;
		let value = [];

		this.input(inputData);
		this.determineTheValueOfNeurons();

		for(let i = 0; i < this.neurons[last].length; i++){
			value.push(this.neurons[last][i].value);
		}
		return value;
	}
}

