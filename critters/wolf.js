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

      this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down

      // states
      // 0: dead, not moving
      // 1: attacking prey. NOT MOVING.
      // 2: hunting prey. moving towards prey.
      // 3: searching for prey, actually looking for prey, moving.
      // 4: idle/waiting, not moving.
      this.state = 3;

      this.baseWidth = 64;
      this.baseHeight = 24;
      this.target = null;

      //wolf_size is how big a wolf is, they generally start small.
      this.wolf_size = 0;

      //base stats {
      this.maxHealth = 50 + 10 * randomInt(10);
      this.health = this.maxHealth;
      this.regen = this.maxHealth/15;
      this.defense = 5 + randomInt(3);
      this.attack = 5 + randomInt(3);
      this.agility = 1 + randomInt(3);
      this.intelligence = 1 + randomInt(1);
      // }

      this.actionSpeed = 3/this.agility

      //derived stats {
      //I have no idea if this is reasonable.
      this.maxSpeed = 25 + Math.ceil(this.agility) * 15;
      //for wolves, intelligence determines how far they can see.

      this.scale = 0.7;
      this.radius = this.baseWidth*this.scale/2;
      this.center = {
        x: this.x + this.radius,
        y: this.y + this.radius
      }

      this.reachRadius = this.radius*1.2; //give it a little extra range.
      this.visualRadius = 50 + 25 * this.intelligence;
      // }

      this.grow(randomInt(30)); //see if the wolf starts off having grown some.
      this.grow(randomInt(30));
      this.grow(randomInt(30));
      this.grow(randomInt(30));

      this.myHealthBar = new HealthBar(this.theGame, this);
      this.isSelected = false;

      this.myType = "WOLF";
      this.myFaction = "enemy";
      this.description = "don't let them eat your minions!";

      this.timer = new Timer();
      this.timeSinceUpdate = 0;
      this.stateHistory = [];
      this.isBorked = false;
      this.waitTill = 0;

      this.thePlayer = this.theCamera.thePlayer;
      this.myBirth = this.theGame.timer.lastTimestamp;
      this.tick = this.theGame.tickDuration;
      this.delta = 1/this.tick;
      this.startup = null;
      this.myHealthBar = new HealthBar(this.theGame, this);

      this.exhaustion = 0;

      this.elapsedTime = 0;
      this.actionTime = 0;
      this.printTime = 0;
      this.regenTime = 0;
  };


  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    this.actionTime += this.theGame.clockTick;
    this.printTime += this.theGame.clockTick;
    this.regenTime += this.theGame.clockTick;

    this.center = {
      x: this.x + this.radius,
      y: this.y + this.radius
    }

    this.isSelected = (this.thePlayer.selected == this);

    //states are numbered by how "important" the state is,
    //so alive/dead is determined first, followed by "if attacking"
    //followed by "if gathering"...etc.
    //0-->dead,
    //1-->attacking enemy
    //2-->moving to target (moving),
    //3-->searching for enemy/resource (moving),
    //4-->idle
    if(this.state == undefined) {
      this.state = this.findNewTarget();
    }

    this.updateHealth();
    if(this.health > 0) {
      // this.exhaustion += randomInt(this.agility/this.state);
      if(this.state == 1 && this.actionTime >= this.actionSpeed) {
        this.state = this.attackEnemy();
        this.actionTime = 0;
      } else {
        if (this.state == 2) {
          this.state = this.moveToTarget();
        } else if (this.state == 3) {
          // if(Math.random(this.exhaustion) > this.wolf_size) {
          //   this.state = this.idle();
          // } else {
          this.state = this.findNewTarget();
            // }
        } else if (this.state == 4) {
          this.state = this.idle();
        } else if (this.state == 1) {
          this.velocity = {
            x: 0,
            y: 0
          }
        } else {
          this.state = this.idle();
        }
      }
    }
    this.maxListLength = 25;
    addHistoryEntry(this, this.makeStateEntry(this), this.maxListLength, this.delta, this.isBorked);
    this.checkHistory();
    if(this.startup) {
      //do Nothing
    } else {
      this.startup = this.theGame.timer.lastTimestamp;
    }
  };

  updateHealth() {
    if(this.health <= 0) {
      this.state = 0;
    } else {
      //at the end of each wolf's "turn", it heals depending on how much it went through.
      //wandering heals most for example
      if(this.regenTime > 1) {
        let heal = passiveHeal(this, this.state/10);
        if(this.isSelected && heal > 0) {
          this.theGame.addElement(new Score(this.theGame, this.x, this.y - 10, heal, "teal"));
        } else {
          passiveHeal(this, this.state/10);
        }
        this.regenTime = 0;
      }
    }

    this.myHealthBar.updateMe();
  }

  //yes this wolf AI is INCREDABLY over-engineered, this is to GURANTEE that minions will ALWAYS be
  //in some 'state' and so can be handled as such. note that this.state is NOT the actual state
  //this.state is only the *representation* of the minion's state and thats all it CAN be.

  attackEnemy() {
    if(this.target) {
      //we do still have a target to attack and it is alive.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var damage = (this.attack + randomInt(this.attack)) - ent.defense
        if(damage < 0) {
          damage = 0 //don't heal the target by dealing negitive damage!
        }
        ent.health -= damage; //don't heal the target by dealing negitive damage!
        this.grow(damage);
        this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "red"));
        return 1;
      } else if ((ent.state != 0 || ent.health > 0) && !reach(this, ent)) {
        return 2;
        //the target moved out of reach, so change to searching state.
      } else {
        //this should not EVER happen!
        return "attack_method entity_handling failure";
      }
    } else if (!this.target || !(this.target.state != 0 || this.target.health < 0)){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "attack_method targeting failed";
    }
  }

  moveToTarget() {
    var that = this;

    if(this.target && this.target.x != this.x && this.target.y != this.y) {
      let b = this.target;
      // console.log(b);
      // console.log(this.center);
      var dist = Math.sqrt(
        (that.x - b.x) * (that.x - b.x) +
        (that.y - b.y) * (that.y - b.y)
      );

      //console.log(this + " is moving to: "+ this.target.x + ", " + this.target.y + ", " + dist);
      this.velocity = {
        x: (this.target.x - this.x)/dist * this.maxSpeed,
        y: (this.target.y - this.y)/dist * this.maxSpeed
      };

      this.x += this.velocity.x * this.theGame.clockTick;
      this.y += this.velocity.y * this.theGame.clockTick;
      this.facing = getFacing(this.velocity);

      if(reach(this, this.target)) {
        if(this.target instanceof Minion) {
          return 1;
        } else {
          //just a location, find new location.
          this.target = null;
          return 3;
        }
      } else {
        //still not reached target so stay in current mode.
        return 2;
      }
    } else {
      //!this.target || !canSee(this, this.target)
      //we lost the target or it went out of range or its our own location
      this.target = null;
      return 4;
    }
  }

  findNewTarget() {
    //first look around for enemys
    let that = this;
    if(this.intelligence >= 1){
      //we know to attack baddies and thats it.

      //create a list of enemys at moment of search, sort IN THE ARRAY by their distance
      //to this minion and then shift() returns the closest enemy.
      let closestEnemy = this.theGame.entities.filter(entity => {
        return entity instanceof Minion;
      }).sort(function(a,b) {
        return (distance(that, a) - distance(that, b))
      }).shift();

      //if the closest is in visualRadius, target it, if not, then none of them are.
      if(closestEnemy && distance(that, closestEnemy) < that.visualRadius) {
        this.target = closestEnemy;
      }
    } else if (this.intelligence >= 3) {
      //we are smart enough to not pick fights with enemys bigger then us.
      let attackWeight = 3;
      let defenseWeight = 2;
      let maxHealthWeight = 1;
      let totalWeight = attackWeight + defenseWeight + maxHealthWeight
      this.target = this.theGame.entities.filter(entity => {
        return (
          entity instanceof Minion &&
          (
            ((entity.attack / that.attack) * that.attackWeight) +
            ((entity.defense / that.defense) * that.defenseWeight) +
            ((entity.maxHealth / that.maxHealth) * that.maxHealthWeight)
          ) / (that.totalWeight) > 1
          //if the target's average stats are too great relative to our own, don't try to engage it.
          //(and weighting some more then others), this will sum up to more then 3.
        );
      }).sort(function(a,b) {
        return (distance(that, a) - distance(that, b))
      }).shift();

      //if the closest is in visualRadius, target it, if not, then none of them are.
      if(closestEnemy && distance(that, closestEnemy) < that.visualRadius) {
        this.target = closestEnemy;
      }
    }

    //we don't see any minions, pick location
    if(this.target) {
      return 1;
    } else {
      if(this.intelligence <= 1) {
        this.target = generateTarget(this);
      } else {
        //if we are not a young pup, we know to stay away from towers.
        let scary = this.theGame.entities.filter(entity => {
          return (entity instanceof Tower || entity instanceof Dragon)
        }).sort(function(a,b) {
          if(!a || !b) {
            return false;
          } else {
            return (distance(that, a) - distance(that, b))
          }
        }).shift();

        if(scary && distance(this, scary) < scary.visualRadius) {
          let runtowards = {
            x: this.x - (scary.x - this.x), //the point opposite of the tower relative to us.
            y: this.y - (scary.y - this.y)
          }
          this.target = runtowards
        } else {
          this.target = generateTarget(this);
        }
      }
    }

    if(this.target) {
      return 2;
    } else {
      this.target = null;
      return 4;
    }
  }

  idle() {
    //idle, wait till elapsedTime surpasses randomly decided wait-time.
    //note, wolves CAN fail to see prey when in this state since their "not paying attention".
    // if (this.actionTime >= this.actionSpeed){
      //sleepy doggo!
      // this.theGame.addElement(new Score(this.theGame, this.center.x, this.y, "z", "grey"));
      // this.actionTime = 0;
      // this.exhaustion -= (5 + (this.maxHealth)/100);
      // if(this.exhaustion < randomInt(this.health/100)) {
        // this.state = this.findNewTarget();
    //     this.exhaustion = 0;
    //   }
    // }

    this.state = 3;
    // if(this.waitTill == 0) {
    //   this.waitTill = this.theGame.timer.lastTimestamp + randomInt(3);
    // } else if (this.waitTill < this.theGame.timer.lastTimestamp) {
    //   this.waitTill = 0;
    //   this.state = 3; //we have waited long enough.
    // }
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
      this.wolf_size++;

      //base stats.
      this.maxHealth += 25 + 3*randomInt(2);
      this.health = this.maxHealth;
      this.regen = this.maxHealth/15;
      this.defense += 1 + randomInt(3);
      this.attack += 1 + randomInt(3);
      this.agility += 1 + randomInt(3);
      this.intelligence += 1 + randomInt(3);

      //derived stats.
      //I have no idea if this is reasonable.
      this.maxSpeed = 25 + Math.ceil(this.agility) * 15;
      //for wolves, intelligence determines how far they can see.

      this.scale += 0.1;
      this.radius = this.baseWidth*this.scale/2;
      this.center = {
        x: this.x + this.radius,
        y: this.y + this.radius
      }

      this.attackRange = this.radius*1.2; //give it a little extra range.
      this.visualRadius = 50 + 25 * this.intelligence;
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

    let temp = this.state;
    if(temp < 1 || temp == 4 || !(temp)) {
      temp = 0; //if we are dead, sleeping or broken, use "dead" animation.
    } else if (temp != 1){
      temp = 2;
    }
    this.animations[this.direction][temp].drawFrame(this.theGame.clockTick, ctx,
      this.center.x - this.theCamera.x - this.radius, this.center.y - this.theCamera.y - this.radius*0.8, this.scale);

    if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
      //display own radius.
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();

      //display visualRadius
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.visualRadius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.restore();

      if(this.target) {
        ctx.save();
        let radius;
        if(this.target.myFaction === "enemy") {
          //Attacking entity at location
          let location = {
            x: this.target.center.x,
            y: this.target.center.y
          }
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
          radius = this.target.radius
        } else if (!(this.target.myType)) {
          //searching for entity's at location
          let location = {
            x: this.target.x,
            y: this.target.y
          }
          ctx.strokeStyle = "yellow";
          ctx.fillStyle = "yellow";
          radius = this.radius;
        }
        ctx.beginPath(); //draw own radius.
        ctx.arc(location.x - this.theCamera.x, location.y - this.theCamera.y, radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.strokeRect( //draw rectangle around desired location
          location.x - this.theCamera.x, location.y - this.theCamera.y,
          radius*2, radius*2
        )
        ctx.stroke();
        ctx.fillStyle = "yellow"; //display desired motion
        ctx.fillText("moving to", location.x, location.y);
        ctx.beginPath(); //draw line from own location to desired location.
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(location.x, location.y);
        ctx.stroke();
      }
      ctx.restore();
    }
    this.myHealthBar.drawMe(ctx, this.health, this.maxHealth, "health");
    ctx.restore();


  }

  // Load the animations for this entity.
  loadAnimations() {
      for (var i = 0; i < 4; i++) {
          this.animations.push([]);
      }

      // Left
      this.animations[0].push(new Animator(this.spritesheet, 512, 202, 64, 25, 1, 3, 0, false, true)); //dead
      this.animations[0].push(new Animator(this.spritesheet, 320, 352, 64, 32, 5, 0.15, 0, false, true)); //attacking
      this.animations[0].push(new Animator(this.spritesheet, 320, 288, 64, 32, 5, 0.15, 0, false, true)); //moving

      // Right
      this.animations[1].push(new Animator(this.spritesheet, 512, 9, 64, 25, 1, 3, 0, false, true)); //dead
      this.animations[1].push(new Animator(this.spritesheet, 320, 160, 64, 32, 5, 0.15, 0, false, true)); //attacking
      this.animations[1].push(new Animator(this.spritesheet, 320, 128, 64, 32, 5, 0.15, 0, false, true)); //moving

      // Up
      this.animations[2].push(new Animator(this.spritesheet, 260, 84, 25, 40, 1, 3, 0, false, true)); //dead
      this.animations[2].push(new Animator(this.spritesheet, 164, 258, 25, 57, 5, 0.15, 7, false, true)); //attacking
      this.animations[2].push(new Animator(this.spritesheet, 164, 134, 25, 57, 4, 0.15, 7, false, true)); //moving

      // Down
      this.animations[3].push(new Animator(this.spritesheet, 100, 79, 25, 49, 1, 3, 0, false, true)); //dead
      this.animations[3].push(new Animator(this.spritesheet, 4, 256, 25, 64, 5, 0.15, 7, false, true)); //attacking
      this.animations[3].push(new Animator(this.spritesheet, 4, 192, 25, 64, 5, 0.15, 7, false, true)); //moving
  };

  printHistory() {
    let printNum = 0;
    let startup = Math.round(this.startup/this.delta); //approximate time to start up
    if(this.isBorked) {
      printNum *= 2;
    }

    let history = this.stateHistory;
    for(var i = 0; i < printNum; i++) {
      let entry = history[history.length-1-i];
      let string = "";
      string += "time: " + (entry.time - startup) + ", ";
      for(var j in entry) {
        if(entry.hasOwnProperty(j) && j != "time") {
          string += j + ": " + entry[j] + ", ";
        }
      }
      console.log(string);
    }
  }

  checkHistory() {
    let printTime = this.theGame.timer.lastTimestamp;
    if(this.waitTill == 0) {
      this.waitTill = printTime + 2000;
    } else if (this.waitTill < printTime) {
      this.waitTill = 0;
      this.amIStuck();
    }
  }

  tryToFixSelf() {
    this.target = null;
    this.state = this.findNewTarget();
    if(params.DEBUG) {
      this.printHistory();
    }
  }

  amIStuck() {
    //later I will make this method check this minion if its stuck.
    //for now it just prints out its state history.
    if(this.isSelected && params.DEBUG) {
      this.printHistory();
    }
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
