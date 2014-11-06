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
var imgSize = 32;
var GRID_WIDTH = 1920/imgSize;
var GRID_HEIGHT = 1920/imgSize;

//Tile Images
var PATH_TILE_GRASS = "game/assets/img/grass.jpg";
var PATH_TILE_UNBUILD = "game/assets/img/unbuildgrass.jpg";
var PATH_TILE_PATH = "game/assets/img/path.jpg";


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

var Grid = [];
var Towers = [];
var Creeps = [];

var airdragon = [];
var wdragon = [];
var fdragon = [];
var gdragon = [];
var bdragon = [];

var spacing = 3;
var buildArea = (GRID_WIDTH-spacing*6)/2;

var ongoingTouches = new Array();


/***************************************************/
/***************************************************/
/***************************************************/


/***************************************************/
/******************* OBJECTS ***********************/
/***************************************************/

var Tile = function(path,build,x,y,size){
		this.pathable = path;
		this.buildable = build;
		this.size = size;
		this.locX = x*size;
		this.locY = y*size;
		this.img = new Image();
		this.spawn = false;
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
	stage.addEventListener('touchend', handleEnd, false);
	stage.addEventListener('touchcancel', handleCancel, false);
	stage.addEventListener('touchleave', handleEnd, false);
	stage.addEventListener('touchmove', handleMove, false);
	
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
	
	
	//sleepFor(10000);
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

		waveSetup();
		updateTime = new Date().getTime();
		gameloop = setInterval(update, TIME_PER_FRAME);	
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
	updateTime = updateTime - new Date().getTime();
	updateTimeTotal = updateTimeTotal + updateTime;
	updateTime = new Date().getTime();
	updateCount = updateCount + 1;
	
	cameraWidth = stage.width;//960;
	cameraHeight = stage.height;//540;
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
						//ctx.font = '10pt Calibri';
						//ctx.fillStyle = 'red';
						//ctx.fillText(""+i, Grid[i].locX-cameraLocX+1,Grid[i].locY-cameraLocY+imgSize/2); //Test To see Grid Number
					}
				}
			}
		}
	}
	
	//Draw Tower Sprites
	for(var i = 0; i < Towers.length; i++){
		if(Towers[i].locX+Towers[i].size >= cameraLocX){
			if(Towers[i].locX <= cameraLocX + cameraWidth){
				if(Towers[i].locY+Towers[i].size >= cameraLocY){
					if(Towers[i].locY <= cameraLocY + cameraHeight){
						ctx.drawImage(Towers[i].img,Towers[i].locX-cameraLocX,Towers[i].locY-cameraLocY,imgSize,imgSize);
						//ctx.strokeText(""+i, Grid[i].locX-cameraLocX+1,Grid[i].locY-cameraLocY+imgSize/2); //Test To see Grid Number
					}
				}
			}
		}
	}
	
	//Draw Creep  
	console.log("Number of Creeps: " + Creeps.length);
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
	
	
	//Draw HUD
	ctx.font = '20pt Calibri';
	ctx.fillStyle = 'yellow';
	//ctx.fillText("Camera X: " + cameraLocX + " Camera Y: " + cameraLocY,stage.width*0.1,stage.height*0.05);
	ctx.fillText("Average Update Time: " + (-1)*updateTimeTotal/updateCount,stage.width*0.1,stage.height*0.05);
	//ctx.fillText("Camera width: " + stage.width + " Camera Height: " + stage.height,stage.width*0.1,stage.height*0.15);
	
	
	//Tower Movement
	
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
			if(Creeps[i].locX >= getRandomArbitrary(GRID_HEIGHT-(spacing*2+1),GRID_HEIGHT-(spacing*2))*imgSize){
				Creeps[i].dir = Creeps[i].dir + 1;
				//console.log("Direction " + Creeps[i].dir);
			}
		} else if (Creeps[i].dir == 2){
			Creeps[i].locY = Creeps[i].locY + (Creeps[i].baseSpeed/(TIME_PER_FRAME));//*2))/3;
			if(Creeps[i].locY >= getRandomArbitrary(GRID_HEIGHT-(spacing*2+1),GRID_HEIGHT-(spacing*2))*imgSize){
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
}



//Creep Spawner
function waveSetup(){
	console.log("Wave is Setup");
	clearInterval(timerspawnDelay);
	clearInterval(timerwaveSpawner);
	wave = wave + 1;
	
	timerwaveSpawner = setTimeout(waveSpawner, 15000);
}
var modifierTestArray = [];
function waveSpawner()
{
	console.log("In Wave " + wave + " Spawner");
	clearInterval(waveSetup);
	timerwaveSetup = setTimeout(waveSetup,20000);
	timerspawnDelay = setInterval(spawnCreeps,spawnDelay);
	



}
//var modifierTestArray = [];
function spawnCreeps(){
	console.log("Spawning Creeps");
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
/*
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      var canvas =stage;
      var context = ctx;

      canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);//writeMessage(canvas, message);
      }, false);

*/	

//Touch Functions
function handleStart(evt) {
	evt.preventDefault();
	console.log("touchstart.");
	startX = evt.changedTouches[0].pageX;
	startY = evt.changedTouches[0].pageY;
	/* var touches = evt.changedTouches;
	//ctx.fillStyle = "black";
	//ctx.fillRect(0, 0, stage.width, stage.height);	
	for (var i=0; i < touches.length;i++){
		log("tochstart:"+i+"...");
		ongoingTouches.push(copyTouch(touches[i]));
		//var color = colorForTouch(touches[i]);
		//ctx.beginPath();
		//ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2*Math.PI, false); //A circle at the start
		//ctx.fillStyle = color;
		//ctx.fill();
		
		console.log("touchstart:"+i+".");
	} */

}

function handleMove(evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	
	
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
  log("touchend/touchleave.");
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if(idx >= 0) {
      //ctx.lineWidth = 4;
      //ctx.fillStyle = color;
      //ctx.beginPath();
      //ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      //ctx.lineTo(touches[i].pageX, touches[i].pageY);
      //ctx.fillRect(touches[i].pageX-4, touches[i].pageY-4, 8, 8);  // and a square at the end
	  touchX = touches[i].pageX;
	  touchY = touches[i].pageY;
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  var touches = evt.changedTouches;
  
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
