class Rock {
  constructor(theGame, x, y, scale, spriteChoice) {
    Object.assign(this, { theGame, x, y, scale, spriteChoice })
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");

    this.health = 100;
    this.maxHealth = 100;

    this.removeFromWorld = false;
    this.scale = 1;
    this.radius = 13*this.scale;
    this.visualRadius = 100;
    this.ready = true;
    this.isSelected = false;

    this.myFaction = "resource";
    this.myType = "BOULDER";

    this.defineDefaultValues();
    this.chooseSprite(this.spriteChoice);

    this.healthbar = new HealthBar(this.theGame, this);

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
      this.isSelected = (this.thePlayer.selected == this);
      if(this.health <= 0) {
        this.state = 0;
      }
  };

  drawMe(ctx) {
    ctx.drawImage(
      this.spritesheet,
      this.sx, this.sy,
      this.sw, this.sh,
      this.x - this.theGame.theCamera.x,
      this.y - this.theGame.theCamera.y,
      24 * this.scale,
      24 * this.scale
    );

    if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.fillStyle = "white";
      ctx.stroke();
    }

    this.healthbar.drawMe(ctx, this.health, this.maxHealth, 0);
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "brown";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }

  //Sets the sprite for the rock
  chooseSprite(choice) {
    switch (choice) {
      case 0:
        this.sx = 267;
        this.sy = 102;
        this.sw = 51;
        this.sh = 57;
        break;
      case 1:
        this.sx = 331;
        this.sy = 108;
        this.sw = 39;
        this.sh = 51;
        break;
      case 2:
        this.sx = 392;
        this.sy = 102;
        this.sw = 40;
        this.sh = 57;
        break;
      case 3:
        this.sx = 458;
        this.sy = 102;
        this.sw = 41;
        this.sh = 57;
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
