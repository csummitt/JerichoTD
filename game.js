//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = window.innerWidth;
stage.height = window.innerHeight;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;

var touchX = -5;
var touchY = -5;

window.addEventListener('resize', resizeCanvas, false);
//---------------
//Preloading ...
//---------------

//Setup Tile
var Tile = function(path,build,x,y,size){
		this.pathable = path;
		this.buildable = build;
		this.size = size;
		this.locX = x*size;
		this.locY = y*size;
		this.img = new Image();
		this.spawn = false;
	}
	

function setAssetReady()
{
	this.ready = true;
}

//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
//Setup Timers
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

var ongoingTouches = new Array();
function preloading()
{	
	clearInterval(preloader);
	//Register Touch Events
	stage.addEventListener("touchstart", handleStart, false);
	stage.addEventListener("touchend", handleEnd, false);
	stage.addEventListener("touchcancel", handleCancel, false);
	stage.addEventListener("touchleave", handleEnd, false);
	stage.addEventListener("touchmove", handleMove, false);
	
	
	//Create Grid
	for(var r = 0; r < 98; r++){
		for(var c = 0; c < 98; c++){
			if(r<6||r>91||(c<6 && r > 11)||(c>91 && r<86)){
				Grid[r*98+c] = new Tile(false,false,c,r,imgSize);
				Grid[r*98+c].img.src = PATH_TILE_UNBUILD;
			} else if ((r<12 && c < 92)||(c>5 && r > 85) ||c < 12||c>85||(c>45 && c<52)||(r>45 && r < 52)){
				Grid[r*98+c] = new Tile(true,false,c,r,imgSize);
				Grid[r*98+c].img.src = PATH_TILE_PATH;
			} else {
				Grid[r*98+c] = new Tile(false,true,c,r,imgSize);
				Grid[r*98+c].img.src = PATH_TILE_GRASS;
			}
		}
	}
	
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
		for(var i = 0; i < 32;i++){
	            tempImg = new Image()
	            if(i < 8){
	                tempImg.src = "game/assets/img/water-dragon/walking/water-walking-n000" + i + ".png";
	                wdragon[i] = tempImg;
	            } else if(i < 16){
	                tempImg.src = "game/assets/img/water-dragon/walking/water-walking-e000" + (i-8) + ".png"
	                wdragon[i] = tempImg;
	            } else if(i < 24){
	                tempImg.src = "game/assets/img/water-dragon/walking/water-walking-s000" + (i-16) + ".png"
	                wdragon[i] = tempImg;
	            } else {
	                tempImg.src = "game/assets/img/water-dragon/walking/water-walking-w000" + (i-24) + ".png"
	                wdragon[i] = tempImg;
	            }
	        }//end of water dragon
	        for(var i = 0; i < 32;i++){
	            tempImg = new Image()
	            if(i < 8){
	                tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-n000" + i + ".png";
	                fdragon[i] = tempImg;
	            } else if(i < 16){
	                tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-e000" + (i-8) + ".png"
	                fdragon[i] = tempImg;
	            } else if(i < 24){
	                tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-s000" + (i-16) + ".png"
	                fdragon[i] = tempImg;
	            } else {
	                tempImg.src = "game/assets/img/fire-dragon/walking/fire-walking-w000" + (i-24) + ".png"
	                fdragon[i] = tempImg;
	            }
	        }//end of fire dragon
	        for(var i = 0; i < 32;i++){
	            tempImg = new Image()
	            if(i < 8){
	                tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-n000" + i + ".png";
	                gdragon[i] = tempImg;
	            } else if(i < 16){
	                tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-e000" + (i-8) + ".png"
	                gdragon[i] = tempImg;
	            } else if(i < 24){
	                tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-s000" + (i-16) + ".png"
	                gdragon[i] = tempImg;
	            } else {
	                tempImg.src = "game/assets/img/gold-dragon/walking/gold-walking-w000" + (i-24) + ".png"
	                gdragon[i] = tempImg;
	            }
	        }//end of gold dragon
	        for(var i = 0; i < 32;i++){
	            tempImg = new Image()
	            if(i < 8){
	                tempImg.src = "game/assets/img/black-dragon/walking/black-walking-n000" + i + ".png";
	                bdragon[i] = tempImg;
	            } else if(i < 16){
	                tempImg.src = "game/assets/img/black-dragon/walking/black-walking-e000" + (i-8) + ".png"
	                bdragon[i] = tempImg;
	            } else if(i < 24){
	                tempImg.src = "game/assets/img/black-dragon/walking/black-walking-s000" + (i-16) + ".png"
	                bdragon[i] = tempImg;
	            } else {
	                tempImg.src = "game/assets/img/black-dragon/walking/black-walking-w000" + (i-24) + ".png"
	                bdragon[i] = tempImg;
	            }
	        }//end of black dragon

		waveSetup();
		gameloop = setInterval(update, TIME_PER_FRAME);	
}

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
						ctx.drawImage(Creeps[i].imgs[Creeps[i].dir*8+Creeps[i].currentImg],Creeps[i].locX-cameraLocX,Creeps[i].locY-cameraLocY,4*imgSize,4*imgSize);
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
	ctx.fillStyle = 'red';
	ctx.fillText("Touch X: " + touchX + " Touch Y: " + touchY,stage.width*0.1,stage.height*0.05);
	
	
	//Tower Movement
	
	//Projectile Movement
	
	//Creep Movement
	for(var i = 0; i < Creeps.length; i++){
		if(Creeps[i].dir == 0){
			Creeps[i].locY = Creeps[i].locY - (Creeps[i].baseSpeed/(TIME_PER_FRAME*2))/3;
			if(Creeps[i].locY <= getRandomArbitrary(5,8)*imgSize){
				Creeps[i].dir = Creeps[i].dir + 1;
				//console.log("Direction " + Creeps[i].dir);
			}
		} else if (Creeps[i].dir == 1){
			Creeps[i].locX = Creeps[i].locX + (Creeps[i].baseSpeed/(TIME_PER_FRAME*2))/3;
			if(Creeps[i].locX >= getRandomArbitrary(86,89)*imgSize){
				Creeps[i].dir = Creeps[i].dir + 1;
				//console.log("Direction " + Creeps[i].dir);
			}
		} else if (Creeps[i].dir == 2){
			Creeps[i].locY = Creeps[i].locY + (Creeps[i].baseSpeed/(TIME_PER_FRAME*2))/3;
			if(Creeps[i].locY >= getRandomArbitrary(86,89)*imgSize){
				Creeps[i].dir = Creeps[i].dir + 1;
				//console.log("Direction " + Creeps[i].dir);
			}
		} else {
			Creeps[i].locX = Creeps[i].locX - (Creeps[i].baseSpeed/(TIME_PER_FRAME*2))/3;
			if(Creeps[i].locX <= getRandomArbitrary(5,8)*imgSize){
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

function waveSpawner()
{
	console.log("In Wave " + wave + " Spawner");
	clearInterval(waveSetup);
	timerwaveSetup = setTimeout(waveSetup,20000);
	timerspawnDelay = setInterval(spawnCreeps,spawnDelay*2);
	



}
var modifierTestArray = [];
function spawnCreeps(){
	console.log("Spawning Creeps");
	tempCreep = new Creep(wave,"Basic",imgSize*getRandomArbitrary(0,1),imgSize*getRandomArbitrary(6.5,7.5),modifierTestArray,airdragon);
	tempCreep.dir = 1;
	tempCreep.currentImg = getRandomInt(0,7);
	Creeps.push(tempCreep);
	tempCreep = new Creep(wave,"Basic",imgSize*getRandomArbitrary(95,96),imgSize*getRandomArbitrary(86.5,87.5),modifierTestArray,airdragon);
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
	var touches = evt.changedTouches;
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
		
		console.og("touchstart:"+i+".");
	}

}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if(idx >= 0) {
      log("continuing touch "+idx);
     // ctx.beginPath();
     // log("ctx.moveTo("+ongoingTouches[idx].pageX+", "+ongoingTouches[idx].pageY+");");
      // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      // log("ctx.lineTo("+touches[i].pageX+", "+touches[i].pageY+");");
      // ctx.lineTo(touches[i].pageX, touches[i].pageY);
      // ctx.lineWidth = 4;
      // ctx.strokeStyle = color;
      // ctx.stroke();
	  touchX = touches[i].pageX;
	  touchY = touches[i].pageY;
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      log(".");
    } else {
      log("can't figure out which touch to continue");
    }
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
	
