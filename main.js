var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var allGameObjects = [];
var count = 0;
var level = new LevelOne();

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






function Rectangle(width, height, colour, lineColour) {
	this.width = width || 0;
	this.height = height || 0;
	this.colour = colour || '#000';
	this.lineColour = lineColour || '#000';
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
}

Polygon.prototype.moveToPosition = function(position) {
	ctx.beginPath();
	ctx.fillStyle = this.colour;
	ctx.moveTo (position.x +  this.size * Math.cos(0), position.y +  this.size * Math.sin(0));          

	for (var i = 1; i <= this.sides;i += 1) {
	  ctx.lineTo (position.x + this.size * Math.cos(i * 2 * Math.PI / this.sides),position.y + this.size * Math.sin(i * 2 * Math.PI / this.sides));
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
}






function updatePosition (){
	//all objects update position
	for(var i in allGameObjects){

		// change position based on speed
		allGameObjects[i].position = new Position(Math.min(Math.max(allGameObjects[i].position.x + allGameObjects[i].vector.x,0),canvas.width), 
			Math.min(Math.max(allGameObjects[i].position.y + allGameObjects[i].vector.y,0),canvas.height) );

		// change visual element position in DOM
		allGameObjects[i].shapeType.moveToPosition(allGameObjects[i].position);

		slowDown(allGameObjects[i]);

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
	setTimeout("gameLoop()",10);
}





$("#canvas").click(function(e) {
  
  var posX = 0, posY = 0;
  mouse = new Vector(((e.pageX+posX) - (allGameObjects[2].position.x))/35,
  	((e.pageY+posY) - (allGameObjects[2].position.y))/35);
  allGameObjects[2].vector.add(mouse);

});




allGameObjects[0] = new Particle(new Vector(10,10), new Position(300,100), new Circle(30,'#ff9933','#000'));
allGameObjects[1] = new Particle(new Vector(10,-10), new Position(300,100), new Rectangle(30,30,'#009910','#000'));
allGameObjects[2] = new Particle(new Vector(-2,10), new Position(300,100), new Polygon(30,6,'#0022ff','#000'));
gameLoop();