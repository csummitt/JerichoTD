/***************************************************/
/***************** CONSTANTS ***********************/
/***************************************************/
//------------
//System Values
//------------
var STAGE_WIDTH = 960;
var STAGE_HEIGHT = 540;
var TIME_PER_FRAME = 20; //this equates to 30 fps
var GAME_FONTS = "bold 20px sans-serif";
var imgSize = 64;
var GRID_WIDTH = 1920/imgSize;
var GRID_HEIGHT = 1920/imgSize;

//Tile Images
var PATH_TILE_GRASS = "game/assets/img/grass.jpg";
var PATH_TILE_UNBUILD = "game/assets/img/unbuildgrass.jpg";
var PATH_TILE_PATH = "game/assets/img/path.jpg";

//HUD Images
var PATH_HUD_CASH = "game/assets/img/cash.jpg";

var cashImg = new Image();
cashImg.src = PATH_HUD_CASH;

//Tower Images
var PATH_TOWER_BASIC = "";
var PATH_TOWER_RAPID = "";
var PATH_TOWER_SPLASH = "";
var PATH_TOWER_MULTI = "";

//Creep Images
var PATH_CREEP_BASIC = "";
var PATH_CREEP_ARMOR = "";
var PATH_CREEP_FAST = "";
var PATH_CREEP_SPLIT = "";
var PATH_CREEP_BOSS = "";

//Purchase Iages
var PATH_HEXEGON = "game/assets/img/hexagon-small.png";
var PATH_GREEN = "game/assets/img/GreenPurchase.png";
var PATH_CANCEL = "game/assets/img/cancel.png";

var heximg = new Image();
heximg.src = PATH_HEXEGON;
var greenimg = new Image();
greenimg.src = PATH_GREEN;
var canimg = new Image();
canimg.src = PATH_CANCEL; 
//Pre-load stuff
var TEXT_PRELOADING = "Loading ...", 
	TEXT_PRELOADING_X = 300, 
	TEXT_PRELOADING_Y = 300;

/***************************************************/
/***************************************************/
/***************************************************/

/***************************************************/
/***************** VARIABLES ***********************/
/***************************************************/

//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = window.innerWidth;
stage.height = window.innerHeight;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;

var startX = -5;
var startY = -5;
var endX = -5;
var endY = -5;

//Test Variables
updateCount = 0;
updateTime = 0;
updateTimeTotal = 0;
var mouseIsDown = false;
var mouseMoved = false;
var touched = false;
var touchmoved = false;

/***************************************************/
/***************************************************/
/***************************************************/

var preloader = setInterval(preloading, TIME_PER_FRAME);
var gameloop;
var timerwaveSpawner;
var timerspawnDelay;
var timerwaveSetup;
var spawnDelay = 500;
var waveLength;
var wave = 0;
var selectedTile = -1;

var player;

var Grid = [];
var Towers = [];
var Creeps = [];

var airdragon = [];
var wdragon = [];
var fdragon = [];
var gdragon = [];
var bdragon = [];

var availableNumbers = [];
var greenLaserSprite = [];

var creepID = 0;
var spacing = 2;
var buildArea = (GRID_WIDTH-spacing*6)/2;

var ongoingTouches = new Array();
var purchasing = false;
var gameOver = false;
/***************************************************/
/***************************************************/
/***************************************************/
var logMessage = "Log";
var timer;
var startTime;
var displaySec = 0;
var displayMin = 0;
var displayHour = 0;
var startSec = 0;
var startMin = 0;
var startHour = 0;
var hour= 0;
var min = 0;
var sec = 0;

/***************************************************/
/******************* OBJECTS ***********************/
/***************************************************/

/******************TILES*************************/	
var Tile = function(path,build,x,y,size){
		this.pathable = path;
		this.buildable = build;
		this.size = size;
		this.locX = x*size;
		this.locY = y*size;
		this.img = new Image();
		this.spawn = false;
		this.tower = -1;
	}

/******************PLAYER*************************/	
var Player = function(){
	this.cash = 250;
	this.kills = 0;
	this.exp = 0;
	this.expGain = 0;
	this.towersBuilt = 0;
	this.towersSold = 0;
	this.waveReached = 0;
}

/******************CREEPS*************************/	
var Creep = function(wave,type,locX,locY,modifiers,imgs){
	//Location Variables
	this.locX = locX;
	this.locY = locY;
	
	
	//Stat Variables
	this.baseHP = (wave*25)+((25*(wave-1))/8) ^2;
	this.baseSpeed = 100;
	this.baseArmor = Math.floor(wave/5);
	this.exp = Math.floor(wave/5);
	this.bounty = 5 + Math.floor(wave/5);
	if(availableNumbers.length < 1){
		this.UID = creepID;
		creepID = creepID + 1;
	} else {
		this.UID = availableNumbers.pop();
	}
	
	this.dead = false;
	
	switch (type) {
		case "Armor":
			this.HP = this.baseHP * 1.1;
			this.Armor = (this.baseArmor + 1) * 2;
			this.baseSpeed = this.baseSpeed * 0.9;
		case "Fast":
			this.HP = this.baseHP * 0.8;
			this.Armor = this.baseArmor;
			this.baseSpeed = this.baseSpeed * 1.3;
		case "Split":
			this.HP = this.baseHP * 1.05;
			this.Armor = this.baseArmor;
			this.baseSpeed = this.baseSpeed * 0.95;
		case "Mob":
			this.HP = this.baseHP * 0.75;
			this.Armor = this.baseArmor;
			this.baseSpeed = this.baseSpeed;
		case "Boss":
			this.HP = this.baseHP * 1.5;
			this.Armor = (this.baseArmor + 5) * 1.75;
			this.baseSpeed = this.baseSpeed;
		default:
			this.HP = this.baseHP;
			this.Armor = this.baseArmor;
			this.baseSpeed = this.baseSpeed;
	}
	
	
	//Image Variables
	this.dir = 0;
	this.imgs = imgs;
	this.imgSpeed = 3;
	this.currentImg = 0;
	
}	

