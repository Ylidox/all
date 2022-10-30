class Time{
	constructor(){
		this.startTime = [];
		this.timer = null;
		this.seconds = 0;
	}
	start(){
		let time = new Date();
		this.startTime = [time.getMinutes(), time.getSeconds()];
	}
	show(){
		let dom = document.querySelector('#time1');
		let time = new Date();
		let m = Math.floor(this.seconds / 60);
		let s = this.seconds % 60;
		if(m < 10) m = '0' + m;
		if(s < 10) s = '0' + s;
		dom.innerHTML = `${m}:${s}`;
		// console.log(time.getMinutes() - this.startTime[0],  time.getSeconds() - this.startTime[1]);
	}
	setTimer(){
		this.timer = setInterval(() => {
			this.seconds++;
			this.show();
		}, 1000);
	}
	clearTimer(){
		clearInterval(this.timer);
	}
}

class Book{
	constructor(){
		this.chapters = [
			['Кормили плохо, вечно хотелось есть. Иногда пищу давали раз в сутки, и то вечером. Ах, как хотелось есть! И вот в один из таких дней, когда уже приближались сумерки, а во рту не было ещё ни крошки, мы, человек восемь бойцов, сидели на высоком травянистом берегу тихонькой речушки и чуть не скулили. Вдруг видим, без гимнастёрки. Что-то держа в руках. К нам бежит ещё один наш товарищ. Подбежал. Лицо сияющее. Свёрток – это его гимнастёрка, а в неё что-то завёрнуто.',
			'Смотрите! – победно восклицает Борис. Разворачивает гимнастёрку, и в ней … живая дикая утка.',
			'Вижу: сидит, притаилась за кустиком. Я рубаху снял и – хоп! Есть еда! Зажарим.',
			'Утка была некрепкая, молодая. Поворачивая голову по сторонам, она смотрела на нас изумлёнными бусинками глаз. Она просто не могла понять, что это за странные милые существа её окружают и смотрят на неё с таким восхищением. Она не вырывалась, не крякала, не вытягивала натужно шею, чтобы выскользнуть из державших её рук. Нет, она грациозно и с любопытством озиралась. Красавица уточка! А мы – грубые, нечисто выбритые, голодные. Все залюбовались красавицей. И произошло чудо, как в доброй сказке. Как-то просто произнёс: Отпустим!'
			],
			['Звонок раздался, когда Андрей Петрович потерял уже всякую надежду.',
			'Здравствуйте, я по объявлению. Вы даёте уроки литературы?',
			"Андрей Петрович вгляделся в экран видеофона. Мужчина под тридцать. Строго одет - костюм, галстук. Улыбается, но глаза серьёзные. У Андрея Петровича ёкнуло сердце, объявление он вывешивал в сеть лишь по привычке. За десять лет было шесть звонков. Трое ошиблись номером, ещё двое оказались работающими по старинке страховыми агентами, а один попутал литературу с лигатурой.",
			'Д-даю уроки, - запинаясь от волнения, сказал Андрей Петрович. - Н-на дому. Вас интересует литература?',
			'Интересует, - кивнул собеседник. - Меня зовут Максим. Позвольте узнать, каковы условия.',
			'"Задаром!" - едва не вырвалось у Андрея Петровича.',
			'Оплата почасовая, - заставил себя выговорить он. - По договорённости. Когда бы вы хотели начать?',
			'Я, собственно… - собеседник замялся.']
		]
	}
	returnLendthText(text){
		let length = 0;
		for(let i = 0; i < text.length; i++){
			length += text[i].length;
			length++;
		}
		length--;
		return length;
	}
	replaceE(text){
		for(let i = 0; i < text.length; i++){
			let index = text[i].indexOf('ё');
			if(index == -1) continue;
			text[i] = text[i].split('');
			text[i].splice(index, 1, 'е');
			text[i] = text[i].join('');
		}
		return text;
	}
	returnText(){
		let index = Math.floor(this.chapters.length * Math.random());
		let text = this.chapters[index];
		let arr = [];
		for(let i = 0; i < text.length; i++){
			arr = arr.concat(text[i].split(' '));
		}
		return arr;
	}
}

class Statistic{
	constructor(){
		this.wordInMin = 0;
		this.words = 0;
		this.inputTrueSymbols = 0;
		this.allSymbols = 0;
	}
	setTrueSymbols(word1, word2){
		let sym = 0;
		word2 = word2.split('');
		word1.split('').forEach((l, index) => {
			if(l == word2[index]){
				sym++;
			}
		});
		this.inputTrueSymbols += sym;
	}
	setWordInMin(seconds){
		this.wordInMin = this.words / (seconds / 60);
	}
	show(){
		let stat1 = document.getElementById('1');
		let stat2 = document.getElementById('2');
		let stat3 = document.getElementById('3');

		stat1.innerText = Math.floor(this.wordInMin * 100) / 100;
		stat2.innerText = this.inputTrueSymbols;
		stat3.innerText = this.allSymbols;
	}
}

let book = new Book();
let text = book.returnText();
text = book.replaceE(text);

let stat = new Statistic();
stat.allSymbols = book.returnLendthText(text);

let begin = false;
// let end = false;

let htmlText = [];
let textArea = [];
let sizeInputText = 0;
let bool = false;

let time = new Time();
// time.start();

function clear(){
	if(htmlText.length == textArea.length ){
		htmlText = showText().split(' ');
		textArea = [];
		sizeInputText = 0;
		begin = false;
		document.querySelector('textarea').value = '';
		return true;
	}
	return false;
}

function wordCheck(lastWord){
	return htmlText.shift() === lastWord;
}

function getTextAreaLastWord(){
	let area = document.querySelector('textarea');
	let text = area.value;
	textArea = text.split(" ");
	sizeInputText = area.value.length;
}

function setSpan(){
	let show = '';
	for(let i = 0; i < htmlText.length; i++){
		word = htmlText[i];
		if(i < textArea.length){
			if(word === textArea[i]){
				show += `<span id="true">${word}</span> `;
			}else{
				show += `<span id="false">${word}</span> `;
			}
		}else{
			show += `${word} `;
		}
	}
	document.getElementById('textA').innerHTML = show;
}
time.setTimer();
document.querySelector('textarea').onkeydown = (envent) => {
	// time.show();
	let area = document.querySelector('textarea');

	if(!begin){
		time.start();
	}
	begin = true;
	if(event.code == 'Space'){
		getTextAreaLastWord();
		setSpan();

		let word1 = textArea.pop();
		textArea.push(word1);
	
		let word2 = htmlText.pop();
		htmlText.push(word2);
		
		stat.words++;
		stat.setTrueSymbols(word1, word2);
		stat.setWordInMin(time.seconds);

		stat.show();

		if(clear()) return false;
	}
	if(event.code == 'Backspace' && sizeInputText + 1 == area.value.length) return false;
	end();
}

function showText(){
	let buff = text.splice(0, 10).join(' ');
	document.getElementById('textA').innerText = buff;
	return buff;
}

function main(){
	let show = showText();
	htmlText = show.split(' ');
}

function end(){
	if(!text.length){
		clear();
		time.clearTimer();
	}
}

main();
