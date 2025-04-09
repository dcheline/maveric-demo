// MovementMap.jsx
import React, { useRef, useEffect } from 'react';

const MovementMap = ({ towers, devicePath, currentPosition, connectedTower }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !towers || !devicePath) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Draw towers
    drawTowers(ctx, towers);
    
    // Draw device path
    drawPath(ctx, devicePath);
    
    // Draw current position
    drawCurrentPosition(ctx, currentPosition, connectedTower);
    
    // Draw connection line
    if (currentPosition && connectedTower) {
      drawConnectionLine(ctx, currentPosition, getTowerPosition(connectedTower, towers));
    }
    
  }, [towers, devicePath, currentPosition, connectedTower]);
  
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
  
  const drawTowers = (ctx, towers) => {
    towers.forEach(tower => {
      ctx.fillStyle = tower.color;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const drawPath = (ctx, path) => {
    if (path.length < 2) return;
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
  };
  
  const drawCurrentPosition = (ctx, position, connectedTower) => {
    if (!position) return;
    
    // Find tower color
    const towerColor = getTowerColor(connectedTower, towers);
    
    ctx.fillStyle = towerColor;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 7, 0, Math.PI * 2);
    ctx.stroke();
  };
  
  const drawConnectionLine = (ctx, devicePosition, towerPosition) => {
    if (!devicePosition || !towerPosition) return;
    
    ctx.strokeStyle = '#9ca3af';
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(devicePosition.x, devicePosition.y);
    ctx.lineTo(towerPosition.x, towerPosition.y);
    ctx.stroke();
    ctx.setLineDash([]);
  };
  
  const getTowerPosition = (towerId, towers) => {
    const tower = towers.find(t => t.id === towerId);
    return tower ? { x: tower.x, y: tower.y } : null;
  };
  
  const getTowerColor = (towerId, towers) => {
    const tower = towers.find(t => t.id === towerId);
    return tower ? tower.color : '#6b7280';
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-full border border-gray-200"
    />
  );
};

export default MovementMap; 