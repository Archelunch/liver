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
	element.innerHTML = '<div class="col-6"><div class="dummy"></div><div class="c c-test m-3"><button class="delete-btn"></button><textarea>Текст</textarea></div></div>' + element.innerHTML;
}