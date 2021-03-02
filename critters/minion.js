class Minion {
  constructor(theGame, x, y) {
    Object.assign(this, {theGame, x, y });
    this.theCamera = this.theGame.theSM; //theSM is the theGame's theCamera.
    this.thePlayer = this.theGame.theSM.thePlayer;

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

    this.healthbar = new HealthBar(this.theGame, this);
    this.target = null;

    //Stats
    this.health = minionStats.HEALTH;
    this.maxHealth = minionStats.HEALTH;
    this.regen = this.maxHealth/20;
    this.defense = minionStats.DEFENSE;
    this.attack = minionStats.ATTACK;
    this.gatherRate = 10
    this.agility = minionStats.AGILITY;
    this.intelligence = minionStats.INTELLIGENCE;
    this.combat = false;
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
    this.visualRadius = 50 + this.intelligence*50;
    this.reachRadius = this.radius*1.2;
    this.isSelected = false;

    //i,j for cell, x,y for continuous position.
    this.myType = "MINION";
    this.myFaction = "friendly";

    // Object.assign(this, this.name);
    this.timeBetweenUpdates = 1/this.agility;
    //this gives how long this minion will wait before moving.
    //note that its the inverse of the given speed stat.

    this.timer = new Timer();
    this.timeSinceUpdate = 0;
    this.oldTargetList = [];
    this.tryToFix = false;

    this.actionTime = 0;
    this.regenTime = 0;
    this.thePlayer = this.theCamera.thePlayer;
  };

  //the move-speed is still staggered a bit, that might be because of async
  //with the draw-method being called...may need to make the minion handle its own draw-update.
  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    this.actionTime += this.theGame.clockTick;

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

    if(this.state == 1) {
      this.state = this.attackEnemy();
    } else if (this.state == 2) {
      this.state = this.gatherResources();
    } else if (this.state == 3) {
      this.state = this.moveToTarget();
    } else if (this.state == 4 || !this.target) {
      this.state = this.findNewTarget();
    } else {
      //invalid state!
      this.tryToFixSelf();
    }

    this.targetListMaintenence();
  };

  updateHealth() {
    if(this.health < 0) {
      this.state = 0;
      return; //break here NOW as we don't want to regen a minion.
    }
    if (this.regenTime >= 1) {
      this.regenTime = 0;
      //regen health.
      if(this.health < this.maxHealth) {
        this.health += this.regen;
        if (this.health > this.maxHealth) {
          this.health = this.maxHealth
        }
      }
    } else {
      this.regenTime += this.theGame.clockTick;
    }
  }

  //yes this function is INCREDABLY over-engineered, this is to GURANTEE that minions will ALWAYS
  //in some 'state' and so can be handled as such. note that this.state is NOT the actual state
  //this.state is only the *representation* of the minion's state and thats all it CAN be.

  attackEnemy() {
    if(this.actionTime >= this.actionSpeed && this.target && (this.target.state != 0 || this.target.health > 0)) {
      //we do still have a target to attack and it is alive.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var damage = (this.attack + randomInt(this.attack)) - ent.defense
        if(damage > 0) {
          ent.health -= damage; //don't heal the target by dealing negitive damage!
        }
        this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "red"));
        this.actionTime = 0;
        return 1;
      } else if ((ent.state != 0 || ent.health > 0) && !reach(this, ent)) {
        return 3;
        //the target moved out of reach, so change to searching state.
      } else {
        //this should not EVER happen!
        return "attack_method entity_handling failure";
      }
    } else if (!this.target || !(this.target.state != 0 || this.target.health < 0)){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else if (this.actionTime < this.actionSpeed) {
      //do nothing cas we are not ready to attack yet.
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "attack_method targeting failed";
    }
  }

  gatherResources() {
    if(this.actionTime >= this.actionSpeed && this.target && (this.target.health > 0)) {
      //we do still have a target to attack and it is alive and we are ready to attack.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var gather = (this.gatherRate + randomInt(this.gatherRate))
        if(gather > 0) {
          if(ent instanceof Rock) {
            ent.health -= gather; //don't heal the target by dealing negitive gather!
            this.thePlayer.myRock += gather;
          } else if (ent instanceof Bush) {
            if(this.intelligence == 0 || ent.health/ent.maxHealth > 0.1) { //make smarter minions not kill the food!
              ent.health -= gather; //don't heal the target by dealing negitive gather!
              this.thePlayer.myFood += gather;
            } else if (ent.health/ent.maxHealth < 0.1 && this.intelligence > 0) {
              this.target = null;
              return 3; // the berries are low on food.
            }
          } else {
            this.target = null;
            return 4; //somehow not a resource!.
          }
        } else {
          //failed to harvest!
        }
        this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, gather, "blue"));
        this.actionTime = 0;
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
    } else if (this.actionTime < this.actionSpeed) {
      //do nothing cas we are not ready to attack yet.
      return 2;
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "gather_method targeting failed";
    }
  }

  moveToTarget() {

    if(this.target) {
      let dist = distance(this, this.target);
      this.velocity = {
        x: (this.target.x - this.x)/dist * this.maxSpeed,
        y: (this.target.y - this.y) / dist * this.maxSpeed
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
    } else if (!this.target || !canSee(this, this.target)){
      //we lost the target or it went out of range.
      this.target = null;
      return 4;
    }
  }

  findNewTarget() {
    //first look around for enemys
    let that = this;
    if(this.intelligence == 0 ) {
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
    } else if (this.intelligence > 1 && false) {
      // //not yet functional!
      // //we are smart enough to not attack enemys bigger then us.
      // let attackWeight = 3;
      // let defenseWeight = 2;
      // let maxHealthWeight = 1;
      // let totalWeight = attackWeight + defenseWeight + maxHealthWeight
      // this.target = this.theGame.entities.filter(entity => {
      //   return (
      //     distance(this,entity) < this.visualRadius &&
      //     entity.myFaction == "enemy" &&
      //     (
      //       ((entity.attack / that.attack) * that.attackWeight) +
      //       ((entity.defense / that.defense) * that.defenseWeight) +
      //       ((entity.maxHealth / that.maxHealth) * that.maxHealthWeight)
      //     ) / (that.totalWeight) > 1
      //     //if the target's average stats are too great relative to our own, don't try to engage it.
      //     //(and weighting some more then others), this will sum up to more then 3.
      //   );
      // })
    }

    //either stop here because we have our target,
    //or search for resources.
    if(this.target) {
      return 3;
    } else {
      //search for resources
      if(this.intelligence > 0) {
        //we want to ignore bush's with less then 10% health left if we are not braindead.
        let closestHarvestable = this.theGame.entities.filter(entity => {
          return ( //don't over-harvest bushs by ignoring low-health bushs
            entity instanceof Rock ||
            (entity instanceof Bush && entity.health/entity.maxHealth > 0.1)
          )
        }).sort(function(a,b) {
          return (distance(that, a) - distance(that, b))
        }).shift();

        //if the closest is visualRadius, target it, if not, then none of them are.
        this.target = (distance(that, closestHarvestable) < that.visualRadius ? closestHarvestable : null);
      } else {
        //we are littearlly braindead and don't know better.
        let closestHarvestable = this.theGame.entities.filter(entity => {
          return ( //don't over-harvest bushs by ignoring low-health bushs
            entity instanceof Rock || entity instanceof Bush
          )
        }).sort(function(a,b) { //sort by distance to this minion.
          return (distance(that, a) - distance(that, b))
        }).shift();

        //if the closest is visualRadius, target it, if not, then none of them are.
        if(closestHarvestable && distance(that, closestHarvestable) < that.visualRadius) {
          this.target = closestHarvestable;
        }
      }
    }

    //we don't see any enemys OR resources, pick random location in sight.
    if(this.target) {
      return 3;
    } else {
      this.target = pickLocation(this);
    }

    if(this.target) {
      return 3;
    } else {
      return 4;
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
      this.state = "facing is null";
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
    this.healthbar.drawMe(ctx);

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

    this.healthbar.drawMe(ctx);
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

  targetListMaintenence() {
    let target = {
      oldTarget: this.target,
      type: null,
      health: null,
      loc: null,
      ownLoc: {
        x: this.center.x,
        y: this.center.y
      }
    };

    if(this.target) {
      //if we have a target, record certain characteristics of it.
      if(this.target.myType) {
        target.type = this.target.myType;
      }
      if(this.target.health) {
        target.health = this.target.health;
      }
      if(this.target.x && this.target.y) {
        target.loc.x = this.target.x;
        target.loc.y = this.target.y;
      }
    }

    this.oldTargetList.push(target);
    let reoccurance = 0;
    let listLength = 5; //try to maintain list length to this amount.
    if(this.oldTargetList.length > listLength) {
      //we want to maintain a list of the last bunch of targets for debugging purposes
      for(var i = 0; i < this.oldTargetList.length; i++) {
        //see how many entitys are "similar" to the current target.
        if(this.target) {
          //we have a current target, so compare "propertys"
          if(this.target.myType) {
            //it is a proper entity.

          } else {

          }
        } else {
          //we don't have a location atm, so just compare old locations.
        }
      }

      if(reoccurance/this.debugMe.lenght > 0.90) {
        //the target seems to keep reoccuring, check to see if we are at least moving

        if(distance(this.debugMe[0].location, this.location) > this.radius) {
          //we are just moving a long distance.
          this.debugMe.shift();
        } else if (this.target && this.debugMe[0].target == this.target){
          //we are just interacting with a entity, check to see if its health is changing.
          if(this.debugMe[0].target.health < this.target.health) {
            this.debuggerFunction();
            if(this.debugMe.length > listLength*2) {
              //if we are possably stuck, we should keep a longer debugger list.
              this.debugMe.shift();
            }
          } else {
            this.debugMe.shift();
          }
        }
      } else {
        //we have a low reoccurance of the target, so just maintain list.
        this.debugMe.shift();
      }
    }
  }

  debuggerFunction() {
    let printTime = this.theGame.timer.lastTimestamp;
    if(this.waitTill == 0 || !this.waitTill) {
      this.waitTill = printTime + 2500;
    } else if (this.waitTill < printTime) {
      if(!this.tryToFix) {
        if(params.DEBUG){
          console.log("we might have a stuck minion, its last 3 targets are:");
          console.log(this.debugMe)
          for(var i = this.debugMe.length-1; i > this.debugMe.length - 4 ;i--) {
            let ent = this.debugMe[i];
            if(ent && ent.target && ent.target.myType) {
              console.log((i+1) + " (entity): " + ent.target.myType + ", " + Math.round(ent.health) + ", {" + Math.round(ent.target.x) + ", " + Math.round(ent.y) + "}")
            }
            if(ent.loc) {
              console.log((i+1) + " (self location): {" + Math.round(ent.x) + ", " + Math.round(ent.y) + "}");
            }
          }
          console.log("waiting before self-fix");
        }
        //try waiting a moment.
        this.tryToFix = true;
        this.waitTill = 0;
      } else {
        //try to find new target to try to escape broken non-static state.
        tryToFixSelf();
      }
    }
  }

  tryToFixSelf() {
    this.target = null;
    this.tryToFix = false;
    if(params.DEBUG) {
      console.log("trying to self-fix");
    }
    this.state = this.findNewTarget();

  }
};
