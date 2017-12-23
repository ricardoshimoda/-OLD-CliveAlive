var canvas = document.querySelector("canvas");
canvas.width = 800; 	
canvas.height = 400;

var surface = canvas.getContext("2d");
var uInt;        // Variable for setInterval.
var background;  // The backgound image.
var player = {img:null,x:null,y:null}; // The player class. img is the image of the player. x and y are the player coordinates.
var playerSpeed; // Player's speed in pixels.
const JUMP_SPEED = 8; // Used to set the jump speed back to it's original value.
var jumpSpeed;   // Player's jump speed in pixels.
var jumpHeight;  // Player's jump height in pixels.
var jumpCounter; // Trackshow many pixels the player jumped so far.
var goingUp;     // Flag for the jumping animation. True means jumping up, false means falling down.

var flag1 = true;  //  These flags are used to make sure
var flag2 = false; //  the jump speed is modified once,
var flag3 = false; //  and not more.

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var currentDirection = true; // Used to keep track of player's direction. (true=right false=left)

var jumpSound = document.createElement("AUDIO");

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("keypress", onKeyPress);

createMap();

function update()
{
	movePlayer();
	render();
}

function createMap()
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
	uInt = setInterval(update, 15.34);
}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height);
	surface.drawImage(background,0,0);
	surface.drawImage(player.img,player.x,player.y);
}

function movePlayer()
{
	if (leftPressed && player.x > 0)
	{
		console.log(upPressed);
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
			console.log(jumpSpeed);
			player.y = player.y - jumpSpeed;
			jumpCounter += jumpSpeed;
			if (jumpCounter >= jumpHeight/100*50 && flag1)
			{
				jumpSound.play();
				console.log("DECREASE");
				jumpSpeed = JUMP_SPEED - 1;
				flag1 = false;
				flag2 = true;
			}
			else if (jumpCounter >= jumpHeight/100*75 && flag2)
			{
				console.log("DECREASE");
				jumpSpeed = JUMP_SPEED - 2;
				flag2 = false;
				flag3 = true;
			}
			else if (jumpCounter >= jumpHeight/100*95 && flag3)
			{
				console.log("DECREASE");
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
		{
			console.log(jumpSpeed);
			player.y = player.y + jumpSpeed;
			jumpCounter -= jumpSpeed;
			if (jumpCounter <= jumpHeight/100*95 && flag1)
			{
				jumpSpeed = JUMP_SPEED - 2;
				flag1 = false;
				flag2 = true;
			}
			else if (jumpCounter <= jumpHeight/100*75 && flag2)
			{
				jumpSpeed = JUMP_SPEED - 1;
				flag2 = false;
				flag3 = true;
			}
			else if (jumpCounter <= jumpHeight/100*50 && flag1)
			{
				jumpSpeed = JUMP_SPEED;
				flag3 = false;
			}
			if (jumpCounter <= 0)
			{ // Jumping animation is over. Time to reset the jumping values.
				jumpCounter = 0;
				player.y = 295; // Make sure the player does not go below ground.
				if(currentDirection)
				{
					player.img.src = "../img/playerRight.png";
				}
				else
				{
					player.img.src = "../img/playerLeft.png";
				}
				goingUp = true; // Set the flag so that the falling animation can stop.
				upPressed = false; // If you don't change this to false, the player will continiously jump.
				flag1 = true;
				window.addEventListener("keypress", onKeyPress); // Since the jumping animation is over, we need to add event listener again.
			}
		}
	}
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