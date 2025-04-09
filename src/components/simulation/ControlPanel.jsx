import React from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';

const ControlPanel = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  speed,
  onSpeedChange,
  useMRO,
  onToggleMRO,
  onOptimize,
  isOptimizing,
}) => {
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
  ];

  // MRO Simulation controls
  if (typeof onStart === 'function') {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <Button
              onClick={isRunning ? onPause : onStart}
              variant={isRunning ? 'secondary' : 'primary'}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={onReset} variant="secondary">
              Reset
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              label="Speed"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              options={speedOptions}
              className="w-32"
            />

            <Checkbox
              label="Use MRO"
              checked={useMRO}
              onChange={(e) => onToggleMRO(e.target.checked)}
            />
          </div>
        </div>
      </div>
    );
  }

  // CCO Optimization controls
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onOptimize}
          disabled={isOptimizing}
          variant="primary"
          className="w-full"
        >
          {isOptimizing ? 'Optimizing...' : 'Run CCO Optimization'}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel; 