/******************Towers*************************/	
var Tower = function(type,locX,locY){
	//Location Variables
	this.locX = locX;
	this.locY = locY;
	this.centerX = locX / 2;
	this.centerY = locY / 2;
	
	//Stat Variables
	this.baseDMG = 0;
	this.baseAS = 10000000;
	this.baseRange = 0;
	this.level = 1;
	this.target;
	console.log(this.target);
	this.attackDelay = 0;
	
	switch (type) {
		case "green":
			console.log("Green Tower Created");
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =100;
			this.maxImage = 32;
		case "red":
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =600;
			this.maxImage = 32;
		case "blue":
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =600;
			this.maxImage = 32;
		case "yellow":
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =600;
			this.maxImage = 32;
		case "black":
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =600;
			this.maxImage = 32;
		default:
			this.imgs = greenLaserSprite;
			this.baseDMG = 10;
			this.baseAS = 25; //20 ms per frame aka 50 * 20 = 1 second
			this.baseRange =100;
			this.maxImage = 32;
	}
	
	//This is throwing a (Uncaught TypeError: undefined is not a function) so moving it outside of tower
	/*
	var acquireTarget = function(creeps, tower){
		var distance = 0;
		var targetIndex=creeps.indexOf(tower.target);
		
		distance = Math.sqrt( Math.pow(creeps[targetIndex].locX/2 - tower.centerX, 2) + Math.pow(creeps[targetIndex].locY/2 - tower.centerY, 2));
		if(distance <= tower.baseRange){
			return tower.target;
		}
		
		for(i=0;i<creeps.length;i++){
			//sqrt( (creeepX-TowerX)^2 + (creepY-TowerY)^2  )
			distance = Math.sqrt( Math.pow(creeps[i].locX/2 - tower.centerX, 2) + Math.pow(creeps[i].locY/2 - tower.centerY, 2));
			if(distance <= tower.baseRange){
				return creeps[i].UID;
			}
		}
		return -1;
	}
	*/
	
	//Image Variables	
	this.imgSpeed = 3;
	this.currentImg = 0;
	
	
}	

var acquireTarget = function(creeps, tower){
	var distance = 0;
	var targetCreep=tower.target;
	if(!(tower.target === null)){
		distance = Math.sqrt( Math.pow(targetCreep.locX/2 - tower.centerX, 2) + Math.pow(targetCreep.locY/2 - tower.centerY, 2));
		if(distance <= tower.baseRange){
			return tower.target;
		}
	}
	
	for(i=0;i<creeps.length;i++){
		//sqrt( (creeepX-TowerX)^2 + (creepY-TowerY)^2  )
		distance = Math.sqrt( Math.pow(creeps[i].locX/2 - tower.centerX, 2) + Math.pow(creeps[i].locY/2 - tower.centerY, 2));
		//console.log("Distance: " + distance);
		if(distance <= tower.baseRange){
			//console.log("New Target: " + creeps[i].UID);
			return creeps[i];
		}
	}
	return null;
}

/***************************************************/
/***************************************************/
/***************************************************/




/***************************************************/
/******************* PRELOAD ***********************/
/***************************************************/

//---------------
//Preloading ...
//---------------

//Setup Tile

	

function setAssetReady()
{
	this.ready = true;
}

window.addEventListener('resize', resizeCanvas, false);
//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
//Setup Timers

