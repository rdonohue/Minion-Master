// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class GameEngine {
  constructor() {
      this.entities = [];
      //elements anything which don't need to be selectable, collidable or show up on the minimap
      this.elements = [];

      this.ctx = null;

      this.click = null;
      this.mouse = null;
      this.wheel = null;
      this.left = false;
      this.right = false;
      this.up = false;
      this.down = false;

      this.tickDuration = 0.1;

      this.notDead = true;
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
        case "dragon":
          let dragon = new Dragon(this, x, y);
          this.addEntity(dragon, x, y);
          break;
    }
  };

  addEntity(entity) {
    this.entities.push(entity);
  };

  addElement(element){
    this.elements.push(element);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].drawMe(this.ctx);
    }
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].drawMe(this.ctx);
    }
    this.theSM.draw(this.ctx);
  }

  update() {
    var entitiesCount = this.entities.length;
    var elementsCount = this.elements.length;

    if (!this.theSM.paused && this.notDead) {
      for (var i = 0; i < elementsCount; i++) {
        var element = this.elements[i];

        if(element.state != 0) {
          element.updateMe();
        }
      }

      for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (entity.state != 0 || (entity instanceof Ogre || entity instanceof Dragon)) {
          entity.updateMe();
        }
      }
    }
    this.theSM.update();

    for (var i = entitiesCount - 1; i >= 0; --i) {
      var entity = this.entities[i];
      if ((entity.state == 0 && !(entity instanceof Ogre || entity instanceof Dragon ))  || ((entity instanceof Ogre || entity instanceof Dragon ) && entity.removeFromWorld)) {
        this.entities.splice(i, 1);
      }
    }
    for (var i = elementsCount - 1; i >= 0; --i) {
      var element = this.elements[i];
      if (element.state == 0) {
        this.elements.splice(i, 1);
      }
    }
  };

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
