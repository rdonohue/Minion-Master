class Minion {
    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");
        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 1, 0.1, 0, false, true);

        this.myTile = null;
        this.theGrid = null;
        this.myName = "minion";
        this.tickDuration = game.tickDuration; //should be able to change this to allow
        //for asyncronous entity ticks?

        this.elapsedTime = 0;
    };

    updateMe(tick) {
      this.elapsedTime += tick;
      let tick = this.currentTick();
      if

      var environment = this.whatISee();

      // var myMove = this.findMyMove(0);
      var myMove = this.findMyMove(0);
      this.makeMove(myMove, this.myTile);
    };

    //this function determines what this entity "sees"
    whatISee(){
      //currently does nothing.
    }

    //this function determines what this entity does based on what it sees.
    //currently just gets a random Tilefrom the 9 tiles around it including its own.
    //and picks that as its move.
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
      var newXCord = 2;
      var newYCord = 2;

      // console.log("success: "+success);
      // console.log("newX and newY : "+newXCord+","+newYCord);
      // //we (should) now have a new tile
      // console.log("theNewMove!: "+this.theGrid[newXCord][newYCord])
      return this.theGrid[newXCord][newYCord];
    }

    makeMove(newMove, oldMove) {
      if(newMove == oldMove) {
        //apparently we chose to do nothing?
      }else {
        //swap the old tile's reference to this entity to the new one.
        newMove.myEntitys.push(this);
        oldMove.myEntitys.splice(oldMove.myEntitys.indexOf(this), 1);
        //swap this entity's tile from the old one to the new one.
        this.myTile = newMove;
      }
    }

    drawMe() {
      // console.log(this.one++);
      this.myAnimator.drawFrame(this.game.clockTick, this.game.ctx,
        theTileSize*this.myTile.myX, //draw myX many Tiles right
        theTileSize*this.myTile.myY, //draw myY tiles down.
        1
      );
    };

    currentTick() {
      return Math.floor(this.elapsedTime / this.tickDuration);
    };
}
