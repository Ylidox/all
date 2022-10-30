vector = (x, y) => {
	return {x, y};
}

vectorFromAngle = (angle) => {
	return vector(Math.cos(angle), Math.sin(angle));
}

length = (vec) => {
	return Math.hypot(vec.x, vec.y);
}

normalize = (vec) => {
	let l = length(vec);
	vec.x /= l;
	vec.y /= l;
	return vec;
}

sum = (vec1, vec2) => {
	return vector(vec1.x + vec2.x, vec1.y + vec2.y);
}

dif = (vec1, vec2) => {
	return vector(vec1.x - vec2.x, vec1.y - vec2.y);
}

mul = (vec1, num) => {
	if(typeof num == 'number') return vector(vec1.x * num, vec1.y * num);
	// если вторым параметром передали вектор, находим скалярное произведение
	else return vec1.x * num.x + vec1.y * num.y;
}

angle = (vec1, vec2 = undefined) => {
	// если передан один вектор, находим его направление,
	if(!vec2) return Math.atan(vec1.y / vec1.x);
	// иначе возвращаем угол между векторами
	else return Math.acos( mul(vec1, vec2) / (length(vec1) * length(vec2)) );
}

proj = (vec1, vec2) => {
	// находим проекцию вектора vec1 на vec2
	let x, y;
	x = (mul(vec1, vec2) / length(vec2) ** 2) * vec2.x;
	y = (mul(vec1, vec2) / length(vec2) ** 2) * vec2.y;
	return vector(x, y);
}

point = (x, y) => {
	return {x, y};
}

dist = (point1, point2) => {
	return Math.hypot( point1.x - point2.x, point1.y - point2.y);
}

getCenterMass = (arrPoint) => {
	let x = y = 0;
	for(let i = 0; i < arrPoint.length; i++){
		x += arrPoint[i].x;
		y += arrPoint[i].y;
	}
	x /= arrPoint.length;
	y /= arrPoint.length;
	return point(x, y);
}

getAngle = (point1, point2) => {
	let x1 = point1.x;
	let y1 = point1.y;
	let x2 = point2.x;
	let y2 = point2.y;
	let angle = Math.atan( (y2 - y1) / (x2 - x1));
	if(x1 < x2 && y1 > y2){
		angle += 2 * Math.PI;
		return angle;
	}
	if(x1 < x2 && y1 < y2) return angle;
	if(x1 > x2 && y1 < y2){
		angle += Math.PI;
		return angle;
	}
	if(x1 > x2 && y1 > y2){
		angle += Math.PI;
		return angle;
	}
}