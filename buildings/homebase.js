class HomeBase {
  constructor(game, x, y) {
      Object.assign(this, {game, x, y});
      this.myType = "HomeBase";
      this.isSelectable = true;
      this.isSelected = false;
      //we need to not have this redundency. I know they
      //eventually will be different but for now we should reduce to one I think.

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

      this.state = 1;  // 1 = idle, 0 = destroyed
      this.scale = 0.3;

      this.x = x;
      this.y = y;

      this.sw = 450;
      this.sh = 460;
      this.radius = this.sw/2 * this.scale;
      this.ow = this.radius;
      this.oh = this.radius;

      this.theHud = game.theHud;

      //Stats
      this.health = 200;
      this.defense = 3.0;
      this.agility = 0;
      this.intelligence = 0;

      this.healthbar = new HealthBar(this);
      this.myButtons = [];
      this.createMyButtons();

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

  createMyButtons() {
    var that = this;
    var minionButton = new Button(
      that, that.theHud, that.game, //theObject, theHud, theGame,
      params.CANVAS_WIDTH + that.theHud.hudLength/2, 150, // x, y, //upper left corner
      25, 25, // w, h, //size of the buttons click-size
      25, 25, // sw, sh, //buttonSize
      10, 10, // ox, oy //offset
      (that.spawnMinion),
      "spawn minion", //button text
      null, "blue" // either spritesheet or a color.
    );
    that.myButtons.push(minionButton);
  }

  spawnMinion() {
    var that = this;
    this.game.spawnMinion("minion", this.x, this.y);
    // this.game.spawnMe("minion", this.x + this.radius, this.y + this.radius);
  }

  updateMe() {
    if (this.health <= 0) {
      this.state = 0;
    }
    this.myButtons.forEach((button) => {
      button.updateMe();
    });
    // add more code here later about speed and physics
  };

  drawMe(ctx) {
    // console.log(this.animations[0].spritesheet);
    this.animations[0].drawFrame(this.game.clockTick, ctx,
      this.x - this.game.camera.x,
      this.y - this.game.camera.y,
      this.scale
    );

    if(params.DEBUG) {
      if(this.isSelectable) {
        ctx.lineWidth = 1;
        ctx.strokeStyle= "red";
        ctx.beginPath();
        ctx.arc(this.x - this.game.camera.x + this.ow, this.y - this.game.camera.y + this.oh, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    this.myButtons.forEach((button) => {
      button.drawMe(ctx);
    });
    this.healthbar.drawMe(ctx);
  };


}
