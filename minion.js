class Minion {
    constructor(game, speed) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");

        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myBattleAnimator = new Animator(this.spritesheet, 62, 5, 16, 16, 4, 0.1, 4, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 162, 7, 16, 16, 1, 0.1, 4, false, true);


        // 2:00 PM - 2:
        // 2/3/21
        // Discussed with the professor on ideas on how to develop the HUD.


        this.myTile = game.theMap.theGrid[1][1];

        //I could just make it so that this creature is only "initalized" when it has a tile....but I'm lazy
        this.theTileSize = params.TILE_W_H;
        this.myScale = 2;

        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);

        this.theGrid = game.theMap.theGrid;
        this.myHealth = 5;

        this.health = 100;
        this.defense = 0.0;
        this.attack = 1;
        this.dead = false;
        this.removeFromWorld = false;

        //i,j for cell, x,y for continuous position.

        this.myName = "minion";

        // Object.assign(this, this.name);


        this.timeBetweenUpdates = 1/speed;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.n = "n";
        this.e = "e";
        this.w = "w";
        this.s = "s";
        // (n, e, s, w) --> (up, right, down, left, diagonals don't exist)
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
      var myMove = this.findMyMove(environment);
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

      var myX = this.myTile.myX;
      var myY = this.myTile.myY;

      if (true) {
        //if dumb, do this....
        var maxAttempts = 15;
        while(newXCord == -1 && newYCord == -1 && maxAttempts > 0) {
          changeX = Math.floor((Math.random() * 3))-1;
          changeY = Math.floor((Math.random() * 3))-1;
          if (this.myTile.isOnMap(myX+changeX, myY+changeY)==0){
            newXCord = myX + changeX;
            newYCord = myY + changeY;
          } else {
            maxAttempts -= 1;
          }

        }
      }

      // console.log("success: "+success);
      // console.log("newX and newY : "+newXCord+","+newYCord);
      // //we (should) now have a new tile
      // console.log("theNewMove!: "+this.theGrid[newXCord][newYCord])
      return this.theGrid[newXCord][newYCord];
    }

    makeMove(newMove, oldMove) {
      if (newMove != oldMove) {
        //before we swap, we want to change our direction.

        //swap the old tile's reference to this entity to the new one.
        newMove.myEntitys.push(this);
        oldMove.myEntitys.splice(oldMove.myEntitys.indexOf(this), 1);
        //swap this entity's tile from the old one to the new one.
        this.myTile = newMove;
      }
      //set up velocity --> when inside <small distance), be ready for next update.
      //
    }


    // Engaging in combat with minions.
    fight(enemy) {
        if (enemy.health != 0 && this.health != 0) {
            enemy.health -= Math.floor(this.attack - (enemy.defense * this.attack));
            this.health -= Math.floor(enemy.attack - (this.defense * enemy.attack));
            if (enemy.health <= 0) {
                enemy.die();
            }
            if (this.health <= 0) {
                die();
            }
        }
    };

    damage(projectile) {
      // this.health -= Math.floor(projectile.attack - (this.defense * projectile.attack));
      // if (this.health <= 0) {
      //    die();
      // }
    };

    die() {
        this.dead = true;
        this.removeFromWorld = true;
        this.myTile = NULL;
    }

    drawMe() {

    };

    drawMinimap(ctx, mmX, mmY) {
        ctx.fillStyle = "Orange";
        ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {

      // console.log(this.one++);
      //use current "direction" to decide how to draw.
      this.drawMinimap(ctx, this.myTile.myX, this.myTile.myY);
      this.myAnimator.drawFrame(this.game.clockTick, this.game.ctx,
        params.TILE_W_H*(3/2)+params.TILE_W_H*this.myTile.myX, //draw myX many Tiles right
        params.TILE_W_H*(3/2)+params.TILE_W_H*this.myTile.myY, //draw myY tiles down.
        this.myScale, this.myDirection
      );
      if(this.isSelected) {
        ctx.font = params.TILE_W_H/4 + 'px "test TEXT"';
        ctx.fillStyle = "White";
        ctx.fillText(("myName: " + this.myName),
          params.TILE_W_H*(3/2)+params.TILE_W_H*this.myTile.myX,
          params.TILE_W_H*(3/2)+params.TILE_W_H*this.myTile.myY);
      }
    };
}
