class InteriorGrass {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
        this.interiorX = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.interiorY = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.buildInterior();
    };

    updateMe() {

    };

    // drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
    drawMe(ctx) {
      var sx, sy, dx, dy;
      for (var i = 0; i < params.PLAY_HEIGHT / params.TILE_W_H - 2; i++) {
        for (var j = 0; j < params.PLAY_WIDTH / params.TILE_W_H - 2; j++) {
          sx = this.interiorX[i][j];
          sy = this.interiorY[i][j];
          dx = this.x + j * params.TILE_W_H;
          dy = this.y + i * params.TILE_W_H;
          ctx.drawImage(this.spritesheet, sx, sy, params.TILE_W_H, params.TILE_W_H, dx - this.game.camera.x, dy - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        }
      }
    };

    buildInterior() {
      const intGrassX = [46, 110, 174, 110];
      const intGrassY = [1250, 1250, 1250, 1314];
      var intGrassSelection = randomInt(4);
      for (var i = 0; i < params.PLAY_HEIGHT / params.TILE_W_H - 2; i++) {
        for (var j = 0; j < params.PLAY_WIDTH / params.TILE_W_H - 2; j++) {
          this.interiorX[i][j] = intGrassX[intGrassSelection];
          this.interiorY[i][j] = intGrassY[intGrassSelection];
          intGrassSelection = randomInt(4);
        }
      }
    };
};

