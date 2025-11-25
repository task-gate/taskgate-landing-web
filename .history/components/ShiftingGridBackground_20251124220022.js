"use client";

import { useEffect, useRef, useState } from "react";

const ShiftingGridBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Config
    const GRID_SIZE = 18; // N x N grid
    const BASE_SHIFT_INTERVAL = 3500; // ms between row/column shifts
    const SHAPE_MORPH_INTERVAL = 9000; // ms between shape morphs
    const SHAPE_MORPH_DURATION = 1800; // ms to move into shape
    const SHAPE_HOLD_DURATION = 1300; // ms hold shape

    // Colors / style (monotone, subtle)
    const BG_COLOR = "#050507";
    const GRID_COLOR_BASE = "rgba(130, 135, 150, 0.14)";
    const GRID_COLOR_DIM = "rgba(90, 95, 110, 0.10)";
    const GRID_COLOR_ACTIVE = "rgba(210, 215, 235, 0.9)";

    // State
    const cells = [];

    // Helper to create initial grid cells
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        cells.push({
          row: r,
          col: c,
          baseRow: r,
          baseCol: c,
          offsetX: 0,
          offsetY: 0,
          jitterSeed: Math.random() * Math.PI * 2,
          active: false,
          targetRow: r,
          targetCol: c,
          morphStartTime: 0,
          morphing: false,
        });
      }
    }

    // Define a simple TaskGate-like shape mask in GRID_SIZE x GRID_SIZE.
    // We'll center a square "gate" in the grid.
    const shapeMask = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(0)
    );

    const gateSize = Math.floor(GRID_SIZE * 0.5);
    const gateStartRow = Math.floor((GRID_SIZE - gateSize) / 2);
    const gateStartCol = Math.floor((GRID_SIZE - gateSize) / 2);

    for (let r = 0; r < gateSize; r++) {
      for (let c = 0; c < gateSize; c++) {
        // Make a hollow square (border only)
        const isBorder =
          r === 0 || r === gateSize - 1 || c === 0 || c === gateSize - 1;
        shapeMask[gateStartRow + r][gateStartCol + c] = isBorder ? 1 : 0;
      }
    }

    // Timing helpers
    let lastShiftTime = 0;
    let lastShapeMorphTime = 0;
    let inShapeState = false;
    let shapeHoldStart = 0;

    // Assign target positions for active cells based on mask
    const beginShapeMorph = (now) => {
      // Collect positions (row, col) where mask == 1
      const activePositions = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (shapeMask[r][c] === 1) {
            activePositions.push({ row: r, col: c });
          }
        }
      }

      // Shuffle active positions for organic fill
      for (let i = activePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [activePositions[i], activePositions[j]] = [
          activePositions[j],
          activePositions[i],
        ];
      }

      // Choose which cells become active
      const totalCells = cells.length;
      const activeCount = Math.min(
        activePositions.length,
        Math.floor(totalCells * 0.4)
      );
      const usedIndices = new Set();

      // Reset cell states
      cells.forEach((cell) => {
        cell.active = false;
        cell.morphing = false;
      });

      for (let i = 0; i < activeCount; i++) {
        let idx = Math.floor(Math.random() * totalCells);
        // Ensure unique cells
        while (usedIndices.has(idx)) {
          idx = Math.floor(Math.random() * totalCells);
        }
        usedIndices.add(idx);

        const cell = cells[idx];
        const pos = activePositions[i % activePositions.length];

        cell.targetRow = pos.row;
        cell.targetCol = pos.col;
        cell.morphStartTime = now + Math.random() * 300; // small stagger
        cell.morphing = true;
        cell.active = true;
      }

      inShapeState = true;
      shapeHoldStart = 0;
      lastShapeMorphTime = now;
    };

    const endShapeMorph = (now) => {
      // Release cells back to their free-flow grid.
      cells.forEach((cell) => {
        cell.morphing = false;
      });
      inShapeState = false;
      lastShapeMorphTime = now;
    };

    const shiftRowsAndColumns = () => {
      // Randomly choose row or column shift
      const doRowShift = Math.random() < 0.5;

      if (doRowShift) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const dir = Math.random() < 0.5 ? 1 : -1; // right or left

        cells.forEach((cell) => {
          if (!cell.morphing && cell.row === r) {
            cell.col = (cell.col + dir + GRID_SIZE) % GRID_SIZE;
          }
        });
      } else {
        const c = Math.floor(Math.random() * GRID_SIZE);
        const dir = Math.random() < 0.5 ? 1 : -1; // up or down

        cells.forEach((cell) => {
          if (!cell.morphing && cell.col === c) {
            cell.row = (cell.row + dir + GRID_SIZE) % GRID_SIZE;
          }
        });
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    };

    resize();
    window.addEventListener("resize", resize);

    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animate = (timestamp) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Initialize timing references
      if (!lastShiftTime) lastShiftTime = timestamp;
      if (!lastShapeMorphTime) lastShapeMorphTime = timestamp;

      const elapsedSinceShift = timestamp - lastShiftTime;
      const elapsedSinceShape = timestamp - lastShapeMorphTime;

      // Clear
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      const gridPixelSize = Math.min(width, height) * 0.9;
      const cellSize = gridPixelSize / GRID_SIZE;
      const cellGap = cellSize * 0.2;
      const innerCellSize = cellSize - cellGap;

      const offsetX = (width - gridPixelSize) / 2;
      const offsetY = (height - gridPixelSize) / 2;

      // Trigger row/column shifts in base state
      if (!inShapeState && elapsedSinceShift > BASE_SHIFT_INTERVAL) {
        shiftRowsAndColumns();
        lastShiftTime = timestamp;
      }

      // Trigger shape morph periodically
      if (!inShapeState && elapsedSinceShape > SHAPE_MORPH_INTERVAL) {
        beginShapeMorph(timestamp);
      }

      // If in shape state, manage hold + release
      if (inShapeState) {
        if (!shapeHoldStart) {
          // Check if all morphing is done
          const allArrived = cells.every((cell) => {
            if (!cell.morphing) return true;
            const dt = timestamp - cell.morphStartTime;
            return dt >= SHAPE_MORPH_DURATION;
          });
          if (allArrived) {
            shapeHoldStart = timestamp;
          }
        } else {
          const holdElapsed = timestamp - shapeHoldStart;
          if (holdElapsed > SHAPE_HOLD_DURATION) {
            endShapeMorph(timestamp);
          }
        }
      }

      // Draw cells
      cells.forEach((cell) => {
        // Breathing / jitter offset
        const t = timestamp * 0.0004 + cell.jitterSeed;
        const jitterAmp = innerCellSize * 0.06;
        const dx = Math.sin(t) * jitterAmp;
        const dy = Math.cos(t * 0.8) * jitterAmp;

        let row = cell.row;
        let col = cell.col;

        // If morphing, interpolate towards target position
        if (cell.morphing) {
          const dt = timestamp - cell.morphStartTime;
          const rawT = Math.min(Math.max(dt / SHAPE_MORPH_DURATION, 0), 1);
          const eased = easeInOut(rawT);

          const fromRow = cell.row;
          const fromCol = cell.col;
          const toRow = cell.targetRow;
          const toCol = cell.targetCol;

          const interpRow = fromRow + (toRow - fromRow) * eased;
          const interpCol = fromCol + (toCol - fromCol) * eased;

          row = interpRow;
          col = interpCol;

          if (rawT >= 1) {
            cell.morphing = false;
            cell.row = toRow;
            cell.col = toCol;
          }
        }

        const x = offsetX + col * cellSize + cellGap / 2 + dx;
        const y = offsetY + row * cellSize + cellGap / 2 + dy;

        // Base dim style
        let fillStyle = GRID_COLOR_DIM;
        let sizeMultiplier = 0.85;

        if (cell.active) {
          // Active cells (forming gate) are brighter and a bit larger
          const pulse =
            0.9 + 0.1 * Math.sin(timestamp * 0.004 + cell.jitterSeed);
          fillStyle = inShapeState ? GRID_COLOR_ACTIVE : GRID_COLOR_BASE;
          sizeMultiplier = inShapeState ? 1.05 * pulse : 0.95;
        }

        const w = innerCellSize * sizeMultiplier;
        const h = innerCellSize * sizeMultiplier;
        const cx = x + innerCellSize / 2;
        const cy = y + innerCellSize / 2;

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 3);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, zIndex: 0 }}
    />
  );
};

export default ShiftingGridBackground;
