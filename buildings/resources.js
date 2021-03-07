class Resources {
  constructor(theGame, r, b, w) {
    Object.assign(this, { theGame, r, b});

    this.rocks = r + randomInt(r);
    this.bushs = b + randomInt(b);
    this.wolfPatchs = w;

    this.rockArray = [];
    this.bushArray = [];
    this.wolfPatchArray = [];

    this.buildResources(this.rocks, "ROCK", 0.2, 1);
    this.buildResources(this.bushs, "BUSH", 0.2, 1);
    this.buildResources(this.wolfPatchs, "STINKY DOG FLOWERS", 0.5, 0.5);
  };

  //Randomly determines and stores stones and berry locations.
  buildResources(num, type, bunchTendency, bunchDensity) {
    //bunchTendency gives the chance that a resource spawns in a bunch.
    //bunchDensity is the bunch's multiplier for how far apart they can be from one another.
    let failedAttempts = 0;

    //spawning rules
    let edgeBuffer = 40;
    let minDistanceFromBase = this.theGame.theBase.radius*2
    let spawningOptions = [];

    if(type == "ROCK") {
      spawningOptions = this.rockArray;
    } else if (type == "BUSH") {
      spawningOptions = this.bushArray;
    } else if (type == "STINKY DOG FLOWERS") {
      spawningOptions = this.wolfPatchArray;
    }

    while (num > 0 && failedAttempts < 10) {
      let dx, dy;
      if(Math.random() <= bunchTendency){
        if(spawningOptions.length > 0) {
          let randomIndex = randomInt(spawningOptions.length);
          let spawn = spawningOptions[randomIndex];
          // console.log(spawn);
          if(type == "STINKY DOG FLOWERS") {
            dx = spawn.x + randomInt(2) * params.TILE_W_H - params.TILE_W_H + (16 + randomInt(16) - 8)
            dy = spawn.y + randomInt(2) * params.TILE_W_H - params.TILE_W_H + (16 + randomInt(16) - 8);
          } else {
            dx = spawn.x + randomInt(spawn.radius*bunchDensity*2) - spawn.radius*bunchDensity;
            dy = spawn.y + randomInt(spawn.radius*bunchDensity*2) - spawn.radius*bunchDensity;
          }
        }
      }

      if(!(dy && dx)) {
        if(type == "STINKY DOG FLOWERS") {
          dx = randomInt((params.PLAY_WIDTH / params.TILE_W_H) - 2) * params.TILE_W_H + (16 + randomInt(16) - 8)
          dy = randomInt((params.PLAY_HEIGHT / params.TILE_W_H) - 2) * params.TILE_W_H + (16 + randomInt(16) - 8);
        } else {
          dx = edgeBuffer + randomInt(params.PLAY_WIDTH - edgeBuffer*2);
          dy = edgeBuffer + randomInt(params.PLAY_HEIGHT - edgeBuffer*2);
        }
      }

      let center = {
        x: dx,
        y: dy
      }

    }

};

class Bush {
  constructor(game, sx, sy, sw, sh, x, y) {
    Object.assign(this, { game, sx, sy, sw, sh, x, y})
    if (x == undefined || y == undefined) {
      x = 0;
      y = 0;
    }

    this.myType = "resource";

    this.health = 100;
    this.maxHealth = 100;
    this.subHealth = 0;
    this.removeFromWorld = false;
    this.radius = 5;
    this.visualRadius = 10;
    this.ready = true;

    this.healthbar = new HealthBar(this.game, this);
    this.elapsedTime = 0;
    this.dead = false;
  };

  updateMe() {
      this.elapsedTime += this.game.clockTick;
      if (this.subHealth == 100) {
          this.dead = false;
          this.health = this.subHealth;
          this.subHealth = 0;
      }
      if (this.elapsedTime > 1.6 && this.health <= 0 && this.subHealth < this.health) {
          this.dead = true;
          this.subHealth += 5;
          this.elapsedTime = 0;

      if (distance(center, this.theGame.theBase.center) < minDistanceFromBase) {
        failedAttempts++;
      } else {
        let newEntity;
        if (type == "STINKY DOG FLOWERS"){
          newEntity = new Wolfpatch(this.theGame, dx, dy)
          this.wolfPatchArray.push(newEntity);
        } else if (type == "ROCK") {
          newEntity = new Rock(this.theGame, dx, dy)
          this.rockArray.push(newEntity);
        } else if (type == "BUSH") {
          newEntity = new Bush(this.theGame, dx, dy)
          this.bushArray.push(newEntity);
        }
        this.theGame.addEntity(newEntity);
        spawningOptions.push(newEntity);
        num--;

      }
    }

  };
};
