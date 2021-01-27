class Map {
  this.numWolves = 5; //just a place-holder really.
  this.numBush = 5;
  this.numRocks = 5;
  //can pass in xHome, yHome, numRocks, numBerries, numCaves, numWolves
  //so that the caller can decide the params of this map.
  constructor(xSize, ySize) {
    Object.assign(this, {xSize, ySize});

    this.grid = createGrid(this.xSize, this.ySize);
    populateTiles(this.grid, //whatever params we get passed will get pass to this function.
      this.numRocks, this.numBush, this.numWolves);
  }
  //WARNING: JS might have different pass-by rules then I'm used to!

  //This function creates a
  createGrid() {
    //we are creating a grid with xSize rows and ySize columns
    //so we want a array with xSize arrays, each having ySize Tile-objects inside.
    var grid = [];

    for(var x = 0; x < this.xSize; x++) {
      //create a new row.
      var newRow = [];
      //populate the row by pushing a empty Tile into each entry.
      for(var y = 0; y < this.ySize; y++) {
        newRow.push(new Tile(x,y));
      }
      grid.push(newRow);
    }
    return grid;
  }

  //this function is used to populate the tiles of the map.
  populateTiles(theGrid, numRocks, numBush, numWolves){
    var numEmpty = this.xSize * this.ySize;
    var rockFail = 0;
    var bushFail = 0;
    var wolfFail = 0;
    var rockMaxFail = 10;
    var bushMaxFail = 10;
    var wolfMaxFail = 10;

    //we want to try to generate numRocks worth of rocks, but stop if
    //we fail to generate 10-times in a row.
    while(numRocks > 0 && rockFail < rockMaxFail) {
      //randomly generate X and Y position.
      var newPosX = Math.floor((Math.random() * this.xSize));
      var newPosY = Math.floor((Math.random() * this.ySize));

      //check if the target tile is ocupied.
      the_target_tile = this.grid[newPosX][newPosY];
      if (the_target_tile.myEntitys.length == 0) {
        //if it is, then put a new rock into it and subtract 1 from numRocks
        the_target_tile.myEntitys.push(new Rock(newPosX, newPosY));
        numRocks -= 1;
      } else {
        //if it is not, then we failed and we should increment the number of failures.
        rockFail += 1;
      }
    }

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


      //giveTileReferences(this.grid);
        return theGrid;
    }

    //we want to try to generate numRocks worth of rocks, but stop if
    //we fail to generate 10-times in a row.
    while(numRocks > 0 && rockFail < rockMaxFail) {
      //randomly generate X and Y position.
      var newPosX = Math.floor((Math.random() * this.xSize));
      var newPosY = Math.floor((Math.random() * this.ySize));

      //check if the target tile is ocupied.
      the_target_tile = this.grid[newPosX][newPosY];
      if (the_target_tile.myEntitys.length == 0) {
        //if it is, then put a new rock into it and subtract 1 from numRocks
        the_target_tile.myEntitys.push(new Rock(newPosX, newPosY));
        numRocks -= 1;
      } else {
        //if it is not, then we failed and we should increment the number of failures.
        rockFail += 1;
      }
    }
  }

  // My Neighbors
  // 0,  1,   2
  // 3, [ME], 4
  // 5,  6,   7
  // using the above diagram, this function gives each tile a reference
  // each of its neighboring tiles, or a "NULL" string for if its off the map.
   // giveTileReferences(theGris){
   //   for(var x = 0; x < this.xSize; x++) {
   //     for(var y = 0; y < this.ySize; y++) {
   //       the_target_tile = this.grid[x][y];
   //       the_target_tile.myNeighbors = getNeighborsOf(the_target_tile);
   //       //this function should get the 8 neighboring tiles of this tile
   //       //and put it into a array that it returns.
   //     }
   //   }
   // }

}
  getTile(x, y) {
      return this.grid[x][y];
  }

class Tile {
  constructor(myX, myY){
    Object.assign(this, {myX, myY});
    this.entities = [];

    //not yet implemented
    //this.myNeighbors = [];
  }

  // Update the references to this tile.
  updateRef(entity, add) {
      if (add == true) {
          this.entities.push(entity);
      } else {
          var found = false;
          var i = 0;
          while (!found && i < this.entities.length) {
              if (this.entities[i].x == entity.x &&
                this.entities[i].y == entity.y) {
                  this.entities.splice(i, 1);
                  found = true;
              } else {
                  i++;
              }
          }
      }
  };

  neighbors() {

  }

};
