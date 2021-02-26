// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class GameEngine {
  constructor() {
      this.entities = [];
      this.background = [];

      this.ctx = null;

      this.click = null;
      this.mouse = null;
      this.wheel = null;
      this.left = false;
      this.right = false;
      this.up = false;
      this.down = false;

      this.tickDuration = 0.1;
  };

  init(ctx) {
      this.ctx = ctx;
      this.cameraWidth = this.ctx.canvas.width;
      this.cameraHeight = this.ctx.canvas.height;
      this.mapWidth = params.PLAY_WIDTH;
      this.mapHeight = params.PLAY_HEIGHT;
      this.startInput();
      this.timer = new Timer();
  };

  start() {
    var that = this;
      (function gameLoop() {
          that.loop();
          requestAnimFrame(gameLoop, that.ctx.canvas);
      })();
  };

  spawnMe(type, x, y){
    switch (type) {
        case "minion":
          let minion = new Minion(this, x, y);
          this.addEntity(minion, x, y);
          break;
        case "wolf":
          let wolf = new Wolf(this, x, y);
          this.addEntity(wolf, x, y);
          break;
        case "ogre":
          let ogre = new Ogre(this, x, y);
          this.addEntity(ogre, x, y);
          break;
        case "castle":
          let castle = new HomeBase(this, x, y);
          this.theBase = castle;
          this.addEntity(castle, x, y);
          break;
        case "tower":
          let tower = new Tower(this, x, y);
          this.addEntity(tower, x, y);
          break;
        case "cave":
          let cave = new Cave(this, x, y);
          this.addEntity(cave, x, y);
          break;
        //case "berry":
        //  let berry = new BerryBush(this, x, y);
        //  this.addEntity(berry);
        //  break;
    }
  };

  addEntity(entity, x, y) {
    this.entities.push(entity);
    // this.entities.forEach((other) => {
    //   if(collide(entity, other)) {
    //     this.addEntity(entity, x + 5, y + 5);
    //   }
    // });
    // if(
    //   x > this.mapWidth-entity.radius  ||
    //   y > this.mapHeight-entity.radius ||
    //   x < 0 + entity.radius ||
    //   y < 0 + entity.radius
    // ){
    //   console.log("new entity: " + entity.myType + " is off the map!");
    // } else {
    //   this.entities.forEach((other) => {
    //     if(collide(entity, other)) {
    //       this.addEntity(entity, x + 5, y + 5);
    //     }
    //   });
    // }
    //we want to make sure that any new entities are not colliding with any already present entitys.
  };

  addBackground(background){
    this.background.push(background);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].drawMe(this.ctx);
    }
    this.theCamera.draw(this.ctx);
  }

  update() {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
      var entity = this.entities[i];

      if (!entity.removeFromWorld) {
        entity.updateMe();
      }
    }
    this.theSM.update();

    for (var i = this.entities.length - 1; i >= 0; --i) {
      if (this.entities[i].removeFromWorld) {
        this.entities.splice(i, 1);
      }
    }
  };

  entityPriority() {
    var priority = 0;
    for (var i = 0; i < this.entities.length; i++) {
      if (this.entities[i].priority > priority) {
        priority = this.entities[i].priority;
      }
    }
    return priority;
  }

  loop() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.click = null;
  };

  startInput() {
    var that = this;

    var getXandY = function (e) {
      var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
      var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

      return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener("mousemove", function (e) {
      // console.log(getXandY(e));
      that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
      // console.log(getXandY(e));
      that.click = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
      //console.log(getXandY(e));
      that.rightclick = getXandY(e);
      e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          that.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          that.right = true;
          break;
        case "ArrowUp":
        case "KeyW":
          that.up = true;
          break;
        case "ArrowDown":
        case "KeyS":
          that.down = true;
            break;
      }
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          that.left = false;
          break;
        case "ArrowRight":
        case "KeyD":
          that.right = false;
          break;
        case "ArrowUp":
        case "KeyW":
          that.up = false;
          break;
        case "ArrowDown":
        case "KeyS":
          that.down = false;
          break;
        }
    }, false);
  };
};
