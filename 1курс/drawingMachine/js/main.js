const config = {
	box    : 5,
	width  : 120,
	height : 120
}

let table = new Table(config);
table.show(config);

let dots = new Dots();
let key = new Key();
key.init(table, config, dots);

let net = new NN(3, 10, 10, 1);

function correctData(dot){
	let {x, y, color} = dot;
	x /= config.width;
	y /= config.height;
	return [ [x, y], [color] ];
}

function main(){
	for(let i = 0; i < table.length; i++){
		for(let j = 0; j < table[0].length; j++){
			let input = correctData({x: j, y: i, color: table[i][j]})[0];
			table[i][j] = net.out(input);
		}
	}
	table.clear();
	table.show(config);
	table.drawDots(dots, config);
}

addEventListener('keypress', (event) => {
	if(event.code == 'Enter'){
		for(let i = 0; i < 14000; i++){
			for(let j = 0; j < dots.length; j++){
				net.learning(...correctData(dots[j]));
			}
		}
		main();
	}
});
