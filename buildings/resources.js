class Resources {
    constructor(theGame, x, y) {
        Object.assign(this, { theGame, x, y });
        this.rocks = randomInt(10) + 1
        this.berries = 0;

        // Create a fair ratio of stones to berry resources.
        if (this.rocks < 3) {
          this.rocks = 3;
          this.berries = 7;
        } else if (this.rocks > 7) {
          this.rocks = 7;
          this.berries = 3;
        } else {
          this.berries = 10 - this.rocks;
        }

        this.buildResources();
    };

    //Randomly determines and stores stones and berry locations.
    buildResources() {
      var resSelect = randomInt(20);
      var sx, sy, sw, sh, dx, dy;
      var i = 0;
      while (this.berries > 0 || this.rocks > 0) {
        dx = this.x + randomInt(params.PLAY_WIDTH / params.TILE_W_H - 2) * params.TILE_W_H + (16 + randomInt(16) - 8);
        dy = this.y + randomInt(params.PLAY_HEIGHT / params.TILE_W_H - 2) * params.TILE_W_H + (16 + randomInt(16) - 8);
        let center = {
          x: dx,
          y: dy
        }
        if (resSelect > 9 || distance(center, this.theGame.theBase) < this.theGame.theBase.radius*4) {
          //avoid putting resources near the base.

        // || (dx >= 500 && dx <= 930 && dy >= 300 && dy <= 761))
        // This is the former homebase location we had in the prototype build.
        // It needs some optimization with the homebase x, y, w, and h.

          //Do Nothing.
          //Randomizes the area, also prevents resources from being built on the castle.
        } else if (resSelect > 7 && resSelect <= 9) {
          //Bad luck, WOLFPATCH!
          this.theGame.addEntity(new Wolfpatch(this.theGame, dx, dy));
        } else if (this.rocks > 0 && resSelect <= 3) {
          this.theGame.addEntity(new Rock(this.theGame, dx, dy));
          this.rocks--;
          i++;
        } else if ((this.berries > 0) && (resSelect > 3 && resSelect < 8)) {
          this.theGame.addEntity(new Bush(this.theGame, dx, dy));
          this.berries--;
          i++;
        }
        resSelect = randomInt(20);
      }
    };

};
