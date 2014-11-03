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