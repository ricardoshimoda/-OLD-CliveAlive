var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

var surface = canvas.getContext("2d");
var uInt;        // Variable for setInterval.
var background;  // The backgound image.
var pad1 = {img:null,x:null,y:null}; // The two 
var pad2 = {img:null,x:null,y:null}; // pad images.

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
var playerOnPad1, playerOnPad2; // Flag used to dtermine if the player is on a pad or not.
var applyPlayerGravity; // True: Start applying gravitational force to player.   False: Stop applying gravitational force to player.
var fallSpeed; // Player fall speed in pixels.
// END OF PLAYER RELATED VARIABLES **********************************************************************************************

var leftPressed = false; // These flags are used  
var rightPressed = false;// to keep track of which
var upPressed = false;   // keyboard button the
var downPressed = false; // player presses.

var jumpSound = document.createElement("AUDIO"); // This is the jump sound effect, weeeeeeeee!

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keypress", onKeyPress);

createMap();

function update()
{
	movePlayer();
	collisionPlayerPad();
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
	player.x = 300;
	player.y = 295;
	playerSpeed = 4;
	jumpSpeed = JUMP_SPEED;
	jumpHeight = 120;
	jumpCounter = 0;
	goingUp = true;
	currentDirection = true;
	playerOnPad1 = false;
	playerOnPad2 = false;
	applyPlayerGravity = false;
	fallSpeed = 5;
	pad1.img = new Image();
	pad1.img.src = "../img/pad.png";
	pad1.x = 100;
	pad1.y = 250;
	pad2.img = new Image();
	pad2.img.src = "../img/pad.png";
	pad2.x = 450;
	pad2.y = 250;
	uInt = setInterval(update, 15.34);
}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height); // Clear the canvas first.
	surface.drawImage(background,0,0); // Draw the background.
	surface.drawImage(pad1.img,pad1.x,pad1.y); // Draw the 1st pad.
	surface.drawImage(pad2.img,pad2.x,pad2.y); // Draw the 1st pad.
	surface.drawImage(player.img,player.x,player.y); // Draw the player.
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
		playerOnPad1 = false; // Player is NOT on any 
		playerOnPad2 = false; // of the pads while jumping.
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
				jumpSound.play();
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
	if (!goingUp) // We only want to check collision between the pad and the player when the player is falling down.
	{ // Then the player is falling down.
		if (player.y + player.img.height <= pad1.y + jumpSpeed && player.y + player.img.height >= pad1.y - jumpSpeed)
		{ // Then there is a collision between the y coordinates of the player and the pad.
			if (player.x + player.img.width >= pad1.x && player.x <= pad1.x + pad1.img.width)
			{ // Then the x coordinates collide as well. We have a collision!
				playerOnPad1 = true;
				player.y = pad1.y - player.img.height; // Make sure the player is exactly on the pad.
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
		if (player.y + player.img.height <= pad2.y + jumpSpeed && player.y + player.img.height >= pad2.y - jumpSpeed)
		{ // Then there is a collision between the y coordinates of the player and the pad.
			if (player.x + player.img.width >= pad2.x && player.x <= pad2.x + pad2.img.width)
			{ // Then the x coordinates collide as well. We have a collision!
				playerOnPad2 = true;
				player.y = pad2.y - player.img.height; // Make sure the player is exactly on the pad.
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
	if (playerOnPad1) // This part captures the moment when the player leaves the pad, so the fall animation can start.
	{
		if (player.x > pad1.x + pad1.img.width || player.x + player.img.width < pad1.x)
		{ // Then the player left the pad, time to apply gravity.
			applyPlayerGravity = true;
			playerOnPad1 = false;
		}
	}
	if (playerOnPad2) // This part captures the moment when the player leaves the pad, so the fall animation can start.
	{
		if (player.x > pad2.x + pad2.img.width || player.x + player.img.width < pad2.x)
		{ // Then the player left the pad, time to apply gravity.
			applyPlayerGravity = true;
			playerOnPad2 = false;
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
		if (playerOnPad1 || playerOnPad2)
		{ // Then the player landed on one of the pads.
			player.y = pad1.y - player.img.height; // Make sure the player is exactly on the pad.
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