/*x1y1-// x2y2-**
  pos  down    up
	   0 1*1* /1/0
	  /1/1 0   1 1
			   0*1*
*/

class Figure_S{
	constructor(x, y, index){
		this.position = 'down';
		this.coord = [[x, y], [x + 2, y - 1]];
		this.index = index;
		this.result = true;
	}
	spawn(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		field[y1][x1] = field[y2][x2] = field[y1][x1 + 1] = field[y2][x2 - 1] = this.index;
	}
	turnRight(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'down':
				if(field[y2 + 1][x2] === 0 && field[y2 + 2][x2] === 0){
					field[y1][x1] = field[y2][x2] = 0;
					field[y2 + 1][x2] = field[y2 + 2][x2] = this.index;
					this.position = 'up';
					x1++; y1--; y2 += 2;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y1 + 1][x1 - 1] === 0 && field[y1][x1 + 1] === 0){
					field[y2][x2] = field[y2 - 1][x2] =  0;
					field[y1 + 1][x1 - 1] = field[y1][x1 + 1] = this.index;
					this.position = 'down';
					x1--; y1++; y2 -= 2;
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
				case 'down':
					if(field[y1 + 1][x1] === 0 && field[y1 + 1][x1 + 1] === 0 && field[y2 + 1][x2] === 0){
						field[y1][x1] = field[y2][x2 - 1] = field[y2][x2] = 0;
						field[y1 + 1][x1] = field[y1 + 1][x1 + 1] = field[y2 + 1][x2] = this.index;
					}else{
						this.result = false;
					}
					break;
				case 'up':
					if(field[y2][x2 - 1] === 0 && field[y2 + 1][x2] === 0){
						field[y1][x1] = field[y2 - 1][x2] = 0;
						field[y2][x2 - 1] = field[y2 + 1][x2] = this.index;
					}else{
						this.result = false;
					}
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
			case 'down':
				if(field[y2 + 1][x2] === 0 && field[y2][x2 + 1] === 0){
					field[y1][x1] = field[y2][x2 - 1] = 0;
					field[y2 + 1][x2] = field[y2][x2 + 1] = this.index;

					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y1][x1 + 1] === 0 && field[y2 - 1][x2 + 1] === 0 && field[y2][x2 + 1] === 0){
					field[y1][x1] = field[y2][x2] = field[y1 + 1][x1] = 0;
					field[y1][x1 + 1] = field[y2 - 1][x2 + 1] = field[y2][x2 + 1] = this.index;
					
					x1++; x2++;
					this.coord = [[x1, y1], [x2, y2]];
				}
		}
	}
	left(field){
		let x1 = this.coord[0][0];
		let y1 = this.coord[0][1];
		let x2 = this.coord[1][0];
		let y2 = this.coord[1][1];
		switch(this.position){
			case 'down':
				if(field[y1][x1 - 1] === 0 && field[y1 - 1][x1] === 0){
					field[y2][x2] = field[y1][x1 + 1] = 0;
					field[y1][x1 - 1] = field[y1 - 1][x1] = this.index;

					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
			case 'up':
				if(field[y1][x1 - 1] === 0 && field[y1 + 1][x1 - 1] === 0 && field[y2][x2 - 1] === 0){			
					field[y1][x1] = field[y2][x2] = field[y2 - 1][x2] = 0;
					field[y1][x1 - 1] = field[y1 + 1][x1 - 1] = field[y2][x2 - 1] = this.index;
				
					x1--; x2--;
					this.coord = [[x1, y1], [x2, y2]];
				}
				break;
		}
	}
}