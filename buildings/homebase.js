class HomeBase {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y });
      this.myType = "HomeBase";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");
      this.castleAnim = new Animator(this.spritesheet, 0, 0, 430, 461, 1, 1, 0, false, true);

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.radius = Math.floor(this.castleAnim.width / 2) - 50;

      //Stats
      this.health = 200;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;
      this.intelligence = 0;

      this.healthbar = new HealthBar(this.game, this);

      this.dead = false;
      this.removeFromWorld = false;
  };



  updateMe() {
      if (this.health <= 0) {
          this.state = 1;
          this.dead = true;
          this.removeFromWorld = true;
      }
      // add more code here later about speed and physics
  };

  drawMe(ctx) {
      this.castleAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 0.4);
      this.healthbar.drawMe(ctx);
  };

}
