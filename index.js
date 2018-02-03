(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports = require('./lib/anypixel');

},{"./lib/anypixel":2}],2:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

module.exports.config = require('./config');
module.exports.canvas = require('./canvas');
module.exports.events = require('./events');
module.exports.events.setStateListenerOn(document);

},{"./canvas":3,"./config":4,"./events":5}],3:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

var config = require('./config');
var canvas = module.exports = {};

var domCanvas = document.getElementById(config.canvasId);

domCanvas.width = config.width;
domCanvas.height = config.height;

/**
 * Returns the 2D canvas context
 */
canvas.getContext2D = function getContext2D() {
	return domCanvas.getContext('2d');
}

/**
 * Returns the 3D canvas context
 */
canvas.getContext3D = function getContext3D() {
	return domCanvas.getContext('webgl', {preserveDrawingBuffer: true});
}
},{"./config":4}],4:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Expose some configuration data. The user can overwrite this if their setup is different.
 */
var config = module.exports = {};

config.canvasId = 'button-canvas';
config.width = 140;
config.height = 42;
},{}],5:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';

/**
 * Listen for the 'buttonStates' event from a DOM target and emit onButtonDown / Up events
 * depending on the reported button state
 */
var events = module.exports = {};

events.setStateListenerOn = function setStateListenerOn(target) {
		
	if (target.anypixelListener) {
		return;
	}
	
	target.anypixelListener = true;

	target.addEventListener('buttonStates', function(data) {
		data.detail.forEach(function(button) {
			var x = button.p.x;
			var y = button.p.y;
			var state = button.s;
			var event = state === 1 ? 'onButtonDown' : 'onButtonUp';
			var key = x + ':' + y;

			if (state === 1) {
				events.pushedButtons[key] = {x: x, y: y};
			} else {
				delete events.pushedButtons[key];
			}
			
			target.dispatchEvent(new CustomEvent(event, {detail: {x: x, y: y}}));
		});
	});
}

/**
 * A map of currently-pushed buttons, provided for utility
 */
events.pushedButtons = {};

},{}],6:[function(require,module,exports){
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

},{"anypixel":1}]},{},[6]);
