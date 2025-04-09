import React, { useState, useEffect } from 'react';
import GridMap from '../components/visualization/GridMap';
import MetricsPanel from '../components/visualization/MetricsPanel';
import ControlPanel from '../components/simulation/ControlPanel';
import { simulateCCO } from '../services/optimizationService';

const DigitalTwinVisualization = () => {
  const [networkData, setNetworkData] = useState({
    antennas: [
      { id: 1, x: 200, y: 150, power: 80, coverage: 100 },
      { id: 2, x: 400, y: 300, power: 75, coverage: 90 },
      { id: 3, x: 600, y: 200, power: 85, coverage: 110 },
    ],
    towers: [
      { id: 'tower1', x: 200, y: 150, color: '#3B82F6' },
      { id: 'tower2', x: 400, y: 300, color: '#F59E0B' },
      { id: 'tower3', x: 600, y: 200, color: '#10B981' },
    ],
  });

  const [metrics, setMetrics] = useState({
    signalCoverage: 75,
    interference: 15,
    coverageGap: 10,
    throughput: 150,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await simulateCCO(networkData);
      setNetworkData(result.networkData);
      setMetrics(result.metrics);
      setShowOptimized(true);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Network Visualization</h2>
            <GridMap
              antennas={networkData.antennas}
              towers={networkData.towers}
            />
          </div>
          
          <ControlPanel
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </div>

        <div>
          <MetricsPanel
            metrics={metrics}
            showOptimizedComparison={showOptimized}
          />
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinVisualization; 