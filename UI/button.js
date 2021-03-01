class Button{
  constructor(
    theObject, theHud, theGame,
    myFunction, myArguments,
    myText, myImage
    //text which floats above the button.
    ){

    Object.assign(this, {theObject, theHud, theGame, myFunction, myArguments, myText, myImage});

    theObject.myButtons.push(this);

    //we might need to make the minion's handle their
    //own button updates btw.
    this.myFunction = myFunction; //the function that is to be performed
    this.myArguments = [];
    this.myText = myText;
    this.myColor = this.myColor; //default color.
  };

  updateMe() {
    if(this.debugOnly) {
      this.isVisable = params.DEBUG;
    } else if(this.theObject.isSelectable) {
      this.isVisable = this.theObject.isSelected;
    }
  }

  checkButton(theClick, x, y, w, h) {
    if(theClick && this.isVisable) {
      var isInXCoord = theClick.x > x && theClick.x < x + w;
      var isInYCoord = theClick.y > y && theClick.y < y + h;

      if(isInXCoord && isInYCoord){ //check y-axis
        this.theObject.buttonWasClicked = true;
        this.myFunction();
        return true;
      }
    }
    //do nothing.
    return false;
  }

  drawButton(ctx, x, y, w, h, image) {
    if(this.isVisable) {
      ctx.save();
      ctx.font = 16 + 'px "Playfair Display SC"';
      ctx.fillStyle = "white";
      ctx.fillText(this.myText,
        x, y-2);
      if(image) {
        ctx.drawImage(this.myImage, x, y, w, h);
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
      ctx.restore();
    }
  }
}
