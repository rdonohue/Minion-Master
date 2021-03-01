class Rock {
  constructor(game, x, y, scale, spriteChoice) {
    Object.assign(this, { game, x, y, scale, spriteChoice })
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");
    this.health = 100;
    this.maxHealth = 100;
    this.subHealth = 0;
    this.removeFromWorld = false;
    this.radius = 20;
    this.visualRadius = 100;
    this.ready = true;

    this.defineDefaultValues();
    this.chooseSprite(this.spriteChoice);

    this.healthbar = new HealthBar(this.game, this);
    this.elapsedTime = 0;
  };

  updateMe() {
      this.elapsedTime += this.game.clockTick;
  };

  drawMe(ctx) {
    ctx.drawImage(this.spritesheet,
                  this.sx, this.sy,
                  this.sw, this.sh,
                  this.x - this.game.camera.x,
                  this.y - this.game.camera.y,
                  24 * this.scale,
                  24 * this.scale);
      this.healthbar.drawMe(ctx);
  };

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
