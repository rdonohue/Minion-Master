class PauseButton {
constructor(theGame, x, y) {
		Object.assign(this, {theGame, x, y});

		this.selected = false;
		this.mouseover = false;
		this.buttonWidth = 54;
		this.buttonHeight = 22;
    this.dashOffset = 0;
	};

  drawMe(ctx) {
		ctx.save();
		this.dashOffset += 0.15;
		if (this.dashOffset > 16) {
			this.dashOffset = 0;
		}
		this.drawBox(ctx);
		this.drawText(ctx, "Pause");
		//Draw tower for placement.
		ctx.restore();
	};

  drawBox(ctx) {
		ctx.save();
		if (this.mouseover && !this.selected) {
			ctx.strokeStyle = "White";
			ctx.setLineDash([4,2]);
      ctx.lineDashOffset = -this.dashOffset;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else if (this.selected) {
			ctx.strokeStyle = "Aquamarine";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
			this.pauseScreen(ctx);
    } else {
      ctx.strokeStyle = "White";
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    }
		ctx.restore();
  };

  drawText(ctx, theText) {
    ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';
    ctx.fillStyle = "White";
    ctx.fillText(theText, this.x + 4, this.y + 16);
  };

	/*
	 * Draws a faded pause screen over the canvas.
	 */
	pauseScreen(ctx) {
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, params.CANVAS_WIDTH, params.CANVAS_HEIGHT);
		ctx.globalAlpha = 1;
		ctx.fillStyle = "white";
		ctx.font = "64px Playfair Display SC";
		let pauseTitle = "PAUSED";
		let xCenter = (params.CANVAS_WIDTH - (this.theGame.ctx.measureText(pauseTitle).width)) / 2;
		ctx.fillText(pauseTitle, xCenter, 600 / 2);
		ctx.font = "16px Playfair Display SC";
		let subtitle = "Click to Continue Game";
		xCenter = (params.CANVAS_WIDTH - (this.theGame.ctx.measureText(subtitle).width)) / 2;
		ctx.fillText(subtitle, xCenter, 675 / 2);
	};

	drawMinimap() {}

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
				this.theGame.theSM.paused = true;
	    } else {
	      this.selected = false;
				this.theGame.theSM.paused = false;
	    }
		}
  };

};
