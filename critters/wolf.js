class Wolf {
  constructor(theGame, x, y) {
      Object.assign(this, { theGame, x, y });
      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");
      this.theCamera = this.theGame.theSM; //theSM is the theGame's theCamera.
      //this.animations = [];
      //loadAnimations();

      this.mySearchingAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
      this.myLeftAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
      this.myRightAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
      this.myNorthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
      this.mySouthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
      this.myHuntingAnimator = new Animator(this.spritesheet, 320, 160, 64, 32, 4, 0.05, 0, false, true);
      this.myDeadAnimator = new Animator(this.spritesheet, 512, 202, 64, 32, 1, 3, 0, false, true);

      this.animations = [];
      this.loadAnimations();

      this.initialPoint = { x, y };

      this.scale = 1;
      this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
      this.facing = 0;

      this.baseWidth = 64;
      this.baseHeight = 24;

      this.state = 1;

      //wolf_size is how big a wolf is, they generally start small.
      this.wolf_size = randomInt(5); // [0, 4]

      //Stats
      this.maxHealth = 50 + this.wolf_size*2;
      this.health = this.maxHealth;
      this.regen = this.maxHealth/15;
      this.defense = 0 + this.wolf_size/2;
      this.attack = 3 + this.wolf_size;
      this.counterAttack = this.attack*0.1;
      this.agility = 1 + randomInt(3) - Math.floor(this.wolf_size/3);
      this.intelligence = randomInt(this.wolf_size);
      //maxWait is used for thhe max length a wolf will wait for before starting a search again.
      this.maxWait = (this.agility+this.intelligence)/2;
       //I have no idea if this is reasonable.
      this.maxSpeed = 100 + Math.ceil(this.agility) * 25;
      //for wolves, intelligence determines how far they can see.

      this.radius = this.baseWidth*this.scale/2;
      this.center = {
        x: this.x + this.baseWidth*this.scale/2,
        y: this.y + this.baseHeight*this.scale/2
      }
      this.attackRange = this.radius*1.2; //give it a little extra range.
      this.visualRadius = 50 * this.intelligence;

      this.myHealthBar = new HealthBar(this.theGame, this);
      this.isSelected = false;

      this.myType = "WOLF";
      this.myFaction = "enemy";
      this.description = "don't let them eat your minions!";

      // Object.assign(this, this.name);
      this.timeBetweenUpdates = 1/this.agility;
      //this gives how long this minion will wait before moving.
      //note that its the inverse of the given speed stat.

      this.timer = new Timer();
      this.timeSinceUpdate = 0;
      this.stateHistory = [];
      this.isBorked = false;
      this.waitTill = 0;

      this.actionTime = 0;
      this.regenTime = 0;
      this.thePlayer = this.theCamera.thePlayer;
      this.myBirth = this.theGame.timer.lastTimestamp;
      this.tick = this.theGame.tickDuration;
      this.delta = 1/this.tick;
      this.startup = null;
      this.myHealthBar = new HealthBar(this.theGame, this);
  };

  // Load the animations for this entity.
  loadAnimations() {
      for (var i = 0; i < 4; i++) {
          this.animations.push([]);
      }
      // Left
      this.animations[0].push(new Animator(this.spritesheet, 320, 288, 64, 32, 5, 0.15, 0, false, true));
      this.animations[0].push(new Animator(this.spritesheet, 320, 352, 64, 32, 5, 0.15, 0, false, true));
      this.animations[0].push(new Animator(this.spritesheet, 512, 202, 64, 25, 1, 3, 0, false, true));

      // Right
      this.animations[1].push(new Animator(this.spritesheet, 320, 128, 64, 32, 5, 0.15, 0, false, true));
      this.animations[1].push(new Animator(this.spritesheet, 320, 160, 64, 32, 5, 0.15, 0, false, true));
      this.animations[1].push(new Animator(this.spritesheet, 512, 9, 64, 25, 1, 3, 0, false, true));

      // Up
      this.animations[2].push(new Animator(this.spritesheet, 164, 134, 25, 57, 4, 0.15, 7, false, true));
      this.animations[2].push(new Animator(this.spritesheet, 164, 258, 25, 57, 5, 0.15, 7, false, true));
      this.animations[2].push(new Animator(this.spritesheet, 260, 84, 25, 40, 1, 3, 0, false, true));

      // Down
      this.animations[3].push(new Animator(this.spritesheet, 4, 192, 25, 64, 5, 0.15, 7, false, true));
      this.animations[3].push(new Animator(this.spritesheet, 4, 256, 25, 64, 5, 0.15, 7, false, true));
      this.animations[3].push(new Animator(this.spritesheet, 100, 79, 25, 49, 1, 3, 0, false, true));
  };

  // states
  // 0: dead, not moving
  // 1: idle/waiting, not moving.
  // 2: searching for prey, actually looking for prey, moving.
  // 3: hunting prey. moving towards prey.
  // 4: attacking prey. NOT MOVING.
  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    //this is called a decision tree, this is roughly 1/10th the complexity of the
    //AI's that halflife 1 used.

    //see the following:
    //  https://www.youtube.com/watch?v=JyF0oyarz4U&ab_channel=AIandGames
    //  https://en.wikipedia.org/wiki/Finite-state_machine
    //  https://en.wikipedia.org/wiki/Finite-state_machine#Usage
    if(this.state == 0 || this.health <= 0) {
      //dead, do nothing
      this.state = 0;
      this.target = null;
      this.velocity = params.ZERO;
      return;
    } else if (this.state == 1) {
      //idle, wait till elapsedTime surpasses randomly decided wait-time,
      //waittime will max out depending on the wolf's intellegence (may decrease it based on hunger.)
      //see this.maxWait above.

      //note, wolves CAN fail to see prey when in this state since their "not paying attention".
      this.idle();
      this.velocity = params.ZERO
    } else if (this.state == 2) {
      //searching for prey.
      this.target = this.search();
      if(this.target) {
        //found new spot to explore.
        this.moveTowards(this.target);
      } else {
        this.state = 1;

      }
    } else if (this.state == 3) {
      //prey has been found, check to see if its still there.
      this.target = hunt();
      this.moveTowards(this.target);
    } else if (this.state == 4) {
      attack();
    }
     //at the end of each wolf's "turn", it heals depending on how much it went through.
     //idle heals most for example
    passiveHeal(this, 1/(this.state*2));
  };

  idle() {
    //idle, wait till elapsedTime surpasses randomly decided wait-time.
    //note, wolves CAN fail to see prey when in this state since their "not paying attention".
    if(!this.wait || this.wait <= 0) {
      this.wait = Math.random(this.maxWait);
      //decide how long to wait.
      this.waitTill = this.theGame.timer.lastTimestamp + this.wait;
      //find the timeStamp to wait till.

      this.velocity = {x: 0, y: 0};
      //don't move while idle.
    } else if(this.waitTill && this.theGame.timer.lastTimestamp > this.waitTill) {
      //we have waited long enough, start hunting!
      this.wait = 0;
      this.state = 2;
    }
  }

  //looking for prey while moving towards target location (note target is a location here).
  search() {
    //looking for prey while moving towards target location (note target is a location here).
    for (var i = 0; i < this.theGame.entities.length; i++) {
      var ent = this.theGame.entities[i];
      if (ent instanceof Minion && canSee(this, ent) && !(ent.state == 0)) {
        //prey has been found!
        this.target = ent;
        //note, no prioritization currently implemented.
        //use a findPriority(listOfSeenEntitys) method

        if(distance(this, target) <= this.attackRange) {
          //prey is in range!
          this.state = 4;
        } else {
          //prey is NOT in range, move towards it!
          this.state = 3;
        }
        return this.target;
      }
      //entity is not prey!
    }
    //no prey was found at all!

    if(!this.target) {
      //do not currently have a target, so generate new spot to search.
      this.target = generateTarget(this);
      if(this.target) {
        //target location successfully generated, enter searching state.
        console.log("2");
        this.state = 2;
      } else {
        //failed to generate a target location.
        //enter idle-state.
        console.log("1");
        this.state = 1;
      }
    }
    return this.target;
  }

  hunt() {
    //we have prey, but its not in range!
    if(target && canSee(this, this.target) && !(target.state == 0)) {
      //prey is still visable and not dead, check if in range.
      if(distance(this, this.target) < this.attackRange) {
        //prey is in range, attack it!
        this.state = 4;
        velocity = params.ZERO; //don't move!
        return this.target;
        //try to keep track of the target by remembering its last location.
      } else {
        //prey is not yet in range, move towards it! (stay in state 3)
        return this.target;
      }
    } else if (!target || target.state == 0){
      //target has been lost, see if we search around more.
      this.target = this.generateTarget(this);

      //if a target was found, randomly decide to hunt again.
      var decideToSearch = Math.random(1);
      if(this.target && decideToSearch > 0.5) {
        //start hunting.
        this.state = 2;
        return this.target;
      } else {
        //enter idle.
        this.state = 1;
        return this.target;
      }
    }
    //hunt() breaks if it reachs this point.
    return {x: this.x, y: this.y};
  }

  attack() {
    if(this.target && this.target.state != 0 && this.target.health > 0) {
      //attack prey!
      var damage = attackTarget(this, this.target);
      if(Math.floor(Math.random(damage/(1 +this.wolf_size)) > this.wolf_size)) {
        this.grow();
      }
    } else {
      //target was lost,
    }
  }

  moveTowards(targetLocation) {
    var dist = distance(this, targetLocation);
    this.velocity = {
      x: (targetLocation.x - this.x)/dist * this.maxSpeed,
      y: (targetLocation.y - this.y)/dist * this.maxSpeed
    };

    this.x += this.velocity.x * this.theGame.clockTick;
    this.y += this.velocity.y * this.theGame.clockTick;

    this.facing = getFacing(this.velocity);
  }

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "brown";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }

  //this wolf has eaten enough to grow a little and also recover fully
  //since it just ate.
  grow(damage) {
    if(Math.floor(Math.random(damage/(1 + this.wolf_size)) > this.wolf_size)) {
      //the wolf grew!
      //Stats
      this.maxHealth = 50 + this.wolf_size*2;
      this.health = this.maxHealth;
      this.regen = this.maxHealth/15;
      this.defense = 0 + this.wolf_size/2;
      this.attack = 3 + this.wolf_size;
      this.counterAttack = this.attack*0.1;
      this.agility = 1 + randomInt(3) - Math.floor(this.wolf_size/3);
      this.intelligence = randomInt(this.wolf_size);
      //maxWait is used for thhe max length a wolf will wait for before starting a search again.
      this.maxWait = (this.agility+this.intelligence)/2;
       //I have no idea if this is reasonable.
      this.maxSpeed = 100 + Math.ceil(this.agility) * 25;
      //for wolves, intelligence determines how far they can see.

      this.radius = this.baseWidth*this.scale/2;
      this.center = {
        x: this.x + this.baseWidth*this.scale/2,
        y: this.y + this.baseHeight*this.scale/2
      }
      this.attackRange = this.radius*1.2; //give it a little extra range.
      this.visualRadius = 50 * this.intelligence;
    }
  }

  drawMe(ctx) {
    if (this.facing == 0) {
      this.direction = 2;
    } else if (this.facing < 4 && this.facing > 0) {
      this.direction = 1;
    } else if (this.facing == 4) {
      this.direction = 3
    } else if (this.facing > 4) {
      this.direction = 0;
    }

    this.animations[this.direction][this.state].drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.camera.x,
                                                              this.y - this.theGame.camera.y, this.scale);
    this.myHealthBar.drawMe(ctx);
  }

  //this function puts together information on this entity's current state.
  //could also be used for player.js's selection-info printing but don't bother refactoring it.
  makeStateEntry() {
    var that = this;
    const entry = {
      time: Math.round(that.theGame.timer.lastTimestamp - that.myBirth),
      oX: Math.round(that.center.x), //ownX
      oY: Math.round(that.center.y), //ownY
      health: Math.round(that.health),
      isBorked: that.isBorked,
      target: "none",
      tX: 0,
      tY: 0,
      tHealth: 0
    }
    if(that.target && that.target.myType) {
      entry.target = that.target.myType;
      entry.tX = Math.round(that.target.center.x);
      entry.tY = Math.round(that.target.center.y);
      entry.tHealth = that.target.health;
    } else if (that.target){
      entry.target = "loc";
      entry.tX = Math.round(that.target.x);
      entry.tY = Math.round(that.target.y);
    }

    return entry;
  }
};
