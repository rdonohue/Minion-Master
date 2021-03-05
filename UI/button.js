class Button{
  constructor(
    theObject, theGame,
    myFunction, myArguments,
    myText, myColor
    //text which floats above the button.
    ){

    Object.assign(this, {theObject, theGame, myFunction, myArguments, myText, myColor});

    this.theObject.myButtons.push(this);
    this.debugOnly = false;
    this.theCamera = this.theGame.theCamera
    //we might need to make the minion's handle their
    //own button updates btw.
  };

  updateMe() {
    if(this.debugOnly) {
      this.isVisable = params.DEBUG;
    } else if(this.theObject.isSelected) {
      this.isVisable = this.theObject.isSelected;
    } else {
      this.isVisable = true;
    }
  }

  checkButton(x, y, w, h) {
    if(this.isVisable) {
      let theClick = this.theGame.click;
      console.log(w + ", " + h);
      var isInXCoord = theClick.x > x && theClick.x < x + w;
      var isInYCoord = theClick.y > y && theClick.y < y + h;

      if(isInXCoord && isInYCoord){ //check y-axis
        this.theObject.buttonWasClicked = true;
        this.myFunction(this.myArguments);
        return true;
      }
    }
    //do nothing.
    return false;
  }

  drawButton(ctx, x, y, w, h, image) {
    if(this.isVisable) {
      ctx.save();
      ctx.font = 14 + 'px "Playfair Display SC"';
      ctx.fillStyle = "white";
      ctx.fillText(this.myText,
        x+3, y+16);
      if(image) {
        ctx.drawImage(this.myImage, x , y , w, h);
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle= this.myColor
        ctx.beginPath();
        ctx.strokeRect(
          x,
          y,
          w, h
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
