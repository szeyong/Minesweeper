"use strict";

// Game objects
// 1. Initialise board model that set coordinates (row & col arrays), add mines (random), 
//    and assign numbers adjacent to mines.
// 2. Set Flags and counter for mines
// 3. Mouse click listeners to the gameplay
// 4. Zonal checks that render all cells for different actions
// 5. Set timer (1000ms)
// 6. [Future] Challenge levels: Easy(8x8), Medium(16x16), Challenge(24x24) 
// 7. [Future] A display table to log fastest time and player

// Set Variables
const boardSize = {
  '8': {
    boardWidth: '245px',
    totalMines: 15
  },
  '16': {
    boardWidth: '420px',
    totalMines: 80
  },
  '24': {
    boardWidth: '635px',
    totalMines: 150
  }
};

let size = 8; // default 8x8
let board;
let mineCount;
let adjMines;
let strikeMine;
let success;

// Colors for numbers
const colors = [
  '',        
  '#0000FF', // 1 - blue
  '#808000', // 2 - olive
  '#FF0000', // 3 - red
  '#800080', // 4 - purple
  '#008080', // 5 - teal
  '#FF00FF', // 6 - fuchsia
  '#800000', // 7 - maroon
  '#000000', // 8 - black
];

// EVENT LISTENERS

// Listen to button clicked for levels
// Setting levels => board sizes: 8x8, 16x16, 24x24
// Start/restart the game to the level chosen (determined by boardSize)
document.querySelector('#levels').addEventListener('click', function(e) {
  size = parseInt(e.target.id.replace('size-', '')); // return = 8, 16 or 24
  // console.log("size: "+size);
  start();
  render();
});

let boardElement = document.querySelector('#board');

boardElement.addEventListener('click', function(e) {
  if (success || strikeMine) return;
  // checking if clicked cell tagName is an image (which means already flagged)
  let clickedElement = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
  
  // Check if shiftKey is clicked => place a flag; or a mine is struck => reveal all, end game
  if (clickedElement.classList.contains('game-cell')) {
    if (!timerId) {
      setTimer();
    };
    let row = parseInt(clickedElement.dataset.row); // dataset convert to data-row in html
    let col = parseInt(clickedElement.dataset.col); // dataset convert to data-col in html
    let cell = board[row][col];

    if (e.shiftKey && !cell.revealed && mineCount > 0) { // check if shiftKey is clicked to place flag
      mineCount += (cell.setFlag() ? -1 : 1); // if cell.setFlag returns true, mineCount -1. 
    } else {
      strikeMine = cell.uncover();
      if (strikeMine) {
        uncoverAll(); //if True (mine struck), uncover all cells
        clearInterval(timerId); // stop timer
        e.target.style.backgroundColor = 'red'; 
      }
    }
    success = checkWinner();
    render();
  }
});

// Listener for the reset button (smiley)
function resetListener() { 
  document.querySelector('#reset').addEventListener('click', function() {
    start();
    render();
  });
}

// CLASSES

class Cell {
  constructor(row, col, board) {
      this.row = row;
      this.col = col;
      this.board = board;
      this.mines = false;
      this.flagged = false;
      this.uncovered = false;
  }
  // Traversing neighbouring cells to returns coordinates in zone array
  //                           column
  //           0     1     2     3     4     5     6     7     8
  //       0  0,0   0,1   0,2   0,3   0,4   0,5   0,6   0,7   0,8
  //       1  1,0   1,1   1,2   1,3   1,4   1,5   1,6   1,7   1,8
  //       2  2,0   2,1   2,2   2,3   2,4   2,5   2,6   2,7   2,8
  // row   3  3,0   3,1   3,2   3,3   3,4   3,5   3,6   3,7   3,8
  //       4  4,0   4,1   4,2   4,3   4,4   4,5   4,6   4,7   4,8
  //       5  5,0   5,1   5,2   5,3   5,4   5,5   5,6   5,7   5,8
  //       6  6,0   6,1   6,2   6,3   6,4   6,5   6,6   6,7   6,8
  //       7  7,0   7,1   7,2   7,3   7,4   7,5   7,6   7,7   7,8
  //       8  8,0   8,1   8,2   8,3   8,4   8,5   8,6   8,7   8,8

