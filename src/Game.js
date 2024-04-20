import React, { useCallback, useEffect, useState } from "react";
import "./Game.css";

function Game() {
  const rowCount = 50;
  const colCount = 50;
  const [board, setBoard] = useState(makeEmptyBoard());
  const [delayDuration, setDelayDuration] = useState(500);
  const [isRunning, setIsRunning] = useState(false);

  function makeEmptyBoard() {
    let board = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      board[i] = new Array(colCount).fill(false);
    }
    return board;
  }

  function handleCellClick(rowIdx, colIdx) {
    let updatedBoard = [...board];
    let updatedRow = [...board[rowIdx]];
    updatedRow[colIdx] = !updatedRow[colIdx];
    updatedBoard[rowIdx] = updatedRow;
    setBoard(updatedBoard);
  }

  function startExecution() {
    setIsRunning(true);
  }

  function stopExecution() {
    setIsRunning(false);
  }

  function clearBoard() {
    setBoard(makeEmptyBoard());
  }

  function randomizeBoard() {
    let nextBoard = [];
    for (let i = 0; i < rowCount; i++) {
      nextBoard[i] = [];
      for (let j = 0; j < colCount; j++) {
        nextBoard[i][j] = Math.random() >= 0.5;
      }
    }
    setBoard(nextBoard);
  }

  const countNeighbors = useCallback(
    (rowIdx, colIdx) => {
      const dirs = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      let neighborCount = 0;
      dirs.forEach((dir) => {
        let r = rowIdx + dir[0];
        let c = colIdx + dir[1];
        if (r >= 0 && r < rowCount && c >= 0 && c < colCount && board[r][c])
          neighborCount++;
      });
      return neighborCount;
    },
    [board, rowCount, colCount]
  );

  const runIteration = useCallback(() => {
    let nextBoard = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      nextBoard[i] = new Array(colCount).fill(false);
      for (let j = 0; j < colCount; j++) {
        const neighborCount = countNeighbors(i, j);
        if (board[i][j] && (neighborCount === 2 || neighborCount === 3)) {
          nextBoard[i][j] = true;
        }
        if (!board[i][j] && neighborCount === 3) {
          nextBoard[i][j] = true;
        }
      }
    }
    setBoard(nextBoard);
  }, [board, rowCount, colCount, countNeighbors]);

  useEffect(() => {
    if (isRunning) {
      let timeoutHandler = setTimeout(() => {
        runIteration();
      }, delayDuration);

      return () => clearTimeout(timeoutHandler);
    }
  }, [isRunning, delayDuration, runIteration]);

  return (
    <div>
      <div className="heading">Welcome to Game of Life</div>
      <div>
        <label>
          Generate every{" "}
          <input
            type="number"
            value={delayDuration}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setDelayDuration(isNaN(value) ? 500 : value); // Set delayDuration to 500 if NaN
            }}
          />{" "}
          milliseconds
        </label>
        <div>
          {isRunning ? (
            <button className="btn" onClick={stopExecution}>
              Stop
            </button>
          ) : (
            <button className="btn" onClick={startExecution}>
              Start
            </button>
          )}
          <button className="btn" onClick={randomizeBoard}>
            Randomize Board
          </button>
          <button className="btn" onClick={clearBoard}>
            Clear Board
          </button>
        </div>

        <div className="board">
          <table>
            <tbody>
              {board.map((row, rowIdx) => {
                return (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        className={cell ? "alive" : "dead"}
                      >
                        <div className="cell"></div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          Reference:{" "}
          <a
            className="App-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          >
            Conway's Game of Life - Wikipedia
          </a>
        </div>
      </div>
    </div>
  );
}

export default Game;