function preloading()
{	
	clearInterval(preloader);

	//Register Touch Events
	stage.addEventListener('touchstart', handleStart, false);
	stage.addEventListener("touchend", handleEnd, false);
	stage.addEventListener('touchcancel', handleCancel, false);
	stage.addEventListener("touchleave", handleEnd, false);
	stage.addEventListener('touchmove', handleMove, false);

	//Mouse Events
	stage.addEventListener('mousedown', mouseStart, false);
	stage.addEventListener('mousemove', mouseMove, false);
	stage.addEventListener('mouseup', mouseEnd, false);
	stage.addEventListener('mouseout', mouseCancel, false);
	
	player = new Player();
	startTime = new Date().getTime();
	startToday = new Date();
	startSec = startToday.getSeconds();
	startMin = startToday.getMinutes();
	startHour = startToday.getHours();
	//startSec = new Date.getSeconds();
	/****************************************************************/
	/************************* GRID CREATION ************************/
	/****************************************************************/
	
	
	// console.log("Grid is " + GRID_WIDTH +" by "+ GRID_HEIGHT +" and Image Size is: " + imgSize);
	// console.log("spacing: " + spacing);
	// console.log("GRID_HEIGHT - spacing: " + (GRID_HEIGHT-spacing));
	// console.log("spacing*2-1: " +(spacing*2-1));
	// console.log("GRID_WIDTH-spacing*2: " + (GRID_WIDTH-spacing*2));
	// console.log("GRID_HEIGHT-spacing*2: " + (GRID_HEIGHT-spacing*2));
	// console.log("buildArea+spacing*2: " + (buildArea+spacing*2));
	// console.log("buildArea+spacing*3+1: " +( buildArea+spacing*3+1));
	//Create Grid
	for(var r = 0; r < GRID_HEIGHT; r++){
		for(var c = 0; c < GRID_WIDTH; c++){
			if(r<spacing||r>GRID_HEIGHT-(spacing*2-1)||(c<spacing && r > spacing*2-1)||(c>GRID_WIDTH-(spacing*2-1) && r<GRID_HEIGHT-(spacing*3-2))){
				//console.log("Creating Grid["+(r*GRID_HEIGHT+c)+"]!");
				Grid[r*GRID_HEIGHT+c] = new Tile(false,false,c,r,imgSize);
				Grid[r*GRID_HEIGHT+c].img.src = PATH_TILE_UNBUILD;
			} else if ((r<spacing*2 && c < GRID_WIDTH-spacing*2)||(c>spacing && r > GRID_HEIGHT-(spacing*3-1)) ||c < spacing*2||c>GRID_WIDTH-(spacing*3-1)||(c>buildArea+spacing*2 && c<buildArea+spacing*3+1)||(r>buildArea+spacing*2 && r < buildArea+spacing*3+1)){
				//console.log("Creating Grid["+(r*GRID_HEIGHT+c)+"]!");
				Grid[r*GRID_HEIGHT+c] = new Tile(true,false,c,r,imgSize);
				Grid[r*GRID_HEIGHT+c].img.src = PATH_TILE_PATH;
			} else {
				//console.log("Creating Grid["+(r*GRID_HEIGHT+c)+"]!");
				Grid[r*GRID_HEIGHT+c] = new Tile(false,true,c,r,imgSize);
				Grid[r*GRID_HEIGHT+c].img.src = PATH_TILE_GRASS;
			}
		}
	}
	
	/****************************************************************/
	/********************* END GRID CREATION ************************/
	/****************************************************************/
	
	
	//Setup Creeps to use
		for(var i = 0; i < 32;i++){
			tempImg = new Image()
			if(i < 8){
				tempImg.src = "game/assets/img/air-dragon/walking/air-walking-n000" + i + ".png";
				airdragon[i] = tempImg;
			} else if(i < 16){
				tempImg.src = "game/assets/img/air-dragon/walking/air-walking-e000" + (i-8) + ".png"
				airdragon[i] = tempImg;
			} else if(i < 24){
				tempImg.src = "game/assets/img/air-dragon/walking/air-walking-s000" + (i-16) + ".png"
				airdragon[i] = tempImg;
			} else {
				tempImg.src = "game/assets/img/air-dragon/walking/air-walking-w000" + (i-24) + ".png" 
				airdragon[i] = tempImg;
			}
		} //end of air dragon
		// for(var i = 0; i < 32;i++){
	            // tempImg = new Image()
	            // if(i < 8){
	                // tempImg.src = "game/assets/img/water-dragon/walking/water-walking-n000" + i + ".png";
	                // wdragon[i] = tempImg;
	            // } else if(i < 16){
	                // tempImg.src = "game/assets/img/water-dragon/walking/water-walking-e000" + (i-8) + ".png"
	                // wdragon[i] = tempImg;
	            // } else if(i < 24){
	                // tempImg.src = "game/assets/img/water-dragon/walking/water-walking-s000" + (i-16) + ".png"
	                // wdragon[i] = tempImg;
	            // } else {
	                // tempImg.src = "game/assets/img/water-dragon/walking/water-walking-w000" + (i-24) + ".png"
	                // wdragon[i] = tempImg;
	            // }
	        // }//end of water dragon
	        // for(var i = 0; i < 32;i++){
	            // tempImg = new Image()
	            // if(i < 8){
	                // tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-n000" + i + ".png";
	                // fdragon[i] = tempImg;
	            // } else if(i < 16){
	                // tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-e000" + (i-8) + ".png"
	                // fdragon[i] = tempImg;
	            // } else if(i < 24){
	                // tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-s000" + (i-16) + ".png"
	                // fdragon[i] = tempImg;
	            // } else {
	                // tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-w000" + (i-24) + ".png"
	                // fdragon[i] = tempImg;
	            // }
	        // }//end of fire dragon
	        // for(var i = 0; i < 32;i++){
	            // tempImg = new Image()
	            // if(i < 8){
	                // tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-n000" + i + ".png";
	                // gdragon[i] = tempImg;
	            // } else if(i < 16){
	                // tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-e000" + (i-8) + ".png"
	                // gdragon[i] = tempImg;
	            // } else if(i < 24){
	                // tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-s000" + (i-16) + ".png"
	                // gdragon[i] = tempImg;
	            // } else {
	                // tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-w000" + (i-24) + ".png"
	                // gdragon[i] = tempImg;
	            // }
	        // }//end of gold dragon
	        // for(var i = 0; i < 32;i++){
	            // tempImg = new Image()
	            // if(i < 8){
	                // tempImg.src = "game/assets/img/black-dragon/walking/black-walking-n000" + i + ".png";
	                // bdragon[i] = tempImg;
	            // } else if(i < 16){
	                // tempImg.src = "game/assets/img/black-dragon/walking/black-walking-e000" + (i-8) + ".png"
	                // bdragon[i] = tempImg;
	            // } else if(i < 24){
	                // tempImg.src = "game/assets/img/black-dragon/walking/black-walking-s000" + (i-16) + ".png"
	                // bdragon[i] = tempImg;
	            // } else {
	                // tempImg.src = "game/assets/img/black-dragon/walking/black-walking-w000" + (i-24) + ".png"
	                // bdragon[i] = tempImg;
	            // }
	        // }//end of black dragon
			
			
			//Setup Creeps to use
		for(var i = 0; i < 32;i++){
			tempImg = new Image()
			if(i < 10){
				tempImg.src = "game/assets/img/greenLaser/green000" + i + ".png";
				greenLaserSprite[i] = tempImg;
			} else {
				tempImg.src = "game/assets/img/greenLaser/green00" + i + ".png";
				greenLaserSprite[i] = tempImg;
			}
		} //end of Green Laser Tower

		waveSetup();
		updateTime = new Date().getTime();
		gameloop = setInterval(update, TIME_PER_FRAME);
		timer = setInterval(timeTracker,999);
}


