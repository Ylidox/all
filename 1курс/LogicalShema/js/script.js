class Bit{
	constructor(){}
}

class InputBit extends Bit{
	constructor(){
		super();
		this.type = 'INPUT';
		this.address = '';
		this.out = 0;
	}
	changeOut(){
		this.out = this.out ? 0 : 1;
	}
}

class OutputBit extends Bit{
	constructor(){
		super();
		this.type = 'OUTPUT';
		this.address = '';
		this.out = 0;
		this.input1 = '';
		this.input2 = '';
	}
}

class LogicalCell extends Bit{
	constructor(options){
		super(options);
		this.input1 = options.input1;
		this.input2 = options.input2;
		this.type = options.type
	}
	count(a, b){
		switch(this.type){
			case "AND":
				return  a && b;
				break;
			case "OR":
				return a || b;
				break;
			case "XOR":
				return a ^ b;
				break;
		}
	}
}