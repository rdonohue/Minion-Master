class Button{
  constructor(
    theObject, theHud, theGame,
    x, y, //position of top
    w, h, //size of click-box.
    sw, sh, //size of sprite
    ox, oy, //offset right and down.
    myFunction,
    myText, //text which floats above the button.
    mySpriteSheet, myColor //or a color for a rectangle
    ){

    Object.assign(this, {theObject, theHud, theGame, x, y, w, h, sw, sh, ox, oy});

    theObject.myButtons.push(this);
    if(theObject != theHud) {
      theHud.myButtons.push(this);
    }

    //we might need to make the minion's handle their
    //own button updates btw.
    this.myFunction = myFunction; //the function that is to be performed
    this.myArguments = null;
    this.myText = myText;
    this.myImage = mySpriteSheet; //this might be a string
    this.myColor = myColor; //holding what color.
    this.state = 1;
    this.isVisable = true;
    this.debugOnly = false;
    this.start = true;
  };

  updateMe() {
    var theClick = this.theGame.click;

    if(this.debugOnly) {
      this.isVisable = params.DEBUG;
    }
    if(this.theObject.isSelectable) {
      this.isVisable = this.theObject.isSelected;
    }

    if(theClick) {
      var isInXCoord = theClick.x > this.x + this.ox && theClick.x < this.x + this.w + this.ox;
      var isInYCoord = theClick.y > this.y + this.oy && theClick.y < this.y + this.h + this.oy;

      console.log(theClick);
      console.log(isInXCoord);
      console.log(isInYCoord);
      if(isInXCoord && isInYCoord && this.isVisable){ //check y-axis
        this.theObject.buttonWasClicked = true;
        this.myFunction();
        return true;
      }
    } else {
      //do nothing.
      return false;
    }
  }

  drawMe(ctx) {
    if(this.isVisable) {
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

      if(params.DEBUG) {
        ctx.lineWidth = 1;
        ctx.strokeStyle= "red";
        ctx.beginPath();
        ctx.strokeRect(
          this.x - this.theGame.camera.x + this.ow-3,
          this.y - this.theGame.camera.y + this.oh-3,
          this.w+6, this.h+6
        );
        ctx.stroke();
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
