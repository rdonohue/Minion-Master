class Player {
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
    //this.theMap = theMap;

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

    //var theClick = this.theGame.click;

    //if(theClick && this.theMap.isOnMap(theClick.x,theClick.y) == 0){
      //var theTile = this.theMap.theGrid[Math.floor(theClick.x/params.TILE_W_H)][Math.floor(theClick.y/params.TILE_W_H)];
      //if (theTile && theTile.myEntitys.length > 0){
        //this.selected = theTile.myEntitys[theTile.myEntitys.length-1].myName;
        //switched from 0 to length - 1 so that it grabs the entity that most recently entered that tile.
      //}
    //}

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

      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';

      ctx.fillText("HEALTH: " + 100, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
      ctx.fillText("DEF: " + 0, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
      ctx.fillText("ATK: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
      ctx.fillText("AGI: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
      ctx.fillText("INT: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);

      //Health Stat UI
      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';

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

      ctx.fillText("HEALTH", params.TILE_W_H * 2.55, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.HealthButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 2.75,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 2.45, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Defense Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("DEF", params.TILE_W_H * 4.30, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.DefButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 4.25,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 4.0, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Attack Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("ATK", params.TILE_W_H * 5.7, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.AtkButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 5.7,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 5.4, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Agility Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("AGI", params.TILE_W_H * 7.1, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.AgiButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 7.1,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 6.8, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Intellect Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("INT", params.TILE_W_H * 8.5, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.IntButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 8.5,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 8.2, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
    //}

  }
}
