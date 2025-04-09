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

  useEffect(() => {
    initializeSimulation();
  }, [useMRO]);

  const initializeSimulation = async () => {
    try {
      const data = await simulateMRO({ useMRO });
      setSimulationData(data);
      setCurrentStep(0);
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
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
      if (isRunning && simulationData) {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= simulationData.steps.length) {
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

  if (!simulationData) {
    return <div>Loading simulation...</div>;
  }

  const currentPosition = simulationData.steps[currentStep]?.position;
  const connectedTower = simulationData.steps[currentStep]?.connectedTower;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Device Movement</h2>
            <MovementMap
              towers={simulationData.towers}
              devicePath={simulationData.devicePath.slice(0, currentStep + 1)}
              currentPosition={currentPosition}
              connectedTower={connectedTower}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-2xl font-bold mb-4">Power Levels</h2>
            <PowerGraph
              data={simulationData.powerData.slice(0, currentStep + 1)}
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
          <MetricsPanel metrics={simulationData.metrics} />
        </div>
      </div>
    </div>
  );
};

export default MROSimulation; 