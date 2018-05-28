var canvas;
var canvasContext;

var xPos = 500;
var yPos = 300;
var xSpeed = 0;
var ySpeed = 0;

var edge = 20;

var appleX = 100;
var appleY = 100;

var positions = [];
positions[0] = [xPos, yPos];

var newX = -1;
var newY = -1;

var direction = "pause";

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	window.addEventListener('keydown', keyInput, false);

	// run 30 frames per second
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
}

function keyInput(event) {
	// alert(event.keyCode);
	var code = event.keyCode;

	if (code == 37) {
		if (direction != "right") {
			xSpeed = -20;
			ySpeed = 0;
			direction = "left";
		}
	} else if (code == 39) {
		if (direction != "left") {
			xSpeed = 20;
			ySpeed = 0;
			direction = "left";
		}
	} else if (code == 38) {
		if (direction != "down") {
			ySpeed = -20;
			xSpeed = 0;
			direction = "up";
		}
	} else if (code == 40) {
		if (direction != "up") {
			ySpeed = 20;
			xSpeed = 0;
			direction = "down";
		}
	} else if (code == 32) {
		xSpeed = 0;
		ySpeed = 0;
		direction = "pause";
		console.log(appleX + " " + appleY + " " + xPos + " " + yPos);
	}
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	if (!isLegal()) {
		reset();
	}

	if (xPos == appleX && yPos == appleY) {
		newX = appleX;
		newY = appleY;
		updateApple();
	}

	for (i = positions.length - 1; i >= 1; i--) {
		positions[i][0] = positions[i - 1][0];
		positions[i][1] = positions[i - 1][1];
	}

	positions[i][0] += xSpeed;
	positions[i][1] += ySpeed;

	if (newX != -1) {
		positions.push([newX, newY]);
		newX = -1;
		newY = -1;
	}

	xPos = positions[0][0];
	yPos = positions[0][1];
}

function reset() {
	// xPos = 500;
	// yPos = 300;
	positions = new Array();
	positions[0] = [500, 300];

	xSpeed = 0;
	ySpeed = 0;

	appleX = 100;
	appleY = 100;

	direction = "pause";
}

function updateApple() {
	var lowerBoundX = 1;
	var upperBoundX = (canvas.width - edge) / edge;

	var lowerBoundY = 1;
	var upperBoundY = (canvas.height - edge - 4) / edge;

	appleX = Math.floor(Math.random() * (upperBoundX - lowerBoundX) + lowerBoundX) * edge;
	appleY = Math.floor(Math.random() * (upperBoundY - lowerBoundY) + lowerBoundY) * edge;
}

function drawAll() {
	// white background for the canvas
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	// snake in the canvas
	// colorRect(xPos, yPos, edge, edge, 'white');
	// colorRect(xPos + edge, yPos, edge, edge, 'white');\
	for (i = 0; i < positions.length; i++) {
		colorSquare(positions[i][0], positions[i][1], edge, 'black', 'white');
	}

	// colorSquare(xPos, yPos, edge, 'black', 'white');
	// colorSquare(xPos + edge, yPos, edge, 'black', 'white');

	// borders
	colorRect(0, 0, canvas.width, edge, 'white');
	colorRect(0, 0, edge, canvas.height, 'white');
	colorRect(0, canvas.height - edge - 4, canvas.width, edge + 4, 'white');
	colorRect(canvas.width - edge, 0, edge, canvas.height, 'white');

	// apple
	colorSquare(appleX, appleY, edge, 'grey', 'grey');

	colorText(positions.length + "", canvas.width / 2, canvas.height - 10, 'black');
}

function isLegal() {
	if (xPos < edge) {
		return false;
	}

	if (xPos + edge > canvas.width - edge) {
		return false;
	}

	if (yPos < edge) {
		return false;
	}

	if (yPos + edge > canvas.height - edge - 4) {
		return false;
	}

	for (i = 1; i < positions.length; i++) {
		if (positions[0][0] == positions[i][0] && positions[0][1] == positions[i][1]) {
			return false;
		}
	}

	return true;
}

function colorSquare(topLeftX, topLeftY, edge, color1, color2) {
	canvasContext.fillStyle = color1;
	canvasContext.fillRect(topLeftX, topLeftY, edge, edge, color1);
	canvasContext.fillStyle = color2;
	canvasContext.fillRect(topLeftX + 1, topLeftY + 1, edge - 2, edge - 2, color2);
}

// helper function to draw a rectangle
function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

// helper function to draw text
function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}
