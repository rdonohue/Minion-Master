class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    drawFrame(tick, ctx, x, y, scale, direction) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        //these directions might be wrong!
        //we might need to swap which one is "w" and which is "e"
        if(true){
          //don't rotate.
          ctx.drawImage(this.spritesheet,
              this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
              this.width, this.height,
              x, y,
              this.width * scale,
              this.height * scale);
        }
        // else if (direction == "w") {
        //   //rotate 90*
        //   ctx.save();
        //   ctx.rotate(Math.PI/2);
        //   ctx.drawImage(this.spritesheet,
        //       this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
        //       this.width, this.height,
        //       x, y,
        //       this.width * scale,
        //       this.height * scale);
        //   ctx.restore();
        // } else if (direction == "s") {
        //   //rotate 180*
        //   ctx.save();
        //   ctx.rotate(Math.PI);
        //   ctx.drawImage(this.spritesheet,
        //       this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
        //       this.width, this.height,
        //       x, y,
        //       this.width * scale,
        //       this.height * scale);
        //   ctx.restore();
        // } else if (direction == "e") {
        //   //rotate 270*
        //   ctx.save();
        //   ctx.rotate((3/2)*Math.PI); //rotate 180*
        //   ctx.drawImage(this.spritesheet,
        //       this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
        //       this.width, this.height,
        //       x, y,
        //       this.width * scale,
        //       this.height * scale);
        //   ctx.restore();
        // }
    };


    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
