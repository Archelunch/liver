'use strict';

//let address = "192.168.1.5"
let address = "handsapp.fun"

function changeToTextArea(elementId, is_answer=false) {
	let element = document.getElementById(elementId);
	element.onclick = "";
	element.style.backgroundImage = "none";
	if (!is_answer) {
		element.innerHTML = "<textarea>Текст вопроса</textarea>";
	} else {
		element.style.borderRadius = "5vh";
		element.innerHTML = "<textarea>Текст ответа</textarea><button class='removeAnswer' onclick='changeToPrompt(this.parentNode.id);'></button>";
	}
}

function changeToPrompt(elementId) {
	let element = document.getElementById(elementId);
	element.style.backgroundImage = "url('./plus.png')";
	element.style.borderRadius = "1vw";
	element.innerHTML = "<p>Вариант ответа</p>";
	element.onclick = () => {
		changeToTextArea(this.id, true);
	};
}

function addTest() {
	let element = document.getElementsByClassName("row")[0];
	element.innerHTML = '<div class="col-6"><div class="dummy"></div><div class="c c-test m-3"><button class="delete-btn"></button><textarea>Текст</textarea></div></div>' + element.innerHTML;
}

let main = document.getElementById('main');
let gamezone = document.getElementById('gamezone');
let name, code, xhr, question_id;
var people_count=1;
let roomName, chatSocket;
let currentTime = 15;
let timerInterval = null;
let spent = 0;
let hiddenInterval = null;

function timer() {
	document.getElementById("timer").innerHTML = currentTime;
	currentTime -= 1;
	if (currentTime === -1) {
		clear(true);
	}
}

function hiddenTimer() {
	spent += 1;
}

function clear(keep_number) {
	if (!keep_number) {
		document.getElementById("timer").innerHTML = "";
	}
	clearInterval(timerInterval);
}
		
function sendAnswer(ind, question_id) {
	clear(true);
	chatSocket.send(JSON.stringify({message: "answer", name: name, answer: ind, question_id: question_id, time: spent}));
	let elems = document.getElementsByClassName("btn1");
	[...elems].forEach((elem) => {
		elem.disabled = true;
	});
}
		
function processResults() {
	if (xhr.readyState != 4) return;
	gamezone = document.getElementById('gamezone');
	gamezone.innerHTML = xhr.responseText;
}
		
function loadResults(d) {
	console.log(name);
	console.log(roomName);
	$.ajax({
		'url': 'https://' + address + '/leaderboard',
		'type': 'GET',
		'data': {
			'name':name,
			'url': roomName
		},
		'success': (data) => {
			if (data.length >= 100) {
				gamezone = document.getElementById('gamezone');
				gamezone.innerHTML = data;
			}
		}
	});
}
		
function processMessage(d) {
	gamezone = document.getElementById('gamezone');
	let data = JSON.parse(d.data);
	let newHTML;
	if (data.message === 'question') {
		currentTime = 15;
		timerInterval = setInterval(timer, 1000);
		spent = 0;
	} else {
		clear();
	}
	if (data.message === 'question' && data.status === 'player') {
		document.getElementById("footemail").style.visibility = "hidden";
		newHTML = `
			<p class="simple-text">${data.questionNumber} / ${data.questionCount}</p>
			<h2 class="header">${data.questionText}</h2>
			<div class="stab"><div class="bottom" id="main">`;
		data.answers.forEach((answer, index) => {
			newHTML += `<button class="btn btn1" onclick="this.classList.add('chosen');sendAnswer(${data.ids[index]}, ${data.question_id})"><span class="answer">${answer}</span></button>`;
		});
		newHTML += "</div></div>";
		gamezone.innerHTML = newHTML;
	} else if (data.message === 'question_results' && data.status === 'player') {
		let stabilizer = document.getElementsByClassName('stab')[0];
		newHTML = `<div class="bottom" id="main">`;
		data.results.forEach((answer) => {
			newHTML += `<div class="btn result-bar-outer">
				<div class="result-bar-inner-${answer.right ? 1 : 2}" style="width: ${answer.percent}%"></div>
				<span class="answer">${answer.text}</span>
				<span class="percent">${answer.percent}%</span></div>`;
		});
		newHTML += "</div>";
		stabilizer.innerHTML = newHTML;
	} else if (data.message === 'results') {
		newHTML = `<h2 class="header">Вы ответили правильно на ${data.correctAnswersCount} вопросов из ${data.questionCount}!</h2>
		<div class="center">
		<button class="btn btn2" id="resultsButton">Все результаты</button>
		</div>`;
		gamezone.innerHTML = newHTML;
		document.getElementById('resultsButton').addEventListener('click', loadResults);
	} else if (data.message === 'player_count') {
		people_count = data.count;
		var counter = document.getElementById("user-text");
		if (counter) {
			counter.innerHTML = `С вами уже играет ${people_count} человек`;
		}
	}
}
		
function openWaitingScreen() {
	name = document.getElementById('nameInput').value;
	console.log(name)
	$.ajax({
		url: 'https://' + address + '/validate_username',
		data: {
			'username': name,
			'url': roomName
		},
		dataType: 'json',
		success: function (data) {
			if (true) {
			console.log("OK");
			people_count = data['count']
			name = data['user_id']
			}
		}
	});

	gamezone =document.getElementById('gamezone');
	gamezone.innerHTML = `<h2 class="header">Подождите, пожалуйста, игра скоро начнется...</h2><p class="simple-text" id="user-text">С вами уже играет ${people_count} человек</p>`;
	chatSocket.send(JSON.stringify({message: "new_user", name: name}));
};
		
function openCodeForm() {
	let main = document.getElementById("main");
	main.innerHTML = '<div class="input-holder"><input type="text" id="codeInput" placeholder="Введите код" /><button type="button" id="codeFormButton"></button></div>';
	document.getElementById('codeFormButton').addEventListener('click', openNameForm);
};

function socketClose(e) {
	console.error('Game socket closed unexpectedly');
	chatSocket = new WebSocket('wss://' + address + '/ws/quiz/' + roomName + '/');
	chatSocket.onmessage = processMessage;
	chatSocket.onclose = socketClose;
}
		
function openNameForm() {
	code = document.getElementById('codeInput').value;
	$.ajax({
		url: 'https://'+ address + '/validate_code',
		data: {
			'code': code
		},
		dataType: 'json',
		success: function (data) {
			if (data['resp']==200 && code != '') {
				main = document.getElementById('main');
				roomName = data['url'];
				currentTime = data['timer'];
				chatSocket = new WebSocket('wss://' + address + '/ws/quiz/' + roomName + '/');
				chatSocket.onclose = socketClose;
				chatSocket.onmessage = processMessage;
				main.innerHTML = '<div class="input-holder"><input type="text" id="nameInput" placeholder="Представьтесь" /><button type="button" id="nameFormButton"></button></div>';
				document.getElementById('nameFormButton').addEventListener('click', openWaitingScreen);
			} else {
				alert("Incorrect code!")
				openCodeForm();
			}
		}
	});
};


window.onload = () => {
	main = document.getElementById('main');
	gamezone = document.getElementById('gamezone');
}