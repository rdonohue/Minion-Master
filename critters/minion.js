class Minion {
  constructor(theGame, x, y) {
    Object.assign(this, {theGame, x, y });
    this.theCamera = this.theGame.theSM; //theSM is the theGame's theCamera.
    this.thePlayer = this.theGame.theSM.thePlayer;

    this.x = x;
    this.y = y;

    // Different sprites for directions and interactions
    this.downAttack = ASSET_MANAGER.getAsset("./sprites/minion/down_attack.png");
    this.downWalk = ASSET_MANAGER.getAsset("./sprites/minion/down_walk.png");
    this.pickUp = ASSET_MANAGER.getAsset("./sprites/minion/pick_up.png");
    this.sideAttack = ASSET_MANAGER.getAsset("./sprites/minion/side_attack.png");
    this.sideWalk = ASSET_MANAGER.getAsset("./sprites/minion/side_walk.png");
    this.upAttack = ASSET_MANAGER.getAsset("./sprites/minion/up_attack.png");
    this.upWalk = ASSET_MANAGER.getAsset("./sprites/minion/up_walk.png");

    // Down
    this.downWalkAnim = new Animator(this.downWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.downAttackAnim = new Animator(this.downAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Left
    this.leftWalkAnim = new Animator(this.sideWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.leftAttackAnim = new Animator(this.sideAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Right
    this.rightWalkAnim = new Animator(this.sideWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.rightAttackAnim = new Animator(this.sideAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Up
    this.upWalkAnim = new Animator(this.upWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.upAttackAnim = new Animator(this.upAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Pick Up
    this.leftPick = new Animator(this.pickUp, 0, 0, 64, 64, 5, 0.25, 0, false, true);
    this.rightPick = new Animator(this.pickUp, 0, 0, 64, 64, 5, 0.25, 0, false, true);

    this.animations = [];
    this.loadAnimations();

    this.scale = 1;
    this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
    this.state = 4;
    this.priority = 0;

    this.target = null;

    //Stats
    this.health = minionStats.HEALTH;
    this.maxHealth = minionStats.HEALTH;
    this.regen = this.maxHealth/20;
    this.defense = 1;
    this.attack = minionStats.ATTACK;
    this.gatherRate = 2
    this.agility = minionStats.AGILITY;
    this.intelligence = minionStats.INTELLIGENCE+1;

    this.maxSpeed = this.agility*50;
    this.actionSpeed = 3/this.agility

    this.velocity = {
      x: 0,
      y: this.maxSpeed
    };

    this.baseWidth = 32;
    this.baseHeight = 32;
    this.radius = this.baseWidth/2*this.scale;
    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    this.visualRadius = 100 + this.intelligence*25;
    this.reachRadius = this.radius*1.2;
    this.isSelected = false;

    //i,j for cell, x,y for continuous position.
    this.myType = "MINION";
    this.myFaction = "friendly";
    this.description = "your loyal servent";

    this.timer = new Timer();
    this.timeSinceUpdate = 0;
    this.stateHistory = [];
    this.isBorked = false;
    this.waitTill = 0;

    this.actionTime = 0;
    this.thePlayer = this.theCamera.thePlayer;
    this.myBirth = this.theGame.timer.lastTimestamp;
    this.tick = this.theGame.tickDuration;
    this.delta = 1/this.tick;
    this.startup = null;
    this.myHealthBar = new HealthBar(this.theGame, this);
    this.elapsedTime = 0;
    this.actionTime = 0;
    this.printTime = 0;
    this.regenTime = 0;
  };

  //the move-speed is still staggered a bit, that might be because of async
  //with the draw-method being called...may need to make the minion handle its own draw-update.
  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    this.actionTime += this.theGame.clockTick;
    this.printTime += this.theGame.clockTick;
    this.regenTime += this.theGame.clockTick;

    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }

    this.facing = getFacing(this.velocity);

    this.isSelected = (this.thePlayer.selected == this);

    //states are numbered by how "important" the state is,
    //so alive/dead is determined first, followed by "if attacking"
    //followed by "if gathering"...etc.
    //0-->dead,
    //1-->attacking enemy
    //2-->gathering resource.
    //3-->moving to target (moving),
    //4-->searching for enemy/resource (moving),

    this.updateHealth();
    if(this.health > 0) {
      if(this.actionTime >= this.actionSpeed) {
        if(this.state == 1) {
          this.state = this.attackEnemy();
        } else if (this.state == 2) {
          this.state = this.gatherResources();
        }
        this.actionTime = 0;
      } else {
        if (this.state == 3) {
          this.state = this.moveToTarget();
        } else if (this.state == 4) {
          this.state = this.findNewTarget();
        } else if (this.state == 1 || this.state == 2) {
          this.velocity = {
            x: 0,
            y: 0
          }
        } else {
          this.tryToFixSelf(); //invalid state!
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

  //yes this minion AI is INCREDABLY over-engineered, this is to GURANTEE that minions will ALWAYS be
  //in some 'state' and so can be handled as such. note that this.state is NOT the actual state
  //this.state is only the *representation* of the minion's state and thats all it CAN be.

  attackEnemy() {
    if(this.target) {
      //we do still have a target to attack and it is alive.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0 || ((entity instanceof Ogre || entity instanceof Dragon ) && !entity.removeFromWorld)) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var damage = (this.attack + randomInt(this.attack)) - ent.defense
        if(damage < 0) {
          damage = 0 //don't heal the target by dealing negitive damage!
        }
        ent.health -= damage; //don't heal the target by dealing negitive damage!
        this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "red"));
        return 1;
      } else if ((ent.state != 0 || ent.health > 0 || ((entity instanceof Ogre || entity instanceof Dragon ) && !entity.removeFromWorld)) && !reach(this, ent)) {
        return 3;
        //the target moved out of reach, so change to searching state.
      } else {
        //this should not EVER happen!
        return "attack_method entity_handling failure";
      }
    } else if (!this.target || !(this.target.state != 0 || this.target.health < 0 || ((entity instanceof Ogre || entity instanceof Dragon ) && entity.removeFromWorld))){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "attack_method targeting failed";
    }
  }

  gatherResources() {
    if(this.target) {
      //we do still have a target to attack and it is alive and we are ready to attack.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var gather = (this.gatherRate + randomInt(this.gatherRate))
        if(ent.health - gather < 0) {
          gather = ent.health; //don't let the minion's create resources from nothing!
        }
        if(gather > 0) {
          if(ent instanceof Rock) {
            ent.health -= gather; //don't heal the target by dealing negitive gather!
            this.thePlayer.myRock += gather;
          } else if (ent instanceof Bush) {
            if(this.intelligence <= 1 || ent.health/ent.maxHealth > 0.1) { //make smarter minions not kill the food!
              ent.health -= gather; //don't heal the target by dealing negitive gather!
              this.thePlayer.myFood += gather;
            } else if (ent.health/ent.maxHealth < 0.1 && this.intelligence > 1) {
              this.target = null;
              return 3; // the berries are low on food.
            }
          } else {
            this.target = null;
            return 4; //somehow not a resource!.
          }
          this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, gather, "blue"));
          this.actionTime = 0;
        } else {
          //failed to harvest!
        }
        return 2; //keep gathering.
      } else if ((ent.state != 0 || ent.health > 0) && !reach(this, ent)) {
        //the target moved out of range, so change to hunt-mode.
        return 3;
      } else {
        //this should not EVER happen!
        return "gather_method entity_handling failure";
      }
    } else if (!this.target || this.target.state == 0){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "gather_method targeting failed";
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
        if(this.target.myFaction === "enemy") {
          return 1;
        } else if (this.target.myFaction === "resource"){
          return 2;
        } else {
          //just a location, find new location.
          this.target = null;
          return 4;
        }
      } else {
        //still not reached target so stay in current mode.
        return 3;
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
    if(this.intelligence == 1 ) {
      //we are too dumb to attack anything.
    } else if (this.intelligence >= 1){
      //we know to attack baddies and thats it.

      //create a list of enemys at moment of search, sort IN THE ARRAY by their distance
      //to this minion and then shift() returns the closest enemy.
      let closestEnemy = this.theGame.entities.filter(entity => {
        return entity.myFaction == "enemy";
      }).sort(function(a,b) {
        return (distance(that, a) - distance(that, b))
      }).shift();

      //if the closest is visualRadius, target it, if not, then none of them are.
      if(closestEnemy && distance(that, closestEnemy) < that.visualRadius) {
        this.target = closestEnemy;
      }
    } else if (this.intelligence >= 2) {
      //we are smart enough to not pick fights with enemys bigger then us.
      let attackWeight = 3;
      let defenseWeight = 2;
      let maxHealthWeight = 1;
      let totalWeight = attackWeight + defenseWeight + maxHealthWeight
      this.target = this.theGame.entities.filter(entity => {
        return (
          entity.myFaction == "enemy" &&
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

      //if the closest is visualRadius, target it, if not, then none of them are.
      if(closestEnemy && distance(that, closestEnemy) < that.visualRadius) {
        this.target = closestEnemy;
      }
    }

    //either stop here because we have our target,
    //or search for resources.
    if(this.target) {
      return 3;
    } else {
      //search for resources
      if(this.intelligence > 1) {
        //we want to ignore bush's with less then 10% health left if we are not braindead.
        let closestHarvestable = this.theGame.entities.filter(entity => {
          return ( //don't over-harvest bushs by ignoring low-health bushs
            entity instanceof Rock ||
            (entity instanceof Bush && entity.health/entity.maxHealth > 0.1)
          )
        }).sort(function(a,b) {
          if(!a || !b) {
            return false;
          } else {
            return (distance(that, a) - distance(that, b))
          }
        }).shift();

        //if the closest is visualRadius, target it, if not, then none of them are.
        if(closestHarvestable && distance(that, closestHarvestable) < that.visualRadius) {
          this.target = closestHarvestable;
        }
      } else {
        //we are littearlly braindead and don't know better.
        let closestHarvestable = this.theGame.entities.filter(entity => {
          return ( //don't over-harvest bushs by ignoring low-health bushs
            entity instanceof Rock || entity instanceof Bush
          )
        }).sort(function(a,b) { //sort by distance to this minion.
          if(!a || !b) {
            return false;
          } else {
            return (distance(that, a) - distance(that, b))
          }
        }).shift();

        //if the closest is visualRadius, target it, if not, then none of them are.
        if(closestHarvestable && distance(that, closestHarvestable) < that.visualRadius) {
          this.target = closestHarvestable;
        }
      }
    }

    //we don't see any enemys OR resources, pick location that which is proprotionally far to our
    //intelligence. more intelligence makes the movement less erratic as a result
    if(this.target) {
      return 3;
    } else {
      this.target = generateTarget(this);
    }

    if(this.target) {
      return 3;
    } else {
      this.target = null;
      return "failed to find target";
    }
  }

  drawMe(ctx) {
    let temp;
    if (this.state == 3 || this.state == 4) {
      temp = 0;
    } else if (this.state == 1 || this.state == 2) {
      temp = 1;
    } else {
      temp = 0; //if dead or broken.
    }

    if (this.facing == 0) {
      this.direction = 2;
    } else if (this.facing < 4 && this.facing > 0) {
      this.direction = 1;
    } else if (this.facing == 4) {
      this.direction = 3
    } else if (this.facing > 4) {
      this.direction = 0;
    } else {
      this.direction = 0;
    }

    let tempAdjust = 70; //I'm not sure why the sprites are so off-center, but I'm doing this for now.

    var w = this.animations[temp][this.direction].width;

    if (this.direction == 1) {
      ctx.save();
      ctx.scale(-1, 1);
      switch (temp) {
        //Walking
        case 0: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                        -(this.x - this.theGame.theCamera.x) - w,
                        this.y - this.theGame.theCamera.y,
                        this.scale, 4);
                                                              break;
        //Attacking
        case 1: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                        -(this.x - this.theGame.theCamera.x) - w,
                        this.y - this.theGame.theCamera.y,
                        this.scale, 2);
                                                              break;
      }
      ctx.restore();
    } else {
      switch (temp) {
        case 0: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                        this.x - this.theGame.theCamera.x,
                        this.y - this.theGame.theCamera.y,
                        this.scale, 4);
                                                              break;
        case 1: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                        this.x - this.theGame.theCamera.x,
                        this.y - this.theGame.theCamera.y,
                        this.scale, 2);
                                                              break;
      }
    }

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
        } else if (this.target.myFaction === "resource") {
          //harvesting entity at location
          let location = {
            x: this.target.center.x,
            y: this.target.center.y
          }
          ctx.strokeStyle = "blue";
          ctx.fillStyle = "blue";
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
  };

  loadAnimations() {
    this.animations.push([]);
    this.animations.push([]);

    // Idle/Walking
    this.animations[0].push(this.leftWalkAnim);
    this.animations[0].push(this.rightWalkAnim);
    this.animations[0].push(this.upWalkAnim);
    this.animations[0].push(this.downWalkAnim);

    // Attacking
    this.animations[1].push(this.leftAttackAnim);
    this.animations[1].push(this.rightAttackAnim);
    this.animations[1].push(this.upAttackAnim);
    this.animations[1].push(this.downAttackAnim);
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "orange";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }

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
      //console.log("minion at: {" + this.center.x + "," + this.center.y + "} self fixing, changed to: " + this.state + " and targeting: "+ this.target.x + ", " + this.target.y);
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
