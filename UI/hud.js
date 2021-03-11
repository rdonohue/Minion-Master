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

    new Button(that, that.theGame, this.upgradeMinion, "Health", "Health     90 Food", "Crimson");
    new Button(that, that.theGame, this.upgradeMinion, "Attack", "Attack     90 Food", "Yellow");
    new Button(that, that.theGame, this.upgradeMinion, "Agility", "Agility     90 Food", "Aqua");
    new Button(that, that.theGame, this.upgradeMinion, "Defense", "Defense     90 Food", "Black");
    new Button(that, that.theGame, this.upgradeMinion, "Intelligence", "Intel        90 Food", "Chartreuse");

    new Button(that, that.theGame, this.assistBase, 100, "Repair        100 Rock", "White");
    new Button(that, that.theGame, this.upgradeBase, null, "BaseUp        500 Rock", "Gold");

    new Button(that, that.theGame, this.upgradeTower, "Defense", "Harden        90 Rock", "White");
    new Button(that, that.theGame, this.upgradeTower, "Offense", "Offense        90 Rock", "White");
  };

  upgradeMinion(type) {
    if (this.theGame.theSM.thePlayer.myFood >= 90) {
      this.theGame.theSM.thePlayer.myFood -= 90;
      for (var i = 0; i < this.theGame.entities.length; i++) {
          let ent = this.theGame.entities[i];
          if (ent instanceof Minion) {
            switch (type) {
                case "Health":
                  ent.upgradeHealth(30);
                  break;
                case "Defense":
                  ent.upgradeDefense(10);
                  break;
                case "Attack":
                  ent.upgradeAttack(15);
                  break;
                case "Agility":
                  ent.upgradeAgility(3);
                  break;
                case "Intelligence":
                  ent.upgradeIntel(3);
                  break;
            }
         }
      }

      switch (type) {
          case "Health":
            this.theGame.defaultHealth += 30;
            break;
          case "Defense":
            this.theGame.defaultDef += 10;
            break;
          case "Attack":
            this.theGame.defaultAttack += 15;
            break;
          case "Agility":
            this.theGame.defaultAgi += 2;
            break;
          case "Intelligence":
            this.theGame.defaultIntel += 3;
            break;
      }
    } else {
        this.theGame.theSM.thePlayer.myFoodColor = "orange";
    }
  };

  upgradeTower(type) {
     if (this.theGame.theSM.myRock >= 90 && this.theGame.towerCount > 0) {
        this.theGame.theSM.thePlayer.myRock -= 90;
        for (var i = 0; i < this.theGame.entities.length; i++) {
           let ent = this.theGame.entities[i];
           if (ent instanceof Tower) {
              if (type == "Defense") {
                  ent.upgradeDefense(50);
              } else {
                 ent.upgradeOffense(15);
              }
           }
        }

        if (type == "Defense") {
          this.theGame.towerDefense++;
          this.theGame.towerHealth += this.theGame.towerHealth * (50 * 0.2);
          this.theGame.towerVisual += this.theGame.towerVisual * (0.5 / 50);
        } else {
          this.theGame.towerAttack += 15;
          this.theGame.towerProjectile += 0.5;
          this.theGame.towerAgility += 0.5;
        }
     } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange";
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
        this.theGame.theSM.thePlayer.myRockColor = "orange";
    }
  };

  upgradeBase() {
    if (this.theGame.theSM.thePlayer.myRock >= 500) {
        this.theGame.theSM.thePlayer.myRock -= 500;
        this.theGame.theBase.maxHealth *= 2;
        this.theGame.theBase.health.upgrade();
    } else {
        this.theGame.theSM.thePlayer.myRockColor = "orange";
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
