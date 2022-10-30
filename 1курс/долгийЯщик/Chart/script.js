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
		this.bankroll *= 100;
		this.bankroll += Math.round(value);
		this.bankroll /= 100;
		this.arrayBankroll.push(this.bankroll);
	}
	updateNumberOfHands(){
		this.numberOfHand++;
		this.arrayNumberOfHands.push(this.numberOfHand);
	}
}

let user = new User();
user.name = 'Ylidox';

let arrayOfHand = [];

function readFile(input) {
	let file = input.files[0];

	reader = new FileReader();

	reader.readAsText(file);

	reader.onload = function() {
	    let arr = reader.result.split("\n");

	    let prevBankroll = 100; // банкролл предыдущей руки в центах
		let currentBankroll = 0; // банкролл текущей руки
		let isCurrentHandWin = false; // выигрышная ли текущая рука
		let isPrevHandWin = false; // выигрышная ли предыдущая рука

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

					currentBankroll = Math.round(findBankroll(str) * 100);
				}
				if(str.indexOf(user.name) != -1 &&
					(str.indexOf('выиграл') != -1 || str.indexOf('собрал') != -1)){
					isCurrentHandWin = true;
				}
			}
			// console.log(currentBankroll, prevBankroll);
			if(currentBankroll > prevBankroll && isPrevHandWin){
				user.updateBankroll(currentBankroll - prevBankroll);
				// console.log(1);
			}else if(currentBankroll < prevBankroll){
				user.updateBankroll(currentBankroll - prevBankroll);
				// console.log(2);
			}else if(currentBankroll == prevBankroll){
				user.updateBankroll(0);
				// console.log(3);
			}

			isPrevHandWin = isCurrentHandWin;
			isCurrentHandWin = false;
			prevBankroll = currentBankroll;
		}
		// console.log(arrayOfHand);

	};

	reader.onerror = function() {
		console.log(reader.error);
	};

}

document.querySelector("input").onchange = () => {
	readFile(document.querySelector("input"));
}

function findBankroll(str){
	let arrStr = str.split('');
	let begin = str.indexOf('$') + 1;
	let end = str.indexOf(' фишек');
	let newArr = arrStr.slice(begin, end);
	let newStr = newArr.join('');
	return +newStr;
}

