/* x1y1- //,  x2y2- **
 pos   down    up   left    right
	   0 1    1*1*  1 0 0  /1/1 1
	   0 1    1 0  /1/1*1*  0 0*1*
     /1/*1*  /1/0  
*/
class Figure_J{
	constructor(x, y, index){
		this.position = 'left';
		this.coord = [[x, y], [x + 2, y]]; // x1y1, x2y2
		this.index = index;
		this.result = true;
	}
	spawn(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		field[y1][x1] = field[y1 - 1][x1] = field[y1][x1 + 1] = field[y2][x2] = this.index;
	}
	canTurnRight(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				if(field[y1 - 1][x1 + 1] === 0 && field[y1 + 1][x1] === 0){
					return true;
				}else{
					return false;
				}
			case 'right':
				if(field[y2][x2 - 1] === 0 && field[y2 - 2][x2] === 0){
					return true;
				}else{
					return false;
				}
			case 'up':
				if(field[y2 + 1][x2] === 0 && field[y2][x2 - 2] === 0){
					return true;
				}else{
					return false;
				}
			case 'down':
				if(field[y1 - 1][x1] === 0 && field[y2][x2 + 1] === 0){
					return true;
				}else{
					return false;
				}
		}
	}
	canTurnLeft(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				if(field[y1 - 1][x1 + 1] === 0 && field[y1 - 2][x1 + 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'right':
				if(field[y2][x2 - 1] === 0 && field[y2 + 1][x2 - 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'down':
				if(field[y1 - 1][x1] === 0 && field[y1 - 1][x1 - 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'up':
				if(field[y1 - 1][x1 + 1] === 0 && field[y1 - 1][x1 + 2] === 0){
					return true;
				}else{
					return false;
				}
		}
	}
	canGoDown(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				if(field[y1 + 1][x1] === 0 && field[y1 + 1][x1 + 1] === 0 && field[y2 + 1][x2] === 0){
					return true;
				}else{
					return false;
				}
			case 'right':
				if(field[y1 + 1][x1] === 0 && field[y1 + 1][x1 + 1] === 0 && field[y2 + 1][x2] === 0){
					return true;
				}else{
					return false;
				}
			case 'down':
				if(field[y1 + 1][x1] === 0 && field[y2 + 1][x2] === 0){
					return true;
				}else{
					return false;
				}
			case 'up':
				if(field[y1 + 1][x1] === 0 && field[y2 + 1][x2] == 0){
					return true;
				}else{
					return false;
				}
		}
	}
	canGoRight(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				if(field[y1 - 1][x1 + 1] === 0 && field[y2][x2 + 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'right':
				if(field[y2][x2 + 1] === 0 && field[y2 - 1][x2 + 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'up':
				if(field[y2][x2 + 1] === 0 && field[y1][x1 + 1] === 0 && field[y1 - 1][x1 + 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'down':
				if(field[y2][x2 + 1] === 0 && field[y2 - 1][x2 + 1] === 0 && field[y2 - 2][x2 - 1] === 0){
					return true;
				}else{
					return false;
				}
		}
	}
	canGoLeft(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				if(field[y1 - 1][x1 - 1] === 0 && field[y1][x1 - 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'right':
				if(field[y1][x1 - 1] === 0 && field[y2][x2 - 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'up':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1 - 1] === 0 && field[y1 - 2][x1 - 1] === 0){
					return true;
				}else{
					return false;
				}
			case 'down':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1] === 0 && field[y1 - 2][x1] === 0){
					return true;
				}else{
					return false;
				}
		}
	}
	moveDown(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				field[y1 - 1][x1] = field[y1][x1 + 1] = field[y2][x2] = 0;
				field[y1 + 1][x1] = field[y1 + 1][x1 + 1] = field[y2 + 1][x2] = this.index;			
				break;
			case 'right':
				field[y1][x1] = field[y1][x1 + 1] = field[y1][x1 + 2] = 0;
				field[y1 + 1][x1] = field[y1 + 1][x1 + 1] = field[y2 + 1][x2] = this.index;
				break;
			case 'up':
				field[y2][x2] = field[y2][x2 - 1] = 0;
				field[y1 + 1][x1] = field[y2 + 1][x2] = this.index;
				break;
			case 'down':
				field[y1][x1] = field[y2 - 2][x2] = 0;
				field[y1 + 1][x1] = field[y2 + 1][x2] = this.index;
				break;
		}
		y1++; y2++;
		this.coord = [[x1, y1], [x2, y2]];
	}
	moveLeft(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				field[y1 - 1][x1] = field[y2][x2] = 0;
				field[y1][x1 - 1] = field[y1 - 1][x1 - 1] = this.index;
				break;
			case 'right':
				field[y2][x2] = field[y2 - 1][x2] = 0;
				field[y1][x1 - 1] = field[y2][x2 - 1] = this.index;
				break;
			case 'up':
				field[y2][x2] = field[y1][x1] = field[y1 - 1][x1] = 0;
				field[y1][x1 - 1] = field[y1 - 1][x1 - 1] = field[y1 - 2][x1 - 1] = this.index;
				break;
			case 'down':
				field[y2][x2] = field[y2 - 1][x2] = field[y2 - 2][x2] = 0;
				field[y1][x1 - 1] = field[y1 - 1][x1] = field[y1 - 2][x1] = this.index;
				break;
		}
		x1--; x2--;
		this.coord = [[x1, y1], [x2, y2]];
	}
	moveRight(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'left':
				field[y1][x1] = field[y1 - 1][x1] = 0;
				field[y1 - 1][x1 + 1] = field[y2][x2 + 1] = this.index;
				break;
			case 'right':
				field[y1][x1] = field[y2][x2] = 0;
				field[y2][x2 + 1] = field[y2 - 1][x2 + 1] = this.index;
				break;
			case 'up':
				field[y1][x1] = field[y1 - 1][x1] = field[y1 - 2][x1] = 0;
				field[y1][x1 + 1] = field[y1 - 1][x1 + 1] = field[y2][x2 + 1] = this.index;
				break;
			case 'down':
				field[y1][x1] = field[y2 - 1][x2] = field[y2 - 2][x2] = 0;
				field[y2][x2 + 1] = field[y2 - 1][x2 + 1] = field[y2 - 2][x2 + 1] = this.index;
				break; 
		}
		x1++; x2++;
		this.coord = [[x1, y1], [x2, y2]];
	}

	left(field){
		if(this.canGoLeft(field)) this.moveLeft(field);
	}
	right(field){
		if(this.canGoRight(field)) this.moveRight(field);
	}
	down(field){
		try{
			if(this.canGoDown(field)){
				this.moveDown(field);
			}else{
				this.result = false;
			}
		}catch(e){
			this.result = false;
		}
		
	}
	turnLeft(field){
		if(this.canTurnLeft(field)){
			let x1 = this.coord[0][0];
			let y1 = this.coord[0][1];
			let x2 = this.coord[1][0];
			let y2 = this.coord[1][1];
			switch(this.position){
				case 'left':
					field[y1 - 1][x1] = field[y2][x2] = 0;
					field[y1 - 1][x1 + 1] = field[y1 - 2][x1 + 1] = this.index;
					this.position = 'down';
					x2--;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'right':
					field[y1][x1] = field[y2][x2] = 0;
					field[y2][x2 - 1] = field[y2 + 1][x2 - 1] = this.index;
					this.position = 'up';
					y1 += 2; x1++; y2--;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'up':
					field[y1][x1] = field[y2][x2] = 0;
					field[y1 - 1][x1 + 1] = field[y1 - 1][x1 + 2] = this.index;
					this.position = 'left';
					y1--; x2++; y2++;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'down':
					field[y1][x1] = field[y2 - 2][x2] = 0;
					field[y1 - 1][x1] = field[y1 - 1][x1 - 1] = this.index;
					this.position = 'right';
					y1--; x1--;
					this.coord = [[x1, y1], [x2, y2]];
					break;
			}
		}
	}
	turnRight(field){
		if(this.canTurnRight(field)){
			let x1 = this.coord[0][0];
			let y1 = this.coord[0][1];
			let x2 = this.coord[1][0];
			let y2 = this.coord[1][1];
			switch(this.position){
				case 'left':
					field[y2][x2] = field[y2][x2 - 1] = 0;
					field[y1 - 1][x1 + 1] = field[y1 + 1][x1] = this.index;
					this.position = 'up';
					y2--; x2--; y1++;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'right':
					field[y1][x1] = field[y1][x1 + 1] = 0;
					field[y1 + 1][x1 + 1] = field[y1 - 1][x1 + 2] = this.index;
					this.position = 'down';
					y1++; x1++;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'up':
					field[y1][x1] = field[y1 - 1][x1] = 0;
					field[y2 + 1][x2] = field[y2][x2 - 2] = this.index;
					this.position = 'right';
					y1 -= 2; x1--; y2++;
					this.coord = [[x1, y1], [x2, y2]];
					break;
				case 'down':
					field[y2 - 1][x2] = field[y2 - 2][x2] = 0;
					field[y1 - 1][x1] = field[y2][x2 + 1] = this.index;
					x2++;
					this.position = 'left';
					this.coord = [[x1, y1], [x2, y2]];
					break;
			}
		}
	}
}