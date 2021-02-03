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

    this.selected = null;
    this.myName = "thePlayer";
  }

  updateMe() {
    this.timeSinceUpdate += this.timer.tick();

    var theClick = this.theGame.click;
    if(theClick){
      if (this.theMap.theGrid){
        var theTile = this.theMap.theGrid[Math.floor(theClick.x/params.TILE_W_H)][Math.floor(theClick.y/params.TILE_W_H)];
        if (theTile){
          if(theTile.myEntitys.length > 0) {
            this.selected = theTile.myEntitys[0].myName;
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
    ctx.font = params.TILE_W_H/4 + 'px "test TEXT"';
    ctx.fillStyle = "White";
    ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
      + Math.round(this.foodIncome) + " food/second"), params.TILE_W_H/4, params.TILE_W_H/4);
    ctx.fillText(("Rock: " + Math.round(this.myRock) + " + "
      + Math.round(this.rockIncome) + " rock/second"), params.TILE_W_H/4, params.TILE_W_H/4*2);

    ctx.fillText(("Selected: " + this.selected), params.TILE_W_H/4, params.TILE_W_H/4*3);
  }
}
