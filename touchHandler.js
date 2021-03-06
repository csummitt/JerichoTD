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
		touchX = touches[i].pageX;
		touchY = touches[i].pageY;
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