class Cave {
    constructor(theGame, x, y) {
      Object.assign(this, { theGame, x, y });
      this.theCamera = this.theGame.theSM;

      this.myType = "OGRE-CAVE";
      this.myFaction = "enemy";
      this.description = "ogres will wait to come out..."

      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/cave.png");
      this.caveAnim = new Animator(this.spritesheet, 0, 0, 2714, 1762, 1, 1, 0, false, true);

      this.state = 0;  // 0 = idle, 1 = destroyed
      this.scale = 0.07;
      this.radius = 20;

      this.myHealthBar = new HealthBar(this.theGame, this);

      this.center = {
        x: this.x +this.radius*this.scale,
        y: this.y + this.radius*this.scale
      }

      this.isSelected = false

      //Stats
      this.health = 200;
      this.defense = 0.0;
      this.attack = 0;
      this.agility = 0;

      this.state = 1;

      this.elapsedTime = 0;

      this.startRate = 20; //start by every 20 seconds.
      this.currentRate = this.startRate;
      this.accelerate = 1;
      this.minRate = 10; //slowly accelerate to every 10 seconds.
    };

    updateMe() {
        this.elapsedTime += this.theGame.clockTick;

        if (this.health <= 0) {
            this.state = 0;
        }

        this.isSelected = (this.theGame.theSM.thePlayer.selected == this);

        if (this.elapsedTime >= this.currentRate) {
            this.theGame.spawnMe("ogre", this.x+50, this.y+50);
            this.elapsedTime = 0;
            if(this.currentRate > this.maxRate) {
              this.currentRate -= this.accelerate;
            }
        }
    };

    drawMe(ctx) {
        this.caveAnim.drawFrame(this.theGame.clockTick, ctx, this.x - this.theCamera.x, this.y - this.theCamera.y, this.scale);
        this.myHealthBar.drawMe(ctx);

        if(params.DEBUG || this.isSelected) {
          ctx.save();
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
          ctx.fillStyle = "red";
          ctx.font = '16px "Playfair Display SC'
          ctx.stroke();
          ctx.restore();
        }
    };

    drawMinimap(ctx, mmX, mmY, mmW, mmH) {
      let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
      let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, 10, 10);
      ctx.restore();
    }

};
