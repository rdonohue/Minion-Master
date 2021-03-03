class HomeBase {
  constructor(theGame, x, y) {
      Object.assign(this, {theGame, x, y});

      this.camera = this.theGame.theSM; //theSM is the game's camera.
      this.thePlayer = this.camera.thePlayer;
      this.myType = "HOMEBASE";
      this.myFaction = "friendly";

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 1;  // 1 = idle, 0 = destroyed
      this.isSelected = false;

      //Stats
      this.maxHealth = 200;
      this.health = 200;
      this.defense = 3.0;
      this.attack = 0;
      this.agility = 0;
      this.intelligence = 0;

      this.baseWidth = 450;
      this.baseHeight = 450;
      this.scale = 0.4;
      this.radius = this.baseWidth*this.scale/2;
      this.center = {
        x: this.x + this.baseWidth*this.scale/2,
        y: this.y + this.baseHeight*this.scale/2
      }

      this.animations = [];
      this.loadAnimations();
      this.isSelected = false;
      this.myHealthBar = new HealthBar(this.theGame, this);
  };

  loadAnimations() {
      this.animations[0] = new Animator(this.spritesheet, 0, 0, this.baseWidth, this.baseHeight, 1, 1, 0, false, true);
  }

  updateMe() {
    if (this.health <= 0) {
        this.state = 0;
    }

    this.isSelected = (this.thePlayer.selected == this);

    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    // add more code here later about speed and physics
  };

  drawMe(ctx) {
    this.animations[0].drawFrame(this.theGame.clockTick, ctx, this.x - this.camera.x, this.y - this.camera.y, this.scale);

    if(params.DEBUG || this.isSelected) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.camera.x, this.center.y - this.camera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();
    }

    this.myHealthBar.drawMe(ctx, this.health, this.maxHealth, "health");
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "grey";
    ctx.strokeRect(x-1, y-1, 3, 3);
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }
}