// This class draws the corners of the canvas for the game map.
// game: the current iteration of the GameEngine
// x: the origin point of the x (horizontal) cardinal direction for drawing
// y: the origin point of the y (vertical) cardinal direction for drawing
class Grasscorner {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
    };

    updateMe() {

    };

    // drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
    drawMe(ctx) {
        //top left corner
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, 0 - this.game.camera.x, 0 - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        let yCanvasOrigin = params.PLAY_HEIGHT - params.TILE_W_H;
        let xCanvasOrigin = params.PLAY_WIDTH - params.TILE_W_H;

        //bottom left corner
        ctx.save();
        ctx.scale(1,-1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, 0 - this.game.camera.x, -yCanvasOrigin - params.TILE_W_H + this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();

        //top right corner
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, -xCanvasOrigin - params.TILE_W_H + this.game.camera.x, 0 - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();

        //bottom right corner
        ctx.save();
        ctx.scale(-1,-1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, -xCanvasOrigin - params.TILE_W_H + this.game.camera.x, -yCanvasOrigin - params.TILE_W_H + this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();
    };
};

// This class draws the along the walls of the canvas for the game map.
// game: the current iteration of the GameEngine
// x: the origin point of the x (horizontal) cardinal direction for drawing
// y: the origin point of the y (vertical) cardinal direction for drawing
class Vertwall {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
    };

    updateMe() {

    };

    // drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
    drawMe(ctx) {
      for (var i = 0; i < (params.PLAY_HEIGHT / params.TILE_W_H - 2); i++) {
          ctx.drawImage(this.spritesheet, 0, 1247, params.TILE_W_H, params.TILE_W_H, this.x - this.game.camera.x, this.y + i * params.TILE_W_H - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);

          ctx.save();
          ctx.scale(-1,1);
          // The dx here is a copy of the one in Grasscorner above.
          // -(this.x + (params.CANVAS_WIDTH - params.TILE_W_H)) = -(0 + (1024 - 64)) - 64
          // First it flips the original image and puts it off the canvas. The -params.TILE_W_H(64px) shifts it left to be visible once more.
          ctx.drawImage(this.spritesheet, 0, 1247, params.TILE_W_H, params.TILE_W_H, -(this.x + (params.PLAY_WIDTH - params.TILE_W_H)) - params.TILE_W_H + this.game.camera.x,
                        this.y + i * params.TILE_W_H - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
          ctx.restore();
      }
    };
};

// This class draws the along the walls of the canvas for the game map.
// game: the current iteration of the GameEngine
// x: the origin point of the x (horizontal) cardinal direction for drawing
// y: the origin point of the y (vertical) cardinal direction for drawing
class Horiwall {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
    };

    updateMe() {

    };

    // drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
    // Top Wall
    drawMe(ctx) {
      for (var i = 0; i < params.PLAY_WIDTH / params.TILE_W_H - 2; i++) {
        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(this.spritesheet, 0, 1247, params.TILE_W_H, params.TILE_W_H,
                      this.x - params.TILE_W_H - this.game.camera.y, //dx
                      (this.y - params.TILE_W_H * 2) - i * params.TILE_W_H + this.game.camera.x, //dy
                      params.TILE_W_H, params.TILE_W_H);

        // The dx here is a copy of the one in Grasscorner above.
        // -(this.x + (params.CANVAS_WIDTH - params.TILE_W_H)) = -(0 + (1024 - 64)) - 64
        // First it flips the original image and puts it off the canvas. The -64 shifts it left to be visible once more.
        // ctx.drawImage(this.spritesheet, 0, 1247, params.TILE_W_H, params.TILE_W_H, -(this.x - params.TILE_W_H) - params.TILE_W_H, params.CANVAS_HEIGHT + i * params.TILE_W_H, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();
      }

      // Bottom Wall
      for (var i = 0; i < params.PLAY_WIDTH / params.TILE_W_H - 2; i++) {
        ctx.save();
        ctx.translate(params.TILE_W_H, params.PLAY_HEIGHT - params.TILE_W_H);
        ctx.rotate(3 * (Math.PI / 2));
        ctx.drawImage(this.spritesheet, 0, 1247, params.TILE_W_H, params.TILE_W_H, 0 - params.TILE_W_H + this.game.camera.y, 0 + i * params.TILE_W_H - this.game.camera.x, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();
      }
    };

};



class Resources {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");
        this.interiorX = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.interiorY = Create2DArray(params.PLAY_HEIGHT / params.TILE_W_H - 2);
        this.resArray = [];
        this.drawArray = [];
        this.stones = randomInt(10) + 1
        this.berries = 0;
        this.state = 1;

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
        this.resArray[0] = new SpriteDimensional(267,102,51,57); //Stone 0
        this.resArray[1] = new SpriteDimensional(331,108,39,51); //Stone 1
        this.resArray[2] = new SpriteDimensional(392,102,40,57); //Stone 2
        this.resArray[3] = new SpriteDimensional(458,102,41,57); //Stone 3
        //Berries
        this.resArray[4] = new SpriteDimensional(142,800,37,31); //Berry 0
        this.resArray[5] = new SpriteDimensional(192,808,30,23); //Berry 1
        this.resArray[6] = new SpriteDimensional(237,805,37,26); //Berry 2
        this.resArray[7] = new SpriteDimensional(294,818,20,13); //Berry 3

        this.buildResources();

    };

    updateMe() {
    };

    drawMe(ctx) {
      for (var i = 0; i < 10; i++) {
        ctx.drawImage(this.spritesheet, this.drawArray[i].sx, this.drawArray[i].sy, this.drawArray[i].sw,
           this.drawArray[i].sh, this.drawArray[i].dx - this.game.camera.x, this.drawArray[i].dy - this.game.camera.y, params.TILE_W_H / 3, params.TILE_W_H / 3);
      }
    };

    //Randomly determines and stores stones and berry locations.
    buildResources() {
      var resSelect = randomInt(20);
      var sx, sy, sw, sh, dx, dy, i;
      i = 0;
      while (this.berries > 0 || this.stones > 0) {
        dx = this.x + randomInt(params.PLAY_WIDTH/ params.TILE_W_H - 2) * params.TILE_W_H;
        dy = this.y + randomInt(params.PLAY_HEIGHT / params.TILE_W_H - 2) * params.TILE_W_H;
        if (resSelect > 7 || (dx >= 500 && dx <= 930 && dy >= 300 && dy <= 761)) {
          //Do Nothing.
          //Randomizes the area, also prevents resources from being built on the castle.
        } else if (this.stones > 0 && resSelect <= 3) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new SpriteDimensional(sx,sy,sw,sh,dx,dy);
          this.stones--;
          i++;
        } else if ((this.berries > 0) && (resSelect > 3 && resSelect < 8)) {
          sx = this.resArray[resSelect].sx;
          sy = this.resArray[resSelect].sy;
          sw = this.resArray[resSelect].sw;
          sh = this.resArray[resSelect].sh;
          this.drawArray[i] = new SpriteDimensional(sx,sy,sw,sh,dx,dy);
          this.berries--;
          i++;
        }
        resSelect = randomInt(20);
      }
    };
};


// Class to store sprite sheet and canvas locations.
class SpriteDimensional {
  constructor(sx, sy, sw, sh, dx, dy) {
    Object.assign(this, {sx, sy, sw, sh, dx, dy})
    if (dx == undefined || dy == undefined) {
      dx = 0;
      dy = 0;
    }
  }
};

class Bush {
  constructor(sx, sy, sw, sh, dx, dy) {
    Object.assign(this, {sx, sy, sw, sh, dx, dy})
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.regen = 1;
    this.state = 1;
    this.myScale = 2;
    this.radius = 10;
    if (dx == undefined || dy == undefined) {
      dx = 0;
      dy = 0;
    }
  }
}

class Rock {
  constructor(sx, sy, sw, sh, dx, dy) {
    Object.assign(this, {sx, sy, sw, sh, dx, dy})
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.regen = 0;
    this.state = 1;
    this.myScale = 2;
    this.radius = 10;
    if (dx == undefined || dy == undefined) {
      dx = 0;
      dy = 0;
    }
  }
}
