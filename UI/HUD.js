// Rest of the UI to hold the game menu features.
class HUD{
    constructor(game,
      gameLength, gameHeight, hudLength, //canvas dimensions
      startingRes) {
        Object.assign(this, {game, gameLength, gameHeight, hudLength});

        this.myFood = startingRes[0];
        this.myRock = startingRes[1];
        this.foodIncome = startingRes[2];
        this.rockIncome = startingRes[3];

        this.timeBetweenUpdates = 1;
        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.gamePosX = 0; // not really needed
        this.gamePosY = 0;
        this.gameLength= gameLength;
        this.gameHeight = gameHeight;

        this.hudPosX = this.gameLength;
        this.hudPosY = 0;
        this.hudLength = hudLength;
        this.hudHeight = this.gameHeight;

        this.miniMapX = gameLength;
        this.minimapY = this.gameHeight - 576;
        this.theMiniMap = new MiniMap(game, this.miniMapX, this.miniMapY, this.hudLength);

        this.theGame = game;
        this.state = 1;

        this.AgiButt = ASSET_MANAGER.getAsset("./sprites/button_Agi.png");
        this.AtkButt = ASSET_MANAGER.getAsset("./sprites/button_Attack.png");
        this.DefButt = ASSET_MANAGER.getAsset("./sprites/button_Def.png");
        this.HealthButt = ASSET_MANAGER.getAsset("./sprites/button_Health.png");
        this.IntButt = ASSET_MANAGER.getAsset("./sprites/button_Int.png");

        this.targetType = null;
        this.selected = null;
        this.myName = "thePlayer";

        this.healthInc = 5;
        this.defInc = 1;
        this.agilInc = 0.5;
        this.attackInc = 2.5;
        this.intelInc = 1;

        this.debugMode = params.DEBUG_ON;
        this.myButtons = [];
        this.createButtons();
    };

    createButtons() {
      var that = this;

      var debugButton = new Button(
        this, this, this.theGame,
        15, 15,
        25, 25,
        25, 25,
        0, 0,
        (this.debugSwitch),
        "debug mode",
        null, "black"
      );

      var wolfButton = new Button(
        this, this, this.theGame,
        15, 55,
        25, 25,
        25, 25,
        0, 0,
        (this.spawnWolf),
        "spawn wolf",
        null, "SaddleBrown"
      );
      wolfButton.debugOnly = true;

      var caveButton = new Button(
        this, this, this.theGame,
        15, 95,
        25, 25,
        25, 25,
        0, 0,
        (this.spawnCave),
        "spawn cave",
        null, "black"
      );
      caveButton.debugOnly = true;

      var ogreButton = new Button(
        this, this, this.theGame,
        15, 135,
        25, 25,
        25, 25,
        0, 0,
        (this.spawnOgre),
        "spawn ogre",
        null, "orange"
      );
      ogreButton.debugOnly = true;
    }

    debugSwitch() {
      var that = this;
      params.DEBUG = !params.DEBUG;
      if(params.DEBUG) {
        console.log("debug mode is on");
      } else {
        console.log("debug mode is off");
      }
      that.buttonWasClicked = true;
    }

    spawnWolf() {
      var that = this;
      var x = randomInt(150) + 50;
      var y = randomInt(150) + 50;
      console.log("spawning wolf at: "+x + ", "+y);
      this.game.spawnMe("wolf", x, y);
      that.buttonWasClicked = true;
    }

    spawnCave() {
      var that = this;
      var x = randomInt(150) + 50;
      var y = randomInt(150) + 50;
      console.log("spawning cave at: "+x + ", "+y);
      this.game.spawnMe("cave", x, y);
      that.buttonWasClicked = true;
    }

    spawnOgre() {
      var that = this;
      var x = randomInt(150) + 50;
      var y = randomInt(150) + 50;
      console.log("spawning ogre at: "+x + ", "+y);
      this.game.spawnMe("ogre", x, y);
      that.buttonWasClicked = true;
    }

