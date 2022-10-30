class Table extends Array{
	constructor(config){
		super();
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.width = this.canvas.width = config.box * config.width;
		this.height = this.canvas.height = config.box * config.height;

		this.init(config);
	}
	init(config){
		for(let i = 0; i < config.height; i++){
			this[i] = [];
			for(let j = 0; j < config.width; j++){
				this[i][j] = 0.55;// Math.random();
			}
		}
	}
	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	convertNumberToHSL(number){
		let color = Math.round(number * 360);
		return `hsl(${color}, 100%, 50%)`;
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
			this.ctx.rect(x, y, width, height );
			this.ctx.fillStyle = color;
			this.ctx.fill();
		this.ctx.closePath();
	}
	circle(x, y, radius, color){
		this.ctx.beginPath();
			this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
			this.ctx.fillStyle = color;
			this.ctx.fill();
		this.ctx.closePath();
	}
	show(config){
		for(let i = 0; i < this.length; i++){
			for(let j = 0; j < this[0].length; j++){
				
				let color = this.convertNumberToHSL(this[i][j]);
				let box = config.box;
				this.rect(j * box, i * box, box, box, color);
			}
		}
	}
	drawDots(dots, config){
		for(let i = 0; i < dots.length; i++){
			let {x, y, color} = dots[i];
			this.circle(x * config.box + 5, y * config.box + 5, 5, this.convertNumberToHSL(color));
		}
	}
}

