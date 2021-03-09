class Player {
  constructor(theGame, startFood, startRock, trickleFood, trickleRock, posX, posY) {
    Object.assign(this, {theGame, startFood, startRock, trickleFood, trickleRock, posX, posY});

    this.myFood = startFood;
    this.myRock = startRock;
    this.foodIncome = trickleFood;
    this.rockIncome = trickleRock;

    this.myFoodColor = "white";
    this.myRockColor = "white";

    this.timer = new Timer();
    this.timeBetweenUpdates = 1;
    this.timeSinceUpdate = 0;
    this.waitTillFood = 0;
    this.waitTillRock = 0;

    this.cam = this.theGame.theSM;
    this.w = 1024;
    this.h = 768;

    this.AgiButt = ASSET_MANAGER.getAsset("./sprites/button_Agi.png");
    this.AtkButt = ASSET_MANAGER.getAsset("./sprites/button_Attack.png");
    this.DefButt = ASSET_MANAGER.getAsset("./sprites/button_Def.png");
    this.HealthButt = ASSET_MANAGER.getAsset("./sprites/button_Health.png");
    this.IntButt = ASSET_MANAGER.getAsset("./sprites/button_Int.png");

    this.targetType = null;
    this.selected = null;
    this.myName = "thePlayer";
  }

  updateMe() {
    this.timeSinceUpdate += this.timer.tick();
    this.updateResources();
    if(this.theGame.click){
      this.updateSelected(this.theGame.click);
    }
  }

  updateResources() {
    if(this.myFoodColor != "white") {
      let currentFoodTime = this.theGame.timer.lastTimestamp;
      if(this.waitTillFood == 0) {
        this.waitTillFood = currentFoodTime + 1000;
      } else if (this.waitTillFood < currentFoodTime) {
        this.myFoodColor = "white";
        this.waitTillFood = 0;
      }
    }

    if(this.myRockColor != "white") {
      let currentRockTime = this.theGame.timer.lastTimestamp;
      if(this.waitTillRock == 0) {
        this.waitTillRock = currentRockTime + 1000;
      } else if (this.waitTillRock < currentRockTime) {
        this.myRockColor = "white";
        this.waitTillRock = 0;
      }
    }

    if(this.timeSinceUpdate < this.timeBetweenUpdates) {
      //NOTE! we always want to respond to player input!
      return;
    } else {
      //if it HAS, then allow update and reset timeSinceUpdate.
      this.myFood += this.foodIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
      this.myRock += this.rockIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
      this.timeSinceUpdate = 0;
      //we need to make it so that the player's resource increment
      //gets multiplied by how much time has passed.
    }
  }

  updateSelected(click){
    if(click.x > this.width) {
      //hud click, do nothing
    } else {
      //on canvas.
      let entities = this.theGame.entities;
      let theClick = {
        x: click.x + this.cam.x,
        y: click.y + this.cam.y
      }

      let newSelect = null;
      let closest = null;

      for(var i = 0; i< entities.length; i++) {
        if(entities[i].isSelected === false) {
          if(!closest) {
            newSelect = entities[i];
            closest = distance(entities[i].center, theClick);
          } else if (closest > distance(entities[i].center, theClick)) {
            newSelect = entities[i];
            closest = distance(entities[i].center, theClick);
          }
        }
      }

      if(newSelect && closest < newSelect.radius) {
        this.selected = newSelect;
        this.targetType = this.selected.myType;
      } else if (this.selected == newSelect) {
      } else if (this.selected && closest >= newSelect.radius) {
        this.selected = null
      }
    }
  }

  drawMe(ctx) {
    this.drawPlayerResources(ctx);
    this.drawSelectedInfo(ctx);
  }

  drawPlayerResources(ctx) {
    //this can be where we update the resources displayed
    //make sure to round to integer.
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
    ctx.fillStyle = "White";

    //Upper Right HUD
    ctx.fillText("RESOURCES", params.CANVAS_WIDTH + 78, 20);
    ctx.strokeStyle = "White";
    ctx.strokeRect(params.CANVAS_WIDTH + 76, 4, 95, 20);
    ctx.fillStyle = this.myFoodColor;
    ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
      + Math.round(this.foodIncome) + " food/second"), 1024 + params.TILE_W_H/4, params.TILE_W_H/4 + 24);
    ctx.fillStyle = this.myRockColor;
    ctx.fillText(("Rock: " + Math.round(this.myRock) + " + "
      + Math.round(this.rockIncome) + " rock/second"), 1024 + params.TILE_W_H/4, params.TILE_W_H/4*2 + 24);
    // ctx.fillText(("Selected: " + this.targetType), 1024 + params.TILE_W_H/4, params.TILE_W_H/4*3);

    ctx.fillText("BUILD MENU", params.CANVAS_WIDTH + 78, 82);
    ctx.strokeRect(params.CANVAS_WIDTH + 76, 66, 102, 20);

    ctx.fillText("MINON UPGRADES", params.CANVAS_WIDTH + 78, 232);
    ctx.strokeRect(params.CANVAS_WIDTH + 76, 218, 145, 20);
  }

  drawSelectedInfo(ctx) {
    //Bottom Left HUD
    if (this.selected) {
      ctx.save();
      ctx.font = params.TILE_W_H/4 + 'px "Press Start 2P"';
      ctx.fillText(this.targetType + " (" + this.selected.description + ")", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2);
      if(params.DEBUG) {
        if(this.selected.target && this.selected.target.myType) {
          ctx.fillText("target: "+this.selected.target.myType + "{"+Math.round(this.selected.target.health) + "/"+Math.round(this.selected.target.maxHealth)+"}", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2.5);
        } else if (this.selected.target) {
          ctx.fillText("target: {"+Math.round(this.selected.target.x) + ", " +Math.round(this.selected.target.y) + "}", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2.5);
        }
      }
      ctx.fillText("STATS: ", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5);

      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';
      if (this.selected.health && this.selected.maxHealth) {
          ctx.fillText("HEALTH: " + Math.round(this.selected.health) + "/" + Math.round(this.selected.maxHealth), 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
      }
      if(this.selected.defense) {
          ctx.fillText("DEF: " + this.selected.defense, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
      }
      if(this.selected.attack) {
          ctx.fillText("ATK: " + this.selected.attack, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
      }
      if(this.selected.agility) {
          ctx.fillText("AGI: " + this.selected.agility, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
      }
      if(this.selected.intelligence) {
          ctx.fillText("INT: " + this.selected.intelligence, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);
      }
      if(params.DEBUG) {
        ctx.fillText("State: " + this.selected.state, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.2);
      }
      ctx.restore();

      // if(this.selected.myFaction == "friendly") {
      //   ctx.save();
      //   ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';
      //
      //   if(this.selected.health) {
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      //     ctx.stroke();

          // ctx.strokeStyle = "Pink";
          // ctx.beginPath();
          // ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
          // ctx.stroke();
          //
          // ctx.strokeStyle = "Goldenrod";
          // ctx.beginPath();
          // ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
          // ctx.stroke();

          // ctx.fillText("HEALTH", params.TILE_W_H * 2.55, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
          // ctx.drawImage(this.HealthButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 2.75,
          //               params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
          // ctx.fillText("UPGRADE!", params.TILE_W_H * 2.45, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
      //   }
      // }
      //
      //   //Defense Stat UI
      //   if(this.selected.defense) {
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Pink";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      //     ctx.stroke();
      //
      //     ctx.fillText("DEF", params.TILE_W_H * 4.30, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      //     ctx.drawImage(this.DefButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 4.25,
      //                   params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      //     ctx.fillText("UPGRADE!", params.TILE_W_H * 4.0, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
      //   }
      //
      //   //Attack Stat UI
      //   if(this.selected.attack) {
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Pink";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      //     ctx.stroke();
      //
      //     ctx.fillText("ATK", params.TILE_W_H * 5.7, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      //     ctx.drawImage(this.AtkButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 5.7,
      //                   params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      //     ctx.fillText("UPGRADE!", params.TILE_W_H * 5.4, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
      //   }
      //
      //   if(this.selected.agility) {
      //     //Agility Stat UI
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Pink";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      //     ctx.stroke();
      //
      //     ctx.fillText("AGI", params.TILE_W_H * 7.1, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      //     ctx.drawImage(this.AgiButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 7.1,
      //                   params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      //     ctx.fillText("UPGRADE!", params.TILE_W_H * 6.8, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
      //   }
      //
      //   //Intellect Stat UI
      //   if(this.selected.intelligence) {
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Pink";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      //     ctx.stroke();
      //     ctx.strokeStyle = "Goldenrod";
      //     ctx.beginPath();
      //     ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      //     ctx.stroke();
      //
      //     ctx.fillText("INT", params.TILE_W_H * 8.5, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      //     ctx.drawImage(this.IntButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 8.5,
      //                   params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      //     ctx.fillText("UPGRADE!", params.TILE_W_H * 8.2, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
      //   }
      //   ctx.restore();
      // }
    }
  }
}