    updateMe() {
      this.timeSinceUpdate += this.timer.tick();
      this.buttonWasClicked = false;

      this.myButtons.forEach((button) => {
        button.updateMe();
      });

      if(this.theGame.click && this.theGame.click.x < params.CANVAS_WIDTH) {
        //if there is a click, we need to first check to see if it is a Hud-button.
        if(!this.buttonWasClicked) {
          //no buttons were clicked.
        } else {
          //no hud-buttons were clicked, check if a entity was.
          this.game.entities.forEach((entity) => {
            //for each entity that is selectable
            if(entity.isSelectable) {
              var dist = Math.sqrt(Math.abs(
                  (this.game.click.x - (entity.x-this.game.camera.x + entity.ow)) *
                  (this.game.click.x - (entity.x-this.game.camera.x + entity.ow)) +
                  (this.game.click.y - (entity.y-this.game.camera.y + entity.oh)) *
                  (this.game.click.y - (entity.y-this.game.camera.y + entity.oh))
                )
              );
              if(dist < entity.radius) {
                this.selected = entity; //update selected
                entity.isSelected = true;
                this.buttonWasClicked = true;
              }
            }
          })

          if(!this.buttonWasClicked && this.selected) {
            //if the player clicked on nothing, set selected to null;
            this.selected.isSelected = false;
            this.selected = null;
          }
        }
      }


      //this is NOT the best implmentation of making the player not increment.
      if(!(this.timeSinceUpdate < this.timeBetweenUpdates)) {
        //if it HAS, then allow update and reset timeSinceUpdate.
        this.myFood += this.foodIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
        this.myRock += this.rockIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
        this.timeSinceUpdate = 0;
        //we need to make it so that the player's resource increment
        //gets multiplied by how much time has passed.
      }
    };

    drawMe(ctx) {
      this.drawHud(ctx);
      this.drawPlayerResources(ctx);

      ctx.font = params.TILE_W_H/4 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";

      // Bottom Left HUD

      if (this.selected && this.selected.myType) {
        ctx.fillText(this.selected.myType + "'s", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2);
        ctx.fillText("STATS: ", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5);

        ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';

        ctx.fillText("HEALTH: " + this.selected.health, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
        ctx.fillText("DEF: " + this.selected.defense, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
        ctx.fillText("ATK: " + this.selected.attack, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
        ctx.fillText("AGI: " + this.selected.agility, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
        ctx.fillText("INT: " + this.selected.intelligence, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);
      }

      //draw the buttons
      this.myButtons.forEach((button) => {
        button.drawMe(ctx);
      });
    }

    drawPlayerResources(ctx) {
      //Upper Right HUD
      ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
      ctx.fillStyle = "White";

      var resourceX = this.gameLength + 10;

      ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
        + Math.round(this.foodIncome) + " food/second"), resourceX, params.TILE_W_H/4);
      ctx.fillText(("Rock: " + Math.round(this.myRock) + " + "
        + Math.round(this.rockIncome) + " rock/second"), resourceX, params.TILE_W_H/4*2);
      if(this.selected) {
        ctx.fillText(("Selected: " + this.selected.myType), resourceX, params.TILE_W_H/4*3);
      } else {
        ctx.fillText(("Selected: None"), resourceX, params.TILE_W_H/4*3);
      }
    }

    drawHud(ctx) {
      ctx.fillStyle = "SaddleBrown";
      ctx.fillRect(
        this.hudPosX, this.hudPosY,
        this.hudLength, this.hudHeight);
      ctx.fillRect(
        this.hudPosX, this.hudPosY,
        250, 50);

      this.theMiniMap.drawMe(ctx);
    }

    // incrementStat(theArgs) {
    //   if(theArgs[0] == "incrementStat") {
    //     if(theArgs[1] == "HEALTH") {
    //       minionStats.HEALTH += theArgs[2];
    //       console.log("minionStats.HEALTH: "+minionStats.HEALTH)
    //     }
    //   }
    // }
}

/* When the user clicks on the button,

toggle between hiding and showing the dropdown content */
// function menuFunction() {
//   document.getElementById("myDropdown").classList.toggle("show");
// };

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };

// Minimap for the game.
class MiniMap {
    constructor(game, x, y, w) {
        Object.assign(this, {game, x, y, w });
    };

    updateMe() {

    };

    drawMe(ctx) {
        ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
        ctx.fillStyle = "White";
        ctx.fillText("MiniMap", this.x + 88, 568);
        ctx.strokeStyle = "green"
        ctx.fillRect(this.x, this.y, this.w, 500);
    }
};

//putting "UI" back in at least temperarilly
// Rest of the UI to hold the game menu features.
class UI {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
    };

    updateMe() {

    };

    drawMe(ctx) {
        // ctx.fillStyle = "SaddleBrown";
        // ctx.fillRect(this.x, this.y, this.w, 576);
        // ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
        // ctx.fillStyle = "White";
        // ctx.fillText("MiniMap", this.x + 88, 568);
        // ctx.strokeStyle = "White"
        // ctx.strokeRect(this.x + 84, 552, 76, 22);
    }

};


// var newHealthButton = new Button(
//   this, this, this.theGame,
//   150, 600, //location of top left corner
//   25, 25, //size of button hitbox
//   45, 45, //size of button sprite
//   this.incrementStat,  //the function to be called on it.
//   "increase Health", this.HealthButt, //the text and spritesheet to use.
//   false, false
// );
// this.healthButton = newHealthButton;

// ctx.fillText("DEF", params.TILE_W_H * 4.30, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
// ctx.drawImage(this.DefButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 4.25,
//               params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
// ctx.fillText("UPGRADE!", params.TILE_W_H * 4.0, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
