class TowerButton {
constructor(game, x, y) {
		Object.assign(this, {game, x, y});

		this.selected = false;
		this.mouseover = false;

		this.buttonWidth = 100;
		this.buttonHeight = 22;
    this.dashOffset = 0;

	};

  drawMe(ctx) {
		ctx.beginPath();
		this.drawBox(ctx);
		this.drawText(ctx);
		// this.drawIconHighlight(ctx);
		ctx.closePath();
	};

  drawBox(ctx) {
    ctx.strokeStyle = "White";
    if (this.selected) {
      this.dashOffset++;
      if (this.dashOffset > 16) {
        this.dashOffset = 0;
      }
      ctx.setLineDash([4,2]);
      ctx.setlineDashOffset = -this.dashOffset;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else if (this.mouseover) {
      ctx.strokeStyle = "Black";
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

  updateMe(ctx) {
    xClick = this.game.click.x
    yClick = this.game.click.y
    xMove = this.game.mouse.x
    yMove = this.game.mouse.y
    if ((xClick >= this.x && xClick <= this.x + this.buttonWidth) && (yClick >= this.y && yClick <= this.y + this.buttonHeight)) {
      this.selected = true;
    } else {
      this.selected = false;
    }

    if ((xMove >= this.x && xMove <= this.x + this.buttonWidth) && (yMove >= this.y && yMove <= this.y + this.buttonHeight)) {
      this.mouseover = true;
    } else {
      this.mouseover = false;
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
