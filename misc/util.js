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
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y)*(B.y - A.y));
};

//this method is like collide but its used for checking the entitys reach, since targets
//can bump into eachother without actually attacking and vis-versa...so they should
//be independent checks.
function reach(A, B) {
  return (distance(A, B) < A.reachRadius);
}

function checkFor(A, faction) {
  let closest = 0
  let temp = null;
  for (var i = 0; i < A.theGame.entities.length; i++) {
    var ent = A.theGame.entities[i];
    if (ent && ent.myFaction) {
      if(ent.myFaction == faction) {
        //priortize closest entity that matchs the targeted faction.
        if(!closest || closest > distance(A, ent)) {
          temp = ent;
          closest = distance(A, ent);
        }
      }
    }
  }
  if(closest < A.visualRadius) {
    return temp;
  } else {
    return null;
  }
}

function pickLocation(A) {
  temp = {
    x: null,
    y: null
  }
  attempts = 0;
  maxAttempts = 10;
  while((!temp.x || !temp.y) && attempts++ < maxAttempts) {
    let x = A.x - A.visualRadius + randomInt(2*A.visualRadius);
    let y = A.y - A.visualRadius + randomInt(2*A.visualRadius);
    if( (x < params.PLAY_WIDTH - A.radius && x > A.radius) &&
        (y < params.PLAY_HEIGHT - A.radius && y > A.radius)) {
      temp.x = x;
      temp.y = y;
    }
  }
  return temp;
}

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

// add global parameters here
var minionStats = {
  HEALTH : 100,
  DEFENSE : 0.0,
  ATTACK : 12,
  AGILITY : 3,
  INTELLIGENCE : 1,
}

var params = {
  //Tile width and height
  DEBUG: true,
  TILE_W_H : 64,
  VERT_WALL_COUNT : 10,
  HORI_WALL_COUNT : 14,
  CANVAS_WIDTH : 1024,
  CANVAS_HEIGHT : 768,
  PLAY_WIDTH : 1024,
  PLAY_HEIGHT : 768,
  BASE_SPD : 0.25,
  BLOCKWIDTH : 48  //temporary
};

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
