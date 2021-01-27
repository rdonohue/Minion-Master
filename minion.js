class Minion {
    constructor(game, intelligence, speed) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");
        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);

        this.myTile = game.theMap.theGrid[1][1];
        //I could just make it so that this creature is only "initalized" when it has a tile....but I'm lazy
        this.myTargetTile = null;
        this.theTileSize = game.theMap.tileSize
        this.theGrid = game.theMap.theGrid;

        this.myName = "minion";

        this.timeBetweenUpdates = 1/speed;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.n = "n";
        this.e = "e";
        this.w = "w";
        this.s = "s";
        // (n, e, s, w) --> (up, right, down, left, diagonals don't exist)
        this.myIntelligence = intelligence;
        this.timer = new Timer();
        this.timeSinceUpdate = 0;
    };

//the move-speed is still staggered a bit, that might be because of async
//with the draw-method being called...may need to make the minion handle its own draw-update.
    updateMe() {
      this.timeSinceUpdate += this.timer.tick();

      //this is NOT the best implmentation of making this minion not move till its ready.
      if(this.timeSinceUpdate < this.timeBetweenUpdates) {
        //if its not been long enough since the last update
        //do nothing.
        return;
      } else {
        //if it HAS, then allow update and reset timeSinceUpdate.
        this.timeSinceUpdate = 0;
      }
      var environment = this.whatISee();
      // var myMove = this.findMyMove(0);
      var myMove = this.findMyMove(this.myIntelligence);
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

      var r = Math.floor((Math.random() * 2))-1;

      if(true) {
        //if dumb, do this....
        var maxAttempts = 15;
        while(newXCord == -1 && newYCord == -1 && maxAttempts > 0) {
          changeX = Math.floor((Math.random() * 3))-1;
          changeY = Math.floor((Math.random() * 3))-1;
          if(this.myTile.isOnMap(myX+changeX, myY+changeY)==0){
            newXCord = myX + changeX;
            newYCord = myY + changeY;
          } else {
            maxAttempts -= 1;
          }
        }
      } else {
        //otherwise, do this.

        // this.myTile.myNeighbors;
      }

      //randomly decide if we check up/down or left/right first to handle
      //diagonals by basically choosing between the two directions at random.
      if (Math.floor((Math.random() * 2))-1){
        //handle X first
        if (changeX > 0) {
          this.myDirection = this.e;
        } else {
          this.myDirection = this.w;
        }
        if (changeY > 0) {
          this.myDirection = this.s;
        } else {
          this.myDirection = this.n;
        }
      } else {
        //handle Y first
        if (changeY > 0) {
          this.myDirection = this.s;
        } else {
          this.myDirection = this.n;
        }
        if (changeX > 0) {
          this.myDirection = this.e;
        } else {
          this.myDirection = this.w;
        }
      }
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
        //before we swap, we want to change our direction.

        //swap the old tile's reference to this entity to the new one.
        newMove.myEntitys.push(this);
        oldMove.myEntitys.splice(oldMove.myEntitys.indexOf(this), 1);
        //swap this entity's tile from the old one to the new one.
        this.myTile = newMove;
      }
    }

    drawMe() {
      // console.log(this.one++);
      //use current "direction" to decide how to draw.
      this.myAnimator.drawFrame(this.game.clockTick, this.game.ctx,
        this.theTileSize*this.myTile.myX, //draw myX many Tiles right
        this.theTileSize*this.myTile.myY, //draw myY tiles down.
        4, this.myDirection
      );
    };
}
