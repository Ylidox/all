const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width;
let height;

const config = {
	playerX     : 102,
	playerY     : 102,
	playerAngle : Math.PI / 4,
	playerSpeed : 5,
	box         : 50
}

const map = [
	'WWWWWWWWWWWWWWWWWWWWWW'.split(''),
	'W.....W.....W........W'.split(''),
	'W.....WWWWW.W.....W..W'.split(''),
	'WWWWW.W...........W..W'.split(''),
	'W.....W.....W.....W..W'.split(''),
	'W.....W.....W.WWWWW..W'.split(''),
	'W.....W..W...........W'.split(''),
	'W.....W..W.....W.WWW.W'.split(''),
	'W........W.....W.W...W'.split(''),
	'WWWWWWWWWW.WWWWW.W...W'.split(''),
	'W................WWW.W'.split(''),
	'W.....WWWWWWW....W...W'.split(''),
	'W...........W....W...W'.split(''),
	'W.....W....WW..WWW...W'.split(''),
	'W.....W..............W'.split(''),
	'W.WWWWWW...WWW.WWW...W'.split(''),
	'W..............W.....W'.split(''),
	'WWWW..WW.WW.WWWW..WWWW'.split(''),
	'W....................W'.split(''),
	'W....................W'.split(''),
	'W....................W'.split(''),
	'WWWW.WWWWWW..WWWWWWWWW'.split(''),
	'W..W...W.........W...W'.split(''),
	'W..W...W...W.....W...W'.split(''),
	'W..........W.........W'.split(''),
	'W.W..WWW...W.......W.W'.split(''),
	'W.W........W.......W.W'.split(''),
	'W...WW.......W.WWWWW.W'.split(''),
	'W..........W.........W'.split(''),
	'WWWWWWWWWWWWWWWWWWWWWW'.split('')
];

let field = [];
initField = () => {
	for(let i = 0; i < map.length; i++){
		field[i] = [];
		for(let j = 0; j < map[0].length; j++){
			switch(map[i][j]){
				case '.':
					field[i][j] = 0;
					break;
				case 'W':
					field[i][j] = 1;
					break;
			}
		}
	}
}

let player = {
	x: config.playerX,
	y: config.playerY,
	angle: config.playerAngle,
	speed: config.playerSpeed
}

drawRay = () => {
	let pi = Math.PI;
	const FOV = 4 * pi / 7; // разрешение экрана,
	const NUM_Rays = 150;
	const deltaAngle = FOV / NUM_Rays; // приращение угла на каждую итерацию
	let depth = 200 * 2; // длина луча, где 20 - количество итераций

	let beginAngle = player.angle - FOV / 2;
	let endAngle = player.angle + FOV / 2;
	for(let angle = beginAngle; angle < endAngle; angle += deltaAngle){
		let x = player.x;
		let y = player.y;
		ctx.beginPath();
			ctx.moveTo(x, y);
			for(let t = 0; t < 2000; t++){
				x += 2 * Math.cos(angle);
				y += 2 * Math.sin(angle);
				ctx.lineTo(x, y,)
				if(field[Math.floor(y/config.box)][Math.floor(x/config.box)]){
					// ctx.strokeStyle = '#a2a2a2';
					// ctx.stroke();
					break;
				}
				
			}
			ctx.strokeStyle = 'rgba(160, 160, 160, 0.25)';
			ctx.stroke();
		ctx.closePath();
	}
}

drawBox = (x, y, w, h, color, fill) => {
	ctx.beginPath();
		ctx.rect(x, y, w, h);
		if(fill){
			ctx.fillStyle = color;
			ctx.fill();
		}else{
			ctx.strokeStyle = color;
			ctx.stroke();
		}
	ctx.closePath();
}
drawField = () => {
	let box = config.box;
	let rows = Math.floor(height / box);
	let cols = Math.floor(width / box);
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			drawBox(j * box, i * box, box, box, 'rgba(0,0,255,0.25)', field[i][j]);		
		}
	}
}

