class UpgradeButton {
  constructor(theGame, x, y, type, increase, color1, color2) {
		Object.assign(this, {theGame, x, y, type, increase, color1, color2});

		this.selected = false;
		this.mouseover = false;
		this.eat = false;

		this.foodCost = 50;

		this.buttonWidth = 63;
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
		this.drawText(ctx);
		this.upgradeStat(ctx);
    this.upgrade();
		ctx.restore();
	};

  drawBox(ctx) {
		ctx.save();
		if (this.mouseover) {
			ctx.strokeStyle = this.color1;
			ctx.setLineDash([4,2]);
      ctx.lineDashOffset = -this.dashOffset;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else if (this.selected) {
			ctx.strokeStyle = this.color2;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    } else {
      ctx.strokeStyle = this.color1;
      ctx.strokeRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
    }
		ctx.restore();
  };

  drawText(ctx) {
		ctx.save();
    ctx.font = 16 + 'px "Playfair Display SC"';
    ctx.fillStyle = "White";
    ctx.fillText(this.type + "    90 Food", this.x + 4, this.y + 16);
		ctx.restore();
  };

	upgradeStat(ctx) {
		if (this.theGame.mouse && this.selected) {
			let mouse = this.theGame.mouse;
			if ( (mouse.x < params.CANVAS_WIDTH && mouse.x > 20)
				 && (mouse.y < params.CANVAS_HEIGHT && mouse.y > 20) ) {
        const xCenter = 52.5 / 2;
   			const yCenter = 34.5 / 2;
				if(this.theGame.theSM.thePlayer.myFood >= this.foodCost) {
					this.eat = true;
				} else if (this.theGame.theSM.thePlayer.myFood < this.foodCost) {
					this.theGame.theSM.thePlayer.myFoodColor = "orange";
					ctx.save();
					ctx.fillStyle = "orange";
					ctx.globalAlpha = 1;
			 		ctx.fillText("You are short on food!", mouse.x - 3*xCenter, mouse.y - yCenter);
					ctx.restore();
				}
			}
		}
	};

  upgrade() {
		if (this.theGame.click) {
			if(this.theGame.theSM.thePlayer.myFood >= this.foodCost && this.eat) {
				this.theGame.theSM.thePlayer.myFood -= this.foodCost;
				for (var i = 0; i < this.theGame.entities.length; i++) {
            let ent = this.theGame.entities[i];
            if (ent instanceof Minion) {
                switch(this.type) {
                    case "Health":
                       ent.upgradeHealth(this.increase);
                       break;
                    case "Defense":
                       ent.upgradeDefense(this.increase);
                       break;
                    case "Attack":
                       ent.upgradeAttack(this.increase);
                       break;
                    case "Agility":
                       ent.upgradeAgility(this.increase);
                       break;
                    case "Intel":
                       ent.upgradeIntel(this.increase);
                       break;
                }
            }
        }
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
