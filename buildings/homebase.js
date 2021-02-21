class HomeBase {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y});
      this.myName = "HomeBase";
      //we need to not have this redundency. I know they
      //eventually will be different but for now we should reduce to one I think.

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 1;  // 1 = idle, 0 = destroyed
      this.radius = this.sw/2;

      this.sw = 450;
      this.sh = 460;

      this.game = game;
      this.x = x;
      this.y = y;
      this.scale = 0.3;

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
         this.sw, this.sh, //size
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
    // console.log(this.animations[0].spritesheet);
    this.animations[0].drawFrame(this.game.clockTick, ctx,
      this.x - this.game.camera.x,
      this.y - this.game.camera.y,
      this.scale);

    this.healthbar.drawMe(ctx);
  };

}
