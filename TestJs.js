let anagram = (first, second) => {
	let letters1 = first.toLowerCase().split('').sort();
	let letters2 = second.toLowerCase().split('').sort();

	if(letters1.length != letters2.length) return false;

	for(let i = 0; i < letters1.length; i++){
		if(letters1[i] == letters2[i]) continue;
		else return false;
	}

	return true;
}

let flat = (array) => {
	let out = [];
	for(let item of array){
		if(typeof item == 'object') out = out.concat(flat(item));
		else out = out.concat(item);
	}
	return out;
}

let square = (number) => {
	return (number + '')
		.split('')
		.map((item) => {
			item = (+item)**2;
			return item + '';
		})
		.join('');
}

let duplicate = (str) => {
	str = str.split('');
	let letters = {};
	for(let item of str){
		if(letters[item] == undefined) letters[item] = 0;
		letters[item]++;
	}
	return str.map((item) => {
		if(letters[item] == 1) return '(';
		else return ')';
	})
	.join('');
}

let order = (str) => {
	let reg = /\d+/g;
	let numbers = str.match(reg);
	let len = Math.max(...numbers);
	let clean = [...Array(len)];

	let words = str.split(' ');
	for(let i = 0; i < len; i++){
		let index = words[i].indexOf(numbers[i]);
		words[i] = words[i].split('');
		words[i].splice(index, numbers[i].length);
		clean[+numbers[i]] = words[i].join('');
	}
	return clean.join(' ');
}

//console.log(order('Cs3d 1Aas D4sd Bds2 E5sd'));

let create = (n) => {
	let out = [];
	for(let i = 0; i < n; i++){
		out.push( Math.round( Math.random() * 10));
	}
	return out;
}

let a = create(10000);
let b = create(10000);
let c = create(10000);

let sum1 = (arr) => {
	return arr.reduce((a, b) => a + b);
}

let mul1 = (a, b, c) => {
	return sum1(a) * sum1(b) * sum1(c);
}

let sum2 = async (arr) => {
	return arr.reduce((a, b) => a + b);
}

let mul2 = async (a, b, c) => {
	let n1 = await sum1(a);
	let n2 = await sum1(b);
	let n3 = await sum1(c);
	return n1 * n2 * n3;
}

/*console.time();
console.log(mul1(a, b, c));
console.timeEnd();

let log = (num) => {
	console.log(num);
	console.timeEnd();
}
console.time();
mul2(a, b, c).then(log);*/

/*let [n1, m1] = [this.length, this[0].length]; // [строки, столбцы]
let [n2, m2] = [m.length, m[0].length];
// число столбцов первой матрицы должно совпадать с числом строк второй
if (m1 != n2)
{
	console.log( new Error('Попытка умножить матрицы не соответствующих размеров'));
	return;
}
let out = new Matrix(n1, m2); // число строк первой * число столбцов второй

for ( let i = 0; i < n1; i++ ) {
	for ( let j = 0; j < m2; j++) {
		let S = 0;
		for ( let k = 0; k < m1; k++){
			S += this[i][k] * m[k][j];
		}
		out[i][j] = S;
	}
}*/


let createMatrix = (n, m) => {
	let out = Array(n);
	for(let i = 0; i < m; i++){
		out[i] = Array(m).fill(0);
	}
	return out;
}

let createRandomMatrix = (n, m) => {
	let out = Array(n);
	for(let i = 0; i < m; i++){
		out[i] = Array(m).fill( Math.floor(10 * Math.random()));
	}
	return out;
}

let m1 = createRandomMatrix(100, 100);
let m2 = createRandomMatrix(100, 100);


let cell = async (i, j, m1, m2) => {
	// находит поэлементное произведение ячеек по строке i матрицы m1
	// и столбца j матрицы m2, после чего полученные произведения складываются
	let out = 0;
	for(let k = 0; k < m2.length; k++){
		out += m1[i][k] * m2[k][j];
	}
	return out;
}

let mul = async (a, b) => {
	let [n1, m1] = [a.length, a[0].length]; // [строки, столбцы]
	let [n2, m2] = [b.length, b[0].length];

	// число столбцов первой матрицы должно совпадать с числом строк второй
	if (m1 != n2)
	{
		console.log( new Error('Попытка умножить матрицы не соответствующих размеров'));
		return;
	}

	let S = createMatrix(n1, m2);

	// console.time();
	for(let i = 0; i < n1; i++){
		for(let j = 0; j < m2; j++){
			S[i][j] = await cell(i, j, a, b);
		}
	}
	// console.timeEnd();
	return S;
}

let syncMul = (a, b) => {
	let [n1, m1] = [a.length, b.length]; // [строки, столбцы]
	let [n2, m2] = [a.length, b[0].length];
	// число столбцов первой матрицы должно совпадать с числом строк второй
	if (m1 != n2)
	{
		console.log( new Error('Попытка умножить матрицы не соответствующих размеров'));
		return;
	}
	let out = createMatrix(n1, m2); // число строк первой * число столбцов второй

	for ( let i = 0; i < n1; i++ ) {
		for ( let j = 0; j < m2; j++) {
			let S = 0;
			for ( let k = 0; k < m1; k++){
				S += a[i][k] * b[k][j];
			}
			out[i][j] = S;
		}
	}

	return out;
}

// console.time();
// //console.log(syncMul(m1, m2));
// syncMul(m1, m2)
// console.timeEnd();

// let n = 0;
// let log = (item) => {
// 	//console.log(item);
// 	console.timeEnd();
// }
// console.time();
// mul(m1, m2).then(log);