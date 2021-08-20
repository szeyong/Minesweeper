# Minesweeper Game
Minesweeper is a classic Microsoft Windows game which was first introduced in the standard install of Windows 3.1 in 1992. This is a screenshot of the Windows 98 version of Microsoft Minesweeper.

<img src="https://szeyong.github.io/project1/images/win98version-minesweeper.png">

The goal of the game is to uncover all the squares on a gridboard that do not contain mines without being "blown up" by clicking on a cell with a mine hidden beneath. There is a logical process to discover the location of the mines, but some will require guessing, with a 50-50 chance of being correct. Clicking on any cell will reveal what is hidden underneath. Some cells are empty while some contain numbers (from 1 to 8), with each number being the number of mines adjacent to the uncovered cell.



<img src="https://szeyong.github.io/project1/images/project1_screenshot.png">
Screenshot: This is my version of the game


## Playing the Game

You can try the game [here](https://szeyong.github.io/project1/index.html)

**Win the game:** Uncover all cells without hitting the mines!

**Lose the game:** You hit/uncover a mine. Game Over!

### How to play
1. Select the board size (8x8, 16x16, 24x24)
2. Top of the board:
- Left display: Total number of mines
- Right display: Timer
- Centre button (Smiley): Reset
3. Click on any cell on the board to start the game (and the timer will start concurrently).
5. If you uncovered a number (from 1 to 8), it depicts the number of mines adjacent to it (that is covered).
7. If you uncovered an empty cell, a number of adjacent empty cells may be uncovered too.
8. If you uncovered a mine, game over.
9. If you suspect a cell that has a mine hidden, you can put a flag on it. This can be done by **"Shift + Click"**. When a flag is added, display will show the number of mines left (top left display).
10. To win the game, all numbered and empty cells have to be uncovered.

## The Project and Challenges

The game is build using HTML, CSS and Vanilla Javascript. 

### Approach

I begin the project by drawing a simple wireframe of how I want the game board to look like. Then the flow (and rule) of the game is being ran through, with notes on the actions required. For a start, decided to use vanilla JS and begin by building a simple 6x6 board using tables in HTML, and later on manipulate the table-data and elements in JS. While going through the game logic, a list of "what-to-build" came up:

- Build board model that set coordinates (row & col arrays),
- Initialising game
- Place mines (randomly) and assign "numbers" adjacent to mines.
- Able to put Flags, and create counter for number of mines
- Event listeners: on cell, on reset, set flag
- Create zonal checks (eg. around each cell), render through every cell
- Win and lose logic
- Timer
- Set difficulty levels (board sizes)


### Challenges

The game logic is pretty straightforward if you are a fan of minesweeper, but building it does not come without challenges. I spent the most time in building the structure of the board (the table, arrays, cell, etc). However, once the main structure is ready (and with the game logic keep running in your mind), the various functions, class and listeners that support the game play then starts building up. Console logging (a lot of it!) helps to check and confirm the returns and values I need. I am glad I started with a smaller board as rendering processes through individual cells can be pretty painful. I also took the opportunity to read and pick up new functions and methods, and learn from other developers commmunities (stackoverflow, blogs etc). This project provides a good review on JS and CSS (which I believe you will only learn when you work on it). Not perfect, but I am happy. Always learning, always building :)




