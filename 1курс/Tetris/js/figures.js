class Figure{
	constructor(){
		this.type = '';
		this.x = Math.floor(config.fieldWidth / 2) - 2;
		this.y = 0;
		this.condition = 0;
		this.index = choice([1, 2, 3]);
		this.prohibitDescent = 10; 	// запрет появления новой фигуры,
									// когда старая не может двигаться вниз 
	}
	changeFigureIndex(){
		for(let i = 0; i < this.state.length; i++){
			for(let j = 0; j < this.state[0].length; j++){
				if(this.state[i][j]) this.state[i][j] = this.index;
			}
		}
	}
	checkPossibleToMove(){
		for(let i = 0; i < this.state.length; i++){
			for(let j = 0; j < this.state[0].length; j++){

				if(this.state[i][j] && (isAValueInCell(i + this.y, j + this.x) || !isACell(i + this.y, j + this.x))){
					return false;
					break;
				}

			}
		}
		return true;
	}
	turn(){
		let turn = this.turnFigure();
		if(!turn){
			this.x++;
			turn = this.turnFigure();
		}
		if(!turn){
			this.x -= 2;
			turn = this.turnFigure();
		}
		if(!turn){
			this.x++;
			this.y--;
			if(this.type == 'I') this.y--;
			turn = this.turnFigure();
		}
		if(!turn) this.y++;
	}

	turnFigure(){
		this.state = this.states[(++this.condition) % 4];
		for(let i = 0; i < this.state.length; i++){
			for(let j = 0; j < this.state[0].length; j++){
				if(this.state[i][j] && (isAValueInCell(i + this.y, j + this.x) || !isACell(i + this.y, j + this.x))){  
					this.state = this.states[ Math.abs((--this.condition) % 4)];
					this.changeFigureIndex();
					return false;
				}
			}
		}
		this.changeFigureIndex();
		return true;
	}
	left(){
		this.prohibitDescent = 10;
		this.x--;
		if(!this.checkPossibleToMove()) this.x++;
	}
	right(){
		this.prohibitDescent = 10;
		this.x++;
		if(!this.checkPossibleToMove()) this.x--;
	}
	down(){
		this.y++;
		if(!this.checkPossibleToMove()){
			this.y--;
			return false;
		}
		return true;
	}
}


class Figure_J extends Figure{
	constructor(){
		super();
		this.state = [
					[1, 0, 0], 
					[1, 1, 1],
					[0, 0, 0]
				];
		this.states ={ 
			0: [
					[1, 0, 0], 
					[1, 1, 1],
					[0, 0, 0]
				],
			1: 
				[
					[0, 1, 1], 
					[0, 1, 0],
					[0, 1, 0]
				],
			2:
				[
					[0, 0, 0],
					[1, 1, 1], 
					[0, 0, 1]
				],
			3:
				[
					[0, 1, 0], 
					[0, 1, 0],
					[1, 1, 0]
				]
		};
	}
}

class Figure_L extends Figure{
	constructor(){
		super();
		this.state = [
					[0, 0, 1], 
					[1, 1, 1],
					[0, 0, 0]
				];
		this.states ={ 
			0: [
					[0, 0, 1], 
					[1, 1, 1],
					[0, 0, 0]
				],
			1: 
				[
					[0, 1, 0], 
					[0, 1, 0],
					[0, 1, 1]
				],
			2:
				[
					[0, 0, 0],
					[1, 1, 1], 
					[1, 0, 0]
				],
			3:
				[
					[1, 1, 0], 
					[0, 1, 0],
					[0, 1, 0]
				]
		};
	}	
}

class Figure_O extends Figure{
	constructor(){
		super();
		this.state = [
					[1, 1], 
					[1, 1]
				];
		this.states ={ 
			0: [
					[1, 1], 
					[1, 1]
				],
			1: 
				[
					[1, 1], 
					[1, 1]
				],
			2:
				[
					[1, 1], 
					[1, 1]
				],
			3:
				[
					[1, 1], 
					[1, 1]
				]
		};
	}
}

class Figure_Z extends Figure{
	constructor(){
		super();
		this.state = [
					[0, 1, 1], 
					[1, 1, 0],
					[0, 0, 0]
				];
		this.states ={ 
			0: [
					[0, 1, 1], 
					[1, 1, 0],
					[0, 0, 0]
				],
			1: 
				[
					[0, 1, 0], 
					[0, 1, 1],
					[0, 0, 1]
				],
			2:
				[
					[0, 0, 0],
					[0, 1, 1], 
					[1, 1, 0]
				],
			3:
				[
					[1, 0, 0], 
					[1, 1, 0],
					[0, 1, 0]
				]
		};
	}	
}

class Figure_S extends Figure{
	constructor(){
		super();
		this.state = [
					[1, 1, 0], 
					[0, 1, 1],
					[0, 0, 0]	
				];
		this.states ={ 
			0: [
					[1, 1, 0], 
					[0, 1, 1],
					[0, 0, 0]
				],
			1: 
				[
					[0, 0, 1], 
					[0, 1, 1],
					[0, 1, 0]
				],
			2:
				[
					[0, 0, 0],
					[1, 1, 0], 
					[0, 1, 1]
				],
			3:
				[
					[0, 1, 0], 
					[1, 1, 0],
					[1, 0, 0]
				]
		};
	}	
}

class Figure_T extends Figure{
	constructor(){
		super();
		this.state = [
					[0, 1, 0], 
					[1, 1, 1],
					[0, 0, 0]
				];
		this.states ={ 
			0: [
					[0, 1, 0], 
					[1, 1, 1],
					[0, 0, 0]
				],
			1: 
				[
					[0, 1, 0], 
					[0, 1, 1],
					[0, 1, 0]
				],
			2:
				[
					[0, 0, 0],
					[1, 1, 1], 
					[0, 1, 0]
				],
			3:
				[
					[0, 1, 0], 
					[1, 1, 0],
					[0, 1, 0]
				]
		};
	}	
}

class Figure_I extends Figure{
	constructor(){
		super();
		this.state = [
					[0, 0, 0, 0], 
					[1, 1, 1, 1],
					[0, 0, 0, 0]	
				];
		this.states ={
			0: [
					[0, 0, 0, 0], 
					[1, 1, 1, 1],
					[0, 0, 0, 0]	
				],
			1: [
					[0, 0, 1, 0], 
					[0, 0, 1, 0],
					[0, 0, 1, 0],
					[0, 0, 1, 0]
				],
			2: 
				[
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[1, 1, 1, 1], 
					[0, 0, 0, 0]
				],
			3:
				[
					[0, 1, 0, 0], 
					[0, 1, 0, 0],
					[0, 1, 0, 0],
					[0, 1, 0, 0]
				]
		};
	}	
}
