class Bush {
  constructor(theGame, x, y, scale, spriteChoice) {
    Object.assign(this, { theGame, x, y, scale, spriteChoice })
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");

    this.maxHealth = 100;
    this.health = 100;
    this.subHealth = 0;
    this.regenTimer = 20;

    this.scale = 1;
    this.radius = 13*this.scale;
    this.visualRadius = 100;

    this.state = 1;

    this.isSelected = false;
    this.myFaction = "resource";
    this.description = "your minion's will gather food from this";
    this.myType = "BUSH";

    this.defineDefaultValues();
    this.chooseSprite(this.spriteChoice);

    this.healthbar = new HealthBar(this.theGame, this);
    this.berrieBar = new HealthBar(this.theGame, this);

    this.center = {
      x: this.x + this.radius,
      y: this.y + this.radius
    }

    this.elapsedTime = 0;

    this.theCamera = this.theGame.theSM;
    this.thePlayer = this.theCamera.thePlayer;
  };

  updateMe() {
      this.elapsedTime += this.theGame.clockTick;
      if (this.subHealth >= this.regenTimer) {
          this.health = this.maxHealth;
          this.subHealth = 0;
      }
      if (this.elapsedTime > 1 && this.health < this.maxHealth) {
          this.subHealth += (this.health/this.maxHealth); //making the bush regrow faster the more health you leave it.
          this.elapsedTime = 0;
      }
      if(this.health <= 0) {
        this.state = 0;
      }
      this.isSelected = (this.thePlayer.selected == this);
  };

  drawMe(ctx) {
    ctx.drawImage(
      this.spritesheet,
      this.sx, this.sy,
      this.sw, this.sh,
      this.x - this.theGame.theCamera.x,
      this.y - this.theGame.theCamera.y,
      22 * this.scale,
      22 * this.scale
    );

    if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.fillStyle = "red";
      ctx.font = '16px "Playfair Display SC'
      ctx.fillText(Math.round(this.subHealth) + "/" + this.regenTimer, this.x - this.radius/3, this.y + this.radius*3);
      ctx.stroke();
      ctx.restore();
    }

    this.healthbar.drawMe(ctx, this.health, this.maxHealth, 0);
    this.berrieBar.drawMe(ctx, this.subHealth, this.regenTimer, 1);
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "pink";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }

  //Sets the sprite for the bush
  chooseSprite(choice) {
    switch (choice) {
      case 0:
        this.sx = 142;
        this.sy = 800;
        this.sw = 37;
        this.sh = 31;
        break;
      case 1:
        this.sx = 192;
        this.sy = 808;
        this.sw = 30;
        this.sh = 23;
        break;
      case 2:
        this.sx = 237;
        this.sy = 805;
        this.sw = 37;
        this.sh = 26;
        break;
      case 3:
        this.sx = 294;
        this.sy = 818;
        this.sw = 20;
        this.sh = 13;
        break;
    }
  };

  // Helper method for undefined values with the purpose of decluttering the constructor.
  defineDefaultValues() {
    if (this.scale == undefined || this.scale <= 0) {
      this.scale = 1;
    }

    if (this.spriteChoice == undefined || this.spriteChoice < 0 || this.spriteChoice > 3) {
      this.spriteChoice = randomInt(3);
    }
  };

};