/***************************************************/
/***************************************************/
/***************************************************/


//------------
//Game Loop
//------------

//Temp Camera Vars
cameraLocX = imgSize*0;
cameraLocY = imgSize*0;
cameraWidth = stage.width;//960;
cameraHeight = stage.height;//540;
//

function update()
{
	/***************************************************/
	/***************************************************/
	/*************** Game Loop Variables ***************/
	/***************************************************/
	/***************************************************/

	updateTime = updateTime - new Date().getTime();
	updateTimeTotal = updateTimeTotal + updateTime;
	updateTime = new Date().getTime();
	updateCount = updateCount + 1;
	
	cameraWidth = stage.width;//960;
	cameraHeight = stage.height;//540;

	startTime = new Date().getTime() - startTime;


	/***************************************************/
	/***************** Game Loop Drawing ***************/
	/***************************************************/
	/***************************************************/


	//Re-Order Images so the one on-top should be on-top
	Creeps.sort(function(a,b) { return parseFloat(a.locY) - parseFloat(b.locY) } );
	//Clear Canvas
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, stage.width, stage.height);	
		
	//Draw The Grid
	for(var i = 0; i < Grid.length; i++){
		if(Grid[i].locX+Grid[i].size >= cameraLocX){
			if(Grid[i].locX <= cameraLocX + cameraWidth){
				if(Grid[i].locY+Grid[i].size >= cameraLocY){
					if(Grid[i].locY <= cameraLocY + cameraHeight){
						ctx.drawImage(Grid[i].img,Grid[i].locX-cameraLocX,Grid[i].locY-cameraLocY,imgSize,imgSize);
						//console.log(Grid[i].img.src + "");
						// if(Grid[i].buildable){
							// ctx.beginPath();
							// ctx.rect(Grid[i].locX,Grid[i].locY,imgSize,imgSize);
							// ctx.lineWidth = 2;
							// ctx.strokeStyle = 'black';
							// ctx.stroke();
						// }
						// ctx.font = '12pt Calibri';
						// ctx.fillStyle = 'red';
						// ctx.fillText("("+Grid[i].locX+","+Grid[i].locY+")", Grid[i].locX-cameraLocX+1,Grid[i].locY-cameraLocY+imgSize/2); //Test To see Grid Number
					}
				}
			}
		}
	}
	 
	//Draw Tower Sprites
	//console.log(Towers.length);
	for(var i = 0; i < Towers.length; i++){
		if(Towers[i].locX+(4*imgSize) >= cameraLocX){
			if(Towers[i].locX <= cameraLocX + cameraWidth){
				if(Towers[i].locY+(4*imgSize) >= cameraLocY){
					if(Towers[i].locY <= cameraLocY + cameraHeight){
						ctx.drawImage(Towers[i].imgs[Towers[i].currentImg],Towers[i].locX-cameraLocX,Towers[i].locY-cameraLocY,imgSize,imgSize);
						//ctx.arc(Towers[i].locX,Towers[i].locY,100,0*Math.PI,2*Math.PI);
						//ctx.strokeStyle="red";
						//ctx.stroke();
						
						if(Towers[i].currentImg < 31){
							//console.log("Tower " + i + " img = " + Towers[i].currentImg);
							Towers[i].currentImg = Towers[i].currentImg + 1;
						} else {
							Towers[i].currentImg = 0;
						}
						//ctx.strokeText(""+i, Grid[i].locX-cameraLocX+1,Grid[i].locY-cameraLocY+imgSize/2); //Test To see Grid Number
					}
				}
			}
		}
	}
	
	//Draw Creep  
	//console.log("Number of Creeps: " + Creeps.length);
	for(var i = 0; i < Creeps.length; i++){
		if(Creeps[i].locX+(4*imgSize) >= cameraLocX){
			if(Creeps[i].locX <= cameraLocX + cameraWidth){
				if(Creeps[i].locY+(4*imgSize) >= cameraLocY){
					if(Creeps[i].locY <= cameraLocY + cameraHeight){
						ctx.drawImage(Creeps[i].imgs[Creeps[i].dir*8+Creeps[i].currentImg],Creeps[i].locX-cameraLocX,Creeps[i].locY-cameraLocY,64,64);
						//ctx.drawImage(Grid[i].img                  ,Grid  [i].locX-cameraLocX  ,Grid[i].locY-cameraLocY,imgSize,imgSize);
						//ctx.strokeText(""+i, Grid[i].locX-cameraLocX+1,Grid[i].locY-cameraLocY+imgSize/2); //Test To see Grid Number
					}
				}
			}
		}
	}
	//Draw Projectile Sprite
	
	//Draw Purchase
	if(selectedTile >= 0 && purchasing){
		if(Grid[selectedTile].tower == -1 && Grid[selectedTile].buildable){
			//No tower on tile create Hexegon
			ctx.drawImage(greenimg,Grid[selectedTile].locX-imgSize-cameraLocX,Grid[selectedTile].locY-imgSize-cameraLocY,imgSize,imgSize);
			ctx.drawImage(heximg,Grid[selectedTile].locX-imgSize-cameraLocX,Grid[selectedTile].locY-imgSize-cameraLocY,imgSize,imgSize);
			ctx.drawImage(canimg,Grid[selectedTile].locX+imgSize-cameraLocX,Grid[selectedTile].locY-imgSize-cameraLocY,imgSize,imgSize);
			//ctx.drawImage(img,x,y,64,64);
		}
	}
	
	//Draw HUD
	ctx.fillRect(0,0,stage.width,30); //HUD outline
	ctx.font = '15pt Calibri';
	ctx.fillStyle = 'black';
	//Money Section
	ctx.drawImage(cashImg,stage.width*0.01,5,20,20);
	ctx.fillText(player.cash,stage.width*0.01+20,20);

	//Creep Count Section
	ctx.fillText(Creeps.length + "/300",stage.width*0.25,20);

	//Wave Info Section
	ctx.fillText("Wave: " + wave,stage.width*0.50,20);
	
	//Timer Section
	ctx.fillText(hour + ":" + checkTime(min) + ":" + checkTime(sec),stage.width*0.75,20);			

	//Log Section
	//ctx.fillStyle = 'white';
	//ctx.fillRect(0,30,stage.width,30)
	//ctx.fillStyle = 'black';
	//ctx.fillText(logMessage, stage.width*0.01,50);

	//TESTing Section
	//ctx.fillText("Camera X: " + cameraLocX + " Camera Y: " + cameraLocY,stage.width*0.1,stage.height*0.05);
	//ctx.fillText("Average Update Time: " + (-1)*updateTimeTotal/updateCount,stage.width*0.1,stage.height*0.05);
	//ctx.fillText("Camera width: " + stage.width + " Camera Height: " + stage.height,stage.width*0.1,stage.height*0.15);
	//ctx.fillText("Selected Tile = " + selectedTile,stage.width*0.1,stage.height*0.15);
	


	/***************************************************/	
	/***************************************************/
	/************** Game Loop Processing ***************/
	/***************************************************/
	/***************************************************/
	if (Creeps.length < 50) {
		
		//Tower Movement
			//sprites for tower are drawn above, don't think this section is needed(unless tracking creeps in which case move below creep movements)
			var tempCreep;
		for (var i = 0; i < Towers.length; i++){
			//Test to see if creep is dead
			//console.log((tempCreep) + "==" + null);
			tempCreep = (Towers[i].target);
			//console.log((tempCreep) + "==" + null);
			if((tempCreep) == null){
				//console.log("here I am");
				Towers[i].target = null;
			} else if(tempCreep.dead){
				Towers[i].target = null;
			}
			//Check to see if Tower has valid target
			if((Towers[i].target) === null){
				Towers[i].target = acquireTarget(Creeps,Towers[i]);
				//console.log("Acquired Target: " + Towers[i].target.UID);
			}
			//Reset tempCreep in case tower acquired new target
			tempCreep = Towers[i].target;
			//console.log("target: " + tempCreep);
			
			
			//Check to see if Tower can attack
			if (Towers[i].attackDelay > 0) {
				//Tower can't attack change attack delay
				Towers[i].attackDelay = Towers[i].attackDelay - 1;
				//console.log("Attack Delay: " + Towers[i].attackDelay);
			} else {
				//Check to see if new target was acquired;
				if(!((tempCreep === null))) {
					//Tower can attack
					Towers[i].attackDelay = Towers[i].baseAS;
					tempCreep.HP = tempCreep.HP - Towers[i].baseDMG;
					//console.log("Creep " + tempCreep.UID + " HP: " + tempCreep.HP);
					if (tempCreep.HP <= 0) {
					
						tempCreep.dead = true;
						//console.log("Creep Died");
						//This removal could cause null pointers..
						Creeps.splice(Creeps.indexOf(tempCreep),1);
						player.kills = player.kills + 1;
						player.expGain = player.expGain + tempCreep.exp;
						player.cash = player.cash + tempCreep.bounty;
						//Change towers target back to none(-1)
						Towers[i].target = null;
						
					}
				}
			}
		}
		//Projectile Movement
		
		//Creep Movement
		for(var i = 0; i < Creeps.length; i++){
			if(Creeps[i].dir == 0){
				Creeps[i].locY = Creeps[i].locY - (Creeps[i].baseSpeed/(TIME_PER_FRAME));//*2))/3;
				if(Creeps[i].locY <= getRandomArbitrary(spacing,spacing+1)*imgSize){
					Creeps[i].dir = Creeps[i].dir + 1;
					//console.log("Direction " + Creeps[i].dir);
				}
			} else if (Creeps[i].dir == 1){
				Creeps[i].locX = Creeps[i].locX + (Creeps[i].baseSpeed/(TIME_PER_FRAME));//*2))/3;
				if(Creeps[i].locX >= getRandomArbitrary(GRID_HEIGHT-(spacing*2),GRID_HEIGHT-(spacing*2-1))*imgSize){
					Creeps[i].dir = Creeps[i].dir + 1;
					//console.log("Direction " + Creeps[i].dir);
				}
			} else if (Creeps[i].dir == 2){
				Creeps[i].locY = Creeps[i].locY + (Creeps[i].baseSpeed/(TIME_PER_FRAME));//*2))/3;
				if(Creeps[i].locY >= getRandomArbitrary(GRID_HEIGHT-(spacing*2),GRID_HEIGHT-(spacing*2-1))*imgSize){
					Creeps[i].dir = Creeps[i].dir + 1;
					//console.log("Direction " + Creeps[i].dir);
				}
			} else {
				Creeps[i].locX = Creeps[i].locX - (Creeps[i].baseSpeed/(TIME_PER_FRAME))//*2))/3;
				if(Creeps[i].locX <= getRandomArbitrary(spacing,spacing+1)*imgSize){
					Creeps[i].dir = 0;
					//console.log("Direction " + Creeps[i].dir);
				}
			}
			if(Creeps[i].imgSpeed == 0){
				Creeps[i].imgSpeed = 2;
				if(Creeps[i].currentImg > 6){
					Creeps[i].currentImg = 0;
				} else {
					Creeps[i].currentImg = Creeps[i].currentImg + 1;
				}
			} else {
					Creeps[i].imgSpeed = Creeps[i].imgSpeed-1;
			}
		}
	} else {
		clearInterval(timer);
		clearInterval(timerwaveSetup);
		clearInterval(timerspawnDelay);
		clearInterval(timerwaveSpawner);
		gameOver = true;
		ctx.font = '50pt Calibri';
		ctx.fillStyle = 'red';
		ctx.fillText("GAME OVER", stage.width*0.05,stage.height/2+50);
	}	
	
}


	/***************************************************/	
	/***************************************************/
	/************** Creep Spawning *********************/
	/***************************************************/
	/***************************************************/



