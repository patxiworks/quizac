import { useState, useEffect } from "react";
import ReplyIcon from '@mui/icons-material/Reply';
import Tooltip from '@mui/material/Tooltip';
import styles from "./styles/slide.module.css";

const NUM_ROWS = 3;
const NUM_COLS = 3;
const NUM_TILES = NUM_ROWS * NUM_COLS;
const EMPTY_INDEX = NUM_TILES - 1;
const SHUFFLE_MOVES_RANGE = [60, 80];
const MOVE_DIRECTIONS = ['up', 'down', 'left', 'right'];

function rand (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class GameState {
  static getNewBoard () {
    return Array(NUM_TILES).fill(0).map((x, index) => [
      Math.floor(index / NUM_ROWS), 
      index % NUM_COLS
    ]);
  }
  
  static solvedBoard = GameState.getNewBoard();
  static instance = null;

  static getInstance () {
    if (!GameState.instance) GameState.instance = new GameState();
    return GameState.instance;
  }

  constructor () {
    this.startNewGame();
  }

  isSolved () {
    for (let i=0; i<NUM_TILES; i++) {
      if (this.board[i][0] !== GameState.solvedBoard[i][0] 
          || this.board[i][1] !== GameState.solvedBoard[i][1]) 
        return false;
    }
    return true;
  }
  
  startNewGame () {
    this.moves = 0;
    this.board = GameState.getNewBoard();
    this.stack = [];
    this.shuffle();
  }

  shuffle () {
    this.shuffling = true;
    let shuffleMoves = rand(...SHUFFLE_MOVES_RANGE);
    while (shuffleMoves --> 0) {
      this.moveInDirection (MOVE_DIRECTIONS[rand(0,3)]);
    }
    this.shuffling = false;
  }
  
  canMoveTile (index) {
    if (index < 0 || index >= NUM_TILES) return false;
    
    const tilePos = this.board[index];
    const emptyPos = this.board[EMPTY_INDEX];

    if (tilePos[0] === emptyPos[0])
      return Math.abs(tilePos[1] - emptyPos[1]) === 1;
    else if (tilePos[1] === emptyPos[1])
      return Math.abs(tilePos[0] - emptyPos[0]) === 1;
    else return false;
  }
  
  moveTile (index) {
    if (!this.shuffling && this.isSolved()) return false;
    if (!this.canMoveTile(index)) return false;
    
    const emptyPosition = [...this.board[EMPTY_INDEX]];
    const tilePosition = [...this.board[index]];
    
    let boardAfterMove = [...this.board];    
    boardAfterMove[EMPTY_INDEX] = tilePosition;
    boardAfterMove[index] = emptyPosition;
    
    if (!this.shuffling) this.stack.push(this.board);
    this.board = boardAfterMove;
    if (!this.shuffling) this.moves += 1;
    
    return true;
  }
  
  undo () {
    if (this.stack.length === 0) return false;
    this.board = this.stack.pop();
    this.moves -= 1;
  }
  
  moveInDirection (dir) {
    const epos = this.board[EMPTY_INDEX];
    const posToMove = dir === 'up' ? [epos[0]+1, epos[1]]
      : dir === 'down' ? [epos[0]-1, epos[1]]
      : dir === 'left' ? [epos[0], epos[1]+1]
      : dir === 'right' ? [epos[0], epos[1]-1]
      : epos;
    let tileToMove = EMPTY_INDEX;
    for (let i=0; i<NUM_TILES; i++) {
      if (this.board[i][0] === posToMove[0] && this.board[i][1] === posToMove[1]) {
        tileToMove = i;
        break;
      }
    }
    this.moveTile(tileToMove);
  }

  getState () {
    const self = this;
    return {
      board: self.board,
      moves: self.moves,
      solved: self.isSolved(),
    };
  }
}

function useGameState () {
  const gameState = GameState.getInstance();
  const [state, setState] = useState(gameState.getState());
  
  function newGame () {
    gameState.startNewGame();
    setState(gameState.getState());
  }
  
  function undo () {
    gameState.undo();
    setState(gameState.getState());
  }
  
  function move (index) {
    return function () {
      gameState.moveTile(index);
      setState(gameState.getState());
    }
  }
  
  useEffect(() => {
    /*document.addEventListener('keyup', function listeners(event) {
      
      if (event.keyCode === 37) gameState.moveInDirection('left');
      else if (event.keyCode === 38) gameState.moveInDirection('up');
      else if (event.keyCode === 39) gameState.moveInDirection('right');
      else if (event.keyCode === 40) gameState.moveInDirection('down');
      
      setState(gameState.getState());
    });
    
    return (() => window.removeEventListener(listeners));*/
  }, [gameState]);
  
  return [state.board, state.moves, state.solved, newGame, undo, move];
}

function Tile ({index, pos, onClick, image}) {
  const top = pos[0]*100 + 5;
  const left = pos[1]*100 + 5;
  const bgLeft = (index%NUM_COLS)*100 + 5;
  const bgTop = Math.floor(index/NUM_ROWS)*100 + 5;
  //console.log(index, pos, top, left, bgLeft, bgTop)
  
  return <div 
    className={styles.tile}
    onClick={onClick}
    style={{top, left, backgroundImage: `url(${image})`, backgroundPosition: `-${bgLeft}px -${bgTop}px`}} 
  />;
}

function SlidePuzzle ({ title }) {
  const [board, moves, solved, newGame, undo, move] = useGameState();
  //console.log(board)
  
  return (
    <div className={styles.gameWrapper}>
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <div className={styles.moves}>
          <span>Moves:</span> {moves}
        </div>
        <button className={styles.bigButton} onClick={undo}>
            <Tooltip title="Undo">
                <ReplyIcon fontSize="small" />
            </Tooltip>
        </button>
      </div>
      <div className={styles.boardWrapper}>
      <div className={styles.board} style={{width: '308px', height: '308px'}}>
      {
        board.slice(0,-1).map((pos, index) => ( 
          <Tile key={index} index={index} pos={pos} onClick={move(index)} image={title.image} />
        ))
      }
      { solved &&
          <div className={styles.overlay}>
            <button className={styles.bigButton} onClick={newGame}>
              PLAY AGAIN 
            </button>
          </div>
      }
      </div>
      </div>
    </div>
    </div>
  );
}

export default SlidePuzzle;