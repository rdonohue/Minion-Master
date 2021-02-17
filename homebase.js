class HomeBase {
  constructor(game, x, y, w, h) {
      Object.assign(this, {game, x, y, w, h });
      this.myName = "HomeBase";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.radius = 20;

      //Stats
      this.health = 200;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;
      this.intelligence = 0;

      this.dead = false;
      this.removeFromWorld = false;
      this.xOriginLoc = x;
      this.yOriginLoc = y;
      this.baseWidth = w;
      this.baseHeight = h;

      this.animations = [];
      this.loadAnimations();
  };

  loadAnimations() {
       this.animations[0] = new Animator(this.spritesheet, 0, 0, this.baseWidth, this.baseHeight, 1, 1, 0, false, true);
  }

  updateMe() {
      if (this.health <= 0) {
          this.dead = true;
          this.removeFromWorld = true;
      }
      // add more code here later about speed and physics
  };

  drawMe(ctx) {
      this.animations[0].drawFrame(this.game.clockTick, ctx, this.xOriginLoc, this.yOriginLoc, 0.4);
  };

}