//Creep Spawner
function waveSetup(){
	//console.log("Wave is Setup");
	
	clearInterval(timerspawnDelay);
	clearInterval(timerwaveSpawner);
	//wave = wave + 1;
	
	timerwaveSpawner = setTimeout(waveSpawner, 15000);
}
var modifierTestArray = [];
function waveSpawner(){
	//console.log("In Wave " + wave + " Spawner");
	clearInterval(waveSetup);
	wave = wave + 1;
	timerwaveSetup = setTimeout(waveSetup,20000);
	timerspawnDelay = setInterval(spawnCreeps,spawnDelay);
	



}
//var modifierTestArray = [];
function spawnCreeps(){
	//console.log("Spawning Creeps");
	tempCreep = new Creep(wave,"Basic",imgSize*getRandomArbitrary(0,1),imgSize*getRandomArbitrary(spacing,spacing+1),modifierTestArray,airdragon);
	tempCreep.dir = 1;
	tempCreep.currentImg = getRandomInt(0,7);
	Creeps.push(tempCreep);
	tempCreep = new Creep(wave,"Basic",imgSize*getRandomArbitrary(GRID_WIDTH-2,GRID_WIDTH-1),imgSize*getRandomArbitrary(GRID_HEIGHT-(spacing*2+1),GRID_HEIGHT-(spacing*2)),modifierTestArray,airdragon);
	tempCreep.dir = 3;
	tempCreep.currentImg = getRandomInt(0,7);
	Creeps.push(tempCreep);
	
	Creeps.sort(function(a,b) { return parseFloat(a.locY) - parseFloat(b.locY) } );
}

	/***************************************************/	
	/***************************************************/
	/************** Utility Functions ******************/
	/***************************************************/
	/***************************************************/
