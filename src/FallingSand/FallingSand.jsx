import React, { useEffect, useState } from "react";
import p5 from "p5";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import "./FallingSand.css";

const FallingSand = () => {
  const navigate = useNavigate();
  const [brushSize, setBrushSize] = useState(5);
  const [resetCanvas, setResetCanvas] = useState(false);

  useEffect(() => {
    let canvas;
    let cols, rows;
    let grid, velocityGrid;
    let hueValue = 400;
    const gravity = 0.1;

    const sketch = (p) => {
      p.setup = () => {
        resizeCanvas();
        p.colorMode(p.HSB, 360, 255, 255);
        initializeGrids();
      };

      p.draw = () => {
        p.background(0);

        if (p.mouseIsPressed) {
          const mouseCol = Math.floor(p.mouseX / brushSize);
          const mouseRow = Math.floor(p.mouseY / brushSize);

          const matrix = 5;
          const extent = Math.floor(matrix / 2);
          for (let i = -extent; i <= extent; i++) {
            for (let j = -extent; j <= extent; j++) {
              if (p.random(1) < 0.75) {
                const col = mouseCol + i;
                const row = mouseRow + j;
                if (withinCols(col) && withinRows(row)) {
                  grid[col][row] = hueValue;
                  velocityGrid[col][row] = 1;
                }
              }
            }
          }
          hueValue += 0.5;
          if (hueValue > 360) {
            hueValue = 1;
          }
        }

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            p.noStroke();
            if (grid[i][j] > 0) {
              p.fill(grid[i][j], 255, 255);
              const x = i * brushSize;
              const y = j * brushSize;
              p.square(x, y, brushSize);
            }
          }
        }

        const nextGrid = make2DArray(cols, rows);
        const nextVelocityGrid = make2DArray(cols, rows);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const state = grid[i][j];
            const velocity = velocityGrid[i][j];
            let moved = false;
            if (state > 0) {
              const newPos = Math.floor(j + velocity);
              for (let y = newPos; y > j; y--) {
                const below = grid[i][y];
                let dir = 1;
                if (p.random(1) < 0.5) {
                  dir *= -1;
                }
                let belowA = -1;
                let belowB = -1;
                if (withinCols(i + dir)) belowA = grid[i + dir][y];
                if (withinCols(i - dir)) belowB = grid[i - dir][y];

                if (below === 0) {
                  nextGrid[i][y] = state;
                  nextVelocityGrid[i][y] = velocity + gravity;
                  moved = true;
                  break;
                } else if (belowA === 0) {
                  nextGrid[i + dir][y] = state;
                  nextVelocityGrid[i + dir][y] = velocity + gravity;
                  moved = true;
                  break;
                } else if (belowB === 0) {
                  nextGrid[i - dir][y] = state;
                  nextVelocityGrid[i - dir][y] = velocity + gravity;
                  moved = true;
                  break;
                }
              }
            }

            if (state > 0 && !moved) {
              nextGrid[i][j] = grid[i][j];
              nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
            }
          }
        }
        grid = nextGrid;
        velocityGrid = nextVelocityGrid;
      };

      p.windowResized = () => {
        resizeCanvas();
        initializeGrids(); // Reinitialize grids on window resize
      };

      function resizeCanvas() {
        let canvasWidth, canvasHeight;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        p.resizeCanvas(canvasWidth, canvasHeight);
        cols = Math.floor(p.width / brushSize);
        rows = Math.floor(p.height / brushSize);
      }

      function initializeGrids() {
        grid = make2DArray(cols, rows);
        velocityGrid = make2DArray(cols, rows, 1);
      }

      function make2DArray(cols, rows, defaultValue = 0) {
        const arr = new Array(cols);
        for (let i = 0; i < cols; i++) {
          arr[i] = new Array(rows).fill(defaultValue);
        }
        return arr;
      }

      function withinCols(i) {
        return i >= 0 && i < cols;
      }

      function withinRows(j) {
        return j >= 0 && j < rows;
      }
    };

    canvas = new p5(sketch, document.getElementById("game-container"));

    return () => {
      canvas.remove();
    };
  }, [brushSize, resetCanvas]);

  const handleBackToMain = () => {
    navigate("/");
  };

  const handleResetCanvas = () => {
    setResetCanvas((prev) => !prev);
  };

  return (
    <div className="main">
      <div id="game-container"></div>
      <div className="controls">
        <div className="backButton" onClick={handleBackToMain}>
          <IoArrowBackCircleOutline />
        </div>

        <div className="brushSizeSlider">
          <label htmlFor="brushSize">Brush Size: {brushSize}</label>
          <input
            background="#59443b"
            id="brushSize"
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>

        <button className="resetButton" onClick={handleResetCanvas}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FallingSand;
