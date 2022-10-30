class Dots extends Array{
	constructor(){
		super();
	}
	add(x, y, color){
		this.push({x, y, color});
	}
}

class Key{
	constructor(){
		this.colors = {
			'green' : 0.34,
			'blue'  : 0.66,
			'red'   : 0.01,
			'yellow': 0.16
		}
		this.state = 'red';
	}
	init(table, config, dots){
		let colors = this.colors
		addEventListener('keypress', (event) => {
			switch(event.code){
				case 'KeyR' : this.state = 'red'; break;
				case 'KeyB' : this.state = 'blue'; break;
				case 'KeyG' : this.state = 'green'; break;
				case 'KeyY' : this.state = 'yellow'; break;
			}
		});
		document.querySelector('canvas').onclick = (event) => {
			let i = Math.floor(event.offsetY / config.box);
			let j = Math.floor(event.offsetX / config.box);
			dots.add(j, i, this.colors[this.state]);
			table.clear();
			table.show(config);
			table.drawDots(dots, config);
		};
	}
}

