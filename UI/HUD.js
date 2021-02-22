// Rest of the UI to hold the theGame. menu features.
class HUD{
    constructor(theGame,
      gameLength, gameHeight, hudLength, //canvas dimensions
      startingRes) {
        Object.assign(this, {theGame, gameLength, gameHeight, hudLength});

        this.minionFoodCost = 50;
        this.myFood = startingRes[0];
        this.myFoodsColor = "white";
        this.myRock = startingRes[1];
        this.myRocksColor = "white";
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
        this.theMiniMap = new MiniMap(theGame, this.miniMapX, this.miniMapY, this.hudLength);

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
        this.notMyButtons = [];
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
      this.theGame.spawnMe("wolf", x, y);
      that.hudWasClicked = true;
    }

    spawnCave() {
      var that = this;
      var x = randomInt(150) + 50;
      var y = randomInt(150) + 50;
      console.log("spawning cave at: "+x + ", "+y);
      this.theGame.spawnMe("cave", x, y);
      that.hudWasClicked = true;
    }

    spawnOgre() {
      var that = this;
      var x = randomInt(150) + 50;
      var y = randomInt(150) + 50;
      console.log("spawning ogre at: "+x + ", "+y);
      this.theGame.spawnMe("ogre", x, y);
      that.hudWasClicked = true;
    }

    buttonManagement() {
      this.buttonWasClicked = false;
      this.hudWasClicked = false;
      this.myButtons.forEach((button) => {
        //we need to see if any single button was clicked.
        this.hudWasClicked = this.hudWasClicked || button.updateMe();
      });
      this.notMyButtons.forEach((button) => {
        //we need to see if any single button was clicked.
        this.buttonWasClicked = this.buttonWasClicked || button.updateMe();

      })
      // var theClick = this.theGame.click;
      // var theCam = this.theGame.camera;
      // if(theClick && theClick.x - theCam.x < params.CANVAS_WIDTH) {
      //   //a click was found, so check to see if it was for this entity
      //   //by seeing if the click was within this entity's radius.
      //
      //   var myLoc = {
      //     x: this.x - theCam.x + this.ow,
      //     y: this.y - theCam.y + this.oh
      //   }
      //   var dist = distance(theClick, myLoc);
      //   if(dist<this.radius) {
      //     this.setSelected(this);
      //   }
      // }
      return this.selected != null;
    }

    setSelected(entity) {
      console.log(entity);
      if(entity) {
        //if entity is valid, we want to
        //make sure to update that entity as well
        //as the current one.
        if(this.selected) {
          this.selected.isSelected = false;
          this.selected = entity;
          this.selected.isSelected = true;
          this.selectionChanged = true;
        } else {
          //just update the new entity.
          this.selected = entity;
          this.selected.isSelected = true;
          this.selectionChanged = true;
        }
      } else {
        //if its not valid, we do the same without updating the new.
        //since it doesn't exist.
        if(this.selected) {
          this.selected.isSelected = false;
          this.selected = entity;
          this.selectionChanged = true;
        } else {
          //incase two clicks happen?
          this.selectionChanged = true;
        }
      }
    }

    updateMe() {
      this.timeSinceUpdate += this.timer.tick();
      this.selectionChanged = false;
      // this is used to see if we need to set selected to null;

      //if our food's color is not currently white....
      if(this.myFoodsColor != "white") {
        //we first check to see if we have a timestamp on when it was set
        var present = this.theGame.timer.lastTimestamp;
        if(!this.waitTill){
          //if not, set one.
          this.waitTill = present + 1000; //2 seconds
        } else if (present >= this.waitTill) {
          //if we have one and its not been 2 seconds. change it back.
          this.myFoodsColor = "white";
          this.waitTill = null;
        }
      }

      //if our rock's color is not currently white....
      if(this.myRocksColor != "white") {
        //we first check to see if we have a timestamp on when it was set
        var present = this.theGame.timer.lastTimestamp;
        if(!this.waitTill){
          //if not, set one.
          this.waitTill = present + 1000; //2 seconds
        } else if (present >= this.waitTill) {
          //if we have one and its not been 2 seconds. change it back.
          this.myRocksColor = "white";
          this.waitTill = null;
        }
      }

      if(!(this.timeSinceUpdate < this.timeBetweenUpdates)) {
        //if it HAS been enough time, then allow update and reset timeSinceUpdate.
        this.myFood += this.foodIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
        this.myRock += this.rockIncome * (this.timeSinceUpdate/this.timeBetweenUpdates);
        this.timeSinceUpdate = 0;
        //we need to make it so that the player's resource increment
        //gets multiplied by how much time has passed.
      }

      return this.buttonManagement();
    };

    drawMe(ctx) {
      this.drawHud(ctx);
      //draw the buttons
      this.myButtons.forEach((button) => {
        button.drawMe(ctx);
      });
      this.notMyButtons.forEach((button) => {
        button.drawMe(ctx);
      });
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
    }

    drawPlayerResources(ctx) {
      //Upper Right HUD
      ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';

      var resourceX = this.gameLength + 10;

      ctx.fillStyle = this.myFoodsColor;
      ctx.fillText(("Food: " + Math.round(this.myFood) + " + "
        + Math.round(this.foodIncome) + " food/second"), resourceX, params.TILE_W_H/4);
      ctx.fillStyle = this.myRocksColor;
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

// Minimap for the theGame..
class MiniMap {
    constructor(theGame, x, y, w) {
        Object.assign(this, {theGame, x, y, w });
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
// Rest of the UI to hold the theGame. menu features.
class UI {
    constructor(theGame, x, y, w) {
        Object.assign(this, { theGame, x, y, w });
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