  zonalCells() {
      let zone = [];
      let lastRow = board.length - 1;
      let lastCol = board[0].length - 1;

      // top-left
      if (this.row > 0 && this.col > 0) {
        zone.push(board[this.row - 1][this.col - 1]);
      };
      // top
      if (this.row > 0) {
        zone.push(board[this.row - 1][this.col]);
      };
      // top-right
      if (this.row > 0 && this.col < lastCol) {
        zone.push(board[this.row - 1][this.col + 1]);
      };
      // right
      if (this.col < lastCol) {
        zone.push(board[this.row][this.col + 1]);
      };
      // bottom-right
      if (this.row < lastRow && this.col < lastCol) {
        zone.push(board[this.row + 1][this.col + 1]);
      };
      // bottom
      if (this.row < lastRow) {
        zone.push(board[this.row + 1][this.col]);
      };
      // bottom-left
      if (this.row < lastRow && this.col > 0) {
        zone.push(board[this.row + 1][this.col - 1]);
      };
      // left
      if (this.col > 0) {
        zone.push(board[this.row][this.col - 1]);  
      };     
      return zone;
  }
  // Check for number of mines beside each cell and return a number eg. 1, 2, ...7,8 
  countAdjMines() {
      // function to return an array of neighbouring cells coordinates
      let adjCells = this.zonalCells(); 
      // Callback function
      let adjMines = adjCells.reduce(function(acc, cell) {
        // console.log("value of acc: "+acc)
          return acc + (cell.mines ? 1 : 0); 
      }, 0);
      this.adjMines = adjMines;
  }

  // Set the flagged = true
  setFlag() {
      if (!this.uncovered) {  // !this.revealed is True
          this.flagged = !this.flagged; // !this.flagged is True
          return this.flagged;  // return True
      }
  }

  // Check and uncover cells
  uncover() {
      if (this.uncovered && !strikeMine) return;
      this.uncovered = true;
      if (this.mines) return true;  
      // if adjacent cells don't have mines, proceed to uncover adjacent cell/s
      if (this.adjMines === 0) {  
          var adj = this.zonalCells();
          adj.forEach(function(cell){
              if (!cell.uncovered) cell.uncover();
          });
      }
      return false;  // returning False will not strike mine
  }
}

// FUNCTIONS

// Set up a timer (1000ms)
let timeCounter;
let timerId;
function setTimer () {
  timerId = setInterval(function(){
    // console.log("Time Counter: "+timeCounter);
    timeCounter += 1;
    document.querySelector('#timer').innerText = timeCounter.toString().padStart(3, '0');
  }, 1000); //padStart() method pads a string to 000, eg. 001, 002 
};

// To uncover all the cells (end of game)
function uncoverAll() {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.uncover();
    });
  });
};

// Initialising the game
function start() {
  createBoard();
  board = setArrays(); // x and y arrays set the coordinates
  buildCells();
  mineCount = getMineCount();
  timeCounter = 0;
  clearInterval(timerId);
  timerId = null;
  strikeMine = false;
  success = false;
};

// Set up the game board
function createBoard() {
  let menuRow =
    `<tr>
      <td class="menu" colspan="${size}">
          <section id="game-status">
            <div id="mineCounter">000</div>
            <div id="reset"><img src="images/face-smiley.png"></div>
            <div id="timer">000</div>
          </section>
      </td>
    </tr>
    `;
  // building table-data(td) and table-row(tr) according to dimension (size) of game board
  boardElement.innerHTML = menuRow + `<tr>${'<td class="game-cell"></td>'.repeat(size)}</tr>`.repeat(size);
  boardElement.style.width = boardSize[size].boardWidth;
  resetListener(); // standby reset if click

  // To create individual cell's row and col values in table (td)
  // except class=menu which holds the timer and minecount
  let cells = Array.from(document.querySelectorAll('td:not(.menu)'));
  cells.forEach(function(cell, index) {
   // console.log("row: "+Math.floor(index/size));
   // console.log("col :"+index%size);
    cell.setAttribute('data-row', Math.floor(index / size)); // to get row value 0 to 8
    cell.setAttribute('data-col', index % size); // to get col value 0 to 8
  });
}

