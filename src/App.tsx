import "./App.css";

import produce from "immer";
import React, { useCallback, useRef, useState } from "react";

import { specialGrids } from "./special-grids";

const rowCount = 40;
const colCount = 95;
const interval = 50;

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
