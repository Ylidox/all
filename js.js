const node = () => {
	return {
		link : null,
		value: null
	}
}

const push = (obj, elem) => {
	let a = obj;
	while(true){
		if(a.value === null) break;
		if(a.link === null){
			a.link = node();
		}
		a = a.link;
	}
	a.value = elem;
}

const get = (obj, index) => {
	let a = obj;
	for(let i = 0; i < index - 1; i++){
		if(a.link === null) return false;
		a = a.link;
	}
	return a.value;
}

const set = (obj, index, value) => {
	let a = obj;
	for(let i = 0; i < index - 1; i++){
		if(a.link === null) return false;
		a = a.link;
	}
	a.value = value;
}

const insert = (obj, index, value) => {
	let a = obj;
	for(let i = 0; i < index - 1; i++){
		if(a.link === null) return false;
		a = a.link;
	}
	let b = a.link;
	a.link = node();
	a.link.link = b;
	a.link.value = value;
}

let A = node();

push(A, 1);
push(A, 2);
push(A, 3);
push(A, 4);

get(A, 2);