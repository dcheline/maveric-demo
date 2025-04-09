// PowerGraph.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PowerGraph = ({ data, currentTower }) => {
  // Transform data for the chart
  const chartData = data.map((point, index) => ({
    time: index,
    power: point.power,
    tower: point.tower
  }));

  // Generate colors based on tower ID
  const getLineColor = (tower) => {
    const colors = {
      'tower1': '#3b82f6',
      'tower2': '#f59e0b',
      'tower3': '#10b981'
    };
    return colors[tower] || '#6b7280';
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            label={{ value: 'Power (dbm)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]} 
          />
          <Tooltip 
            formatter={(value, name) => [`${value} dbm`, 'Power']}
            labelFormatter={(value) => `Time: ${value}`}
          />
          <Line 
            type="monotone" 
            dataKey="power" 
            stroke={getLineColor(currentTower)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerGraph; 