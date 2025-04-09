import React, { useState, useEffect } from 'react';
import GridMap from '../components/visualization/GridMap';
import MetricsPanel from '../components/visualization/MetricsPanel';
import ControlPanel from '../components/simulation/ControlPanel';
import { simulateCCO } from '../services/optimizationService';

const DigitalTwinVisualization = () => {
  const initialNetworkData = {
    antennas: [
      { id: 1, x: 200, y: 150, power: 20, tilt: 0, azimuth: 0, frequency: 2100, coverage: 100 },
      { id: 2, x: 400, y: 300, power: 18, tilt: 5, azimuth: 180, frequency: 2100, coverage: 90 },
      { id: 3, x: 600, y: 200, power: 22, tilt: 2, azimuth: 270, frequency: 2100, coverage: 110 },
    ],
    towers: [
      { id: 'tower1', x: 200, y: 150, color: '#3B82F6' },
      { id: 'tower2', x: 400, y: 300, color: '#F59E0B' },
      { id: 'tower3', x: 600, y: 200, color: '#10B981' },
    ],
  };

  const [networkData, setNetworkData] = useState(initialNetworkData);
  const [selectedAntenna, setSelectedAntenna] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  
  const [metrics, setMetrics] = useState({
    signalCoverage: 75,
    interference: 15,
    coverageGap: 10,
    throughput: 150,
  });

  // Reset network to initial configuration
  const handleReset = () => {
    setNetworkData(initialNetworkData);
    setSelectedAntenna(null);
    setSimulationStep(0);
    setIsRunning(false);
    setShowOptimized(false);
    setMetrics({
      signalCoverage: 75,
      interference: 15,
      coverageGap: 10,
      throughput: 150,
    });
  };

  // Handle antenna selection for configuration
  const handleAntennaSelect = (antennaId) => {
    const antenna = networkData.antennas.find(a => a.id === antennaId);
    setSelectedAntenna(antenna);
  };

  // Update antenna parameters
  const handleAntennaUpdate = (updatedParams) => {
    const updatedAntennas = networkData.antennas.map(antenna => 
      antenna.id === selectedAntenna.id ? { ...antenna, ...updatedParams } : antenna
    );
    
    setNetworkData({
      ...networkData,
      antennas: updatedAntennas
    });
    
    setSelectedAntenna({
      ...selectedAntenna,
      ...updatedParams
    });
  };

  // Run simulation
  const handleRunSimulation = () => {
    setIsRunning(true);
    
    // Update metrics based on current antenna configuration
    const updatedMetrics = {
      signalCoverage: Math.min(95, metrics.signalCoverage + 5),
      interference: Math.max(5, metrics.interference - 2),
      coverageGap: Math.max(2, metrics.coverageGap - 1),
      throughput: Math.min(250, metrics.throughput + 15),
    };
    
    setMetrics(updatedMetrics);
  };

  // Pause simulation
  const handlePauseSimulation = () => {
    setIsRunning(false);
  };

  // CCO Optimization
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      // Mock optimization results
      setTimeout(() => {
        const optimizedAntennas = networkData.antennas.map(antenna => ({
          ...antenna,
          power: Math.min(30, antenna.power + 3),
          tilt: Math.max(0, Math.min(10, antenna.tilt + Math.floor(Math.random() * 5) - 2)),
          azimuth: (antenna.azimuth + 15) % 360,
          coverage: antenna.coverage * 1.2
        }));
        
        setNetworkData({
          ...networkData,
          antennas: optimizedAntennas
        });
        
        setMetrics({
          signalCoverage: 92,
          interference: 8,
          coverageGap: 3,
          throughput: 220,
        });
        
        setShowOptimized(true);
      }, 2000);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setTimeout(() => setIsOptimizing(false), 2000);
    }
  };

  // Animation effect
  useEffect(() => {
    let animationFrame;
    
    if (isRunning) {
      const animate = () => {
        setSimulationStep(prev => prev + 1);
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRunning]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Network Visualization</h2>
            <GridMap
              antennas={networkData.antennas}
              towers={networkData.towers}
              simulationStep={simulationStep}
              onAntennaSelect={handleAntennaSelect}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Simulation Controls</h2>
            <div className="flex justify-between mb-4">
              <button 
                className={`px-4 py-2 rounded font-bold ${isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                onClick={isRunning ? handlePauseSimulation : handleRunSimulation}
              >
                {isRunning ? 'Pause Simulation' : 'Run Simulation'}
              </button>
              
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReset}
              >
                Reset Configuration
              </button>
              
              <button 
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? 'Optimizing...' : 'CCO Optimization'}
              </button>
            </div>
          </div>
          
          {selectedAntenna && (
            <div className="bg-white rounded-lg shadow p-4 mb-8">
              <h2 className="text-2xl font-bold mb-4">Antenna Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Power (dBm)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={selectedAntenna.power}
                    onChange={(e) => handleAntennaUpdate({ power: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span>{selectedAntenna.power} dBm</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tilt (degrees)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={selectedAntenna.tilt}
                    onChange={(e) => handleAntennaUpdate({ tilt: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span>{selectedAntenna.tilt}°</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Azimuth (degrees)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="359" 
                    value={selectedAntenna.azimuth}
                    onChange={(e) => handleAntennaUpdate({ azimuth: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span>{selectedAntenna.azimuth}°</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency (MHz)
                  </label>
                  <select 
                    value={selectedAntenna.frequency}
                    onChange={(e) => handleAntennaUpdate({ frequency: parseInt(e.target.value) })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="700">700 MHz</option>
                    <option value="850">850 MHz</option>
                    <option value="1900">1900 MHz</option>
                    <option value="2100">2100 MHz</option>
                    <option value="2600">2600 MHz</option>
                  </select>
                </div>
              </div>
            </div>
          )}
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