class Button{
  constuctor(game x,y,w,h,theObject,theFunction, theText, theSpriteSheet) {
    this.game = game;
    this.x = x; //x coord of top-left
    this.y = y;
    this.w = w; //width and height
    this.h = h;
    this.myObject = theObject; //the object we perform the function on.
    this.myFunction = theFunction; //the function that is to be performed
    this.myText = theText; //
    this.myImage = theSpriteSheet;
  }

  updateMe() {
    var theClick = this.game.click;
    if(theClick) {
      this.myFunction(this.myObject);
      //console.log("button was clicked!")''
    } else {
      //console.log("");
    }
  }

  drawMe(ctx) {
    //note that this button should be drawn AFTER any HUD elements are drawn
    //when it should be visable, otherwise the call-order might cover it.
    if(this.myImage) {
      ctx.drawImage(this.myImage, this.x, this.y, this.w, this.h)
    } else {
      ctx.fillRect(
        this.x, this.y,
        this.w, this.h,
      )
    }
  }
}
