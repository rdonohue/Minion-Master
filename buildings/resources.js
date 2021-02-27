class Resources {
    constructor(theGame, x, y) {
        Object.assign(this, { theGame, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");
        this.interiorX = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.interiorY = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.resArray = [];
        this.drawArray = [];
        this.stones = randomInt(10) + 1
        this.berries = 0;

        // Create a fair ratio of stones to berry resources.
        if (this.stones < 3) {
          this.stones = 3;
          this.berries = 7;
        } else if (this.stones > 7) {
          this.stones = 7;
          this.berries = 3;
        } else {
          this.berries = 10 - this.stones;
        }

        //Stones
        this.resArray[0] = new Rock(this.theGame,267,102,51,57); //Stone 0
        this.resArray[1] = new Rock(this.theGame,331,108,39,51); //Stone 1
        this.resArray[2] = new Rock(this.theGame,392,102,40,57); //Stone 2
        this.resArray[3] = new Rock(this.theGame,458,102,41,57); //Stone 3
        //Berries
        this.resArray[4] = new Bush(this.theGame,142,800,37,31); //Berry 0
        this.resArray[5] = new Bush(this.theGame,192,808,30,23); //Berry 1
        this.resArray[6] = new Bush(this.theGame,237,805,37,26); //Berry 2
        this.resArray[7] = new Bush(this.theGame,294,818,20,13); //Berry 3

        this.buildResources();
    };

    updateMe() {

    };

    drawMe(ctx) {
      for (var i = 0; i < 10; i++) {
        if(!this.drawArray[i].dead) {
          ctx.drawImage(this.spritesheet, this.drawArray[i].sx, this.drawArray[i].sy, this.drawArray[i].sw,
             this.drawArray[i].sh, this.drawArray[i].x - this.theGame.theCamera.x, this.drawArray[i].y - this.theGame.theCamera.y, params.TILE_W_H / 3, params.TILE_W_H / 3);
        }
      }
    };

    //Randomly determines and stores stones and berry locations.
    buildResources() {
      var resSelect = randomInt(20);
      var sx, sy, sw, sh, dx, dy, i;
      i = 0;
      while (this.berries > 0 || this.stones > 0) {
        dx = this.x + randomInt(params.PLAY_WIDTH / params.TILE_W_H - 2) * params.TILE_W_H + (16 + randomInt(16) - 8);
        dy = this.y + randomInt(params.PLAY_HEIGHT / params.TILE_W_H - 2) * params.TILE_W_H + (16 + randomInt(16) - 8);
        if (resSelect > 7 || (dx >= 500 && dx <= 930 && dy >= 300 && dy <= 761)) {
          //Do Nothing.
          //Randomizes the area, also prevents resources from being built on the castle.
        } else if (this.stones > 0 && resSelect <= 3) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new Rock(this.theGame,sx,sy,sw,sh,dx,dy);
          this.stones--;
          i++;
        } else if ((this.berries > 0) && (resSelect > 3 && resSelect < 8)) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new Bush(this.theGame,sx,sy,sw,sh,dx,dy);
          this.berries--;
          i++;
        }
        resSelect = randomInt(20);
      }

      for (var j = 0; j < this.drawArray.length; j++) {
          this.theGame.addEntity(this.drawArray[j]);
      }
    };

};

class Bush {
  constructor(theGame, sx, sy, sw, sh, x, y) {
    Object.assign(this, { theGame, sx, sy, sw, sh, x, y})
    if (x == undefined || y == undefined) {
      x = 0;
      y = 0;
    }
    this.camera = this.theGame.theSM;
    this.health = 20;
    this.maxHealth = 20;
    this.removeFromWorld = false;
    this.dead = false;
    this.baseWidth = 16;
    this.baseHeight = 16;
    this.scale = 1;
    this.radius = this.baseWidth*this.scale/2;
    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    this.visualRadius = 100;
    this.ready = true;

    this.healthbar = new HealthBar(this.theGame, this);
  };

  updateMe() {
      this.elapsedTime += this.theGame.clockTick;

      this.healthbar.updateMe();

      if(this.health < 0) {
        this.removeFromWorld = true;
        this.dead = true;
      }

      // if (this.elapsedTime > 1 && this.health > 0 && this.health < this.maxHealth) {
      //     this.health += this.regen;
      //     if(this.health > this.maxHealth) {
      //       this.health = this.maxHealth
      //     }
      //     this.elapsedTime = 0;
      // }
  };

  drawMe(ctx) {
    this.healthbar.drawMe(ctx);

    if(params.DEBUG || this.isSelected) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.camera.x, this.center.y - this.camera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();
    }
  };
};

class Rock {
  constructor(theGame, sx, sy, sw, sh, x, y) {
    Object.assign(this, { theGame, sx, sy, sw, sh, x, y})
    if (x == undefined || y == undefined) {
      x = 0;
      y = 0;
    }
    this.camera = this.theGame.theSM;
    this.health = 20;
    this.maxHealth = 20;
    this.removeFromWorld = false;
    this.dead = false;
    this.baseWidth = 16;
    this.baseHeight = 16;
    this.scale = 1;
    this.radius = this.baseWidth*this.scale/2;
    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    this.visualRadius = 100;
    this.ready = true;

    this.healthbar = new HealthBar(this.theGame, this);
    this.elapsedTime = 0;
  };

  updateMe() {
    this.elapsedTime += this.theGame.clockTick;

    this.healthbar.updateMe();

    if(this.health < 0) {
      this.removeFromWorld = true;
      this.dead = true;
    }
  };

  drawMe(ctx) {
    this.healthbar.drawMe(ctx);

    if(params.DEBUG || this.isSelected) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.camera.x, this.center.y - this.camera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();
    }
  };

};
