



var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var allGameObjects = [];
var count = 0;

// controller vars
var upPressed = 0;
var downPressed = 0;
var leftPressed = 0;
var rightPressed = 0;


var level = new LevelOne();
var clicker = new Particle(new Vector(0,0), new Position(0,0), new Xspot(5,'#f10','#000'));
var aimLaser = new Particle(new Vector(0,0), new Position(0,0), new Line(10, new Position(0,0), '#f10','#f10'));
var clicking = false;
clicker.isMovable = false;
aimLaser.isMovable = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




function LevelOne() {
}

LevelOne.prototype.clearLevel = function() {
};

LevelOne.prototype.drawLevel = function() {
	ctx.beginPath();
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = '#ccc';
	ctx.fill();
};





























function Position(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Position.prototype.add = function(position) {
	this.x += position.x;
	this.y += position.y;
};





























function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
};

Vector.prototype.getMagnitude = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function () {
	return Math.atan2(this.y,this.x);
};

Vector.fromAngle = function (angle, magnitude) {
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

































function Circle(radius, colour, lineColour) {
	this.radius = radius || 0;
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
	this.typeName = 'circle';
}

Circle.prototype.moveToPosition = function(position) {
	ctx.beginPath();
	ctx.arc(position.x,position.y,this.radius,0,2*Math.PI);
	ctx.fillStyle = this.colour;
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = this.lineColour;
	ctx.stroke();
};

































function Xspot(scale, colour, lineColour) {
	this.scale = scale || 0;
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
	this.typeName = 'xspot';
}

Xspot.prototype.moveToPosition = function(position) {
	ctx.beginPath();
    ctx.moveTo(position.x - this.scale, position.y - this.scale);
    ctx.lineTo(position.x + this.scale, position.y + this.scale);
    ctx.moveTo(position.x + this.scale, position.y - this.scale);
    ctx.lineTo(position.x - this.scale, position.y + this.scale);

    ctx.fillStyle = this.colour;
	ctx.fill();
    ctx.lineWidth = 4;
	ctx.strokeStyle = this.lineColour;
	ctx.stroke();
};
































function Line(width, positionOrigin, colour, lineColour) {
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
	this.width = width || 0;
	this.origin = positionOrigin;
	this.typeName = 'line';
}

Line.prototype.moveToPosition = function(positionTwo) {
	ctx.beginPath();
	ctx.moveTo (this.origin.x, this.origin.y);          
	ctx.lineTo (positionTwo.x, positionTwo.y);
	ctx.fillStyle = this.colour;
	ctx.fill();
    ctx.lineWidth = this.width;
	ctx.strokeStyle = this.lineColour;
	ctx.stroke();
};

































function Rectangle(width, height, colour, lineColour) {
	this.width = width || 0;
	this.height = height || 0;
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
	this.typeName = 'rectangle';
}

Rectangle.prototype.moveToPosition = function(position) {
	ctx.beginPath();
	ctx.rect(position.x,position.y,this.width,this.height);
	ctx.fillStyle = this.colour;
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = this.lineColour;
	ctx.stroke();
};

































function Polygon(size, sides, colour, lineColour) {
	this.size = size || 0;
	this.sides = sides || 0;
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
	this.typeName = 'polygon';
}

Polygon.prototype.moveToPosition = function(position) {
	ctx.beginPath();
	ctx.fillStyle = this.colour;
	ctx.moveTo (position.x +  this.size * Math.cos(0), position.y +  this.size * Math.sin(0));          

	for (var i = 1; i <= this.sides;i += 1) {
	  ctx.lineTo (position.x + this.size * Math.cos(i * 2 * Math.PI / this.sides),
	  	position.y + this.size * Math.sin(i * 2 * Math.PI / this.sides));
	}
	ctx.closePath();
	ctx.fill();

	ctx.strokeStyle = this.lineColour;
	ctx.lineWidth = 4;
	ctx.stroke();
};

































function Particle(vector,position,shapeType) {
	this.vector = vector;
	this.position = position;
	this.shapeType = shapeType;
	this.coefficient = 0.98;
	this.isMovable = true;
}


































function updatePosition (){
	//all objects update position
	for(var i in allGameObjects){
		if(allGameObjects[i].isMovable)
		{
			// change position based on speed
			allGameObjects[i].position = new Position(Math.min(Math.max(allGameObjects[i].position.x + allGameObjects[i].vector.x,0),canvas.width), 
				Math.min(Math.max(allGameObjects[i].position.y + allGameObjects[i].vector.y,0),canvas.height) );

			slowDown(allGameObjects[i]);
		}

		drawLaser(new Position(clicker.position.x,clicker.position.y));

		// change visual element position in DOM
		allGameObjects[i].shapeType.moveToPosition(allGameObjects[i].position);

	} //end for
}


function slowDown(gameElement)
{
  gameElement.vector.x = gameElement.vector.x * gameElement.coefficient;
  gameElement.vector.y = gameElement.vector.y * gameElement.coefficient;
}


function gameLoop()
{
	level.drawLevel();
	updatePosition();

	 var player = allGameObjects[1];

	// change player speed based on keyboard events
	if (upPressed == 1)
		player.vector.y = Math.max(player.vector.y - 1,-1*6);
	if (downPressed == 1)
		player.vector.y = Math.min(player.vector.y + 1,1*6)
	if (rightPressed == 1)
		player.vector.x = Math.min(player.vector.x + 1,1*6);
	if (leftPressed == 1)
		player.vector.x = Math.max(player.vector.x - 1,-1*6);

	setTimeout("gameLoop()",10);
}

































$("#canvas").mouseup(function(e) {
	clicking = false;
	var posX = 0, posY = 0;
	mouse = new Vector(((e.pageX+posX) - (allGameObjects[1].position.x))/14,
		((e.pageY+posY) - (allGameObjects[1].position.y))/14);
	allGameObjects[2].position = allGameObjects[1].position;
	allGameObjects[2].vector.add(mouse);
	clicker.position = new Position(e.pageX+posX,e.pageY+posY);
	clicker.shapeType = new Xspot(5,'#f10','#000');
	allGameObjects[3] = clicker;
});


$("#canvas").mousedown(function(e) {
	clicking = true;
	var posX = 0, posY = 0;
	clicker.position = new Position(e.pageX+posX,e.pageY+posY);
	clicker.shapeType = new Xspot(5,'#f10','#f10');
	allGameObjects[3] = clicker;
});

$("#canvas").mousemove(function(e) {
	var posX = 0, posY = 0;
	clicker.position = new Position(e.pageX+posX,e.pageY+posY);
	allGameObjects[3] = clicker;
});

$('body').mouseover(function(){
    $(this).css({cursor: 'none'});
});


function drawLaser(pos)
{
	//Make Laser
    if(clicking)
	{
		var posX = 0, posY = 0;
		aimLaser.position = new Position(pos.x+posX,pos.y+posY);
		aimLaser.shapeType = new Line(0, allGameObjects[1].position, '#f10','#f10');
		allGameObjects[4] = aimLaser;		
	}
	else
	{
		var posX = 0, posY = 0;
		aimLaser.position = new Position(0,0);
		aimLaser.shapeType = new Line(0, new Position(0,0), '#f10','#f10');
		allGameObjects[4] = aimLaser;	
	}
}


$('body').keydown(function(e)
{
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 38)
    upPressed = 1;
  if (code == 40)
    downPressed = 1;
  if (code == 37)
    leftPressed = 1;
  if (code == 39)
    rightPressed = 1;

  if (code == 87)
    upPressed = 1;
  if (code == 83)
    downPressed = 1;
  if (code == 65)
    leftPressed = 1;
  if (code == 68)
    rightPressed = 1;
});


$('body').keyup(function(e)
{
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 38)
    upPressed = 0;
  if (code == 40)
    downPressed = 0;
  if (code == 37)
    leftPressed = 0;
  if (code == 39)
    rightPressed = 0;

  if (code == 87)
    upPressed = 0;
  if (code == 83)
    downPressed = 0;
  if (code == 65)
    leftPressed = 0;
  if (code == 68)
    rightPressed = 0;
});






























allGameObjects[0] = new Particle(new Vector(10,10), new Position(300,100), new Circle(30,'#ff9933','#000'));
allGameObjects[1] = new Particle(new Vector(10,-10), new Position(300,100), new Rectangle(30,30,'#009910','#000'));
allGameObjects[2] = new Particle(new Vector(-2,10), new Position(300,100), new Polygon(30,6,'#0022ff','#000'));
allGameObjects[4] = aimLaser;
gameLoop();