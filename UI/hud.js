// Rest of the UI to hold the theGame menu features.
class Hud {
  constructor(theGame, x, y, w) {
    Object.assign(this, { theGame, x, y, w });

    this.towerButton = new TowerButton(this.theGame, 1038, 97);
    this.pauseButton = new PauseButton(this.theGame, 1038, 537);

    this.minionCost = 50; //not really where this should be defined but whatever.
    this.myButtons = [];
    this.createButtons();
  };

  updateMe() {
    this.towerButton.updateMe();
    this.pauseButton.updateMe();

    var inc = 0;
    for(var i = 0; i < this.myButtons.length; i++) {
      if (i >= 3) {
        inc = 27;
      }
      this.myButtons[i].updateMe();
      if(this.theGame.click) {
        this.myButtons[i].checkButton(1038, inc + (97 + 27 * i + 27), 63, 22);
      }
    }
  };

  drawMe(ctx) {
    ctx.fillStyle = "DodgerBlue";
    ctx.fillRect(this.x, this.y, this.w, 576);
    ctx.strokeStyle = "Black";
    ctx.strokeRect(this.x, this.y, this.w - 2, 576 - 1);
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';

    this.towerButton.drawMe(ctx);
    this.pauseButton.drawMe(ctx);
    var inc = 0;
    for(var i = 0; i < this.myButtons.length; i++) {
      if (i >= 3) {
         inc = 27;
      }
      this.myButtons[i].drawButton(ctx, 1038, inc + (97 + 27 * i + 27), 63, 22, null);
    }
  };

  createButtons() {
    var that = this;
    new Button(that, that.theGame, that.spawnMinion, [that.minionCost], " Minion     50 Food", "white");

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
    );

    new Button(that, that.theGame, this.assistBase, 100, "Repair        100 Rock", "White");
    new Button(that, that.theGame, this.upgradeMinion, "Health", "Health     90 Food", "Crimson");
    new Button(that, that.theGame, this.upgradeMinion, "Attack", "Attack     90 Food", "Yellow");
    new Button(that, that.theGame, this.upgradeMinion, "Agility", "Agility     90 Food", "Aqua");
    new Button(that, that.theGame, this.upgradeMinion, "Defense", "Defense     90 Food", "Black");
    new Button(that, that.theGame, this.upgradeMinion, "Intel", "Intel        90 Food", "Chartreuse");

  };

  upgradeMinion(type) {
      if (this.theGame.currentMinion != null && !this.theGame.currentMinion.removeFromWorld) {
          switch (type) {
            case "Health":
               this.theGame.currentMinion.upgradeHealth(30);
               break;
            case "Defense":
               this.theGame.currentMinion.upgradeDefense(10);
               break;
            case "Attack":
               this.theGame.currentMinion.upgradeAttack(25);
               break;
            case "Agility":
               this.theGame.currentMinion.upgradeAgility(15);
               break;
            case "Intel":
               this.theGame.currentMinion.upgradeIntel(1);
               break;
          }
      }
  };

  assistBase(cost) {
    if (this.theGame.theSM.thePlayer.myRock >= cost && this.theGame.theBase.health < this.theGame.theBase.maxHealth) {
        this.theGame.theSM.thePlayer.myRock -= cost;
        let difference = this.theGame.theBase.maxHealth - this.theGame.theBase.health;
        if (difference <= 50) {
           this.theGame.theBase.health += 50;
        } else {
           this.theGame.theBase.health += difference;
        }
    } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange"
    }
  };

  spawnMinion(args) {
    if(this.theGame.theSM.thePlayer.myFood >= args[0]) {
      this.theGame.theSM.thePlayer.myFood -= args[0];
      let theBase = this.theGame.theBase;
      this.theGame.spawnMe("minion", theBase.x +theBase.radius*0.5, theBase.y + theBase.radius*2);
      this.theGame.spentFood += args[0];
    } else {
      this.theGame.theSM.thePlayer.myFoodColor = "orange";
    }
  };

};
