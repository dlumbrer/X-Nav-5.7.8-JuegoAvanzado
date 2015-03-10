// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = localStorage.getItem("princess") || 0;
var stones = [];
var stone = {};
var numberOfStones = 5;
var monster = {};
var monsters= [];
var numberOfMonsters = 1;
var speedMonster = 20;
var nivel = 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 96)); //ES -32 YA QUE LE TENEMOS QUE RESTAR EL ACNHO Y EL ALTO DEL ARBOL (32X32)
	princess.y = 32 + (Math.random() * (canvas.height - 96));
	
	stones = []; //REINICIA LAS PIEDRAS
	for(i = 0; i<numberOfStones; i++){
		stone = {}
		stone.x = 32 + (Math.random() * (canvas.width - 96));
		stone.y = 32 + (Math.random() * (canvas.height - 96));
		//PARA QUE NO COINCIDA CON EL CABALLERO NI CON LA PRINCESA
		if(hero.x < (stone.x + 32) && stone.x < (hero.x + 32) && hero.y < (stone.y + 32) && stone.y < (hero.y + 32)
		   || princess.x < (stone.x + 32) && stone.x < (princess.x + 32) && princess.y < (stone.y + 32) && stone.y < (princess.y + 32)){
			stone.x = 32 + (Math.random() * (canvas.width - 96));
			stone.y = 32 + (Math.random() * (canvas.height - 96));
			i--;
			continue;
		}

		stones.push(stone);
	}
	
	monsters = []; //REINICIA LAS MONSTRUOS
	for(i = 0; i<numberOfMonsters; i++){
		monster = {speed: speedMonster};
		monster.x = 32 + (Math.random() * (canvas.width - 96));
		monster.y = 32 + (Math.random() * (canvas.height - 96));
		//PARA QUE NO COINCIDA EL SPAWN CON EL CABALLERO NI CON LA PRINCESA
		if(hero.x < (monster.x + 32) && monster.x < (hero.x + 32) && hero.y < (monster.y + 32) && monster.y < (hero.y + 32)
		   || princess.x < (monster.x + 32) && monster.x < (princess.x + 32) && princess.y < (monster.y + 32) && monster.y < (princess.y + 32)){
			monster.x = 32 + (Math.random() * (canvas.width - 96));
			monster.y = 32 + (Math.random() * (canvas.height - 96));
			i--;
			continue;
		}

		monsters.push(monster);
	}
	
	
	
};

// Update game objects
var update = function (modifier) {


	//IA DE LOS MONSTRUOS
	for(i=0; i<numberOfMonsters; i++){	
		distx = monsters[i].x - hero.x;
		disty = monsters[i].y - hero.y;
		if(distx > 0){
			monsters[i].x -= monsters[i].speed * modifier; 
		}else if (distx < 0){
			monsters[i].x += monsters[i].speed * modifier;
		}
		if(disty > 0){
			monsters[i].y -= monsters[i].speed * modifier; 
		}else if (disty < 0){
			monsters[i].y += monsters[i].speed * modifier;
		}
	}
	
		
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
        //GUARDO EN LOCAL
        localStorage.setItem("princess", princessesCaught);
		reset();
	}
	
	//Si te toca un monstruo pierdes
	for(i=0; i<numberOfMonsters; i++){
		if (
			hero.x <= (monsters[i].x + 16)
			&& monsters[i].x <= (hero.x + 16)
			&& hero.y <= (monsters[i].y + 16)
			&& monsters[i].y <= (hero.y + 32)
		) {
			princessesCaught = 0;
            localStorage.setItem("princess", princessesCaught);
			numberOfMonsters = 1;
			speedMonster = 20;
			numberOfStones = 5;
			nivel = 1;
			reset();
		}
	}	
	
	//Se sale del canvas?
	if(hero.x > (canvas.width-32-32)){
		hero.x = canvas.width-32-32;
	}else if(hero.y > (canvas.height-32-32)){
		hero.y = canvas.height-32-32;
	}else if(hero.y < 32){
		hero.y = 32;
	}else if(hero.x < 32){
		hero.x = 32;
	}

	//Se toca con una piedra? Pues si se toca anulamos el movimiento
	for(i=0;i<numberOfStones;i++){
		if(hero.x < (stones[i].x + 32) && stones[i].x < (hero.x + 32) && hero.y < (stones[i].y + 32) && stones[i].y < (hero.y + 32)){
			if (38 in keysDown) { // Player holding up
				hero.y += hero.speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				hero.y -= hero.speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				hero.x += hero.speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				hero.x -= hero.speed * modifier;
			}	
		}
	}
	
	//niveles
	if(princessesCaught >= 5*nivel){
		numberOfMonsters += 1;
		speedMonster += 10;
		numberOfStones += 5;
		reset();
		nivel += 1;
	}
	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	//////////////////////PIEDRAS////////////////
	if(stoneReady){
		for(i=0;i<numberOfStones;i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}
	////////////////////////////////////////////
	
	//////////////////////Monstruos////////////////
	if(monsterReady){
		for(i=0;i<numberOfMonsters;i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}
	////////////////////////////////////////////
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	//Level
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Level: " + nivel, 380, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