init = () => {
	canvas.width = 640;///*window.innerWidth;*/config.box * map[0].length;
	canvas.height = 400;///*window.innerHeight;*/config.box * map.length;
	width = 640;//config.box * map[0].length;
	height = 400;//config.box * map.length;
	initField();
	// drawField();
}
init();

let fps;
let lastLoop = new Date();
findFPS = () => { 
    let thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    fps = fps.toFixed(3);
    lastLoop = thisLoop;
    drawText(fps, 100, 20);
}

function drawText(string, x, y){
	ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.font = "20px Verdana";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillText(string, x, y);
	ctx.closePath();
}

mapping = (a, b) => {
	let box = config.box;
	return [Math.floor(a / box) * box, Math.floor(b / box) * box];
}
point = (x, y) => {
	ctx.beginPath();
		ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
		ctx.fillStyle = 'red';
		ctx.fill();
	ctx.closePath();
}
function sqrt(value){
	return Math.sqrt(value);
}

main = () => {
	const pi = Math.PI;
	const FOV =  3*pi/7; // кругозор
	const NUM_Rays = width/4;// разрешение экрана,
	const deltaAngle = FOV / NUM_Rays; // приращение угла на каждую итерацию
	const depth = 500; // глубина луча, максимальная дальность
	const scale = width / NUM_Rays; // ширина плоскости, которую рисует один луч

	const DIST = NUM_Rays / (2 * Math.tan(FOV / 2)); // расстояние от игрока до экрана
	const H = config.box; // реальная высота стены
	const COEFF_PROJ = DIST * H; 
 
	let beginAngle = player.angle - FOV / 2;
	let endAngle = player.angle + FOV / 2;

	let num_plane = 0; // номер плоскости, за которую отвечает луч
	
	let x0 = player.x;
	let y0 = player.y;

	const box = config.box;
	let fieldWidth = box * field[0].length;
	let fieldHeight = box * field.length;
	for(let angle = beginAngle; angle < endAngle; angle += deltaAngle){
		let cc = 0;
		sin_a = Math.sin(angle);
		cos_a = Math.cos(angle);

		let x = player.x;
		let y = player.y;
		let box = config.box;
		let d = depth; // расстояние от нас до препятствия, изначально оно максимально
		for(let t = 0; t < 2000; t++){
			x += 1 * Math.cos(angle);
			y += 1 * Math.sin(angle);
			if(field[Math.floor(y/config.box)][Math.floor(x/config.box)]){
				d = Math.sqrt((x - player.x)**2 + (y - player.y)**2); // изменяем расстояние
				d *= Math.cos(player.angle - angle);
				// if(angle == beginAngle)console.log(t);
				break;
			}
		}

		
		/*let tan_a = Math.tan(angle);

		
		// console.time();
		let depth_v, depth_h;
		if(Math.cos(angle) >= 0){
			for(let x = (Math.floor(x0 / box) + 1) * box; x < fieldWidth; x += box){
				// point(x, Math.tan(angle) * (x - x0) + y0, 'rgba(255, 250, 0, 0.7)');
				try{
					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box)]){
						// point(x, Math.tan(angle) * (x - x0) + y0, 'yellow');
						depth_h = Math.sqrt((x - x0)**2 + (Math.tan(angle) * (x - x0))**2);
						break;
					}
				} catch(e) {
					// point(x, Math.tan(angle) * (x - x0) + y0, 'yellow');
					depth_h = Math.sqrt((x - x0)**2 + (Math.tan(angle) * (x - x0))**2);
					break;
				}
			}
		}else{
			for(let x = Math.floor(x0 / box) * box; x > 0; x -= box){
				// point(x, Math.tan(angle) * (x - x0) + y0, 'rgba(255, 250, 0, 0.7)');
				try{
					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box) - 1]){
						// point(x, Math.tan(angle) * (x - x0) + y0, 'yellow');
						depth_h = Math.sqrt((x - x0)**2 + (Math.tan(angle) * (x - x0))**2);
						break;
					}
				} catch(e) {
					// point(x, Math.tan(angle) * (x - x0) + y0, 'yellow');
					depth_h = Math.sqrt((x - x0)**2 + (Math.tan(angle) * (x - x0))**2);
					break;
				}	
			}
		}
		
		if(Math.sin(angle) >= 0){
			for(let y = (Math.floor(y0 / box) + 1) * box; y < fieldHeight; y += box){
				// point( (y - y0)/tan_a + x0, y, 'rgba(0, 250, 250, 0.7)');
				try{
					if(field[Math.floor(y/box)][Math.floor(((y - y0)/tan_a + x0) / box)]){
						// point( (y - y0)/tan_a + x0, y, 'red');
						depth_v = Math.sqrt( (y - y0)**2 + ((y - y0)/tan_a)**2 );
						break;
					}
				} catch(e) {
					// point( (y - y0)/tan_a + x0, y, 'red');
					depth_v = Math.sqrt( (y - y0)**2 + ((y - y0)/tan_a)**2 );
					break;
				}
			}
		}else{
			for(let y = Math.floor(y0 / box) * box; y > 0; y -= box){
				// point( (y - y0)/tan_a + x0, y, 'rgba(0, 250, 250, 0.7)');

				try{
					if(field[Math.floor(y/box - 1)][Math.floor(((y - y0)/tan_a + x0) / box)]){
						// point( (y - y0)/tan_a + x0, y, 'red');
						depth_v = Math.sqrt( (y - y0)**2 + ((y - y0)/tan_a)**2 );
						break;
					}
				} catch(e) {
					// point( (y - y0)/tan_a + x0, y, 'red');
					depth_v = Math.sqrt( (y - y0)**2 + ((y - y0)/tan_a)**2 );
					break;
				}
			}
		}
		d = Math.min(depth_h|| 800, depth_v || 800);*/
	// console.log(depth_h, depth_v)
	// line(x0, y0, x0 + depth * Math.cos(angle), y0 + depth * Math.sin(angle), 'red');

	// for(let j = 0; j < height; j += box){
	// 	point( (j - y)/Math.tan(angle) + x, j);
	// }
	// console.timeEnd();

		// d = Math.min(depth_h, depth_v);
		// d *= Math.cos(player.angle - angle);

		projHeight = 4*COEFF_PROJ / d;
		let c = Math.floor(255 / (1 + d**2 * 0.000005)) ;
		let color = 'rgb(' + c + ',' + c + ',' + c + ')';
		drawBox(num_plane * scale, (height - projHeight) / 2, scale, projHeight, color, 1);
		// console.log('**************');
		num_plane++;
		

		// console.log(cc);
	}
	// console.log('//////////');
}

