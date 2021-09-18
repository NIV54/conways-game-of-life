import "./App.css";

import produce from "immer";
import React, { useCallback, useRef, useState } from "react";

const rowCount = 40;
const colCount = 95;
const interval = 50;

const specialGrids = [
  [
    // Simkin glider gun
    [11, 1],
    [11, 2],
    [11, 8],
    [11, 9],
    [12, 1],
    [12, 2],
    [12, 8],
    [12, 9],
    [14, 5],
    [14, 6],
    [15, 5],
    [15, 6],
    [20, 23],
    [20, 24],
    [20, 26],
    [20, 27],
    [21, 22],
    [21, 28],
    [22, 22],
    [22, 29],
    [22, 32],
    [22, 33],
    [23, 22],
    [23, 23],
    [23, 24],
    [23, 28],
    [23, 32],
    [23, 33],
    [24, 27],
    [28, 21],
    [28, 22],
    [29, 21],
    [30, 22],
    [30, 23],
    [30, 24],
    [31, 24]
  ],
  // Gosper glider gun
  [
    [5, 1],
    [5, 2],
    [6, 1],
    [6, 2],
    [3, 13],
    [3, 14],
    [4, 12],
    [4, 16],
    [5, 11],
    [5, 17],
    [6, 11],
    [6, 15],
    [6, 17],
    [6, 18],
    [7, 11],
    [7, 17],
    [8, 12],
    [8, 16],
    [9, 13],
    [9, 14],
    [1, 25],
    [2, 23],
    [2, 25],
    [3, 21],
    [3, 22],
    [4, 21],
    [4, 22],
    [5, 21],
    [5, 22],
    [6, 23],
    [6, 25],
    [7, 25],
    [4, 35],
    [4, 36],
    [5, 35],
    [5, 36]
  ],
  // Infinite moving shape
  [
    [14, 17],
    [15, 15],
    [15, 17],
    [15, 18],
    [16, 15],
    [16, 17],
    [17, 15],
    [18, 13],
    [19, 11],
    [19, 13]
  ],
  // Infinite stale shape
  [
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 3],
    [4, 7],
    [5, 3],
    [5, 7],
    [6, 4],
    [6, 5],
    [6, 6],
    [11, 4],
    [11, 5],
    [11, 6],
    [12, 3],
    [12, 7],
    [13, 3],
    [13, 7],
    [14, 4],
    [14, 5],
    [14, 6]
  ]
];

const getEmptyGrid = () => new Array(rowCount).fill(new Array(colCount).fill(0));

const cases = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, -1],
  [1, 1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
];

function App() {
  const [grid, setGrid] = useState<number[][]>(getEmptyGrid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const start = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g =>
      produce(g, gridCopy => {
        g.forEach((row, i) =>
          row.forEach((col, j) => {
            let neighbors = 0;
            cases.forEach(([x, y]) => {
              const newX = x + i;
              const newY = y + j;
              if (newX >= 0 && newX < rowCount && newY >= 0 && newY < colCount) {
                neighbors += g[newX][newY];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          })
        );
      })
    );

    setTimeout(start, interval);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            start();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          const specialGrid = specialGrids[Math.floor(Math.random() * specialGrids.length)];
          const newGrid = produce(grid, gridCopy => {
            gridCopy.forEach((row, i) => {
              gridCopy.forEach((col, j) => {
                gridCopy[i][j] = 0;
              });
            });
            specialGrid.forEach(coords => {
              gridCopy[coords[0]][coords[1]] = 1;
            });
          });
          setGrid(newGrid);
        }}
      >
        Special Grid
      </button>
      <div
        style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, var(--cell-size))` }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i} - ${j}`}
              className={`cell ${col === 0 ? "cell-inactive" : "cell-active"}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = gridCopy[i][j] === 0 ? 1 : 0;
                });
                setGrid(newGrid);
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
