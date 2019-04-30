'use strict';

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
	let html = `<div style="height: 100vh; width: 100vw;">
		<div class="center">
			<div class="input-holder"><input type="text" id="nameInput" name="nameInput" placeholder="Название" required/><button type="button" id="testButton"></button></div>
		</div>
	</div>`;
	document.body.innerHTML += html;
	document.getElementById("testButton").addEventListener('click', addTestModule);
}

function addTestModule() {
	$.ajax("/createQuiz", {
		type: "GET",
		data: {
			title: document.getElementById("testButton").value;
		},
		success: (data) => {
			window.location.href = `/adminka/${data.id}`;
		}
	})
}