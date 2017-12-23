var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

var surface = canvas.getContext("2d");
var uInt;        // Variable for setInterval.
var background;  // The backgound image.
var pad1 = {img:null,x:null,y:null,onPad:null}; // The two 
var pad2 = {img:null,x:null,y:null,onPad:null}; // pad classes.
var pads; // This array holds the pads that the player can jump onto.
var bullets; // This array will hold all the bullets displayed on the canvas.
var bulletSpeedMultiplier; // A vairable used to determine the value of bullet speed.

// PLAYER RELATED VARIABLES GO HERE ********************************************************************************************
var player = {img:null,x:null,y:null}; // The player class. img is the image of the player. x and y are the player coordinates.
var playerSpeed; // Player's speed in pixels.
const JUMP_SPEED = 8; // Used to set the jump speed back to it's original value.
var jumpSpeed;   // Player's current jump speed in pixels.
var jumpHeight;  // Player's jump height in pixels.
var jumpCounter; // Trackshow many pixels the player jumped so far.
var goingUp;     // Flag for the jumping animation. True means jumping up, false means falling down.
var flag1 = true;  //  These flags are used to make sure
var flag2 = false; //  the jump speed is modified once,
var flag3 = false; //  and not more.
var currentDirection;// Used to keep track of player's direction. (true=right false=left)
var applyPlayerGravity; // True: Start applying gravitational force to player.   False: Stop applying gravitational force to player.
var fallSpeed; // Player fall speed in pixels.
// END OF PLAYER RELATED VARIABLES **********************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.

var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!
var shootSound = document.createElement("AUDIO"); // Shooting sound effect.

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keypress", onKeyPress);
canvas.addEventListener("click", fire);

createMap();

function update()
{
	movePlayer();
	moveBullet();
	collisionPlayerPad();
	collisionBulletPad();
	collisionBulletGround()
	playerGravity();
	render();
}

function createMap() // Initialize all the variables here.
{
	background = new Image();
	background.src = "../img/background.jpg";
	player.img = new Image();
	player.img.src = "../img/playerRight.png";
	jumpSound.setAttribute("src","../aud/jump.wav");
	shootSound.setAttribute("src","../aud/shoot.wav");
	player.x = 300;
	player.y = 295;
	playerSpeed = 4;
	jumpSpeed = JUMP_SPEED;
	jumpHeight = 120;
	jumpCounter = 0;
	goingUp = true;
	currentDirection = true;
	applyPlayerGravity = false;
	fallSpeed = 5;
	bullets = [];
	bulletSpeedMultiplier = 20;
	pads = [];
	pad1.img = new Image();
	pad1.img.src = "../img/pad.png";
	pad1.x = 100;
	pad1.y = 250;
	pad1.onPad = false;
	pads.push(pad1);
	pad2.img = new Image();
	pad2.img.src = "../img/pad.png";
	pad2.x = 450;
	pad2.y = 250;
	pad2.onPad = false;
	pads.push(pad2);
	uInt = setInterval(update, 15.34);
}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
	surface.drawImage(background,0,0); // Draw the background.
	for (var i = 0; i < pads.length; i++)
	{ // For each pad in the pads array, draw it on the canvas.
		surface.drawImage(pads[i].img,pads[i].x,pads[i].y);
	}
	surface.drawImage(player.img,player.x,player.y); // Draw the player.
	for (var i = 0; i < bullets.length; i++)
	{ // For each bullet in bullets array:
		surface.drawImage(bullets[i].img,bullets[i].x,bullets[i].y); // Draw the bullet on the canvas.
	}
}

function moveBullet()
{
	var currentBullet;
	for (var i = 0; i < bullets.length; i++)
	{ // For each bullet in bullets array:
		currentBullet = bullets[i];
		if (currentBullet.x > canvas.width || currentBullet.x < 0 || currentBullet.y > canvas.height || currentBullet.y < 0)
		{ // Then the current bulletis out of the canvas. Time to delete it from the bullets array.
			bullets.splice(i,i+1); // Removes the current bullet from the bullet array.
		}
		
		currentBullet.x += currentBullet.xSpeed;
		currentBullet.y += currentBullet.ySpeed;
	}
}

