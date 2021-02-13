// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.showOutlines = false;
        this.ctx = null;
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.tickDuration = 0.1;
    };

    init(ctx, xSize, ySize, tileSize) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.thePlayer = new Player(this, this.theMap, 100, 150, 10, 5, 0, 0);
        this.startInput();
        this.timer = new Timer();
    };

    spawnMe(type, x, y){
      switch (type) {
          case "minion":
            let minion = new Minion(this, x, y);
            this.addEntity(minion);
            break;
          case "wolf":
            let wolf = new Wolf(this, x, y);
            this.addEntity(wolf);
            break;
          case "ogre":
            let ogre = new Ogre(this, x, y);
            this.addEntity(ogre);
            break;
          case "castle":
            let castle = new HomeBase(this, x, y);
            this.addEntity(castle);
            break;
          case "tower":
            let tower = new GuardTower(this, x, y);
            this.addEntity(tower);
            break;
          case "cave":
            let cave = new Cave(this, x, y);
            this.addEntity(cave);
            break;
          //case "rock":
          //  let rock = new Rock(this, x, y);
          //  this.addEntity(rock);
          //  break;
          //case "berry":
          //  let berry = new BerryBush(this, x, y);
          //  this.addEntity(berry);
          //  break;
      }
    };

    start() {
      this.addEntity(this.thePlayer);
      var that = this;
        (function gameLoop() {
            that.loop(); //changed "that" back to "this"
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {
        var that = this;

        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y };
        }

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {

            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    drawEntitys() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].drawMe(this.ctx);
        }
    };

    updateEntitys() {
        var entitiesCount = this.entities.length;

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            if (!entity.removeFromWorld) {
              entity.updateMe();
            }
        }

        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.updateEntitys();
        this.drawEntitys();
    };
};
