class Minion {
    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");
        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);

        this.myTile = null;
        this.theTileSize = game.theMap.tileSize
        this.theGrid = null;
        this.myName = "minion";
        this.tickDuration = game.tickDuration; //should be able to change this to allow
        //for asyncronous entity ticks?
        this.mydirection = 0;
        // (0, 1, 2, 3) --> (up, right, down, left)

        this.timer = new Timer();
        this.timeSinceUpdate = 0;
    };

    updateMe() {
      this.timeSinceUpdate += this.timer.tick();

      if(this.timeSinceUpdate < this.tickDuration) {
        // If it is not been long enough since the last update
        // Do nothing.
        return;
      } else {
        this.timeSinceUpdate = 0;
      }
      var environment = this.whatISee();
      // var myMove = this.findMyMove(0);
      var myMove = this.findMyMove(0);
      this.makeMove(myMove, this.myTile);

    };

    //this function determines what this entity "sees"
    whatISee(){
      //currently does nothing.
    }

    // Determines the behavior of this entity depending on what is in its detection
    // range. Its range extends out to the 8 surrounding tiles.
    findMyMove(inputData){
      //keep randomly selecting values between (-1,0,1) till one doesn't go off the X-axis
      var newXCord = -1;
      var newYCord = -1;
      var changeX;
      var changeY;
      var success = 0;

      var myX = this.myTile.myX;
      var myY = this.myTile.myY;

      var maxAttempts = 15;
      while(newXCord == -1 && newYCord == -1 && maxAttempts > 0) {
        changeX = Math.floor((Math.random() * 3))-1;
        changeY = Math.floor((Math.random() * 3))-1;
        if(this.myTile.isOnMap(myX+changeX, myY+changeY)==0){
          newXCord = myX+changeX;
          newYCord = myY+changeY;
          success = 1;
        }else {
          maxAttempts -= 1;
        }
      }

      return this.theGrid[newXCord][newYCord];
    }

    // updates the references to the old tile and the new tile.
    makeMove(newMove, oldMove) {
      if (newMove != oldMove) {
        //swap the old tile's reference to this entity to the new one.
        newMove.myEntitys.push(this);
        oldMove.myEntitys.splice(oldMove.myEntitys.indexOf(this), 1);
        //swap this entity's tile from the old one to the new one.
        this.myTile = newMove;
      }
    }

    // Draw this entity.
    drawMe() {
      this.myAnimator.drawFrame(this.game.clockTick, this.game.ctx,
        this.theTileSize*this.myTile.myX, //draw myX many Tiles right
        this.theTileSize*this.myTile.myY, //draw myY tiles down.
        4
      );
    };

    currentTick() {
      return Math.floor(this.elapsedTime / this.tickDuration);
    };
}
