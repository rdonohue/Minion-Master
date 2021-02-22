// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.backgroundEntities = [];
        this.entities = [];

        this.showOutlines = false;
        this.ctx = null;
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.surfaceWidth = null;
        this.surfaceHeight = null;

        this.tickDuration = 0.1;

        this.theHud = new HUD(this,
          1024, params.CANVAS_HEIGHT, 256,
          [500,60,6,4]
        );

        this.theBase;
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
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
        case "tower":
          let tower = new tower(this, x, y);
          this.addEntity(tower);
          break;
        case "cave":
          let cave = new Cave(this, x, y);
          this.addEntity(cave);
          break;
        case "base":
          let home = new HomeBase(this, x, y);
          this.theBase = home;
          this.addEntity(this.theBase);
          break;
        //case "berry":
        //  let berry = new BerryBush(this, x, y);
        //  this.addEntity(berry);
        //  break;
      }
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

    addEntity(entity) {
      if(entity.myHunger) {
        //if the entity has "myHunger",
        //tell hud to subtract that amount from the players food income.
        this.theHud.foodIncome -= entity.myHunger;
      }
      this.entities.push(entity);
    };

    addBackgroundEntity(entity) {
        this.backgroundEntities.push(entity);
    };

    drawEntitys() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i = 0; i < this.backgroundEntities.length; i++) {
            this.backgroundEntities[i].drawMe(this.ctx);
        }
        for (var i = 0; i < this.entities.length; i++) {
          this.entities[i].drawMe(this.ctx);
        }
        this.theHud.drawMe(this.ctx); //always draw the hud and the camera last.
        this.camera.draw(this.ctx);
    }

    updateEntitys() {
      if()
      this.clickedEntity = this.theHud.updateMe();
      //always update the Hud first.

      var bCount = this.backgroundEntities.length;

      for (var i = 0; i < bCount; i++) {
          var entity = this.backgroundEntities[i];
          if (entity.state != 0) {//not killed
            if(entity.updateMe()) {
              //background entitys should not be selectable, so don't handle that case
            };
          }
      }
      for (var i = this.backgroundEntities.length - 1; i >= 0; --i) {
          if (this.backgroundEntities[i].state == 0 ) {//killed
            this.backgroundEntities.splice(i, 1);
          }
      }
      var eCount = this.entities.length;
      for (var i = 0; i < eCount; i++) {
          var entity = this.entities[i];
          if (entity.state != 0) {//not killed
            this.clickedEntity = this.clickedEntity || entity.updateMe();
            if(entity.myHunger && this.theHud.myFood < 0) {
              //the player is out of food! randomly kill some of their critters
              //after that critter's last action. "myHunger" only exists
              //for the player's food-consuming entitys.
              this.handleStarvation(entity);
            }
          }
      }

      for (var i = this.entities.length - 1; i >= 0; --i) {
          if (this.entities[i].state == 0 ) {
            //killed a entity.
            if(entity.myHunger) {
              //if the entity has "myHunger",
              //tell hud to add that amount to the players food income.
              this.theHud.foodIncome += entity.myHunger;
            }
            this.entities.splice(i, 1);
          }
      }
      if(this.click && !this.clickedEntity && this.theHud.selectionChanged) {
        //if none of the Hud's buttons were clicked while updating the HUD,
        //and none of the entitys were clicked, it means the player clicked on
        //the map and we should de-select.
        this.theHud.setSelected(null);
      }
      this.camera.update();
    };

    handleStarvation(entity) {
      this.theHud.myFoodsColor = "red";
      this.ctx.fillText(("Your out of food, your critters are dieing!"),
        //warn the player of starvation.
        25, 200
      );
      //note, this code does not properly display cause of death
      //to player Or determine chance, I'm giving up on it for now

      var didDie = Math.random()/100;
      // console.log(didDie + ", " + parseFloat((1/-this.theHud.myFood).toFixed(2)));
      if(didDie > parseFloat((1/-this.theHud.myFood).toFixed(2))) {
        entity.state = 0;
        if(
          entity.x - this.camera.x < params.CANVAS_WIDTH &&
          entity.y - this.camera.y < params.CANVAS_HEIGHT) {
            //if the creature is onscreen, tell them why the critter died.
            this.ctx.fillStyle = "red";
            this.ctx.fillText(("starvation!"),
              //warn the player of starvation.
              entity.x - this.camera.x, entity.y - this.camera.y
            );
          }
      }
    }

    //this is not how AI priority should work, each AI is going to need its own priority system for
    //each enemy, this assumes they all share the same priority scieme with eachother.
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
        this.updateEntitys();
        this.drawEntitys();
        this.click = null;
    };
};
