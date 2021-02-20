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

class GuardTower {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y });

      this.myName = "cave";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");

      this.state = 0;  // 0 = idle, 1 = destroyed

      this.healthbar = new HealthBar(this);

    //Stats
      this.health = 90;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;

      this.dead = false;
      this.removeFromWorld = false;
      this.xOriginLoc = x;
      this.yOriginLoc = y;
      this.baseWidth = 1;
      this.baseHeight = 1;

  };

  updateMe() {
      if (this.health <= 0) {
        this.dead = true;
        this.removeFromWorld = true;
      }
  };

  drawMe(ctx) {
      //don't forget to subtract this.game.camera.x and this.game.camera.y from the respective coordinates.
  };
};

class HomeBase {
  constructor(game, x, y, s) {
      Object.assign(this, {game, x, y, s});
      this.myName = "HomeBase";
      //we need to not have this redundency. I know they
      //eventually will be different but for now we should reduce to one I think.

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 1;  // 1 = idle, 0 = destroyed
      this.radius = 20;

      this.game = game;
      this.x = x;
      this.y = y;
      this.s = s;

      //Stats
      this.health = 200;
      this.defense = 3.0;
      this.attack = 0;
      this.agility = 0;
      this.intelligence = 0;

      this.healthbar = new HealthBar(this);

      this.animations = [];
      this.loadAnimations();
  };

  loadAnimations() {
       this.animations[0] = new Animator(
         this.spritesheet,
         0, 0, //pos
         this.radius, this.radius, //size
         1, 1, 0, //frame-info
         false, true //boolean type-info
       );
  }

  updateMe() {
      if (this.health <= 0) {
        this.state = 0;
      }
      // add more code here later about speed and physics
  };

  drawMe(ctx) {
    console.log("hi");
    ctx.drawImage(this.animations[0], this.x, this.y, this.s);
    this.healthbar.drawMe(ctx);
  };

}
