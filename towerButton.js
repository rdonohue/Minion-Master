class TowerButton {
constructor(game, x, y) {
		Object.assign(this, {game, x, y});

		this.selected = false;
		this.mouseover = false;
		this.placing = false;

		this.buttonWidth = 100;
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
		this.drawText(ctx);
		this.drawBox(ctx);
		//Draw tower for placement.
		this.placeTower(ctx);
		this.setTower();
		ctx.restore();
	};

  drawBox(ctx) {
    ctx.strokeStyle = "White";
    if (this.selected) {
			ctx.strokeStyle = "Aquamarine";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else if (this.mouseover) {
			ctx.setLineDash([4,2]);
      ctx.lineDashOffset = -this.dashOffset;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else {
      ctx.strokeStyle = "White";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    }
  };

  drawText(ctx) {
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
    ctx.strokeStyle = "White";
    ctx.fillText("New Tower", this.x + 4, this.y + 16);
  };

/**
 * Draws a tower over the mouse for tower placement.
 */
	placeTower(ctx) {
		if (this.game.mouse && this.selected) {
			let mouse = this.game.mouse;
			if ( (mouse.x < params.CANVAS_WIDTH && mouse.x > 20)
				 && (mouse.y < params.CANVAS_HEIGHT && mouse.y > 20) ) {
				 ctx.globalAlpha = 0.25;
				 const xCenter = 52.5 / 2;
				 const yCenter = 34.5 / 2;

				 // Subtracting x/yCenter from the origin point paints the tower's center where the user clicks.
				 var x = mouse.x - xCenter;
				 var y = mouse.y - yCenter;
				 ctx.beginPath();
				 ctx.arc(x + xCenter, y + yCenter, 300, 0, 2*Math.PI);
				 ctx.setLineDash([10,5]);
				 ctx.stroke();
				 ctx.drawImage(this.spritesheet, 0, 0, 105, 138, x, y, 52.5, 69);

				 this.placing = true;
			}
		}
	};

	setTower() {
		if (this.game.click) {
			let click = this.game.click;
			if (this.placing &&
			 	 (click.x > 0 && click.x < params.CANVAS_WIDTH) &&
			 	 (click.y > 0 && click.y < params.CANVAS_HEIGHT) ) {
						this.game.spawnMe("tower", click.x + this.game.camera.x, click.y + this.game.camera.y);
						this.placing = false;
				 }
		}
	};

  updateMe() {
		if (this.game.mouse) {
			let xMove = this.game.mouse.xw
	    let yMove = this.game.mouse.y
	    if ((xMove >= this.x && xMove <= this.x + this.buttonWidth) && (yMove >= this.y && yMove <= this.y + this.buttonHeight)) {
	      this.mouseover = true;
	    } else {
	      this.mouseover = false;
	    }
		}

		if (this.game.click) {
			let xClick = this.game.click.x
	    let yClick = this.game.click.y
	    if ((xClick >= this.x && xClick <= this.x + this.buttonWidth) && (yClick >= this.y && yClick <= this.y + this.buttonHeight)) {
	      this.selected = true;
	    } else {
	      this.selected = false;
	    }
		}
  };

  // isSelected() {
  //   return this.selected;
  // };
  //
  // isMouseover() {
  //   return this.mouseover;
  // }

};