//Utility Functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeCanvas(){

	if(window.height > window.width){
		//portrait
		stage.width = window.innerWidth;
		stage.height = window.innerHeight;
	} else {
		//landscape
		stage.width = window.innerWidth;
		stage.height = window.innerHeight;
	}
	if(cameraLocX < 0){
		cameraLocX = 0;
	}
	if(cameraLocX > GRID_WIDTH*imgSize-cameraWidth){
		cameraLocX = GRID_WIDTH*imgSize-cameraWidth;
	}
	if(cameraLocY > GRID_HEIGHT*imgSize-cameraHeight){
		cameraLocY = GRID_HEIGHT*imgSize-cameraHeight;
	}
	if(cameraLocY < 0){
		cameraLocY = 0;
	}
	
}

	/***************************************************/	
	/***************************************************/
	/************** TIME FUNCTIONS *********************/
	/***************************************************/
	/***************************************************/
//Horrible Timer Function
function timeTracker(){
	sec = sec + 1;
	if (sec == 60) {
		sec = 0;
		min = min + 1
		if (min == 60) {
			min = 0;
			hour = hour + 1;
		}
	}
	var t = setTimeout(function(){timeTracker},999);
}

function getTime() {
    var today=new Date();

    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    //document.getElementById('txt').innerHTML = h+":"+m+":"+s;
    //var t = setTimeout(function(){getTime()},500);
	return [h,m,s];
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


/********************************************************/
/***************** Touch Functions **********************/
/********************************************************/
var actualX;
var actualY;
function handleStart(evt) {
	evt.preventDefault();
	if (!gameOver) {
		//document.getElementById("demo").innerHTML  = "Start";
		touched = true;
		console.log("touchstart.");
		logMessage = "Touch Started";
		startX = evt.changedTouches[0].screenX;
		startY = evt.changedTouches[0].screenY;
		var touches = evt.changedTouches;
		//ctx.fillStyle = "black";
		//ctx.fillRect(0, 0, stage.width, stage.height);	
		//for (var i=0; i < touches.length;i++){
		//	log("tochstart:"+i+"...");
		//	ongoingTouches.push(copyTouch(touches[i]));
		//	var color = colorForTouch(touches[i]);
		//	ctx.beginPath();
		//	ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2*Math.PI, false); //A circle at the start
		//	ctx.fillStyle = color;
		//	ctx.fill();
		//	}
		//	console.log("touchstart:"+i+".");
		//
		//touchX = touches[0].screenX;
		//touchY = touches[0].screenX;
		actualX = startX + cameraLocX;
		actualY = startY + cameraLocY;
		if(!touchmoved && !purchasing){
		
			for(var i = 0; i < Grid.length; i++){
				//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML  + "<br>" + i;
				//document.getElementById("onEnd").innerHTML  = "ActualX: " + actualX + "<br>ActualY: " + actualY;
				// document.getElementById("onEnd").innerHTML  = "<br>" + actualX + " > " + Grid[i].locX + " && " +  actualX + " < " + (Grid[i].locX + Grid[i].size);
				if(actualX > Grid[i].locX && actualX < (Grid[i].locX + Grid[i].size)){
				//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML + "<br>It is Within the X range";
					if(actualY > Grid[i].locY && actualY < (Grid[i].locY + Grid[i].size)){
						//document.getElementById("onEnd").innerHTML  = "Gride square " + i + " has been clicked!";
						selectedTile = i;
						if(Grid[selectedTile].tower == -1 && Grid[selectedTile].buildable){
							purchasing = true;
						}
					}
				}
			}
		}
		if(purchasing){
			if(selectedTile != -1){
				if(Grid[selectedTile].tower == -1){
					if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX-imgSize && actualX < Grid[selectedTile].locX){
						//Green purchase clicking
						console.log("Green Clicked");
						if (player.cash >= 50) {
							console.log("Creating Tower");
							player.cash = player.cash - 50;
							tempTow = new Tower("green",Grid[selectedTile].locX,Grid[selectedTile].locY);
							Grid[selectedTile].tower = Towers.push(tempTow)-1;
						}
						purchasing = false;
					} else if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX+imgSize && actualX < Grid[selectedTile].locX+imgSize*2){
						//Cancel button clicked
						selectedTile = -1;
						purchasing = false;
						console.log("Cancelling");
					}
				} else {
					//something went wrong
					console.log("AHHHHH!!!!");
					purchasing = false;
				}
			}
		}
		touchmoved = false;
		ongoingTouches.splice(idx, 1);  // remove it; we're done
	} else {
		ongoingTouches.splice(idx, 1);  // remove it; we're done
		window.location = "index.html";
	}
	
}

