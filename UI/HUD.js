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

      var debugButton = new Button(
        this, this, this.theGame,
        15, 15,
        25, 25,
        25, 25,
        (function(){
          params.DEBUG_ON = !params.DEBUG_ON;
        }),
        "debug mode", null,
        false, false //debug button should always be visable.
      );
      debugButton.myColor = "white";

      var minionButton = new Button(
        this, this, this.theGame,
        15, 55,
        25, 25,
        25, 25,
        (function() {
          if(that.myFood >= 50) {
            var x = randomInt(150);
            var y = randomInt(150);
            console.log(that.myFood);
            this.theGame.spawnMe("minion", x, y);
          }
        }),
        "spawn minion", null, //has to be null if we don't want to add a spritesheet, cas I'm lazy.
        false, false
      );
      minionButton.myColor = "blue";

      var wolfButton = new Button(
        this, this, this.theGame,
        15, 95,
        25, 25,
        25, 25,
        (function() {
          var x = randomInt(150);
          var y = randomInt(150);
          console.log("spawning wolf at: (" + x + "," + y+")");
          this.theGame.spawnMe("wolf", x, y);
        }),
        "spawn wolf", null, //has to be null if we don't want to add a spritesheet, cas I'm lazy.
        true, false
      );
      wolfButton.myColor = "SaddleBrown";

      this.createStatButtons()
    }

    updateMe() {
      this.timeSinceUpdate += this.timer.tick();

      if(this.theGame.click) {
        //if there is a click, we need to let all of the buttons check if its for them.
        this.myButtons.forEach((button) => {
          button.updateMe();
        });
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
      this.createStatButtons(ctx);
      this.drawPlayerResources(ctx);

      ctx.font = params.TILE_W_H/4 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      //Bottom Left HUD
      //if (this.selected = "minion") {
      ctx.fillText(this.targetType + "'s", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2);
      ctx.fillText("STATS: ", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5);

      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';

      ctx.fillText("HEALTH: " + minionStats.HEALTH, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
      ctx.fillText("DEF: " + minionStats.DEFENSE, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
      ctx.fillText("ATK: " + minionStats.ATTACK, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
      ctx.fillText("AGI: " + minionStats.AGILITY, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
      ctx.fillText("INT: " + minionStats.INTELLIGENCE, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);

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
      ctx.fillText(("Selected: " + this.targetType), resourceX, params.TILE_W_H/4*3);
    }

    createStatButtons(ctx) {
      var newHealthButton = new Button(
        this, this, this.theGame,
        150, 600, //location of top left corner
        25, 25, //size of button hitbox
        45, 45, //size of button sprite
        this.incrementStat,  //the function to be called on it.
        "increase Health", this.HealthButt, //the text and spritesheet to use.
        false, false
      );
      this.healthButton = newHealthButton;

      // ctx.fillText("DEF", params.TILE_W_H * 4.30, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      // ctx.drawImage(this.DefButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 4.25,
      //               params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      // ctx.fillText("UPGRADE!", params.TILE_W_H * 4.0, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

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

    incrementStat(theArgs) {
      if(theArgs[0] == "incrementStat") {
        if(theArgs[1] == "HEALTH") {
          minionStats.HEALTH += theArgs[2];
          console.log("minionStats.HEALTH: "+minionStats.HEALTH)
        }
      }
    }
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
