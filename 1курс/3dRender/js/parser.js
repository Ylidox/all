function readFile(input) {
	let file = input.files[0];

	let reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function() {
		let strings = reader.result.split('\n');

		for(let i = 0; i < strings.length; i++){
			let str = strings[i];
			if(str[0] == '#') continue;
			if(str[0] + str[1] == 'v '){
				str = str.split(' ');
				let p = [+str[2], +str[3], +str[4], 1];
				// let point = new Matrix(1, 4);
				// point.setValue(p);
				points.push(p);
			}
			if(str[0] == 'f'){
				str = str.split(' ');
				let f = [];
				for(let j = 1; j < 5; j++){
					let p = str[j].split('/');
					f.push(+p[0]);
				}
				faces.push(f);
			}
		}
	};

	reader.onerror = function() {
	console.log(reader.error);
	};

}