function handleMove(evt) {
		evt.preventDefault();
		touchmoved = true;
		purchasing = false;
		var touches = evt.changedTouches;
		//document.getElementById("demo").innerHTML  = "Moving";
		logMessage = "Touched Moved";
		cameraLocX = cameraLocX +(startX - touches[0].screenX)
		startX = touches[0].screenX;
		cameraLocY = cameraLocY +(startY - touches[0].screenY)
		startY = touches[0].screenY;
		if(cameraLocX < 0){
			cameraLocX = 0;
		}
		if(cameraLocX > GRID_WIDTH*imgSize-cameraWidth){
			cameraLocX = GRID_WIDTH*imgSize-cameraWidth;
		}
		if(cameraLocY > GRID_HEIGHT*imgSize-cameraHeight){
			cameraLocY = GRID_HEIGHT*imgSize-cameraHeight;
		}
		if(cameraLocY < 0){
			cameraLocY = 0;
		}
}

function handleEnd(evt) {
	evt.preventDefault();
	logMessage("Touched Ended");
	
	var touches = evt.changedTouches;
	
		
	//touchX = touches[0].screenX;
	//touchY = touches[0].screenX;
	actualX = startX + cameraLocX;
	actualY = startY + cameraLocY;
	if (!touchmoved && !purchasing) {
		for(var i = 0; i < Grid.length; i++){
			if(actualX > Grid[i].locX && actualX < (Grid[i].locX + Grid[i].size)){
			//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML + "<br>It is Within the X range";
				if(actualY > Grid[i].locY && actualY < (Grid[i].locY + Grid[i].size)){
					//document.getElementById("onEnd").innerHTML  = "Gride square " + i + " has been clicked!";
					selectedTile = i;
					if(Grid[selectedTile].tower == -1){
						purchasing = true;
					}
				}
			}
		}
	}
	if(purchasing){
		if(selectedTile != -1){
			if(Grid[selectedTile].tower == -1){
				if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX-imgSize && actualX < Grid[selectedTile].locX){
					//Green purchase clicking
					console.log("Green Clicked");
					
					
					console.log("Creating Tower");
					tempTow = new Tower("green",Grid[selectedTile].locX,Grid[selectedTile].locY);
					Grid[selectedTile].tower = Towers.push(tempTow)-1;
					
					
					purchasing = false;
				} else if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX+imgSize && actualX < Grid[selectedTile].locX+imgSize*2){
					//Cancel button clicked
					selectedTile = -1;
					purchasing = false;
					console.log("Cancelling");
				}
			} else {
				//something went wrong
				console.log("AHHHHH!!!!");
				purchasing = false;
			}
		}
	}
	touchmoved = false;
	ongoingTouches.splice(idx, 1);  // remove it; we're done
}