let key = {
	'KeyW': 0,
	'KeyD': 0,
	'KeyS': 0,
	'KeyA': 0,
	'KeyK': 0,
	'KeyJ': 0
};

loop = () => {
	ctx.clearRect(0,0, width, height);
	main();
	// drawField();
	// drawRay();
	findFPS();
	move();
	requestAnimationFrame(loop);
}
loop();

function move() {
	let pos = {
		x : player.x,
		y : player.y
	}

	let speed = player.speed;
	let cos = Math.cos(player.angle);
	let sin = Math.sin(player.angle);
	let box = config.box;

	if(key['KeyW']){
		player.x += speed * cos;
		player.y += speed * sin;
	}
	if(key['KeyD']){
		player.x -= speed * sin;
		player.y += speed * cos;
	}
	if(key['KeyS']){
		player.x -= speed * cos;
		player.y -= speed * sin;
	}
	if(key['KeyA']){
		player.x += speed * sin;
		player.y -= speed * cos;
	}
	if(key['KeyK']){
		player.angle += Math.PI / 32;
		if(player.angle > Math.PI * 2){
			player.angle -= Math.PI * 2;
		}
	}
	if(key['KeyJ']){
		player.angle -= Math.PI / 32;
		if(player.angle < 0){
			player.angle += Math.PI * 2;
		}
	}

	if(field[Math.floor(player.y / box)][Math.floor(player.x / box)]){
		player.x = pos.x;
		player.y = pos.y;
	}
}

addEventListener('keydown', (e) => {
	key[e.code] = 1;
})
addEventListener('keyup', (e) => {
	key[e.code] = 0;
})
