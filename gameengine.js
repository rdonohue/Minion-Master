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

    createANDSpawnEntity(type){
      if (type == "minion") {
          let minion = new Minion(this);
          this.addEntity(minion);
      } else if (type == "wolf") {
          //let wolf = new Wolf(this);
          //this.addEntity(wolf);
          //minion.drawMe(this.ctx);
      }
    }

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

    removeEntity(entity){
        this.entities.splice(i, 1); //remove the entity from gameengines own list.
    }

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
                this.removeEntity(this.entities[i]);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.updateEntitys();
        this.drawEntitys();
    };
};
