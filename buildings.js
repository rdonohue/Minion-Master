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

class Tower {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y });
      this.myName = "tower";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");
      this.elapsedTime = 0;
      this.state = 0;  // 0 = idle, 1 = destroyed

    //Stats
      this.health = 200;
      this.maxHealth = 200;
      this.defense = 0.0;
      this.attack = 1;

      //Fire Rate of Tower
      this.agility = 1;
      this.radius = 30;
      this.visualRadius = 300;

//      this.dead = false; This is redundant. Use this.state.
      this.removeFromWorld = false;
      // this.baseWidth = 1;
      // this.baseHeight = 1;

  };

  updateMe() {
    this.elapsedTime += this.game.clockTick;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent instanceof Wolf) && canSee(this, ent) && this.elapsedTime > this.agility) {
            this.elapsedTime = 0;
            this.game.addEntity(new Projectile(this.game, this.x, this.y, ent, this.attack));
        }
    }


    if (this.health <= 0) {
      die();
    }
  };

  die() {
      this.state = 1;
      this.removeFromWorld = true;
  };

  drawMe(ctx) {
    const xCenter = 52.5 / 2;
    const yCenter = 34.5 / 2;
    var x = this.x - xCenter - this.game.camera.x;
    var y = this.y - yCenter - this.game.camera.y;

    ctx.drawImage(this.spritesheet, 0, 0, 105, 138, x, y, 52.5, 69);

    ctx.strokeStyle = "Pink";
    ctx.strokeRect(x, y, 52.5, 69);

      //don't forget to subtract this.game.camera.x and this.game.camera.y from the respective coordinates.
  };

};
