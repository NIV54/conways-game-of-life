import produce from "immer";
import React, { useCallback, useRef, useState } from "react";

const rowCount = 40;
const colCount = 95;
const interval = 100;

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
  const [grid, setGrid] = useState<number[][]>(() =>
    new Array(rowCount).fill(new Array(colCount).fill(0))
  );

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
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 20px)` }}>
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i} - ${j}`}
              style={{
                height: 20,
                width: 20,
                border: "1px solid black",
                backgroundColor: col === 0 ? "white" : "pink"
              }}
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
