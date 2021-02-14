class Button{
  constructor(theGame, x,y, w,h, theFunction, theText, theSpriteSheet) { //what spritesheet to use (otherwise use rectangle)
    Object.assign(this, {theGame, x,y});
    this.theGame = theGame;
    this.x = x; //x coord of top-left
    this.y = y;
    this.w = w; //width and height
    this.h = h;
    this.myFunction = theFunction; //the function that is to be performed
    this.theText = theText;
    this.myImage = theSpriteSheet; //since this is "optional", it has to be last I think.

    //can use this to "turn off" this button.
    //but you can also just set the x,y values to be outside the visable screen.
    this.isActive = true;
  };

  // makeButtons(theGame){
  //   let newHealthButton = new Button(theGame,
  //     100, 100, //location of top left corner
  //     50, 50, //size of button hitbox
  //     this.incrementStat, //the function to be called on it.
  //     "increase Health",
  //     this.HealthButt, //the spritesheet to use.
  //   );
  //   newHealthButton.myFunction.args = ["incrementStat", "HEALTH" , this.healthInc];
  //   this.healthButton = newHealthButton;
  //   theGame.addEntity(this.healthButton);
  //   //it seems you have to call this here,
  //   //not inside the button's constuctor....weird.
  // }
  //
  // incrementStat(theArgs) {
  //   if(theArgs[0] == "incrementStat") {
  //     if(theArgs[1] == "HEALTH") {
  //       minionStats.HEALTH += theArgs[2];
  //       console.log("minionStats.HEALTH: "+minionStats.HEALTH)
  //     } else if()
  //   }
  // }

  updateMe() {
    var theClick = this.theGame.click;
    if(!theClick) {
      return;
    }

    var isInXCoord = theClick.x > this.x && theClick.x < this.x + this.w;
    var isInYCoord = theClick.y > this.y && theClick.y < this.y + this.h;

    if(isInXCoord && isInYCoord){ //check y-axis
      this.myFunction(this.myFunction.args);
    }
  }

  drawMe(ctx) {
    //note that this button should be drawn AFTER any HUD elements are drawn
    //when it should be visable, otherwise the call-order might cover it.

    if(this.myImage) {
      ctx.drawImage(this.myImage, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillRect(
        this.x, this.y,
        this.w, this.h,
      )
    }
  }
}