function movePlayer()
{
	if (leftPressed && player.x > 0)
	{
		if (upPressed)
			player.img.src = "../img/playerLeftJump.png";
		else
			player.img.src = "../img/playerLeft.png";
		player.x = player.x - playerSpeed;
		currentDirection = false;
	}
	if (rightPressed && player.x < (canvas.width - player.img.width))
	{
		if (upPressed)
			player.img.src = "../img/playerRightJump.png";
		else
			player.img.src = "../img/playerRight.png";
		player.x = player.x + playerSpeed;
		currentDirection = true;
	}
	if (upPressed)
	{
		window.removeEventListener("keypress", onKeyPress); // Remove the event listener so the player can't jump mid air.
		for (var i = 0; i < pads.length; i++)
		{
			pads[i].onPad = false; // Player is NOT on any of the pads while jumping.
		}
		if(currentDirection)
		{
			player.img.src = "../img/playerRightJump.png";
		}
		else
		{
			player.img.src = "../img/playerLeftJump.png";
		}
		if (goingUp)
		{
			player.y = player.y - jumpSpeed;
			jumpCounter += jumpSpeed;
			if (jumpCounter >= jumpHeight/100*50 && flag1) // When the player reaches half of his/her jump, reduce the jump speed.
			{
				jumpSound.play(); // Plays the jump sound effect.
				jumpSpeed = JUMP_SPEED - 1;
				flag1 = false;
				flag2 = true;
			}
			else if (jumpCounter >= jumpHeight/100*75 && flag2) // When %75 of jump height reached, decrease the jump speed even more.
			{
				jumpSpeed = JUMP_SPEED - 2;
				flag2 = false;
				flag3 = true;
			}
			else if (jumpCounter >= jumpHeight/100*95 && flag3) // When &95 of jump height reached, set jumpSpeed to 1. This creates a "floating effect". 
			{
				jumpSpeed = 1;
				flag3 = false;
			}
			if (jumpCounter >= jumpHeight) 
			{ // Reached the peak of jump.
				goingUp = false; // Set the flag so that the falling animation can begin.
				flag1 = true;
			}
		}
		else
		{ // Reached the peak of jump, now it's time to fall.
			applyPlayerGravity = true;
			window.addEventListener("keypress", onKeyPress);
		}
	}
}

function collisionPlayerPad()
{
	for ( var i = 0; i < pads.length; i++)
	{ // For each pad in the pads array:
		if (!goingUp) // We only want to check collision between the pad and the player when the player is falling down.
		{
			if (player.y + player.img.height <= pads[i].y + jumpSpeed && player.y + player.img.height >= pads[i].y - jumpSpeed)
			{ // Then there is a collision between the y coordinates of the player and the pad.
				if (player.x + player.img.width >= pads[i].x && player.x <= pads[i].x + pads[i].img.width)
				{ // Then the x coordinates collide as well. We have a collision!
					pads[i].onPad = true;
					player.y = pads[i].y - player.img.height; // Make sure the player is exactly on the pad.
					resetJump(); // Reset the jump variables so the next jump is not screwed up.
					if(currentDirection)
					{
						player.img.src = "../img/playerRight.png";
					}
					else
					{
						player.img.src = "../img/playerLeft.png";
					}
				}
			}
		}
		if (pads[i].onPad) // This part captures the moment when the player leaves the pad, so the fall animation can start.
		{
			if (player.x > pads[i].x + pads[i].img.width || player.x + player.img.width < pads[i].x)
			{ // Then the player left the pad, time to apply gravity.
				applyPlayerGravity = true;
				pads[i].onPad = false;
			}
		}
	}
}

function collisionBulletPad()
{
	for (var i = 0; i < bullets.length; i++)
	{ // For each bullet in the bullets array:
		for (var j = 0; j < pads.length; j++)
		{ // For each pad in the pads array:
			var leftCollide = false, rightCollide = false, upCollide = false, downCollide = false;
			if (bullets[i].x + bullets[i].img.width + bullets[i].xSpeed >= pads[j].x)
			{ // IMPORTANT: Adding the speed of the bullet to these four if statements is crucial! It prevents the bullet from going inside the pad.
				leftCollide = true;
			}
			if (bullets[i].x  + bullets[i].xSpeed <= pads[j].x + pads[j].img.width)
			{
				rightCollide = true;
			}
			if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed>= pads[j].y)
			{
				upCollide = true;
			}
			if (bullets[i].y + bullets[i].ySpeed<= pads[j].y + pads[j].img.height)
			{
				downCollide = true;
			}
			if (leftCollide && rightCollide && upCollide && downCollide)
			{// Collision occured!
				var bulletCenterY = bullets[i].y + bullets[i].img.height/2;
				if ( bulletCenterY > pads[j].y && bulletCenterY < pads[j].y + pads[j].img.height)
				{ // Then a horizontal collision occured.
					if (bullets[i].x < pads[j].x)
					{ // Then the bullet collided with the left side.
						bullets[i].x = pads[j].x - bullets[i].img.width; // This ensures the bullet ricochet animation is smooth.
					}
					else
					{ // Then the bullet collided with the right side.
						bullets[i].x = pads[j].x + pads[j].img.width; // This ensures the bullet ricochet animation is smooth.
					}
					bullets[i].xSpeed = -bullets[i].xSpeed;
				}
				else
				{ // Then a vertical collision occured.
					if (bullets[i].y < pads[j].y)
					{ // Then the bullet collided with the top side.
						bullets[i].y = pads[j].y - bullets[i].img.height; // This ensures the bullet ricochet animation is smooth.
					}
					else
					{ // Then the bullet collided with the bottom side.
						bullets[i].y = pads[j].y + pads[j].img.height; // This ensures the bullet ricochet animation is smooth.
					}
					bullets[i].ySpeed = -bullets[i].ySpeed;
				}
			}
		}
	}
}

