class Tower {
  constructor(theGame, x, y) {
      Object.assign(this, {theGame, x, y });
      this.myType = "TOWER";
      this.myFaction = "friendly";
      this.description = "protects your minions and base"

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");
      this.elapsedTime = 0;
      this.state = 1;  // 1 = idle, 0 = destroyed
      this.upgradeAmount = 1; // 1 being the initial spawned upgrade state of a tower.

      this.healthbar = new HealthBar(this.theGame, this);

      //Stats
      this.health = 200;
      this.maxHealth = 200;
      this.defense = 10;
      this.attack = 35;
      this.projectileScale = 1;

      //Tower Vision
      this.radius = 35;
      this.visualRadius = 300;

      this.center = {
        x: this.x,
				y: this.y + 34.5 / 2
      }

      //Fire Rate of Tower
      this.agility = 1;

      this.theCamera = this.theGame.theSM;
      this.thePlayer = this.theCamera.thePlayer;
  };

  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    for (var i = 0; i < this.theGame.entities.length; i++) {
        var ent = this.theGame.entities[i];
        if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Dragon) &&
              canSee(this, ent) && this.elapsedTime > 1 / this.agility) {
            this.elapsedTime = 0;
            this.theGame.addEntity(new Projectile(this.theGame, this.x, this.y, ent, this.attack, this.projectileScale));
        }
    }

    if (this.health <= 0) {
      this.state = 0;
    }

    this.isSelected = (this.thePlayer.selected == this);
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
    if (this.theGame.player.selectedAttackUP) {
      this.attack++;
      this.projectileScale += 0.5;
      this.agility += 0.5;
    }
  };

  /**
   * This method interacts with HUD buttons for when a tower is selected.
   * When a player upgrades it's tower's defensive capabilities, the
   * tower is tougher, has better built walls, and can see farther.
   *
   * @upgradeAmount: The stage of upgrade the tower is currently at. (ryan: I think 3 is probably the max amount of upgrades if this is a good idea.)
   */
  upgradeDefense(upgradeAmount) {
    if (this.theGame.player.selectedDefenseUP) {
      this.defense += 1;
      this.maxHealth += this.maxHealth * (upgradeAmount * 0.2);
      this.visualRadius += this.visualRadius * (0.5 / upgradeAmount);
    }
  };

  drawMe(ctx) {
    const xCenter = 52.5 / 2;
    const yCenter = 34.5 / 2;

    // Subtracting x/yCenter from the origin point paints the tower's center where the user clicks.
    var x = this.x - xCenter - this.theGame.theCamera.x;
    var y = this.y - yCenter - this.theGame.theCamera.y;

    ctx.drawImage(this.spritesheet, 0, 0, 105, 138, x, y, 52.5, 69);

    if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.visualRadius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    // Did this to test centering of the sprite on the draw point.
    // ctx.strokeStyle = "Pink";
    // ctx.strokeRect(x, y, 52.5, 69);

      //don't forget to subtract this.theGame.theCamera.x and this.theGame.theCamera.y from the respective coordinates.
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "grey";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }

};
