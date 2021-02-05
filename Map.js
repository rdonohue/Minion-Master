class Map {
  //can pass in xHome, yHome, numRocks, numBerries, numCaves, numWolves
  //so that the caller can decide the params of this map.
  constructor(xSize, ySize, tileSize) {
    Object.assign(this, this.theGrid);
    this.xMax = xSize;
    this.yMax = ySize;
    this.theTileSize = tileSize;

    this.theGrid = [];
    this.createGrid(this.theGrid, xSize, ySize, tileSize);
    this.initalizeGrid();
    // this.theGrid.forEach(function(item, index, array) {
    //   console.log(item, index)
    // })
    //this.populateTiles(xSize, ySize); //, //whatever params we get passed will get pass to this function.
    // this.numRocks, this.numBush, this.numWolves);
  };

  isOnMap(theX, theY) {
    if (theX < 0 || theX > (this.theGrid.length-1)){
      return -1;
    }
    if (theY < 0 || theY > (this.theGrid[0].length-1)){
      return 1;
    }
    // console.log("this.xMax:"+this.xMax);
    // console.log("theX < 0: " + (theX < 0) );
    // console.log("this.xMax-1: " + (this.xMax-1))
    // console.log("theX > (this.xMax-1): " + (theX > (this.xMax-1)));
    //
    // console.log("this.yMax: "+this.yMax);
    // console.log("theY < 0: " + (theY < 0) );
    // console.log("this.yMax-1: " + (this.yMax-1))
    // console.log("theY > (this.yMax-1): " + (theY > (this.yMax-1)));
    return 0;
    //if(array and array[index]) {
    }


  //WARNING: JS might have different pass-by rules then I'm used to!

  //This function creates the grid for the map.
  createGrid(theGrid, theXSize, theYSize, tileSize) {
    //we are creating a grid with xSize rows and ySize columns
    //so we want a array with xSize arrays, each having ySize Tile-objects inside.

    for(var x = 0; x < theXSize; x++) {
      //create a new row.
      var newRow = [];
      //populate the row by pushing a empty Tile into each entry.
      for(var y = 0; y < theYSize; y++) {
        newRow.push(new Tile(this.theGrid, x, y, theXSize, theYSize, tileSize));
      }
      theGrid.push(newRow);
    }
  }

  spawnEntity(theEntity, theX, theY) {
    //give the entity a reference to its tile.
    theEntity.myTile = this.theGrid[theX][theY];
    theEntity.theGrid = this.theGrid;
    theEntity.removeFromWorld = false;

    //give the tile a reference to the entity.
    this.theGrid[theX][theY].myEntitys.push(theEntity);
  }

  initalizeGrid(){
    var g = this.theGrid;

    for(var x = 0; x < this.xMax; x++) {
      for(var y = 0; y < this.yMax; y++) {
        //for each tile, give it a set of all of its neighbors.
        g[x][y].meetNeighbors();
      }
    }
  }
}
class Tile {
  constructor(myGrid, myX, myY, xMax, yMax, tileSize){
    this.myEntitys = [];
    Object.assign(this, {myGrid, myX, myY, xMax, yMax});
    this.theTileSize = tileSize;
    this.myGrid = myGrid;
    this.xMax = xMax;
    this.yMax = yMax;

    this.myNeighbors = [];
  }

  //the neighbors are defined as follows:
  // nw, n   ne
  // w,  m,  e
  // sw,  s,  se
  //where m is THIS tile.
  meetNeighbors() {
    var g = this.myGrid;
    var x = this.myX;
    var y = this.myY;

    // this.m = this;
    this.m = g[x][y]; //yes, this might actually be used.
    if (x > 0) {
      this.w = g[x-1][y];
      if (y > 0) {
        this.n = g[x][y-1];
        this.nw = g[x-1][y-1];
      } else if (y < this.yMax-1) {
        this.s = g[x][y+1];
        this.sw = g[x-1][y+1];
      }
    } else if (x < this.xMax-1) {
      this.e = g[x+1][y];
      if (y > 0) {
        this.n = g[x][y-1];
        this.ne = g[x+1][y-1];
      } else if (y < this.yMax-1) {
        this.s = g[x][y+1];
        this.se = g[x+1][y+1];
      }
    }

    //now push each reference into a set as well
    this.myNeighbors.push(this.ne);
    this.myNeighbors.push(this.n);
    this.myNeighbors.push(this.nw);
    this.myNeighbors.push(this.e);
    this.myNeighbors.push(this.w);
    this.myNeighbors.push(this.se);
    this.myNeighbors.push(this.s);
    this.myNeighbors.push(this.sw);
  }

