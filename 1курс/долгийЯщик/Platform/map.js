const mapConstruct = [
	"1..111....1".split(''),
	"1......1..1".split(''),
	"1.......111...11".split(''),
	"1.111.....1.111.".split(''),
	"1......1111".split(''),
	".".split(''),
	"......11...111.".split(''),
	"111.1.1.1.1.".split('')
];

class Map{
	constructor(){
		this.platforms = [];
		this.box = 50;
	}
	init(mapConstruct){
		for(let i = 0; i < mapConstruct.length; i++){
			for(let j = 0; j < mapConstruct[i].length; j++){
				if(mapConstruct[i][j] == '.') continue;
				this.platforms.push(new Hitbox({
					x: j * this.box,
					y: i * this.box,
					width: this.box,
					height: this.box
				}));
				this.platforms[this.platforms.length - 1].show();
			}
		}
	}
}

let map = new Map();
map.init(mapConstruct);