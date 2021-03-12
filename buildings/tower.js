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


      //Stats
      this.health = this.theGame.towerHealth;
      this.maxHealth = this.theGame.towerHealth;
      this.defense = this.theGame.towerDefense;
      this.attack = this.theGame.towerAttack;
      this.projectileScale = this.theGame.towerProjectile;

      //Tower Vision
      this.radius = 35;
      this.visualRadius = this.theGame.towerVisual;

      this.center = {
        x: this.x,
				y: this.y + 34.5 / 2
      }

      //Fire Rate of Tower
      this.agility = this.theGame.towerAgility;

      this.theCamera = this.theGame.theSM;
      this.thePlayer = this.theCamera.thePlayer;
      this.myHealthBar = new HealthBar(this.theGame, this);
  };

  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    for (var i = 0; i < this.theGame.entities.length; i++) {
        var ent = this.theGame.entities[i];
        if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Dragon) &&
              canSee(this, ent) && this.elapsedTime > 1 / this.agility) {
            this.elapsedTime = 0;
            this.theGame.addEntity(new Projectile(this.theGame, this.x, this.y, ent, Math.floor(this.attack/2 + randomInt(this.attack)), this.projectileScale));
        }
    }

    if (this.health <= 0) {
      this.state = 0;
      if (!this.theGame.victory && !this.theGame.theSM.paused && this.theGame.notDead) this.theGame.deadTowers++;
    }


    this.isSelected = (this.thePlayer.selected == this);
    this.myHealthBar.updateMe();
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
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.fillStyle = "White";
    ctx.fillRect(x, y, 7.5, 7.5);
    ctx.restore();
  };

};
