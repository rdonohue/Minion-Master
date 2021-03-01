class Wolfpatch {
    constructor(game, x, y) {
      Object.assign(this, { game, x, y });

      this.myType = "STINKY DOG FLOWERS";
      this.myFaction = "enemy";

      // Draw parameters
      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
      this.sx = 1405;
      this.sy = 1568
      this.sw = params.TILE_W_H;
      this.sh = params.TILE_W_H;


      this.state = 0;  // 0 = idle, 1 = destroyed

      this.healthbar = new HealthBar(this.game, this);

      //Stats
      this.health = 200;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;

      this.dead = false;
      this.removeFromWorld = false;

      this.elapsedTime = 0;
    };

    updateMe() {
        this.elapsedTime += this.game.clockTick;

        if (this.health <= 0) {
            this.dead = true;
            this.removeFromWorld = true;
        }

        if (this.elapsedTime >= 10) {
            this.game.spawnMe("wolf", this.x+50, this.y+50);
            this.elapsedTime = 0;
        }
    };


    drawMe(ctx) {
        ctx.drawImage(this.spritesheet, this.sx, this.sy, this.sw, this.sh, this.x - this.game.camera.x, this.y - this.game.camera.y, params.TILE_W_H, params.TILE_W_H);
        this.healthbar.drawMe(ctx);
    };

};
