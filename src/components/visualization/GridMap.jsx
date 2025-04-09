import React, { useRef, useEffect } from 'react';

const GridMap = ({ antennas, towers, simulationStep = 0, onAntennaSelect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw coverage areas with animation
    drawCoverageAreas(ctx, antennas, simulationStep);

    // Draw antennas/towers
    drawAntennas(ctx, antennas, towers);
    
    // Draw instruction message
    drawInstructionMessage(ctx, width, height);
  }, [antennas, towers, simulationStep]);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCoverageAreas = (ctx, antennas, step) => {
    antennas.forEach(antenna => {
      const pulseFactor = 1 + Math.sin(step * 0.05) * 0.1; // Pulsing effect
      const radius = antenna.coverage * pulseFactor;
      
      ctx.beginPath();
      ctx.arc(antenna.x, antenna.y, radius, 0, 2 * Math.PI);
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        antenna.x, antenna.y, 0,
        antenna.x, antenna.y, radius
      );
      
      // Match tower color if available
      const towerIndex = antenna.id - 1;
      const baseColor = towerIndex === 0 ? '#3B82F6' : 
                        towerIndex === 1 ? '#F59E0B' : 
                        towerIndex === 2 ? '#10B981' : '#6366F1';
      
      gradient.addColorStop(0, `${baseColor}50`);  // 30% opacity
      gradient.addColorStop(1, `${baseColor}10`);  // 10% opacity
      
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };

  const drawAntennas = (ctx, antennas, towers) => {
    towers.forEach(tower => {
      // Draw tower
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = tower.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      
      // Tower label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(`Tower ${tower.id.replace('tower', '')}`, tower.x, tower.y - 15);
    });
  };
  
  const drawInstructionMessage = (ctx, width, height) => {
    ctx.font = 'italic 16px Arial';
    ctx.fillStyle = 'rgba(107, 114, 128, 0.8)'; // gray-500 with opacity
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Click on antenna to configure', width / 2, height - 20);
  };

  const handleCanvasClick = (e) => {
    if (!onAntennaSelect) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is on an antenna
    antennas.forEach(antenna => {
      const distance = Math.sqrt(Math.pow(x - antenna.x, 2) + Math.pow(y - antenna.y, 2));
      if (distance <= 15) { // Slightly larger than the tower radius for easier clicking
        onAntennaSelect(antenna.id);
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="border border-gray-300 rounded-lg"
      onClick={handleCanvasClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default GridMap; 