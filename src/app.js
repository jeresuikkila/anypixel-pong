const anypixel = require('anypixel');
const ctx = anypixel.canvas.getContext2D();

const HEIGHT = 42;
const WIDTH  = 140;
const RED  = '#F00';
const BLUE = '#00F'

const paddleHeight = HEIGHT / 4;

const left  = new Rect(5, HEIGHT / 2, 1, paddleHeight, RED);
const right = new Rect(WIDTH - 6, HEIGHT / 2, 1, paddleHeight, BLUE);
left.points  = 0;
right.points = 0;

const leftScore  = new Rect(0, 0, 0, 1, RED);
const rightScore = new Rect(WIDTH - 1, 0, 0, 1, BLUE);


const ball  = new Rect(WIDTH / 2, HEIGHT / 2, 1, 1, '#0F0');
ball.xSpeed = 1;
ball.ySpeed = 1;

// TODO: Reset game after done

document.addEventListener('onButtonDown', function(event) {
	// Choose paddle to move based on board side
	if (event.detail.x < WIDTH / 2) {
		left.y  = event.detail.y;
	} else {
		right.y = event.detail.y;
	}
});

document.addEventListener('DOMContentLoaded', function() {
	window.requestAnimationFrame(update);
});


function update() {
	// Bounce ball from walls and award points if it hits side walls
	if (ball.x + ball.xSpeed > WIDTH) {
		ball.xSpeed *= -1;
		left.points++;

		leftScore.width = left.points;
		console.log("Left:", left.points);
	} else if (ball.x + ball.xSpeed < 0) {
		ball.xSpeed *= -1;
		right.points++;

		rightScore.width = right.points;
		rightScore.x = WIDTH - right.points;
		console.log("Right:", right.points);
	}

	// Bounce from top and bottom
	if (ball.y + ball.ySpeed > HEIGHT || ball.y + ball.ySpeed < 0) {
		ball.ySpeed *= -1;
	}

	// Bounce from paddle
	// Only when going towards the goal
	if (ball.y + ball.ySpeed >= left.y
		&& ball.y + ball.ySpeed <= left.y + left.height
		&& ball.x + ball.xSpeed <= left.x
		&& ball.xSpeed < 0) {
			ball.xSpeed *= -1;
			ball.ySpeed *= -1;
	} else if (ball.y + ball.ySpeed >= right.y
		&& ball.y + ball.ySpeed <= right.y + right.height
		&& ball.x + ball.xSpeed >= right.x
		&& ball.xSpeed > 0) {
			ball.xSpeed *= -1;
			ball.ySpeed *= -1;
	}

	// Update ball location
	ball.x += ball.xSpeed;
	ball.y += ball.ySpeed;

	clear();

	// TODO: Create a game object array
	leftScore.draw();
	rightScore.draw();
	right.draw();
	left.draw();
	ball.draw();

	if (right.points > 4 || left.points > 4) {
		reset();
	}

	window.requestAnimationFrame(update);
}

function clear() {
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function reset() {
	ball.x = WIDTH  / 2;
	ball.y = HEIGHT / 2;
	ball.xSpeed  = 1;
	ball.ySpeed  = 1;
	left.points  = 0;
	right.points = 0;
	leftScore.width  = 0;
	rightScore.width = 0;
}

function Rect(inX, inY, inWidth, inHeight, inColor) {
  this.x = inX;
  this.y = inY;
  this.width  = inWidth;
  this.height = inHeight;
  this.color  = inColor;
}

Rect.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
}
