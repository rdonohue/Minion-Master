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
      if (i >= 2 && i < 7) {
        inc = 27;
      } else if (i >= 7 && i < 9) {
         inc = 54;
      } else if (i >= 9) {
         inc = 81;
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
      if (i >= 2 && i < 7) {
         inc = 27;
      } else if (i >= 7 && i < 9) {
         inc = 54;
      } else if (i >= 9) {
         inc = 81;
      }
      this.myButtons[i].drawButton(ctx, 1038, inc + (97 + 27 * i + 27), 63, 22, null);
    }
  };

  createButtons() {
    var that = this;
    new Button(that, that.theGame, that.spawnMinion, [that.minionCost], " Minion", "white");

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
      "Victory", "white"
    );

    new Button(that, that.theGame, this.upgradeMinion, "Health", "Health", "Crimson"); // 90 Food
    new Button(that, that.theGame, this.upgradeMinion, "Attack", "Attack", "Yellow"); // 90 Food
    new Button(that, that.theGame, this.upgradeMinion, "Agility", "Agility", "Aqua"); // 90 Food
    new Button(that, that.theGame, this.upgradeMinion, "Defense", "Defense", "Black"); // 90 Food
    new Button(that, that.theGame, this.upgradeMinion, "Intelligence", "Intel", "Chartreuse"); // 90 Food

    new Button(that, that.theGame, this.assistBase, 100, "Repair", "White"); // 100 Rock
    new Button(that, that.theGame, this.upgradeBase, null, "BaseUp", "Gold"); // 500 Rock

    new Button(that, that.theGame, this.upgradeTower, "Defense", "Harden", "White"); // 90 Rock
    new Button(that, that.theGame, this.upgradeTower, "Offense", "Offense", "White"); // 90 Rock
  };

  // Upgrade minion method for the game. Will upgrade certain stat based on the option selected.
  // After upgrade, all other preceding minions that are spawned will have said updated value.
  upgradeMinion(type) {
    if (this.theGame.theSM.thePlayer.myFood >= 90) {
      this.theGame.theSM.thePlayer.myFood -= 90;
      this.theGame.spentFood += 90;
      for (var i = 0; i < this.theGame.entities.length; i++) {
          let ent = this.theGame.entities[i];
          if (ent instanceof Minion) {
            switch (type) {
                case "Health":
                  ent.upgradeHealth(30);
                  break;
                case "Defense":
                  ent.upgradeDefense(5);
                  break;
                case "Attack":
                  ent.upgradeAttack(5);
                  break;
                case "Agility":
                  ent.upgradeAgility(1);
                  break;
                case "Intelligence":
                  ent.upgradeIntel(1);
                  break;
            }
         }
      }

      // switch (type) {
      //     case "Health":
      //       this.theGame.defaultHealth += 30;
      //       break;
      //     case "Defense":
      //       this.theGame.defaultDef += 10;
      //       break;
      //     case "Attack":
      //       this.theGame.defaultAttack += 15;
      //       break;
      //     case "Agility":
      //       this.theGame.defaultAgi += 2;
      //       break;
      //     case "Intelligence":
      //       this.theGame.defaultIntel += 3;
      //       break;
      // }
    } else {
        this.theGame.theSM.thePlayer.myFoodColor = "orange";
    }
  };

  // Upgrade method for the tower. Will upgrade certain stat depending on whatever
  // option it is. After upgrade, all preceding towers that are spawned will have
  // said updated value.
  upgradeTower(type) {
     if (this.theGame.theSM.thePlayer.myRock >= 90 && this.theGame.towerCount > 0) {
        this.theGame.theSM.thePlayer.myRock -= 90;
        this.theGame.spentRock += 90;
        for (var ent of this.theGame.entities) {
          if (ent instanceof Tower) {
            if (type == "Defense") {
              this.theGame.towerDefense++;
              this.theGame.towerHealth += 25;
              this.theGame.towerVisual += 25;
            } else {
              this.theGame.towerAttack += 15;
              this.theGame.towerProjectile += 0.5;
              this.theGame.towerAgility += 0.5;
            }
          }
        }
     } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange";
     }
  };

  // Healing method for the home base.
  assistBase(cost) {
    if (this.theGame.theSM.thePlayer.myRock >= cost && this.theGame.theBase.health < this.theGame.theBase.maxHealth) {
        this.theGame.theSM.thePlayer.myRock -= cost;
        this.theGame.spentRock += cost;
        let difference = this.theGame.theBase.maxHealth - this.theGame.theBase.health;
        if (difference <= 50) {
           this.theGame.theBase.health += 50;
        } else {
           this.theGame.theBase.health += difference;
        }
    } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange";
    }
  };

  // Upgrade method for the home base.
  upgradeBase() {
    if (this.theGame.theSM.thePlayer.myRock >= 500) {
        this.theGame.theSM.thePlayer.myRock -= 500;
        this.theGame.spentRock += 500;
        this.theGame.theBase.maxHealth *= 2;
        this.theGame.theBase.upgrade();
    } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange";
    }
  };

  // Simple spawn method for the minion
  spawnMinion(args) {
    if(this.theGame.theSM.thePlayer.myFood >= args[0]) {
      this.theGame.theSM.thePlayer.myFood -= args[0];
      this.theGame.spentFood += args[0];
      let theBase = this.theGame.theBase;
      this.theGame.spawnMe("minion", theBase.x +theBase.radius*0.5, theBase.y + theBase.radius*2);
      this.theGame.spentFood += args[0];
    } else {
      this.theGame.theSM.thePlayer.myFoodColor = "orange";
    }
  };

};