function collisionBulletGround()
{
	for (var i = 0; i < bullets.length; i++)
	{
		if (bullets[i].y + bullets[i].img.height + bullets[i].ySpeed > 355)
		{
			bullets[i].ySpeed = -bullets[i].ySpeed;
		}
	}
}

function playerGravity()
{
	if (applyPlayerGravity)
	{
		window.removeEventListener("keypress", onKeyPress); // We don't want the player to be able to jump mid-air (for now).
		player.y += fallSpeed;
		if(currentDirection)
		{
			player.img.src = "../img/playerRightJump.png";
		}
		else
		{
			player.img.src = "../img/playerLeftJump.png";
		}
		for (var i = 0; i < pads.length; i++)
		{ // For all the pads in the pads array:
			if (pads[i].onPad)
			{ // Then the player landed on one of the pads.
				player.y = pads[i].y - player.img.height; // Make sure the player is exactly on the pad.
				applyPlayerGravity = false; // Stop applying gravitational force.
				resetJump(); // Reset the jump variables so the next jump is not screwed up.
				if(currentDirection)
				{
					player.img.src = "../img/playerRight.png";
				}
				else
				{
					player.img.src = "../img/playerLeft.png";
				}
			}
		}
		if (player.y >= 295)
		{ // Then the player reached the ground, time to stop.
			player.y = 295; // Make sure the player does not go below ground.
			applyPlayerGravity = false; // Make sure the player is exactly on the pad.
			resetJump(); // Reset the jump variables so the next jump is not screwed up.
			if(currentDirection)
			{
				player.img.src = "../img/playerRight.png";
			}
			else
			{
				player.img.src = "../img/playerLeft.png";
			}
		}
		
	}
}

function resetJump()
{
	jumpSpeed = JUMP_SPEED;
	jumpHeight = 120;
	jumpCounter = 0;
	goingUp = true;
	upPressed = false;
	flag1 = true;
	flag2 = false;
	flag3 = false;
	window.addEventListener("keypress", onKeyPress);
}

function fire(event)
{
	shootSound.play(); // Play the shooting sound effect. Pew pew pew!
	var mouseX = event.clientX - surface.canvas.offsetLeft; // You have to subtract the offset value
	var mouseY = event.clientY - surface.canvas.offsetTop;  // to get the mouse coordinate inside the canvas.
	// THIS IS WHERE THE TRAJECTORY OF THE BULLET IS CALCULATED. CONTACT ME (EKIN) IF YOU HAVE ANY QUESTIONS ABOUT THIS**
	var xCoef = mouseX - player.x;
	var yCoef = mouseY - player.y;
	var commonSpeedVariable = 1/(Math.abs(xCoef)+Math.abs(yCoef));
	var finalSpeedX = commonSpeedVariable*xCoef*bulletSpeedMultiplier;
	var finalSpeedY = commonSpeedVariable*yCoef*bulletSpeedMultiplier;
	// END OF BULLET TRAJECTORY CALCULATION *****************************************************************************
	var bulletImage = new Image();
	bulletImage.src = "../img/bullet.png";
	bullets.push({img:bulletImage,x:player.x,y:player.y,xSpeed:finalSpeedX,ySpeed:finalSpeedY});
}

function onKeyDown(event)
{
	switch (event.keyCode)
	{
		case 65:
			leftPressed = true;
			break;
		case 68: 
			rightPressed = true;
			break;
	}
}

function onKeyUp(event)
{
	switch (event.keyCode)
	{
		case 65: 
			leftPressed = false;
			break;
		case 68: 
			rightPressed = false;
			break;
	}
}

function onKeyPress(event)
{
	if (event.keyCode == 87 || event.keyCode == 119)
	{
		upPressed = true;
	}
}