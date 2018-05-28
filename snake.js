// define the canvas
var canvas;
var canvasContext;

// parameters of the snake
var xPos = 500;
var yPos = 300;
var xSpeed = 0;
var ySpeed = 0;
var edge = 20;

// parameters of the apple
var appleX = 100;
var appleY = 100;

// holds each new position of the snake after eating the apple
var positions = [];
positions[0] = [xPos, yPos];

// helps add a new value to the end of the snake after eating an apple
var newX = -1;
var newY = -1;

// the direction of the snake to ensure that illegal turns are avoided
var direction = "pause";

window.onload = function() { // when the page loads
	// define the canvas to the webpage
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// key events are handled
	window.addEventListener('keydown', keyInput, false);

	// run 30 frames per second
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
}

function keyInput(event) { // key events to control the direction of the snake
	// alert(event.keyCode);

	// code holds the number to map to a direction, using arrow-keys
	var code = event.keyCode;

	if (code == 37) { // left
		if (direction != "right") {
			xSpeed = -20;
			ySpeed = 0;
			direction = "left";
		}
	} else if (code == 39) { // right
		if (direction != "left") {
			xSpeed = 20;
			ySpeed = 0;
			direction = "left";
		}
	} else if (code == 38) { // up
		if (direction != "down") {
			ySpeed = -20;
			xSpeed = 0;
			direction = "up";
		}
	} else if (code == 40) { // down
		if (direction != "up") {
			ySpeed = 20;
			xSpeed = 0;
			direction = "down";
		}
	} else if (code == 32) { // space to pause (debugging)
		// xSpeed = 0;
		// ySpeed = 0;
		// direction = "pause";
		// console.log(appleX + " " + appleY + " " + xPos + " " + yPos);
	}
}

function updateAll() { // call this with every frame
	// move and draw everything over the current canvas
	moveAll();
	drawAll();
}

function moveAll() { // update the speed of the snake
	if (!isLegal()) { // if the current location of the snake is illegal, then reset the snake
		reset();
	}

	if (xPos == appleX && yPos == appleY) { // if the snake's head has gone over an apple
		// set the new values to this location to create a new head later
		newX = appleX;
		newY = appleY;
		// create a new apple somewhere
		updateApple();
	}

	for (i = positions.length - 1; i >= 1; i--) { // for every position in the snake, update to the next position
		positions[i][0] = positions[i - 1][0];
		positions[i][1] = positions[i - 1][1];
	}

	// the head of the snake keeps going in the direction of the speed
	positions[i][0] += xSpeed;
	positions[i][1] += ySpeed;

	if (newX != -1) { // if the apple was consumed
		// push in the new position
		positions.push([newX, newY]);
		newX = -1;
		newY = -1;
	}

	// xPos and yPos will be easier to call later
	xPos = positions[0][0];
	yPos = positions[0][1];
}

function reset() { // reset the location of the snake
	// set the length of the snake back to 1
	positions = new Array();
	positions[0] = [500, 300];

	// reset the speed in both directions
	xSpeed = 0;
	ySpeed = 0;

	// have a defined location for the apple
	appleX = 100;
	appleY = 100;

	// it will not be moving
	direction = "pause";
}

function updateApple() { // create a new location for an apple
	// the apple has to be within the boundaries on the sides of the canvas
	var lowerBoundX = 1;
	var upperBoundX = (canvas.width - edge) / edge;

	var lowerBoundY = 1;
	var upperBoundY = (canvas.height - edge - 4) / edge;

	// randomly set a location within those given bounds
	appleX = Math.floor(Math.random() * (upperBoundX - lowerBoundX) + lowerBoundX) * edge;
	appleY = Math.floor(Math.random() * (upperBoundY - lowerBoundY) + lowerBoundY) * edge;

	// make sure that the new apple is not sharing a location with the snake
	for (i = 0; i < positions.length; i++) {
		if (appleX == positions[i][0] && appleY == positions[i][1]) {
			// recursively call updateApple()
			updateApple();
		}
	}
}

function drawAll() { // update the location of everything in the canvas
	// white background for the canvas
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	// snake in the canvas
	for (i = 0; i < positions.length; i++) {
		colorSquare(positions[i][0], positions[i][1], edge, 'black', 'white');
	}

	// borders
	colorRect(0, 0, canvas.width, edge, 'white');
	colorRect(0, 0, edge, canvas.height, 'white');
	colorRect(0, canvas.height - edge - 4, canvas.width, edge + 4, 'white');
	colorRect(canvas.width - edge, 0, edge, canvas.height, 'white');

	// apple
	colorSquare(appleX, appleY, edge, 'grey', 'grey');

	// score
	colorText(positions.length + "", canvas.width / 2, canvas.height - 10, 'black');
}

function isLegal() { // check if the given location of the snake is legal
	// check if the snake head is within the borders
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
		// if the positions besides the head share a location with the head, then this is not legal (self-collision)
		if (positions[0][0] == positions[i][0] && positions[0][1] == positions[i][1]) {
			return false;
		}
	}

	// if nothing fails to be legal, then this is a legal position
	return true;
}

// helper function to draw a square
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
