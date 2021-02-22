class GuardTower {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y });

      this.myName = "cave";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");

      this.state = 1;  // 1 = idle, 0 = destroyed

      this.healthbar = new HealthBar(this);

    //Stats
      this.health = 90;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;

      this.xOriginLoc = x;
      this.yOriginLoc = y;
      this.baseWidth = 1;
      this.baseHeight = 1;

  };

  updateMe() {
      if (this.health <= 0) {
        this.state = 0; //dead.
      }
  };

  drawMe(ctx) {
      //don't forget to subtract this.game.camera.x and this.game.camera.y from the respective coordinates.
  };
};
