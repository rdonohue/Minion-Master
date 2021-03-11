class TowerButton {
constructor(theGame, x, y) {
		Object.assign(this, {theGame, x, y});

		this.selected = false;
		this.mouseover = false;
		this.placing = false;

		this.rockCost = 100

		this.buttonWidth = 63;
		this.buttonHeight = 22;
    this.dashOffset = 0;
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tower.png");
	};

  drawMe(ctx) {
		ctx.save();
		this.dashOffset += 0.15;
		if (this.dashOffset > 16) {
			this.dashOffset = 0;
		}
		this.drawBox(ctx);
		this.drawText(ctx);
		this.placeTower(ctx);
		this.setTower();
		ctx.restore();
	};

  drawBox(ctx) {
		ctx.save();
		if (this.mouseover) {
			ctx.strokeStyle = "White";
			ctx.setLineDash([4,2]);
      ctx.lineDashOffset = -this.dashOffset;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else if (this.selected) {
			ctx.strokeStyle = "Aquamarine";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else {
      ctx.strokeStyle = "White";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    }
		ctx.restore();
  };

  drawText(ctx) {
		ctx.save();
    ctx.font = 16 + 'px "Playfair Display SC"';
    ctx.fillStyle = "White";
    ctx.fillText("Tower", this.x + 4, this.y + 16);
		ctx.restore();
  };

/**
 * Draws a tower over the mouse for tower placement.
 */
	placeTower(ctx) {
		if (this.theGame.mouse && this.selected) {
			let mouse = this.theGame.mouse;
			if ( (mouse.x < params.CANVAS_WIDTH && mouse.x > 20)
				 && (mouse.y < params.CANVAS_HEIGHT && mouse.y > 20) ) {
				ctx.globalAlpha = 0.25;
				const xCenter = 52.5 / 2;
				const yCenter = 34.5 / 2;

				// Subtracting x/yCenter from the origin point paints the tower's center where the user clicks.
				var x = mouse.x - xCenter;
				var y = mouse.y - yCenter;
				ctx.save();
				ctx.beginPath();
				ctx.arc(x + xCenter, y + yCenter, 300, 0, 2*Math.PI);
				ctx.setLineDash([10,5]);
				ctx.stroke();
				ctx.drawImage(this.spritesheet, 0, 0, 105, 138, x, y, 52.5, 69);
				ctx.restore();
				if(this.theGame.theSM.thePlayer.myRock >= this.rockCost) {
					this.placing = true;
				} else if (this.theGame.theSM.thePlayer.myRock < this.rockCost) {
					this.theGame.theSM.thePlayer.myRockColor = "orange";
					ctx.save();
					ctx.fillStyle = "orange";
					ctx.globalAlpha = 1;
			 		ctx.fillText("Your short on rock!", mouse.x - 3*xCenter, mouse.y - yCenter);
					ctx.restore();
				}

			}
		}
	};

	setTower() {
		if (this.theGame.click) {
			if(this.theGame.theSM.thePlayer.myRock >= this.rockCost && this.placing) {
				this.theGame.theSM.thePlayer.myRock -= this.rockCost;
				this.theGame.spentRock += this.rockCost;
				let click = this.theGame.click;
				if (this.placing &&
					 (click.x > 0 && click.x < params.CANVAS_WIDTH) &&
					 (click.y > 0 && click.y < params.CANVAS_HEIGHT) ) {
							this.theGame.spawnMe("tower", click.x + this.theGame.theCamera.x, click.y + this.theGame.theCamera.y);
							this.theGame.towerCount++;
							this.placing = false;
					 }
				} else if (this.placing){
 					this.theGame.theSM.thePlayer.myRockColor = "orange";
					this.placing = false;
 				}
		}
	};

  updateMe() {
		if (this.theGame.mouse) {
			let xMove = this.theGame.mouse.x
	    let yMove = this.theGame.mouse.y
	    if ((xMove >= this.x && xMove <= this.x + this.buttonWidth) && (yMove >= this.y && yMove <= this.y + this.buttonHeight)) {
	      this.mouseover = true;
	    } else {
	      this.mouseover = false;
	    }
		}

		if (this.theGame.click) {
			let xClick = this.theGame.click.x
	    let yClick = this.theGame.click.y
	    if ((xClick >= this.x && xClick <= this.x + this.buttonWidth) && (yClick >= this.y && yClick <= this.y + this.buttonHeight)) {
	      this.selected = true;
	    } else {
	      this.selected = false;
	    }
		}
  };

};
