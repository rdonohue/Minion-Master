// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// add global parameters here
var minionStats = {
  HEALTH : 100,
  DEFENSE : 0.0,
  ATTACK : 1,
  AGILITY : 0.1,
  INTELLIGENCE : 1,
}

var params = {
  //Tile width and height
  DEBUG: true,
  TILE_W_H : 64,
  VERT_WALL_COUNT : 10,
  HORI_WALL_COUNT : 14,
  CANVAS_WIDTH : 1280,
  CANVAS_HEIGHT : 768,
  PLAY_WIDTH : 8192/3,
  PLAY_HEIGHT : 8192/3,
  BASE_SPD : 0.25,
  BLOCKWIDTH : 48,  //temporary
};

function checkLocation(location, mapBuffer) {
  //that the location is within the map.
  var x = location.x;
  var y = location.y;

  var left = x > mapBuffer;
  var right = x < params.PLAY_WIDTH - params.CANVAS_WIDTH - mapBuffer;

  var up = y > mapBuffer;
  var down = y < params.PLAY_HEIGHT - params.CANVAS_HEIGHT + mapBuffer;

  if(left && right && down && up) {
    //the location is in the map.
    return true;
  } else {
    //could not find valid location.
    return false;
  }
};

//this function generates a new location for a critter to go towards.
function generateTarget(critter) {
  var visualRadius = critter.visualRadius;
  var oldX = critter.x;
  var oldY = critter.y;
  var x = -1;
  var y = -1;

  var mapBuffer = critter.radius + 5; //don't want to go up to map itself.
  var attempts = 0;
  var maxAttempts = 10;
  var newLocation = null;

  //attempt no more then 10 times to try to find a new place to wander towards.
  //that is inside the map.
  while(!newLocation && attempts++ < maxAttempts) {
    //generate new location, note that we are techniqually
    //searching a square and not a circle but whatever.
    x = oldX + Math.random(visualRadius) - visualRadius/2;
    y = oldY + Math.random(visualRadius) - visualRadius/2;

    //Check new location for play area edge
    if(checkLocation({x, y}, mapBuffer)) {
      newLocation = {x, y};
    }
  }

  if(attempts >= maxAttempts) {
    newLocation = {oldX, oldY};
  }

  return newLocation;
};

//this function assumes the target is alive.
//this funciton returns the amount of damage dealt to target.
function attackTarget(attacker, defender) {
  //attacker always goes first.
  var damage = attacker.attack/defender.defense;
  defender.health -= damage;
  if(defender.health < 0) {
    defender.state = 0;
  } else {
    //defender survived, so they can try to attack back.
    counterDamage = defender.counterAttack/attacker.defense;
    attack.health -= counterDamage;
    if(attack.health < 0) {
      //attacker died.
      attack.state = 0;
      return 0; //return 0 to avoid triggering grow();
    } else {
      //attacker survived.
      //return damage for stat-keeping.
      return damage;
    }
  }
};

//this function handles most critters passive healing
function passiveHeal(critter, healingFactor) {
  //healing factor is dependent on if the critter is exerting itself.
  if(critter.health < critter.maxHealth) {
    critter.health += critter.regen*healingFactor;
    if(critter.health > critter.maxHealth) {
      //we are maxed out.
      critter.health = critter.maxHealth;
    }
  }
}

// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
      arr[i] = [];
    }

    return arr;
};

function distance(A, B) {
    return Math.sqrt(
      Math.abs(
        (B.x - A.x) * (B.x - A.x) +
        (B.y - A.y) * (B.y - A.y)
      )
    );
};

function collide(A, B) {
    return (distance(A, B) < A.radius + B.radius);
};

function canSee(A, B) { // if A can see B
    return (distance(A, B) < A.visualRadius + B.radius);
};

function getFacing(velocity) {
    if (velocity.x === 0 && velocity.y === 0) return 4;
    let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;

    if (-0.625 < angle && angle < -0.375) return 0;
    if (-0.375 < angle && angle < -0.125) return 1;
    if (-0.125 < angle && angle < 0.125) return 2;
    if (0.125 < angle && angle < 0.375) return 3;
    if (0.375 < angle && angle < 0.625) return 4;
    if (0.625 < angle && angle < 0.875) return 5;
    if (-0.875 > angle || angle > 0.875) return 6;
    if (-0.875 < angle && angle < -0.625) return 7;
};

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    };

    tick() {
        var current = Date.now();
        var delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        var gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    };
};
