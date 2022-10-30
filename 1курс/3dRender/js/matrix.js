class Matrix extends Array
{
	constructor ( n, m )
	{
		super();
		this.init( n, m );
	}
	init ( n, m )
	{
		for ( let i = 0; i < n; i++ )
		{
			this[i] = new Float32Array(m);
		} 
	}
	setValue ( ...arrays )
	{
		for ( let i = 0; i < this.length; i++ )
		{
			for ( let j = 0; j < arrays[i].length; j++ )
			{
				this[i][j] = arrays[i][j];
			}
		}
	}
	multiply ( m ) // умножение матрицы на матрицу или на число
	{
		if ( typeof m == 'number' )
		{
			for ( let i in this )
			{
				for ( let j = 0; j < this[i].length; j++ )
				{
					this[i][j] *= m;
				}
			}
		} else if ( typeof m == 'object' ) { // умножение матрицы на матрицу
			let [n1, m1] = [this.length, this[0].length]; // [строки, столбцы]
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
			}
			
			return out;
		}
	}
	diff ( matrix ) // difference возвращаем разность матриц
	{
		let thisSize = [this.length, this[0].length];
		let matrixSize = [matrix.length, matrix[0].length];

		if ( thisSize[0] != matrixSize[0] || thisSize[1] != matrixSize[1] )
		{
			console.log(new Error('Попытка вычислить разность матриц разных размеров'));
			return;
		}
		let [n, m] = thisSize;
		let out = new Matrix(n, m);
		for (let i = 0; i < n; i++)
		{
			for (let j = 0; j < m; j++)
			{
				out[i][j] = this[i][j] - matrix[i][j];
			}
		}
		return out;
	}
	summ (matrix) // возвращаем сумму матриц
	{
		let thisSize = [this.length, this[0].length];
		let matrixSize = [matrix.length, matrix[0].length];

		if ( thisSize[0] != matrixSize[0] || thisSize[1] != matrixSize[1])
		{
			console.log(new Error('Попытка вычислить сумму матриц разных размеров'));
			return;
		}
		let [n, m] = thisSize;
		let out = new Matrix(n, m);
		for (let i = 0; i < n; i++)
		{
			for (let j = 0; j < m; j++)
			{
				out[i][j] = this[i][j] + matrix[i][j];
			}
		}
		return out;
	}
	trans(){
		const N = this.length;
		const M = this[0].length;
		let object = new Matrix(M, N);

		for(let i = 0; i < N; i++){
			for(let j = 0; j < M; j++){
				object[j][i] = this[i][j];
			}
		}

		return object;
	}
}