// Setup the arrays for rows and columns according to boardsize
function setArrays() {
  let arr = Array(size).fill(null); // Array(8): [null,null,null,null,null,null,null,null]
  arr = arr.map(function() {
    return new Array(size).fill(null);
  });
  // console.log(arr);
  return arr;
};

// Setup each cell to place mines, put numbers adjacent to mines
function buildCells() {
  board.forEach(function(rowArr, rowIndex) {
    rowArr.forEach(function(empty, colIndex) {
      board[rowIndex][colIndex] = new Cell(rowIndex, colIndex, board);
      // console.log(board[rowIndex][colIndex]);
    }); 
  });
  // call function to place the mines (randomly)
  placeMines();
  // Traverse every cells to add numbers beside mines, blank if no neighbouring mines 
  traverseAllCells(function(cell) {
    cell.countAdjMines();
  });
};

function traverseAllCells(cbFunct) {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cbFunct(cell);
    });
  });
}

// Assign random cells to place mines
function placeMines() {
  let currentTotalMines = boardSize[`${size}`].totalMines;
  // Assigning mines to random cells
  while (currentTotalMines !== 0) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);
    let currentCell = board[row][col]
    // check if random cell has already assigned mine
    if (!currentCell.mines){ 
      currentCell.mines = true
      currentTotalMines -= 1
    }
    //return cells (array) that has mines = true
  }
};

// Setup counter for mine
function getMineCount() {
  let count = 0;
  // For every row of cells, return number of mines (not flagged) and add to count
  board.forEach(function(row){
    count += row.filter(function(cell) {
      return cell.mines;  
    }).length // number of mines each row
  });
  return count; // total number of mines (not flagged)
};

// This function to check uncovered cell which is also not a mine
function checkWinner() {
  for (let row = 0; row<board.length; row++) {
    for (let col = 0; col<board[0].length; col++) {
      let cell = board[row][col];
      if (!cell.uncovered && !cell.mines) return false;
    }
  } 
  return true;
};

function render() {
  //padStart() method pads the mines count to 000, eg.010, 040
  document.querySelector('#mineCounter').innerText = mineCount.toString().padStart(3, '0');
  
  // Get cell values to check => flagged, uncover, mines, numbers; and assign new values, if any
  let tdList = Array.from(document.querySelectorAll('[data-row]')); // Get row array from table-data
  tdList.forEach(function(td) {
    let rowIdx = parseInt(td.getAttribute('data-row'));
    let colIdx = parseInt(td.getAttribute('data-col'));
    let cell = board[rowIdx][colIdx];

    if (cell.flagged) {
      td.innerHTML = '<img src="images/flag.png">';
    } else if (cell.uncovered) {
      if (cell.mines) {
        td.innerHTML = '<img src="images/mine.png">';
      } else if (cell.adjMines) {
        td.className = 'uncovered'
        // return number of adjacent mines for each cell, assign a color for each number
        td.style.color = colors[cell.adjMines]; 
        td.textContent = cell.adjMines;  // assign the number to print
      } else {
        td.className = 'uncovered' // set uncovered if blank too
      }
    } else {
      td.innerHTML = '';
    }
  });

  if (strikeMine) {
    document.querySelector('#reset').innerHTML = '<img src=images/face-dead.png>';
    traverseAllCells(function(cell) {
      if (!cell.mines && cell.flagged) {
        let td = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
        td.innerHTML = '<img src="images/wrong-mine.png">';
      }
    });
  } else if (success) {
    document.querySelector('#reset').innerHTML = '<img src=images/face-winner.png>';
    clearInterval(timerId); // stop timer
  }
};

start();
render();