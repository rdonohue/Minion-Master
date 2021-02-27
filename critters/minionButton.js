this.elapsedTime += this.theGame.clockTick;

this.center = {
  x: this.x + this.baseWidth*this.scale/2,
  y: this.y + this.baseHeight*this.scale/2
}
this.isSelected = (this.thePlayer.selected == this);

var dist = distance(this, this.target);
if (!this.target && this.targetID >= this.path.length - 1 || this.target && this.target.health < 0) {
    this.targetID = 0;
    this.path = [
      {
        x: randomInt(params.PLAY_WIDTH),
        y: randomInt(params.PLAY_HEIGHT)
      }];
}

// If its health is 0, it is dead.
if (this.health <= 0) {
    this.state = 2;
    this.dead = true;
    this.removeFromWorld = true;
}

if (dist < 5) {
    if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
        this.targetID++;
    }
    this.target = this.path[this.targetID];
}
var combat = false;
for (var i = 0; i < this.theGame.entities.length; i++) {
    var ent = this.theGame.entities[i];
    if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave
      || ent instanceof Rock || ent instanceof Bush) && canSee(this, ent) && ent.health > 0) {
        this.target = ent;
        combat = true;
    }
    if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && collide(this, ent)) {
        if (this.state == 0) {
            this.state = 1;
            this.elapsedTime = 0;
        } else if (this.elapsedTime > 0.8) {
            var damage = (this.attack + randomInt(this.attack)) - ent.defense;
            ent.health -= damage;
            this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
            this.elapsedTime = 0;
        }
    } else if ((ent instanceof Rock || ent instanceof Bush) && collide(this, ent) && ent.health > 0) {
        if (this.state == 0) {
            this.state = 1;
            this.elapsedTime = 0;
        } else if (this.elapsedTime > 0.8) {
            if(ent instanceof Rock) {
              var gather = 3 + randomInt(3);
              ent.health -= gather;
              this.thePlayer.myRock += gather;
            } else if (ent instanceof Bush) {
              var gather = 3 + randomInt(3);
              ent.health -= gather;
              this.thePlayer.myFood += gather;
            }
            this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, gather, "Yellow"));
            this.elapsedTime = 0;
        }
    }

}

// If it never detected an enemy, make sure it is back to walking.
if (!combat || !this.target) {
    this.state = 0;
}

dist = distance(this, this.target);
this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
  y: (this.target.y - this.y) / dist * this.maxSpeed};
this.x += this.velocity.x * this.theGame.clockTick;
this.y += this.velocity.y * this.theGame.clockTick;
this.facing = getFacing(this.velocity);
