let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

class User{
	constructor(){
		this.name = '';
		this.bankroll = 0;
		this.numberOfHand = 0;
		this.arrayNumberOfHands = [];
		this.arrayBankroll = [];
	}
	updateBankroll(value){
		this.bankroll += Math.round(value) / 100;
		this.arrayBankroll.push( Math.round(this.bankroll*100) / 100);
	}
	updateNumberOfHands(){
		this.numberOfHand++;
		this.arrayNumberOfHands.push(this.numberOfHand);
	}
}

let user = new User();
user.name = 'Ylidox';

let arrayOfHand = [];
let arrayResult = [];

function readFile(input) {
	let file = input.files[0];

	reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function() {
	    let arr = reader.result.split("\n");
	    let currentBankroll = 0;
	    let win = 0;

	    let currentHand = [];
		for(let i = 0; i < arr.length; i++){
			if(arr[i].length > 1){
				currentHand.push(arr[i]);
			}else{
				if(currentHand.length != 0){
					arrayOfHand.push(currentHand);
					user.updateNumberOfHands();
				}
				currentHand = [];
			}
		}

		for(let i = 0; i < arrayOfHand.length; i++){
			for(let j = 0; j < arrayOfHand[i].length; j++){
				let str = arrayOfHand[i][j];

				if (str.indexOf("Место") != -1 &&
					str.indexOf(user.name) != -1 && 
					str.indexOf("фишек") != -1){

					currentBankroll = Math.round(findBankroll(str, 1) * 100);
					arrayResult[i] = [currentBankroll, 0];
					// console.log(currentBankroll)
				}
				if(str.indexOf(user.name) != -1 &&
					(str.indexOf('выиграл') != -1 || str.indexOf('собрал') != -1)){
					// console.log(str);
					win = Math.round( findBankroll(str, 2)*100);
					// console.log(str, ' ** ' ,win);
					arrayResult[i] = [currentBankroll, win];
				}
			}
			
		}
		translate();
	}
}

document.querySelector("input").onchange = () => {
	readFile(document.querySelector("input"));
}

function findBankroll(str, index){
	let arrStr = str.split('');
	let begin = str.indexOf('$') + 1;
	let end;
	if(index == 1){
		end = str.indexOf(' фишек');
	}else if(index == 2){
		end = str.indexOf(')', begin);
	}

	let newArr = arrStr.slice(begin, end);
	let newStr = newArr.join('');
	return +newStr;
}

function translate(){
	for(var i = 0; i < arrayResult.length - 1; i++){
		arrayResult[i][2] = arrayResult[i + 1][0];
	}
	arrayResult[i][2] = arrayResult[i][0] + arrayResult[i][1]; 
	// console.log(arrayResult);
	for(let i = 0; i < arrayResult.length; i++){
		if(arrayResult[i][0] > arrayResult[i][2]){ // проигрыш
			// console.log(arrayResult[i][2] - arrayResult[i][0]);
			user.updateBankroll(arrayResult[i][2] - arrayResult[i][0]);
		}else if(arrayResult[i][0] < arrayResult[i][2] && arrayResult[i][1] > 0){ // выигрыш
			user.updateBankroll(arrayResult[i][2] - arrayResult[i][0]);
			// console.log(arrayResult[i][2] - arrayResult[i][0]);
		}else{
			user.updateBankroll(0);
			// console.log(0);
		}
	}
	console.log(arrayResult);
	console.log(user.bankroll);
	arrayOfHand = [];
	arrayResult = [];


	var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: user.arrayNumberOfHands,
        datasets: [{
            label: 'Результат на сегодня',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: user.arrayBankroll
        }]
    },

    // Configuration options go here
    options: {}
});
}