class Player{
  constructor(game, theMap, startFood, startRock, trickleFood, trickleRock, posX, posY) {
    this.myFood = startFood;
    this.myRock = startRock;
    this.foodIncome = trickleFood;
    this.rockIncome = trickleRock;

    this.timeBetweenUpdates = 1;
    this.timer = new Timer();
    this.timeSinceUpdate = 0;

    this.camX = posX;
    this.camY = posY;
    this.width = 1024;
    this.height = 768;
    this.theGame = game;
    this.theMap = theMap;

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

    var theClick = this.theGame.click;
    if(theClick){
      if (this.theMap.theGrid){
        if(this.theMap.isOnMap(theClick.x,theClick.y) == 0){
          var theTile = this.theMap.theGrid[Math.floor(theClick.x/params.TILE_W_H)][Math.floor(theClick.y/params.TILE_W_H)];
          console.log(theTile);
          if (theTile){
            if(theTile.myEntitys.length > 0) {
              this.selected = theTile.myEntitys[0];
              this.targetType = theTile.myEntitys[0].myType;
            }
          }
        }
      }
    }

    //this is NOT the best implmentation of making the player not increment.
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

  drawMe(ctx) {
    //this can be where we update the resources displayed
    //make sure to round to integer.
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
    ctx.fillStyle = "White";

    //Upper Right HUD
    ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
      + Math.round(this.foodIncome) + " food/second"), 1024 + params.TILE_W_H/4, params.TILE_W_H/4);
    ctx.fillText(("Rock: " + Math.round(this.myRock) + " + "
      + Math.round(this.rockIncome) + " rock/second"), 1024 + params.TILE_W_H/4, params.TILE_W_H/4*2);
    ctx.fillText(("Selected: " + this.targetType), 1024 + params.TILE_W_H/4, params.TILE_W_H/4*3);

    ctx.font = params.TILE_W_H/4 + 'px "Press Start 2P"';
    //Bottom Left HUD
    //if (this.selected = "minion") {
      ctx.fillText(this.targetType + "'s", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2);
      ctx.fillText("STATS: ", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5);

      ctx.font =  params.TILE_W_H/8 + 'px "Press Start 2P"';

      ctx.fillText("HEALTH: " + 100, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
      ctx.fillText("DEF: " + 0, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
      ctx.fillText("ATK: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
      ctx.fillText("AGI: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
      ctx.fillText("INT: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);

      ctx.font =  params.TILE_W_H/6 + 'px "Press Start 2P"';
      ctx.fillText("UPGRADE! YO!", params.TILE_W_H * 2.0, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.HealthButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 2.75,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("HEALTH!", params.TILE_W_H * 2.40, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 2.75 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();
      // ctx.arc(params.TILE_W_H * 2.75, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, 12, 0, 2*Math.PI);
      // ctx.stroke();

    //}

  }
}