function handleCancel(evt) {
	evt.preventDefault();
	logMessage = "Touched Canceled";
	var touches = evt.changedTouches;
	touched = false;
	touchmoved = false;
	for (var i=0; i < touches.length; i++) {
		ongoingTouches.splice(i, 1);  // remove it; we're done
	}
}

//Util
function colorForTouch(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}
 
function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i=0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}
	
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}



/*******************************************************/
/***************** Mouse Movement **********************/
/*******************************************************/
 function mouseStart(evt) {

	evt.preventDefault();
	if (!gameOver) {	
		mouseIsDown = true;
		//console.log("touchstart.");
		startX = evt.screenX;
		startY = evt.screenY;
		
		//document.getElementById("onStart").innerHTML  = "Started <br> StartX = " + startX + "&#09 startY = " + startY;
	} else {
		window.location = "index.html";
	}	
}

function mouseMove(evt) {
	if(mouseIsDown){
		evt.preventDefault();
		mouseMoved = true;
		purchasing = false;
		cameraLocX = cameraLocX +(startX - evt.screenX)
		startX = evt.screenX;
		cameraLocY = cameraLocY +(startY - evt.screenY)
		startY = evt.screenY;
		//document.getElementById("onMove").innerHTML  = "Moving <br> StartX = " + startX + "    startY = " + startY;
		if(cameraLocX < 0){
			cameraLocX = 0;
		}
		if(cameraLocX > GRID_WIDTH*imgSize-cameraWidth){
			cameraLocX = GRID_WIDTH*imgSize-cameraWidth;
		}
		if(cameraLocY > GRID_HEIGHT*imgSize-cameraHeight){
			cameraLocY = GRID_HEIGHT*imgSize-cameraHeight;
		}
		if(cameraLocY < 0){
			cameraLocY = 0;
		}
	}
}

function mouseEnd(evt) {
	evt.preventDefault();
	mouseIsDown = false;
	//document.getElementById("onEnd").innerHTML  = "End <br> " + mouseMoved;
	//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML  + "End <br> " + mouseMoved;
	actualX = evt.pageX + cameraLocX;
	actualY = evt.pageY + cameraLocY;
	//See if player clicked a grid square
	if(!mouseMoved && !purchasing){
	
		for(var i = 0; i < Grid.length; i++){
			//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML  + "<br>" + i;
			//document.getElementById("onEnd").innerHTML  = "ActualX: " + actualX + "<br>ActualY: " + actualY;
			// document.getElementById("onEnd").innerHTML  = "<br>" + actualX + " > " + Grid[i].locX + " && " +  actualX + " < " + (Grid[i].locX + Grid[i].size);
			if(actualX > Grid[i].locX && actualX < (Grid[i].locX + Grid[i].size)){
			//document.getElementById("onEnd").innerHTML  = document.getElementById("onEnd").innerHTML + "<br>It is Within the X range";
				if(actualY > Grid[i].locY && actualY < (Grid[i].locY + Grid[i].size)){
					//document.getElementById("onEnd").innerHTML  = "Gride square " + i + " has been clicked!";
					selectedTile = i;
					if(Grid[selectedTile].tower == -1 && Grid[selectedTile].buildable){
						purchasing = true;
					}
				}
			}
		}
	}
	if(purchasing){
		if(selectedTile != -1){
			if(Grid[selectedTile].tower == -1){
				if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX-imgSize && actualX < Grid[selectedTile].locX){
					//Green purchase clicking
					console.log("Green Clicked");
					if (player.cash >= 50) {
						console.log("Creating Tower");
						player.cash = player.cash - 50;
						tempTow = new Tower("green",Grid[selectedTile].locX,Grid[selectedTile].locY);
						Grid[selectedTile].tower = Towers.push(tempTow)-1;
					}
					purchasing = false;
				} else if(actualY > Grid[selectedTile].locY-imgSize && actualY < Grid[selectedTile].locY && actualX > Grid[selectedTile].locX+imgSize && actualX < Grid[selectedTile].locX+imgSize*2){
					//Cancel button clicked
					selectedTile = -1;
					purchasing = false;
					console.log("Cancelling");
				}
			} else {
				//something went wrong
				console.log("AHHHHH!!!!");
				purchasing = false;
			}
		}
	}
	mouseMoved = false;
	//document.getElementById("onEnd").innerHTML  = "End <br> StartX = " + startX + "    startY = " + startY;
}

function mouseCancel(evt) {
	evt.preventDefault();
	mouseIsDown = false;
	mouseMoved = false;
 // document.getElementById("onEnd").innerHTML  = "End <br> StartX = " + startX + "    startY = " + startY;
}
