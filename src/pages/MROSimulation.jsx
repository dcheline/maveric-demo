import React, { useState, useEffect } from 'react';
import MovementMap from '../components/visualization/MovementMap';
import PowerGraph from '../components/visualization/PowerGraph';
import MetricsPanel from '../components/visualization/MetricsPanel';
import ControlPanel from '../components/simulation/ControlPanel';
import { simulateMRO } from '../services/optimizationService';

const MROSimulation = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [useMRO, setUseMRO] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeSimulation();
  }, [useMRO]);

  const initializeSimulation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sample data for simulation
      const sampleAntennas = [
        { id: 1, x: 100, y: 100, power: 20, frequency: 2100, tilt: 0, azimuth: 0 },
        { id: 2, x: 300, y: 300, power: 20, frequency: 2100, tilt: 0, azimuth: 180 },
        { id: 3, x: 500, y: 100, power: 20, frequency: 2100, tilt: 0, azimuth: 270 }
      ];
      
      const sampleUsers = [
        { id: 'user1', x: 200, y: 200 },
        { id: 'user2', x: 400, y: 150 },
        { id: 'user3', x: 250, y: 350 }
      ];
      
      const sampleArea = { width: 600, height: 400 };
      
      // Use mock data directly without trying to call simulateMRO
      const mockData = {
        towers: sampleAntennas,
        devicePath: [
          { x: 100, y: 100 },
          { x: 200, y: 150 },
          { x: 300, y: 200 },
          { x: 350, y: 250 },
          { x: 400, y: 300 }
        ],
        steps: Array(60).fill().map((_, index) => ({
          position: { 
            x: 100 + index * 5, 
            y: 100 + Math.sin(index / 10) * 50 
          },
          connectedTower: index < 20 ? 1 : (index < 40 ? 2 : 3)
        })),
        powerData: Array(60).fill().map((_, index) => ({
          time: index,
          tower1: -70 - index * 0.5,
          tower2: -90 + index * 0.5,
          tower3: -80 + Math.sin(index / 10) * 5
        })),
        metrics: {
          handovers: 2,
          dropCalls: useMRO ? 0 : 1,
          avgSignalStrength: useMRO ? -65 : -70,
          coverage: useMRO ? 92 : 85,
          interference: useMRO ? 'Low' : 'Medium'
        }
      };
      
      setSimulationData(mockData);
      setCurrentStep(0);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
      setError('Failed to initialize simulation. Please try again.');
      
      // Fallback to basic mock data on error
      const basicMockData = {
        towers: [
          { id: 1, x: 100, y: 100 },
          { id: 2, x: 300, y: 300 },
          { id: 3, x: 500, y: 100 }
        ],
        devicePath: [
          { x: 100, y: 100 },
          { x: 200, y: 150 },
          { x: 300, y: 200 }
        ],
        steps: Array(60).fill().map((_, index) => ({
          position: { 
            x: 100 + index * 5, 
            y: 100 + Math.sin(index / 10) * 50 
          },
          connectedTower: index < 20 ? 1 : (index < 40 ? 2 : 3)
        })),
        powerData: Array(60).fill().map((_, index) => ({
          time: index,
          tower1: -70 - index * 0.5,
          tower2: -90 + index * 0.5,
          tower3: -80 + Math.sin(index / 10) * 5
        })),
        metrics: {
          handovers: 2,
          dropCalls: 1,
          avgSignalStrength: -70,
          coverage: 85,
          interference: 'Medium'
        }
      };
      setSimulationData(basicMockData);
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      if (isRunning && simulationData && simulationData.steps) {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= (simulationData.steps?.length || 0)) {
            setIsRunning(false);
            return prev;
          }
          return next;
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRunning, simulationData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading simulation...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={initializeSimulation}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!simulationData || !simulationData.steps || !simulationData.steps.length) {
    return <div className="flex justify-center items-center h-64">No simulation data available.</div>;
  }

  const currentPosition = simulationData.steps[currentStep]?.position || { x: 0, y: 0 };
  const connectedTower = simulationData.steps[currentStep]?.connectedTower || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Device Movement</h2>
            <MovementMap
              towers={simulationData.towers || []}
              devicePath={(simulationData.devicePath || []).slice(0, currentStep + 1)}
              currentPosition={currentPosition}
              connectedTower={connectedTower}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Power Levels</h2>
            <PowerGraph
              data={(simulationData.powerData || []).slice(0, currentStep + 1)}
              tower={`tower${connectedTower}`}
            />
          </div>

          <ControlPanel
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            useMRO={useMRO}
            onToggleMRO={setUseMRO}
          />
        </div>

        <div>
          <MetricsPanel metrics={simulationData.metrics || {}} />
        </div>
      </div>
    </div>
  );
};

export default MROSimulation; 