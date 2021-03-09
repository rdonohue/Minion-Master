// Rest of the UI to hold the theGame menu features.
class Hud{
  constructor(theGame, x, y, w) {
    Object.assign(this, { theGame, x, y, w });

    this.towerButton = new TowerButton(this.theGame, 1038, 97);
    this.pauseButton = new PauseButton(this.theGame, 1038, 537);

    this.healthButton = new UpgradeButton(this.theGame, 1038, 277, "Health", 30, "Crimson", "Pink");
    this.attButton = new UpgradeButton(this.theGame, 1038, 322, "Attack", 25, "Yellow", "White");
    this.agileButton = new UpgradeButton(this.theGame, 1038, 367, "Agility", 15, "Green", "DarkTurquoise");
    this.defButton = new UpgradeButton(this.theGame, 1038, 412, "Defense", 10, "Gray", "LightSteelBlue");
    this.intButton = new UpgradeButton(this.theGame, 1038, 457, "Intel", 10, "DodgerBlue", "DeepSkyBlue");

    this.minionCost = 50; //not really where this should be defined but whatever.
    this.myButtons = [];
    this.createButtons();
  };

  updateMe() {
    this.towerButton.updateMe();
    this.pauseButton.updateMe();
    this.healthButton.updateMe();
    this.attButton.updateMe();
    this.agileButton.updateMe();
    this.defButton.updateMe();
    this.intButton.updateMe();
    for(var i = 0; i < this.myButtons.length; i++) {
      this.myButtons[i].updateMe();
      if(this.theGame.click) {
        this.myButtons[i].checkButton(1038, 97 +45*i + 45, 63, 22);
      }
    }
  };

  drawMe(ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(this.x, this.y, this.w, 576);
    ctx.strokeStyle = "Black";
    ctx.strokeRect(this.x, this.y, this.w - 2, 576 - 1);
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';

    this.towerButton.drawMe(ctx);
    this.pauseButton.drawMe(ctx);
    this.healthButton.drawMe(ctx);
    this.attButton.drawMe(ctx);
    this.agileButton.drawMe(ctx);
    this.defButton.drawMe(ctx);
    this.intButton.drawMe(ctx);

    for(var i = 0; i < this.myButtons.length; i++) {
      this.myButtons[i].drawButton(ctx, 1038, 97 + 45*i + 45, 63, 22, null);
    }
  }

  createButtons() {
    var that = this;
    new Button(
      that, that.theGame,
      that.spawnMinion, [that.minionCost],
      " Minion     50 Food", "white"
    )

    new Button(
      that, that.theGame,
      () => {
        if (this.theGame.theSM.thePlayer.myFood > 1000) {
          this.theGame.theSM.victory = true;
        } else {
          this.theGame.theSM.thePlayer.myFoodColor = "orange";
        }

      },
      null,
      "Victory    1000 Food", "white"
    )
  }

  spawnMinion(args) {
    if(this.theGame.theSM.thePlayer.myFood >= args[0]) {
      this.theGame.theSM.thePlayer.myFood -= args[0];
      let theBase = this.theGame.theBase;
      this.theGame.spawnMe("minion", theBase.x +theBase.radius*0.5, theBase.y + theBase.radius*2);
    } else {
      this.theGame.theSM.thePlayer.myFoodColor = "orange";
    }
  }

};
