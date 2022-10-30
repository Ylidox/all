/*x1y1-//  x2y2-**
	pos right   down  left   up
		0 0 1   1 0   1 1*1* /1/1
	   /1/1*1*  1 0  /1/0 0   0 1
			   /1/*1*  		  0*1*
*/

class Figure_L{
	constructor(x, y, index){
		this.position = 'right';
		this.coord = [[x, y], [x + 2, y]];
		this.index = index;
		this.result = true;
	}
	spawn(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		field[y1][x1] = field[y2][x2] = field[y1][x1 + 1] = field[y2 - 1][x2] = this.index;
	}
	turnRight(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'right':
				if(field[y1 - 1][x1 + 1] === 0 && field[y1 - 2][x1 + 1] === 0){
					field[y1][x1] = field[y2 - 1][x2] = 0;
					field[y1 - 1][x1 + 1] = field[y1 - 2][x1 + 1] = this.index;
					this.position = 'down';
					x1++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'down':
				if(field[y2 - 1][x2] === 0 && field[y2 - 1][x2 + 1] === 0){
					field[y1 - 2][x1] = field[y2][x2] = 0;
					field[y2 - 1][x2] = field[y2 - 1][x2 + 1] = this.index;
					this.position = 'left';
					y2--; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'left':
				if(field[y1][x1 + 1] === 0 && field[y1 + 1][x1 + 1] === 0){
					field[y1][x1] = field[y2][x2] = 0;
					field[y1][x1 + 1] = field[y1 + 1][x1 + 1] = this.index;
					this.position = 'up';
					y1--; y2 += 2; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y1 + 1][x1 - 1] === 0 && field[y1 + 1][x1] === 0){
					field[y1][x1] = field[y2][x2] = 0;
					field[y1 + 1][x1 - 1] = field[y1 + 1][x1] = this.index;
					this.position = 'right';
					y1++; x1--; y2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
		}
	}
	down(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		try{
			switch(this.position){
				case 'right':
					if(field[y1 + 1][x1] === 0 && field[y1 + 1][x1 + 1] === 0 && field[y2 + 1][x2] === 0){
						field[y1][x1] = field[y1][x1 + 1] = field[y2 - 1][x2] = 0;
						field[y1 + 1][x1] = field[y1 + 1][x1 + 1] = field[y2 + 1][x2] = this.index;				
					}else{
						this.result = false;
					}
					break;
				case 'down':
					if(field[y1 + 1][x1] === 0 && field[y2 + 1][x2] === 0){
						field[y1 - 2][x1] = field[y2][x2] = 0;
						field[y1 + 1][x1] = field[y2 + 1][x2] = this.index;
					}else{
						this.result = false;
					}
					break;
				case 'left':
					if(field[y1 + 1][x1] === 0 && field[y1][x1 + 1] === 0 && field[y2 + 1][x2] === 0){
						field[y2][x2 - 2] = field[y2][x2 - 1] = field[y2][x2] = 0;
						field[y1 + 1][x1] = field[y1][x1 + 1] = field[y2 + 1][x2] = this.index;
					}else{
						this.result = false;
					}
					break;
				case 'up':
					if(field[y1 + 1][x1] === 0 && field[y2 + 1][x2] === 0){
						field[y1][x1] = field[y1][x1 + 1] = 0;
						field[y1 + 1][x1] = field[y2 + 1][x2] = this.index;
					}else{
						this.result = false;
					}
					break;
			}
			y1++; y2++;
			this.coord = [[x1, y1], [x2, y2]];
		}catch(e){
			this.result = false;
		}
	}
	right(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'right':
				if(field[y2][x2 + 1] === 0 && field[y2 - 1][x2 + 1] === 0){
					field[y1][x1] = field[y2 - 1][x2] = 0;
					field[y2][x2 + 1] = field[y2 - 1][x2 + 1] = this.index;		
				
					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'down':
				if(field[y2 - 1][x2] === 0 && field[y2 - 2][x2] === 0 && field[y2][x2 + 1] === 0){
					field[y1][x1] = field[y1 - 1][x1] = field[y1 - 2][x1] = 0;
					field[y2 - 1][x2] = field[y2 - 2][x2] = field[y2][x2 + 1] = this.index;
				
					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'left':
				if(field[y1][x1 + 1] === 0 && field[y2][x2 + 1] === 0){
					field[y1][x1] = field[y1 - 1][x1] = 0;
					field[y1][x1 + 1] = field[y2][x2 + 1] = this.index;
				
					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y2][x2 + 1] === 0 && field[y2 - 1][x2 + 1] === 0 && field[y2 - 2][x2 + 1] === 0){
					field[y1][x1] = field[y2][x2] = field[y2 - 1][x2] = 0;
					field[y2][x2 + 1] = field[y2 - 1][x2 + 1] = field[y2 - 2][x2 + 1] = this.index;
				
					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
		}
	}
	left(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'right':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1 + 1] === 0){
					field[y2][x2] = field[y2 - 1][x2] = 0;
					field[y1][x1 - 1] = field[y1 - 1][x1 + 1] = this.index;

					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'down':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1 - 1] === 0 && field[y1 - 2][x1 - 1] === 0){
					field[y1 - 1][x1] = field[y1 - 2][x1] = field[y2][x2] = 0;
					field[y1][x1 - 1] = field[y1 - 1][x1 - 1] = field[y1 - 2][x1 - 1] = this.index;

					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'left':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1 - 1] === 0){
					field[y1][x1] = field[y2][x2] = 0;
					field[y1][x1 - 1] = field[y1 - 1][x1 - 1] = this.index;

					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y1][x1 - 1] === 0 && field[y1 + 1][x1] === 0 && field[y1 + 2][x1] === 0){
					field[y2][x2] = field[y2 - 1][x2] = field[y2 - 2][x2] = 0;
					field[y1][x1 - 1] = field[y1 + 1][x1] = field[y1 + 2][x1] = this.index;

					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
		}
	}
}

/*x1y1-//  x2y2-**
	pos right   down  left   up
		0 0 1   1 0   1 1*1* /1/1
	   /1/1*1*  1 0  /1/0 0   0 1
			   /1/*1*  		  0*1*
*/
class Figure_L{
	constructor(x, y, index){
		this.position = 'right';
		this.coord = [[x, y], [x + 2, y]];
		this.index = index;
		this.result = true;
	}
	spawn(){

	}
	turnRight(){

	}
	down(){

	}
	right(){

	}
	left(){
		
	}
}