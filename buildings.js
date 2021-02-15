class Cave {
    constructor(game, x, y) {
      Object.assign(this, {game, x, y });

      this.game.cave = this;
      this.myName = "cave";

      //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/cave.png");

      this.state = 0;  // 0 = idle, 1 = destroyed

      //Stats
      this.health = 200;
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

    };

    loadAnimations() {

    };

    die() {
        this.dead = true;
        this.removeFromWorld = true;
        this.myTile = NULL;
    };

    drawMe(ctx) {

    };

};

class GuardTower {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y });

      this.game.tower = this;
      this.myName = "cave";

    //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");

      this.state = 0;  // 0 = idle, 1 = destroyed

    //Stats
      this.health = 200;
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

  };

  loadAnimations() {

  };

  die() {
      this.dead = true;
      this.removeFromWorld = true;
      this.myTile = NULL;
  };

  drawMe(ctx) {
      //don't forget to subtract this.game.camera.x and this.game.camera.y from the respective coordinates.
  };

};
