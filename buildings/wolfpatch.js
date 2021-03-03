class Wolfpatch {
    constructor(theGame, x, y) {
      Object.assign(this, { theGame, x, y });

      this.myType = "STINKY DOG FLOWERS";
      this.myFaction = "enemy";

      // The draw parameters
      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
      this.chooseSprite();

      this.healthbar = new HealthBar(this.theGame, this);

      //Stats
      this.health = 200;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.removeFromWorld = false;

      this.elapsedTime = 0;
    };

    updateMe() {
        this.elapsedTime += this.theGame.clockTick;
        let summonAwoo = randomInt(4); //20% chance to spawn a wolf
        let spawnTime = 60 + (randomInt(20) - 10); // Every 50 to 70 seconds see if a wolf spawns.
        if (this.health <= 0) {
            this.dead = true;
            this.removeFromWorld = true;
        }

        if (this.elapsedTime >= spawnTime) {
          if (summonAwoo < 1) {
            this.theGame.spawnMe("wolf", this.x+50, this.y+50);
          }
            this.elapsedTime = 0;
        }
    };


    drawMe(ctx) {
        ctx.drawImage(this.spritesheet, this.sx, this.sy, this.sw, this.sh, this.x - this.theGame.camera.x, this.y - this.theGame.camera.y, params.TILE_W_H, params.TILE_W_H);
        this.healthbar.drawMe(ctx);
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

};
