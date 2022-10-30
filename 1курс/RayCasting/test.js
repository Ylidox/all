const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const field = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,1,1,0,1,0,0,0,0,0,0,0,1,1,1,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1],
	[1,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,1,1,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const box = 50;
const width = canvas.width = box * field[0].length;
const height = canvas.height = box * field.length;

let player = {
	x: 232,
	y: 172,
	angle:  2*Math.PI / 3
}



function drawPlayer(){
	ctx.beginPath();
		ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
	ctx.closePath();
	ctx.beginPath();
		ctx.moveTo(player.x, player.y);
		ctx.lineTo(player.x + 400 * Math.cos(player.angle), player.y + 400 * Math.sin(player.angle));
		ctx.strokeStyle = 'white';
		ctx.stroke();
	ctx.closePath();
}

function drawField(){
	let rows = Math.floor(height / box);
	let cols = Math.floor(width / box);
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			drawBox(j * box, i * box, box, box, 'rgba(0,0,255,1)', field[i][j]);		
		}
	}
}
function drawBox(x, y, w, h, color, fill){
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

drawField();

function mapping(a, b){
	return [Math.floor(a / box) * box, Math.floor(b / box) * box];
}


let ox = player.x;
let oy = player.y;
let xm, ym;
[xm, ym] = mapping(ox, oy);

function ray( angle, box){
	let l = 0;
	sin_a = Math.sin(angle);
	cos_a = Math.cos(angle);

	sin_a = (sin_a) ? sin_a : 0.000001;
	cos_a = (cos_a) ? cos_a : 0.000001;

	// verticals
	// console.time();
	let x, y, dx, dy;
	// [x, dx] = (cos_a >= 0) ? [xm + box, 1] : [xm, -1];

	if(cos_a >= 0){
		x = xm + box;
		dx = 1;
	}else{
		x = xm;
		dx = -1;
	}

	let depth_v;
	for(let i = 0; i < width; i += box){
		l++;
		depth_v = (x - ox) / cos_a;
		y = oy + depth_v * sin_a;
		let m, n;
		// [m, n] = [Math.floor((x + dx) / box), Math.floor(y / box)];
		m = Math.floor((x + dx) / box);
		n = Math.floor(y / box);
		if(field[n][m]){
			break;
		}
		// point(x, y);
		x += dx * box;		
	}
	// console.timeEnd();
	// console.time();
	// horizontals
	// [y, dy] = (sin_a >= 0) ? [ym + box, 1] : [ym, 1];

	if(sin_a >= 0){
		y = ym + box;
		dy = 1;
	}else{
		y = ym;
		dy = -1;
	}
	for(let i = 0; i < height; i += box){
		l++;
		depth_h = (y - oy) / sin_a;
		x = ox + depth_h * cos_a;
		let m, n;
		// [m, n] = [Math.floor(x / box), Math.floor((y + dy) / box)];
		m =Math.floor(x / box);
		n = Math.floor((y + dy) / box);

		if(field[n][m]){
			break;
		}
		
		// point(x, y);
		y += dy * box;
	}

	// let depth = (depth_v < depth_h) ? depth_v : depth_h;
	if(depth_v < depth_h){
		let depth = depth_v;
	}else{
		let depth = depth_h;
	}
	// console.timeEnd();
	// console.timeEnd();
	// // console.log(l);
	// ctx.beginPath();
	// 	ctx.moveTo(player.x, player.y);
	// 	ctx.lineTo(depth * cos_a + player.x, depth * sin_a + player.y);
	// 	ctx.strokeStyle = 'white';
	// 	ctx.stroke();
	// ctx.closePath();
}

function point (x, y, color) {
	console.log(1);
	ctx.beginPath();
		ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	ctx.closePath();
}

function ray1(angle, box){
	let l = 0;
	let x = player.x;
	let y = player.y;
	sin_a = Math.sin(angle);
	cos_a = Math.cos(angle);
	for(let t = 0; t < 2000; t++){
		l++;
		x += 1 * Math.cos(angle);
		y += 1 * Math.sin(angle);
		if(field[Math.floor(y/box)][Math.floor(x/box)]){
			depth = Math.sqrt((x - player.x)**2 + (y - player.y)**2); // изменяем расстояние
			depth *= Math.cos(player.angle - angle);
			// if(angle == beginAngle)console.log(t);
			break;
		}
		// point(x, y);
	}
	// ctx.beginPath();
	// 	ctx.moveTo(player.x, player.y);
	// 	ctx.lineTo(depth * cos_a + player.x, depth * sin_a + player.y);
	// 	ctx.strokeStyle = 'white';
	// 	ctx.stroke();
	// ctx.closePath();
	console.log(l)
}

// console.time();
// angle = player.angle - Math.PI / 3;
// for(let i = 0; i < 320; i++){
// 	angle = +(angle).toFixed(3);
// 	try{
// 		ray(angle, box);
// 	}catch(e){
// 		console.log(angle * 180 / Math.PI)
// 	}
	
// 	angle += Math.PI / 180;
// }
// ray(282.06712254290426 * Math.PI / 180, box);
// console.timeEnd();

// l = new Date();
// for(let i = 0; i < 10000; i++){
// 	let a = 2;
// 	[j, m] = (a % 3 == 0) ? [1, 2] : [2, 1];
// 	// if(a % 3 == 0){
// 	// 	j = 1;
// 	// 	m = 2;
// 	// } else {
// 	// 	j = 2;
// 	// 	m = 1;
// 	// }

// }
// m = new Date();
// console.log(m - l);


function rayA( angle, box){
	let l = 0;
	sin_a = Math.sin(angle);
	cos_a = Math.cos(angle);

	if(sin_a){
		sin_a = sin_a;
	}else{
		sin_a = 0.000001;
	}

	if(cos_a){
		cos_a = cos_a;
	}else{
		cos_a = 0.000001;
	}
	// verticals
	let x, y, dx, dy;

	if(cos_a >= 0){
		x = xm + box;
		dx = 1;
	}else{
		x = xm;
		dx = -1;
	}

	let depth_v;
	for(let i = 0; i < width; i += box){
		l++;
		depth_v = (x - ox) / cos_a;
		y = oy + depth_v * sin_a;
		let m, n;
		
		m = Math.floor((x + dx) / box);
		n = Math.floor(y / box);

		ctx.beginPath();
			ctx.rect(m*box, n*box, box, box);
			ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
			ctx.fill();
		ctx.closePath();


		if(field[n][m]){
			break;
		}
		x += dx * box;		
	}
	// horizontals
	if(sin_a >= 0){
		y = ym + box;
		dy = 1;
	}else{
		y = ym;
		dy = -1;
	}
	for(let i = 0; i < height; i += box){
		l++;
		depth_h = (y - oy) / sin_a;
		x = ox + depth_h * cos_a;
		let m, n;
		m = Math.floor(x / box);
		n = Math.floor((y + dy) / box);

		ctx.beginPath();
			ctx.rect(m*box, n*box, box, box);
			ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
			ctx.fill();
		ctx.closePath();

		if(field[n][m]){
			break;
		}
		
		y += dy * box;
	}
	let depth;
	if(depth_v < depth_h){
		depth = depth_v;
	}else{
		depth = depth_h;
	}
	return depth;
}
// depth = rayA(player.angle, box);
// for(let angle = -Math.PI; angle < 2 * Math.PI; angle += Math.PI / 640){
// 	try{
// 	let depth = rayA(angle, box);	
// 	ctx.beginPath();
// 		ctx.moveTo(player.x, player.y);
// 		ctx.lineTo(depth * cos_a + player.x, depth * sin_a + player.y);
// 		ctx.strokeStyle = 'white';
// 		ctx.stroke();
// 	ctx.closePath();
// 	}catch(e){

// 	}
// }

// this.line = function (x0, y0, x1, y1, C) { // из точки (x0,y0) в (x1,y1), C - цвет
//    var dx = Math.abs(x1-x0);
//    var dy = Math.abs(y1-y0);
//    var sx = (x0 < x1) ? 1 : -1;
//    var sy = (y0 < y1) ? 1 : -1;
//    var err = dx-dy;
//    while (true) {
//     putPixel(x0,y0,C);
//     if ((x0==x1) && (y0==y1)) break;
//     var e2 = 2*err;
//     if (e2 >-dy){ err -= dy; x0  += sx; }
//     if (e2 < dx){ err += dx; y0  += sy; }
//    }
//   }
// ray(400);
function ray(depth){
	let x0 = Math.floor(player.x / box);
	let y0 = Math.floor(player.y / box);
	let x1 = Math.floor( (player.x + depth * Math.cos(player.angle) ) / box);
	let y1 = Math.floor( (player.y + depth * Math.cos(player.angle) ) / box);

	let dx = Math.abs(x1 - x0);
	let dy = Math.abs(y1 - y0);
	let sx = (x0 < x1) ? 1 : -1;
	let sy = (y0 < y1) ? 1 : -1;
	let err = dx-dy;
	while (true) {
		ctx.beginPath();
			ctx.rect(x0*box, y0*box, box, box);
			ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
			ctx.fill();
		ctx.closePath();
		if ((x0==x1) && (y0==y1)) break;
		var e2 = 2*err;
		if (e2 >-dy){ err -= dy; x0  += sx; }
		if (e2 < dx){ err += dx; y0  += sy; }
	}
}

drawField();
// drawPlayer();

function myRay(angle){
	// let angle = player.angle;
	let x0 = player.x;
	let y0 = player.y;
	let tan_a = Math.tan(angle);
	// console.log('*****\n' + angle*180/Math.PI);
	
	// console.time();
	let depth_v, depth_h;
	if(Math.cos(angle) >= 0){
		for(let x = (Math.floor(x0 / box) + 1) * box; x < width; x += box){
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
		for(let y = (Math.floor(y0 / box) + 1) * box; y < height; y += box){
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
	depth = Math.min(depth_h|| 1200, depth_v || 1200);
	// console.log(depth_h, depth_v)
	line(x0, y0, x0 + depth * Math.cos(angle), y0 + depth * Math.sin(angle), 'rgba(255,0,0,0.5)');

	// for(let j = 0; j < height; j += box){
	// 	point( (j - y)/Math.tan(angle) + x, j);
	// }
	// console.timeEnd();
}
test = () => {
	pi = Math.PI;
	// console.time();
	I = 0;
	// delta = 3*pi/7 / 160;
	m = new Date();
	for(player.angle = 0; player.angle < 2*pi; player.angle += pi/1000){
		// drawPlayer();
		I++;
		myRay(player.angle);
		/*let angle = player.angle;
		sin_a = Math.sin(angle);
		cos_a = Math.cos(angle);

		let x = x0 = player.x;
		let y = y0 = player.y;

		// let box = config.box;
		// let d = depth; // расстояние от нас до препятствия, изначально оно максимально

		for(let t = 0; t < 2000; t++){
			// I++;
			x += 1 * Math.cos(angle);
			y += 1 * Math.sin(angle);
			if(field[Math.floor(y/box)][Math.floor(x/box)]){
				depth = Math.sqrt((x - player.x)**2 + (y - player.y)**2); // изменяем расстояние
				// depth *= Math.cos(player.angle - angle);
				// if(angle == beginAngle)console.log(t);
				line(x0, y0, x0 + depth * Math.cos(angle), y0 + depth * Math.sin(angle), 'red');
				break;
			}
		}*/
		
	}
	console.log('время на кадр: ' + (new Date() - m));
	// console.timeEnd();
	console.log(I);
}
test();

addEventListener('click', (event) => {
	player.x = event.offsetX;
	player.y = event.offsetY;
	ctx.clearRect(0, 0, width, height);
	drawField();
	console.clear();
	test();
});

function line(x1, y1, x2, y2, color){
	ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = color;
		ctx.stroke();
	ctx.closePath();
}

// function main(){
// 	const pi = Math.PI;
// 	const FOV =  3*pi/7; // кругозор
// 	const NUM_Rays = width;// разрешение экрана,
// 	const deltaAngle = FOV / NUM_Rays; // приращение угла на каждую итерацию
// 	const depth = 400; // глубина луча, максимальная дальность
// 	const scale = width / NUM_Rays; // ширина плоскости, которую рисует один луч

// 	const DIST = NUM_Rays / (2 * Math.tan(FOV / 2)); // расстояние от игрока до экрана
// 	const H = config.box; // реальная высота стены
// 	const COEFF_PROJ = DIST * H; 
 
// 	let beginAngle = player.angle - FOV / 2;
// 	let endAngle = player.angle + FOV / 2;

// 	let num_plane = 0; // номер плоскости, за которую отвечает луч
	
// 	let angle = player.angle;
// 	let x0 = player.x;
// 	let y0 = player.y;
// 	let tan_a = Math.tan(angle);

// 	let beginX = Math.floor(x0 / box) * box;
// 	let beginY = Math.floor(y0 / box) * box;

// 	let fieldWidth = box * field[0].length;
// 	let fieldHeight = box * field.length;

// 	let depth_h, depth_v;
// 	for(let angle = beginAngle; angle < endAngle; angle += deltaAngle){

// 		if(Math.cos(angle) >= 0){
// 			for(let x = /*(Math.floor(x0 / box) + 1) * box*/beginX + box; x < fieldWidth; x += box){
// 				// point(x, Math.tan(angle) * (x - x0) + y0 );
// 				try{
// 					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box)]){
// 						depth_h = Math.sqrt((tan_a * (x - x0) + y0)**2 + x**2);
// 						break;
// 					}
// 				} catch(e) {
// 					depth_h = Math.sqrt((tan_a * (x - x0) + y0)**2 + x**2);
// 					break;
// 				}
// 			}
// 		}else{
// 			for(let x = beginX; x > 0; x -= box){
// 				// point(x, Math.tan(angle) * (x - x0) + y0);		
// 				try{
// 					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box)]){
// 						depth_h = Math.sqrt((tan_a * (x - x0) + y0)**2 + x**2);
// 						break;
// 					}
// 				} catch(e) {
// 					depth_h = Math.sqrt((tan_a * (x - x0) + y0)**2 + x**2);
// 					break;
// 				}	
// 			}
// 		}
		
// 		if(Math.sin(angle) >= 0){
// 			for(let y = /*(Math.floor(y0 / box) + 1) * box*/ beginY + box; y < height; y += box){
// 				// point( (y - y0)/tan_a + x0, y);
// 				try{
// 					if(field[Math.floor(y/box)][Math.floor(((y - y0)/tan_a + x0) / box)]){
// 						depth_v = Math.sqrt( ((y - y0)/tan_a + x0)**2 + y**2 );
// 						break;
// 					}
// 				} catch(e) {
// 					depth_v = Math.sqrt( ((y - y0)/tan_a + x0)**2 + y**2 );
// 					break;
// 				}
// 			}
// 		}else{
// 			for(let y = /*Math.floor(y0 / box) * box*/ beginY; y > 0; y -= box){
// 				// point( (y - y0)/tan_a + x0, y);
// 				try{
// 					if(field[Math.floor(y/box)][Math.floor(((y - y0)/tan_a + x0) / box)]){
// 						depth_v = Math.sqrt( ((y - y0)/tan_a + x0)**2 + y**2 );
// 						break;
// 					}
// 				} catch(e) {
// 					depth_v = Math.sqrt( ((y - y0)/tan_a + x0)**2 + y**2 );
// 					break;
// 				}
// 			}
// 		}

// 		let d = Math.min(depth_h, depth_v);
// 		projHeight = COEFF_PROJ / d;
// 		let c = Math.floor(255 / (1 + d**2 * 0.000005)) ;
// 		let color = 'rgb(' + c + ',' + c + ',' + c + ')';
// 		drawBox(num_plane * scale, (height - projHeight) / 2, scale, projHeight, color, 1);
// 		// console.log('**************');
// 		num_plane++;
// 	}
// }

main = () => {
	const pi = Math.PI;
	const FOV =  3*pi/7; // кругозор
	const NUM_Rays = width;// разрешение экрана,
	const deltaAngle = FOV / NUM_Rays; // приращение угла на каждую итерацию
	const depth = 400; // глубина луча, максимальная дальность
	const scale = width / NUM_Rays; // ширина плоскости, которую рисует один луч

	const DIST = NUM_Rays / (2 * Math.tan(FOV / 2)); // расстояние от игрока до экрана
	const H = config.box; // реальная высота стены
	const COEFF_PROJ = DIST * H; 
 
	let beginAngle = player.angle - FOV / 2;
	let endAngle = player.angle + FOV / 2;

	let num_plane = 0; // номер плоскости, за которую отвечает луч
	
	for(let angle = beginAngle; angle < endAngle; angle += deltaAngle){
		let x = player.x;
		let y = player.y;
		let box = config.box;
		let d = depth; // расстояние от нас до препятствия, изначально оно максимально
		
		let x0 = player.x;
		let y0 = player.y;
		let tan_a = Math.tan(angle);
		let cos_a = Math.cos(angle);
		let sin_a = Math.sin(angle);
		// for(let i = 0; i < width; i += box){
		// 	point(i, Math.tan(angle) * (i - x) + y);
		// }
		
		console.time();
		if(Math.cos(angle) >= 0){
			for(let x = (Math.floor(x0 / box) + 1) * box; x < width; x += box){
				// point(x, Math.tan(angle) * (x - x0) + y0 );

				try{
					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box)]){
						depth_v = (x - x0) / cos_a;
						break;
					}
				} catch(e) {
					break;
				}
			}
		}else{
			for(let x = Math.floor(x0 / box) * box; x > 0; x -= box){
				// point(x, Math.tan(angle) * (x - x0) + y0);
				try{
					if(field[Math.floor((tan_a * (x - x0) + y0)/box)][Math.floor(x / box)]){
						depth_v = (x - x0) / cos_a;
						break;
					}
				} catch(e) {
					depth_v = (x - x0) / cos_a;
					break;
				}	
			}
		}
		
		if(Math.sin(angle) >= 0){
			for(let y = (Math.floor(y0 / box) + 1) * box; y < height; y += box){
				// point( (y - y0)/tan_a + x0, y);
				try{
					if(field[Math.floor(y/box)][Math.floor(((y - y0)/tan_a + x0) / box)]){
						depth_h = (y - y0) / sin_a;
						break;
					}
				} catch(e) {
					depth_h = (y - y0) / sin_a;
					break;
				}
			}
		}else{
			for(let y = Math.floor(y0 / box) * box; y > 0; y -= box){
				// point( (y - y0)/tan_a + x0, y);
				try{
					if(field[Math.floor(y/box)][Math.floor(((y - y0)/tan_a + x0) / box)]){
						depth_h = (y - y0) / sin_a;
						break;
					}
				} catch(e) {
					depth_h = (y - y0) / sin_a;
					break;
				}
			}
		}

	
		d = Math.min(depth_h , depth_v);
		d *= Math.cos(player.angle - angle);

		projHeight = COEFF_PROJ / d;
		let c = Math.floor(255 / (1 + d**2 * 0.000005)) ;
		let color = 'rgb(' + c + ',' + c + ',' + c + ')';
		drawBox(num_plane * scale, (height - projHeight) / 2, scale, projHeight, color, 1);
		// console.log('**************');
		num_plane++;
		// console.log(cc);
	}
	// console.log('//////////');
}







