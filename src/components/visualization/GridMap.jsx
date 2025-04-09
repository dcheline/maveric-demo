import React, { useRef, useEffect } from 'react';

const GridMap = ({ antennas, towers }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !antennas || !towers) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio;

    // Set canvas size accounting for device pixel ratio
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw coverage areas
    drawCoverageAreas(ctx, antennas);

    // Draw towers
    drawTowers(ctx, towers);

    // Draw antennas
    drawAntennas(ctx, antennas);

  }, [antennas, towers]);

  const drawGrid = (ctx, width, height) => {
    const gridSize = 30;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCoverageAreas = (ctx, antennas) => {
    antennas.forEach(antenna => {
      ctx.beginPath();
      ctx.fillStyle = `${antenna.color}20`; // 20 is hex for 12% opacity
      ctx.arc(antenna.x, antenna.y, antenna.coverage, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawTowers = (ctx, towers) => {
    towers.forEach(tower => {
      // Draw tower base
      ctx.fillStyle = tower.color;
      ctx.beginPath();
      ctx.moveTo(tower.x - 10, tower.y + 10);
      ctx.lineTo(tower.x + 10, tower.y + 10);
      ctx.lineTo(tower.x, tower.y - 15);
      ctx.closePath();
      ctx.fill();

      // Draw tower identifier
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tower.id, tower.x, tower.y + 25);
    });
  };

  const drawAntennas = (ctx, antennas) => {
    antennas.forEach(antenna => {
      // Draw antenna circle
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = antenna.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.arc(antenna.x, antenna.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw power indicator
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${antenna.power}dBm`, antenna.x, antenna.y - 15);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[600px] border border-gray-200 rounded-lg"
      style={{ touchAction: 'none' }}
    />
  );
};

export default GridMap; 