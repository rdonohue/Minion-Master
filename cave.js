class Cave {
    constructor(game, x, y) {
      Object.assign(this, { game, x, y });

      this.myName = "cave";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/cave.png");
      this.caveAnim = new Animator(this.spritesheet, 0, 0, 2714, 1762, 1, 1, 0, false, true);

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.scale = 0.07;
      this.radius = 20;

      this.healthbar = new HealthBar(this);

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
            this.game.spawnMe("ogre", this.x+50, this.y+50);
            this.elapsedTime = 0;
        }
    };


    drawMe(ctx) {
        this.caveAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        this.healthbar.drawMe(ctx);
    };

};
