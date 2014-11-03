
function update_diff(obj){
	//alert(obj.name);   //Ask prof to see if alerts become toast
	var name = obj.name;
	var doc = obj.ownerDocument;
	var inputs = document.getElementsByTagName("input"); //or document.forms[0].elements;
	var labels = document.getElementsByTagName("label");
	var lbl;
	var cbs = []; //will contain all checkboxes 
	var HPDif = 1;
	var AMTDif = 1;
	var TYPDif = 0;
	var DMGDif = 1;
	for (var i = 0; i < inputs.length; i++) {  
	  if (inputs[i].type == "checkbox") {  
		cbs.push(inputs[i]);   
	  }  
	}  
	for (var i = 0; i < labels.length; i++){
			//alert(labels[i].id);
		if (labels[i].id === "diffMult"){
			lbl = labels[i];
			//alert(lbl.id);
		}
	}
var nbCbs = cbs.length; //number of checkboxes  
	if(name.indexOf("HP") >= 0){
		for(var i=0; i < nbCbs; i++){
			if((cbs[i].name.indexOf("HP") >= 0) && !(cbs[i].name === name)){
				cbs[i].checked = false;
			} else {
				if(cbs[i].checked){
					if(cbs[i].name.indexOf("HP") >= 0){
						HPDif = parseFloat(cbs[i].value);
						
						//alert(cbs[i].name + cbs[i].value);
					}
					if(cbs[i].name.indexOf("Amt") >= 0){
						AMTDif = parseFloat(cbs[i].value);					
					}
					
					if(cbs[i].name.indexOf("Typ") >= 0){
						TYPDif = (TYPDif) + parseFloat(cbs[i].value);				
					}
					
					if(cbs[i].name.indexOf("Dmg") >= 0){
						DMGDif = parseFloat(cbs[i].value);
					}
				}
			}
			
		}
	} else if(name.indexOf("Amt") >= 0){
		for(var i=0; i < nbCbs; i++){
			if((cbs[i].name.indexOf("Amt") >= 0) && !(cbs[i].name === name)){
				cbs[i].checked = false;
			} else {
				if(cbs[i].checked){
					if(cbs[i].name.indexOf("HP") >= 0){
						HPDif = parseFloat(cbs[i].value);
						
						//alert(cbs[i].name + cbs[i].value);
					}
					if(cbs[i].name.indexOf("Amt") >= 0){
						AMTDif = parseFloat(cbs[i].value);					
					}
					
					if(cbs[i].name.indexOf("Typ") >= 0){
						TYPDif = TYPDif + parseFloat(cbs[i].value);				
					}
					
					if(cbs[i].name.indexOf("Dmg") >= 0){
						DMGDif = parseFloat(cbs[i].value);
					}
				}
			}
			
		}
	
	} else if(name.indexOf("Typ") >= 0){
		for(var i=0; i < nbCbs; i++){
			if(cbs[i].checked){
				if(cbs[i].name.indexOf("HP") >= 0){
						HPDif = cbs[i].value;
						
						//alert(cbs[i].name + cbs[i].value);
					}
					if(cbs[i].name.indexOf("Amt") >= 0){
						AMTDif = parseFloat(cbs[i].value);
					}
					
					if(cbs[i].name.indexOf("Typ") >= 0){
						TYPDif = TYPDif + parseFloat(cbs[i].value);	
						//alert(TYPDif);
					}
					
					if(cbs[i].name.indexOf("Dmg") >= 0){
						DMGDif = parseFloat(cbs[i].value);
					}
			}
			
		}
	
	} else if(name.indexOf("Dmg") >= 0){
		for(var i=0; i < nbCbs; i++){
			if((cbs[i].name.indexOf("Dmg") >= 0) && !(cbs[i].name === name)){
				cbs[i].checked = false;
			} else {
				if(cbs[i].checked){
					if(cbs[i].name.indexOf("HP") >= 0){
						HPDif = cbs[i].value;
						
						//alert(cbs[i].name + cbs[i].value);
					}
					if(cbs[i].name.indexOf("Amt") >= 0){
						AMTDif = parseFloat(cbs[i].value);
					}
					
					if(cbs[i].name.indexOf("Typ") >= 0){
						TYPDif = TYPDif + parseFloat(cbs[i].value);				
					}
					
					if(cbs[i].name.indexOf("Dmg") >= 0){
						DMGDif = parseFloat(cbs[i].value);
					}
				}
			}
			
		}
		
	}
	if(TYPDif == 0){
		TYPDif = 1;
	}
	//alert("HPDif = " + HPDif + " AMTDif = " + AMTDif + " TypDif = " + TYPDif + " DMGDif = " + DMGDif);
	var diffValue = (1 * HPDif * AMTDif * TYPDif * DMGDif).toFixed(2);
	lbl.innerHTML = "x"+diffValue;
	//alert(diffValue);

}



/*
// Check
document.getElementById("checkbox").checked = true;

//  Uncheck
document.getElementById("checkbox").checked = false;
*/