  //returns 0 if on map, returns -1 if theX is off and 1 if theY is off.
  isOnMap(theX, theY) {


    if (theX < 0 || theX > (this.xMax-1)){
      return -1;
    }
    if (theY < 0 || theY > (this.yMax-1)){
      return 1;
    }
    // console.log("this.xMax:"+this.xMax);
    // console.log("theX < 0: " + (theX < 0) );
    // console.log("this.xMax-1: " + (this.xMax-1))
    // console.log("theX > (this.xMax-1): " + (theX > (this.xMax-1)));
    //
    // console.log("this.yMax: "+this.yMax);
    // console.log("theY < 0: " + (theY < 0) );
    // console.log("this.yMax-1: " + (this.yMax-1))
    // console.log("theY > (this.yMax-1): " + (theY > (this.yMax-1)));
    return 0;
    //if(array and array[index]) {
    }
}


// killEntity(theEntity) {
//
//   var successfulKill;
//
//   if(!(theEntity.myTile instanceof NULL)) {
//     //if the entity has not already had its Tile removed, remove it.
//     theEntity.myTile = NULL;
//     successKill = True;
//   } else {
//     //if the entity has however, report this to console for debugging reasons.
//     console.log("the game tried to remove ["+theEntity+"]'s tile when it was already NULL!");
//     successKill = False;
//   }
//
//   if(!(theEntity.myTile instanceof NULL)) {
//     //if the grid has not already had the entity removed, remove it.
//     successKill = True;
//     theEntity.myTile = NULL
//   } else {
//     //if the grid has however, report this to console for debugging reasons.
//     console.log("the game tried to remove ["+theEntity+"] from the grid when it already was gone!");
//     successKill = False;
//   }
//
//   console.log("The entity ["+theEntity+"] was killed -->"+successKill);
// }
  //this function is used to populate the tiles of the map.
  // populateTiles(theGrid, numRocks, numBush, numWolves){
  //   var numEmpty = this.xSize * this.ySize;
  //   var rockFail = 0;
  //   var bushFail = 0;
  //   var wolfFail = 0;
  //   var rockMaxFail = 10;
  //   var bushMaxFail = 10;
  //   var wolfMaxFail = 10;
  //
  //   //we want to try to generate numRocks worth of rocks, but stop if
  //   //we fail to generate 10-times in a row.
  //   while(numRocks > 0 && rockFail < rockMaxFail) {
  //     //randomly generate X and Y position.
  //     var newPosX = Math.floor((Math.random() * this.xSize));
  //     var newPosY = Math.floor((Math.random() * this.ySize));
  //
  //     //check if the target tile is ocupied.
  //     the_target_tile = this.grid[newPosX][newPosY];
  //     if (the_target_tile.myEntitys.length == 0) {
  //       //if it is, then put a new rock into it and subtract 1 from numRocks
  //       the_target_tile.myEntitys.push(new Rock(newPosX, newPosY));
  //       numRocks -= 1;
  //     } else {
  //       //if it is not, then we failed and we should increment the number of failures.
  //       rockFail += 1;
  //     }
  //   }

    //repeat for bushs

    // //we want to try to generate numBerries worth of rocks, but stop if
    // //we fail to generate 10-times in a row.
    // while(numBush > 0 && bushFail < bushMaxFail) {
    //   //randomly generate X and Y position.
    //   var newPosX = Math.floor((Math.random() * this.xSize));
    //   var newPosY = Math.floor((Math.random() * this.ySize));
    //
    //   //check if the target tile is ocupied.
    //   the_target_tile = this.grid[newPosX][newPosY];
    //   if (the_target_tile.myEntitys.length == 0) {
    //     //if it is, then put a new bush into it and subtract 1 from numBush
    //     the_target_tile.myEntitys.push(new Bush(newPosX, newPosY));
    //     numBush -= 1;
    //   } else {
    //     //if it is not, then we failed and we should increment the number of failures.
    //     bushFail += 1;
    //   }

      //repeat for wolve


  //     //giveTileReferences(this.grid);
  //       return theGrid
  //   }
  //
  //   //we want to try to generate numRocks worth of rocks, but stop if
  //   //we fail to generate 10-times in a row.
  //   while(numRocks > 0 && rockFail < rockMaxFail) {
  //     //randomly generate X and Y position.
  //     var newPosX = Math.floor((Math.random() * this.xSize));
  //     var newPosY = Math.floor((Math.random() * this.ySize));
  //
  //     //check if the target tile is ocupied.
  //     the_target_tile = this.grid[newPosX][newPosY];
  //     if (the_target_tile.myEntitys.length == 0) {
  //       //if it is, then put a new rock into it and subtract 1 from numRocks
  //       the_target_tile.myEntitys.push(new Rock(newPosX, newPosY));
  //       numRocks -= 1;
  //     } else {
  //       //if it is not, then we failed and we should increment the number of failures.
  //       rockFail += 1;
  //     }
  //   }
  // }
