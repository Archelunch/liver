'use strict';

let questionNumber = 1;

function changeToTextArea(elementId, is_answer=false) {
	let element = document.getElementById(elementId);
	element.onclick = "";
	element.style.backgroundImage = "none";
	if (!is_answer) {
		element.innerHTML = "<textarea>Текст вопроса</textarea>";
	} else {
		element.style.borderRadius = "5vh";
		element.innerHTML = "<textarea>Текст ответа</textarea><button class='markAsCorrect' onclick='markAsCorrect(this.parentNode.id);'></button>";
	}
}

function markAsCorrect(elementId) {
	let element = document.getElementById(elementId);
	element.correct = "true";
}

function markAsIncorrect(elementId) {
	let element = document.getElementById(elementId);
	element.correct = "false";
}

function sendAnswer() {
	let question = document.getElementById("question");
	let answer1 = document.getElementById("answer1");
	let answer2 = document.getElementById("answer2");
	let answer3 = document.getElementById("answer3");
	if (question.firstChild.tagName == "p") {
		return false;
	} else if (answer1.firstChild.tagName == "p") {
		return false;
	} else if (answer2.firstChild.tagName == "p") {
		return false;
	} else if (answer3.firstChild.tagName == "p") {
		return false;
	}
	let data = {
		id: document.getElementById("testId").innerHTML,
		question: question.firstChild.innerHTML,
		answers: {
			[answer1.firstChild.innerHTML]: answer1.correct === "true" ? true : false,
			[answer2.firstChild.innerHTML]: answer2.correct === "true" ? true : false,
			[answer3.firstChild.innerHTML]: answer3.correct === "true" ? true : false
		}
	};
	$.ajax("/", {
		type: "post",
		data: data,
		success: (data) => {
			changeToPrompt("question");
			changeToPrompt("answer1");
			changeToPrompt("answer2");
			changeToPrompt("answer3");
			markAsIncorrect("answer1");
			markAsIncorrect("answer2");
			markAsIncorrect("answer3");
			questionNumber += 1;
			document.getElementsByClassName("editor-header")[0].innerHTML = `${questionNumber}/...`;
		}
	});
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
	let html = `<div style="height: 100vh; width: 100vw;" id="nameOverlay">
		<div class="center">
			<div class="input-holder"><input type="text" id="nameInput" name="nameInput" placeholder="Название" required/><button type="button" id="testButton"></button></div>
		</div>
	</div>`;
	document.body.innerHTML += html;
	document.getElementById("testButton").addEventListener('click', addTestModule);
}

function addTestModule() {
	$.ajax("/createQuiz", {
		type: "post",
		data: {
			title: document.getElementById("testButton").value;
		},
		success: (data) => {
			document.getElementById("nameOverlay").outerHTML = "";
			window.location.href = `/adminka/${data.id}`;
		}
	})
}

function goToAdminka() {
	window.location.href = "/adminka";
}