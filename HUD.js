// Rest of the UI to hold the game menu features.
class HUD {
    constructor(game, gameLength, gameHeight, hudLength, startingRes) {
        Object.assign(this, {game, gameLength, gameHeight, hudLength});

        this.myFood = startingRes[0];
        this.myRock = startingRes[1];
        this.foodIncome = startingRes[2]
        this.rockIncome = startingRes[3]

        this.timeBetweenUpdates = 1;
        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.camX = 0;
        this.camY = 0;
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
    };

    updateMe() {
      this.timeSinceUpdate += this.timer.tick();

      // var theClick = this.theGame.click;
      // if(theClick){
      //   console.log("hud click!");
      // }

      //this is NOT the best implmentation of making the player not increment.
      if(this.timeSinceUpdate < this.timeBetweenUpdates) {
        //NOTE! we always want to respond to player input!
        return;
      } else {
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
      this.drawSelectedInfo(ctx);
      this.drawPlayerResources(ctx);
    }

    drawPlayerResources(ctx) {
      //Upper Right HUD
      ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
      ctx.fillStyle = "White";

      var resourceX = this.gameLength - 250;

      ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
        + Math.round(this.foodIncome) + " food/second"), resourceX, params.TILE_W_H/4);
      ctx.fillText(("Rock: " + Math.round(this.myRock) + " + "
        + Math.round(this.rockIncome) + " rock/second"), resourceX, params.TILE_W_H/4*2);
      ctx.fillText(("Selected: " + this.targetType), resourceX, params.TILE_W_H/4*3);
    }

    drawSelectedInfo(ctx) {
      ctx.font = params.TILE_W_H/4 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      //Bottom Left HUD
      //if (this.selected = "minion") {
      ctx.fillText(this.targetType + "'s", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 2);
      ctx.fillText("STATS: ", 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5);

      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';

      ctx.fillText("HEALTH: " + minionStats.HEALTH, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.2);
      ctx.fillText("DEF: " + 0, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.0);
      ctx.fillText("ATK: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.8);
      ctx.fillText("AGI: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.6);
      ctx.fillText("INT: " + 1, 16, params.CANVAS_HEIGHT - params.TILE_W_H * 0.4);

      //Health Stat UI
      ctx.font =  params.TILE_W_H/7 + 'px "Press Start 2P"';


      //Defense Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 4.25 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("DEF", params.TILE_W_H * 4.30, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.DefButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 4.25,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 4.0, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Attack Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 5.7 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("ATK", params.TILE_W_H * 5.7, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.AtkButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 5.7,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 5.4, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Agility Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 7.1 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("AGI", params.TILE_W_H * 7.1, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.AgiButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 7.1,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 6.8, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);

      //Intellect Stat UI
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 22, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Pink";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 21, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "Goldenrod";
      ctx.beginPath();
      ctx.arc(params.TILE_W_H * 8.5 + 16, params.CANVAS_HEIGHT - params.TILE_W_H * 1.5 + 16, 23, 0, 2*Math.PI);
      ctx.stroke();

      ctx.fillText("INT", params.TILE_W_H * 8.5, params.CANVAS_HEIGHT - params.TILE_W_H * 1.65);
      ctx.drawImage(this.IntButt, 0, 0, params.TILE_W_H / 2, params.TILE_W_H / 2, params.TILE_W_H * 8.5,
                    params.CANVAS_HEIGHT - params.TILE_W_H * 1.5, params.TILE_W_H / 2, params.TILE_W_H / 2);
      ctx.fillText("UPGRADE!", params.TILE_W_H * 8.2, params.CANVAS_HEIGHT - params.TILE_W_H * 0.65);
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
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function menuFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
};

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

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
      ctx.fillText("MiniMap", this.miniMapX + 88, this.miniMapY);
      ctx.strokeStyle = "White"
      ctx.strokeRect(this.x + 84, 552, 76, 22);

      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.w, 192);
    };

};
