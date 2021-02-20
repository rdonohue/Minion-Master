class Button{
  constructor(
    theObject, theHud, theGame, //owning objects
    x, y, //position of top
    w, h, //size of click-box.
    sw, sh, //size of sprite, no offset currently implemented!
    myFunction,
    myText, mySpriteSheet,
    isDebugger, isSeeThrough) {

    Object.assign(this, {theObject, theHud, theGame, x, y, w, h, sw, sh});
    theHud.myButtons.push(this);

    //we might need to make the minion's handle their
    //own button updates btw.
    this.myFunction = myFunction; //the function that is to be performed
    this.myArguments = null;
    this.myText = myText;
    this.myImage = mySpriteSheet; //since this is "optional", it has to be last I think.

    //if this button is for only debug mode only.
    this.isDebugger = isDebugger;

    //can use this to "turn off" this button.
    this.isVisable = !isDebugger || params.DEBUG_ON;
    this.isSeeThrough = isSeeThrough;
  };

  updateMe() {
    var theClick = this.theGame.click;
    if (this.isDebugger){
      this.isVisable = params.DEBUG_ON;
    }

    if(!theClick || !this.isVisable) {
      //do nothing.
      return;
    }

    var isInXCoord = theClick.x > this.x && theClick.x < this.x + this.w;
    var isInYCoord = theClick.y > this.y && theClick.y < this.y + this.h;

    if(isInXCoord && isInYCoord){ //check y-axis
      this.myFunction(this.myArguments);
    }
  }

  drawMe(ctx) {
    //note that this button should be drawn AFTER any HUD elements are drawn
    //when it should be visable, otherwise the call-order might cover it.
    if(this.isVisable && !this.isSeeThrough) {
      //we want to only draw ourselves if we are visable.
      ctx.font = params.TILE_W_H/5 + 'px "Playfair Display SC"';
      ctx.fillStyle = "white";
      ctx.fillText(this.myText,
        this.x, this.y-2);
      if(this.myImage) {
        ctx.drawImage(this.myImage, this.x, this.y, this.sw, this.sh);
      } else {
        ctx.fillStyle = this.myColor;
        ctx.fillRect(
          this.x, this.y,
          this.w, this.h
        );
      }
    }
  }
}

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
