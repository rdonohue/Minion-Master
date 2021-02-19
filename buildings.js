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
      this.upgradeAmount = 1; // 1 being the initial spawned upgrade state of a tower.

      //Stats
      this.health = 200;
      this.maxHealth = 200;
      this.defense = 0.0;
      this.attack = 1;
      this.projectileScale = 2;
      //Fire Rate of Tower
      this.agility = 1;

      //Tower Vision
      this.radius = 30;
      this.visualRadius = 300;

//      this.dead = false; This is redundant. Use this.state.
      this.removeFromWorld = false;
  };

  updateMe() {
    this.elapsedTime += this.game.clockTick;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent instanceof Wolf) && canSee(this, ent) && this.elapsedTime > 1 / this.agility) {
            this.elapsedTime = 0;
            this.game.addEntity(new Projectile(this.game, this.x, this.y, ent, this.attack, this.projectileScale));
        }
    }


    if (this.health <= 0) {
      die();
    }
  };


// Future proofing the inevitable need of the HUD accessing a tower's attributes.
// Don't add functionality about whether or not the tower can be upgraded in this class.

// Since the HUD is the most directly interacting component, it can ask a tower
// what it's current overall upgrade state is, and then fade out (make unavailable)
// the upgrade option.

// Our balancing question is whether or not the upgrade amount is a global value
// where it's max upgrade state is 3, or whatever value, regardless of whether
// it's offensive or defensive, or if each upgrade type can go to a max amount
// individually.

  /**
   * This method interacts with HUD buttons for when a tower is selected.
   * When a player upgrades it's tower's offensive capabilities, the
   * tower's arrows hit harder, shoot faster, and are larger.
   *
   * @upgradeAmount: The stage of upgrade the tower is currently at. (ryan: I think 3 is probably the max amount of upgrades if this is a good idea.)
   */
  upgradeOffense(upgradeAmount) {
    if (this.game.player.selectedAttackUP) {
      this.attack++;
      this.projectileScale += 0.5;
      this.agility += 0.5;
    }
  }

  /**
   * This method interacts with HUD buttons for when a tower is selected.
   * When a player upgrades it's tower's defensive capabilities, the
   * tower is tougher, has better built walls, and can see farther.
   *
   * @upgradeAmount: The stage of upgrade the tower is currently at. (ryan: I think 3 is probably the max amount of upgrades if this is a good idea.)
   */
  upgradeDefense(upgradeAmount) {
    if (this.game.player.selectedDefenseUP) {
      this.defense += 1;
      this.maxHealth += this.maxHealth * (upgradeAmount * 0.2);
      this.visualRadius += this.visualRadius * (0.5 / upgradeAmount);
    }
  }

  die() {
      this.state = 1;
      this.removeFromWorld = true;
  };

  drawMe(ctx) {
    const xCenter = 52.5 / 2;
    const yCenter = 34.5 / 2;

    // Subtracting x/yCenter from the origin point paints the tower's center where the user clicks.
    var x = this.x - xCenter - this.game.camera.x;
    var y = this.y - yCenter - this.game.camera.y;

    ctx.drawImage(this.spritesheet, 0, 0, 105, 138, x, y, 52.5, 69);

    // Did this to test centering of the sprite on the draw point.
    // ctx.strokeStyle = "Pink";
    // ctx.strokeRect(x, y, 52.5, 69);

      //don't forget to subtract this.game.camera.x and this.game.camera.y from the respective coordinates.
  };

};
