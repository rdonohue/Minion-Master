class HomeBase {
  constructor(game, x, y, s) {
      Object.assign(this, {game, x, y, s});
      this.myName = "HomeBase";
      this.myType = "HomeBase"; //we need to not have this redundency. I know they
      //eventually will be different but for now we should reduce to one I think.

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.radius = 20;

      //Stats
      this.health = 200;
      this.defense = 3.0;
      this.attack = 0;
      this.agility = 0;
      this.intelligence = 0;

      this.healthbar = new HealthBar(this);

      this.dead = false;
      this.removeFromWorld = false;
      this.x = x;
      this.y = y;
      this.s = s;

      this.animations = [];
      this.loadAnimations();
  };

  loadAnimations() {
       this.animations[0] = new Animator(
         this.spritesheet,
         0, 0, //pos
         this.w, this.h, //size
         1, 1, 0, //frame-info
         false, true //boolean type-info
       );
  }

  updateMe() {
      if (this.health <= 0) {
          this.dead = true;
          this.removeFromWorld = true;
      }
      // add more code here later about speed and physics
  };

  drawMe(ctx) {
  };

}
