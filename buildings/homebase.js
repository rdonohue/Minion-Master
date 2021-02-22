class HomeBase {
  constructor(theGame, x, y) {
      Object.assign(this, {theGame, x, y});
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

      this.theHud = theGame.theHud;

      //Stats
      this.health = 200;
      this.defense = 10.0;
      this.attack = 0;
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
      that, that.theHud, that.theGame, //theObject, theHud, theGame,
      params.CANVAS_WIDTH + that.theHud.hudLength/2, 150, // x, y, //upper left corner
      25, 25, // w, h, //size of the buttons click-size
      25, 25, // sw, sh, //buttonSize
      0, 0, // ox, oy //offset
      (that.spawnMinion),
      "spawn minion", //button text
      null, "blue" // either spritesheet or a color.
    );
    that.myButtons.push(minionButton);
  }

  spawnMinion() {
    var that = this;
    if(this.theHud.myFood >= this.theHud.minionFoodCost) {
      this.theHud.myFood -= this.theHud.minionFoodCost;
      this.theGame.spawnMe("minion", that.x + that.radius, that.y + that.radius);
    } else {
      //highlight low resources.
      this.theHud.myFoodsColor = "orange";
    }
  }

  //seperating buttonManagement off to make it easer for re-use.
  buttonManagement() {
    var theClick = this.theGame.click;
    var theCam = this.theGame.camera;
    if(theClick && theClick.x - theCam.x < params.CANVAS_WIDTH) {
      //a click was found, so check to see if it was for this entity
      //by seeing if the click was within this entity's radius.
      var myLoc = {
        x: this.x - theCam.x + this.ow,
        y: this.y - theCam.y + this.oh
      }
      var dist = distance(theClick, myLoc);
      if(dist<this.radius) {
        this.theHud.setSelected(this);
      }
    }
    return this.selected;
  }

  updateMe() {
    if (this.health <= 0) {
      this.state = 0;
      return false;
    }
    return this.buttonManagement();
  };

  drawMe(ctx) {
    // console.log(this.animations[0].spritesheet);
    this.animations[0].drawFrame(this.theGame.clockTick, ctx,
      this.x - this.theGame.camera.x,
      this.y - this.theGame.camera.y,
      this.scale
    );

    if(params.DEBUG || this.isSelected) {
      ctx.lineWidth = 1;
      ctx.strokeStyle= "red";
      ctx.beginPath();
      ctx.arc(this.x - this.theGame.camera.x + this.ow, this.y - this.theGame.camera.y + this.oh, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    this.healthbar.drawMe(ctx);
  };


}
