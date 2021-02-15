class Wolf {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");

        //this.animations = [];
        //loadAnimations();

        this.mySearchingAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myLeftAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myRightAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myNorthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.mySouthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myHuntingAnimator = new Animator(this.spritesheet, 320, 160, 64, 32, 4, 0.05, 0, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 512, 202, 64, 32, 1, 3, 0, false, true);
        this.state = 0;
        //wolves should have a few states, these are used for the animator.

        this.initialPoint = {x, y};

        this.myScale = 1; //does not include wolf_size!
        this.myDirection = 0; // 0 = left, 1 = right, 2 = up, 3 = down

        //wolf_size is how big a wolf is, they generally start small.
        this.wolf_size = randomInt(5); // [0, 4]

        //Stats
        this.maxHealth = 50 + this.wolf_size*2;
        this.health = this.maxHealth;
        this.defense = 0 + this.wolf_size/2;
        this.attack = 3 + this.wolf_size;
        this.agility = 1/(this.wolf_size*4);
        this.intelligence = randomInt(3);
        //for wolves, intelligence determines how far they can see.

        this.removeFromWorld = false;

        this.myType = "wolf";
        this.radius = 20 + 2 * this.wolf_size; //making wolves get bigger.
        this.attackRange = 5
        this.visualRadius = 50 * this.intelligence;

        this.path = [];

        this.maxSpeed = 100 + this.wolf_size*25;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;
    };

    updateMe() {
        this.elapsedTime += this.game.clockTick;

        //return a list of entitys that this wolf can see.
        //(and cares about)
        var environment = this.whatISee();

        //use that list to decide what to do.
        //litterally just a entity or location.
        var target = this.decide(environment);
        if(target.myType) {
          this.state = 1; //we have a target that is food!
        } else {
          this.state = 0; //we don't have any food!
        }

        //if its a minion, move towards it or attack it.
        //otherwise, move towards target.
        this.move(target);
    }

    //this method generates a list of targets this wolf can see.
    //it then sorts it based on priority.

    //for now, the priority is just if it can see a minion or not.
    whatISee() {
      var whatISee = [];
      if(this.path.length > 0 && this.path[0].myType) {
        //if we already see prey, don't look around (may change implementation later).
        whatISee.push(this.path[0]);
        return whatISee;
      }
      for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (canSee(this, ent) && !ent.removeFromWorld) {
          if(ent.myType == "Minion"){
            whatISee.push(ent);
          }
        }
      }
      //shuffle list based on distance to self.
      whatISee.sort(function(a,b){return distance(this, a) - distance(this, b)});
      return whatISee;
    }

    //this method returns the next target for the wolf to act on (move or attack).
    decide(env) {
      var target = null;

      if(this.path && this.path[this.path.length-1]) {
        //if we already have a target and it is prey, don't change.
        target = [this.path.length-1];
        if(target && target.myType) {
          //if we already have prey, don't change course.
        } else if (env[0]){
          //since we don't already have a target,
          //check the environment for the closest prey.
          target = env[0];
        } else {
          //we don't see any prey, but we also don't have anything better to do.
          if(distance(this, this.path[0]) < this.radius) {
            target = this.path.shift(); //remove the first element from the list
            //and shift over.
          }
        }

        if
      } else {
        //we don't have a path anymore (somehow), so we start over.
        this.path = [];
        this.path.push(this.generateRandomTarget());
        target = this.path[0];
      }

      //
    }

    move(target) {
      var targetID = 0;
      if (this.path && this.path[0]) {
        this.target = this.path[targetID];
      }

      var dist = distance(this, this.target);
      this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
        y: (this.target.y - this.y) / dist * this.maxSpeed};

      var dist = distance(this, this.target);
      if (dist < 5) {
          if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
              this.targetID++;
          }
          this.target = this.path[this.targetID];
      }

      dist = distance(this, this.target);
      this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
        y: (this.target.y - this.y) / dist * this.maxSpeed};

      this.x += this.velocity.x * this.game.clockTick;
      this.y += this.velocity.y * this.game.clockTick;

      this.facing = getFacing(this.velocity);

      if (this.health <= 0) {
          this.state = 2;
          this.removeFromWorld = true;
      }
    }



    // Load the animations for this entity.
    loadAnimations() {
        for (var i = 0; i < 4; i++) {
            this.animations[i].push([]);
            for (var j = 0; j < 3; j++) {
                this.animations[i][j].push([]);
            }
        }
        // Left
        this.animations[0][0] = new Animator(this.spritesheet, 320, 288, 64, 32, 5, 0.15, 0, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 320, 352, 64, 32, 5, 0.05, 0, false, true);
        this.animations[0][2] = new Animator(this.spritesheet, 512, 202, 64, 25, 1, 3, 0, false, true);

        // Right
        this.animations[1][0] = new Animator(this.spritesheet, 320, 128, 64, 32, 5, 0.15, 0, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 320, 160, 64, 32, 5, 0.05, 0, false, true);
        this.animations[1][2] = new Animator(this.spritesheet, 512, 9, 64, 25, 1, 3, 0, false, true);

        // Up
        this.animations[2][0] = new Animator(this.spritesheet, 164, 134, 25, 57, 5, 0.15, 7, false, true);
        this.animations[2][1] = new Animator(this.spritesheet, 164, 258, 25, 57, 5, 0.15, 7, false, true);
        this.animations[2][2] = new Animator(this.spritesheet, 260, 84, 25, 40, 1, 3, 0, false, true);

        // Down
        this.animations[3][0] = new Animator(this.spritesheet, 4, 192, 25, 64, 5, 0.15, 7, false, true);
        this.animations[3][1] = new Animator(this.spritesheet, 4, 256, 25, 64, 5, 0.15, 7, false, true);
        this.animations[3][2] = new Animator(this.spritesheet, 100, 79, 25, 49, 1, 3, 0, false, true);
    };

    drawMinimap(ctx, mmX, mmY) {

    };

    drawMe(ctx) {
      //this.animations[this.direction][this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
      if(this.removeFromWorld) {
        this.myDeadAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale*0.8+this.wolf_size/10);
      } else if (this.state == 0) {
          this.mySearchingAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale*0.8+this.wolf_size/10);
      } else if (this.state == 1) {
          this.myHuntingAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale*0.8+this.wolf_size/10);
      } else {
          this.myDeadAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale*0.8+this.wolf_size/10);
      }
    };
};
