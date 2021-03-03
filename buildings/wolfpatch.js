class Wolfpatch {
  constructor(theGame, x, y) {
    Object.assign(this, { theGame, x, y });

    this.myType = "STINKY DOG FLOWERS";
    this.description = "wolves wait to come out..."
    this.myFaction = "untouchable"; //minion AI needs this to NOT be a enemy

    // The draw parameters
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
    this.chooseSprite();

    //Stats

    this.isSelected = false;
    this.scale = 1;
    this.radius = params.TILE_W_H/2*this.scale;

    this.center = {
      x: this.x + this.radius,
      y: this.y + this.radius
    }

    this.state = 1;

    this.myHealthBar = new HealthBar(this.theGame, this);

    this.elapsedTime = 0;
    this.spawnTimer = 0;

    this.theCamera = this.theGame.theCamera;
  };

  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    if(this.spawnTimer == 0) {
      this.spawnTime = 60 + (randomInt(20) - 10); // Every 50 to 70 seconds see if a wolf spawns.
    }
    this.isSelected = (this.theGame.theSM.thePlayer.selected == this);

    if (this.elapsedTime >= this.spawnTime) {
      if (Math.random() <= 0.2) { //20% of spawning wolf.
        this.theGame.spawnMe("wolf", this.x+50, this.y+50);
        this.elapsedTime = 0;
      }
    }
  };


  drawMe(ctx) {
    ctx.drawImage(this.spritesheet,
      this.sx, this.sy,
      this.sw, this.sw,
      this.x - this.theCamera.x,
      this.y - this.theCamera.y,
      params.TILE_W_H*this.scale, params.TILE_W_H*this.scale);
    this.myHealthBar.drawMe(ctx, this.health, this.maxHealth, "health");
    this.myHealthBar.drawMe(ctx, this.elapsedTime, this.spawnTimer, "spawnTimer")

    //wolfpatchs are drawn out of order unforutnetely.
    this.theGame.entities.filter(
      entity => {
        return (entity && entity.myType != "STINKY DOG FLOWERS" &&
            ((entity.center.x - this.center.x) < (this.radius + entity.radius)) &&
            ((entity.center.y - this.center.y) < (this.radius + entity.radius)))
      }
      ).forEach((entity) => { //have to re-draw entities above us :<
        entity.drawMe(ctx);
      }
    );

    if(this.isSelected || params.DEBUG) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath(); //draw own radius.
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  };

  chooseSprite() {
    let choice = randomInt(2);
    switch (choice) {
      case 0:
        this.sx = 1405;
        this.sy = 1568;
        this.sw = params.TILE_W_H;
        this.sh = params.TILE_W_H;
        break;
      case 1:
        this.sx = 1405 + params.TILE_W_H;
        this.sy = 1568;
        this.sw = params.TILE_W_H;
        this.sh = params.TILE_W_H;
        break;
      case 2:
        this.sx = 1405;
        this.sy = 1568 + params.TILE_W_H;
        this.sw = params.TILE_W_H;
        this.sh = params.TILE_W_H;
        break;
    }
  }

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "pink";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }
};
