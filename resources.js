class Resources {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");
        this.interiorX = Create2DArray(params.VERT_WALL_COUNT);
        this.interiorY = Create2DArray(params.VERT_WALL_COUNT);
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
        this.resArray[0] = new Rock(267,102,51,57); //Stone 0
        this.resArray[1] = new Rock(331,108,39,51); //Stone 1
        this.resArray[2] = new Rock(392,102,40,57); //Stone 2
        this.resArray[3] = new Rock(458,102,41,57); //Stone 3
        //Berries
        this.resArray[4] = new Bush(142,800,37,31); //Berry 0
        this.resArray[5] = new Bush(192,808,30,23); //Berry 1
        this.resArray[6] = new Bush(237,805,37,26); //Berry 2
        this.resArray[7] = new Bush(294,818,20,13); //Berry 3


        this.buildResources();

    };

    updateMe() {

    };

    drawMe(ctx) {
      for (var i = 0; i < 10; i++) {
        ctx.drawImage(this.spritesheet, this.drawArray[i].sx, this.drawArray[i].sy, this.drawArray[i].sw,
           this.drawArray[i].sh, this.drawArray[i].dx, this.drawArray[i].dy, params.TILE_W_H / 3, params.TILE_W_H / 3);
      }
    };

    //Randomly determines and stores stones and berry locations.
    buildResources() {
      var resSelect = randomInt(20);
      var sx, sy, sw, sh, dx, dy, i;
      i = 0;
      while (this.berries > 0 || this.stones > 0) {
        dx = this.x + randomInt(params.HORI_WALL_COUNT) * params.TILE_W_H;
        dy = this.y + randomInt(params.VERT_WALL_COUNT) * params.TILE_W_H;
        if (resSelect > 7 || (dx >= 500 && dx <= 930 && dy >= 300 && dy <= 761)) {
          //Do Nothing.
          //Randomizes the area, also prevents resources from being built on the castle.
        } else if (this.stones > 0 && resSelect <= 3) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new Rock(sx,sy,sw,sh,dx,dy);
          this.stones--;
          i++;
        } else if ((this.berries > 0) && (resSelect > 3 && resSelect < 8)) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new Bush(sx,sy,sw,sh,dx,dy);
          this.berries--;
          i++;
        }
        resSelect = randomInt(20);
      }

      for (var j = 0; j < this.drawArray.length; j++) {
          this.game.addEntity(this.drawArray[j]);
      }

    };

};

class Bush {
  constructor(sx, sy, sw, sh, dx, dy) {
    Object.assign(this, {sx, sy, sw, sh, dx, dy})
    if (dx == undefined || dy == undefined) {
      dx = 0;
      dy = 0;
    }

    this.health = 100;
    this.removeFromWorld = false;
    this.radius = 15;
    this.visualRadius = 100;

    this.healthbar = new HealthBar(this);
  };

  updateMe() {
      if (this.health <= 0) {
          this.removeFromWorld = true;
      }
  };

  drawMe(ctx) {
      this.healthbar.drawMe(ctx);
  };
};

class Rock {
  constructor(sx, sy, sw, sh, dx, dy) {
    Object.assign(this, {sx, sy, sw, sh, dx, dy})
    if (dx == undefined || dy == undefined) {
      dx = 0;
      dy = 0;
    }


    this.health = 100;
    this.removeFromWorld = false;
    this.radius = 15;
    this.visualRadius = 100;

    this.healthbar = new HealthBar(this);
  };

  updateMe() {
      if (this.health <= 0) {
          this.removeFromWorld = true;
      }
  };

  drawMe(ctx) {
      this.healthbar.drawMe(ctx);
  };

};
