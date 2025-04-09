import React from 'react';

const MetricsPanel = ({ metrics, showOptimizedComparison = false }) => {
  const calculateChange = (current, original) => {
    if (!original) return 0;
    const percentage = ((current - original) / original) * 100;
    return percentage.toFixed(1);
  };

  const MetricItem = ({ label, value, unit = '', originalValue }) => {
    const change = showOptimizedComparison ? calculateChange(value, originalValue) : null;
    const isPositive = change > 0;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600">{label}</span>
          {change !== null && (
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <div className="text-3xl font-bold">
          {value}
          {unit && <span className="text-xl ml-1">{unit}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Network Metrics</h2>
      
      <MetricItem
        label="Signal Coverage"
        value={metrics.signalCoverage}
        unit="%"
        originalValue={metrics.originalSignalCoverage}
      />
      
      <MetricItem
        label="Interference"
        value={metrics.interference}
        unit="dB"
        originalValue={metrics.originalInterference}
      />
      
      <MetricItem
        label="Coverage Gap"
        value={metrics.coverageGap}
        unit="%"
        originalValue={metrics.originalCoverageGap}
      />
      
      <MetricItem
        label="Throughput"
        value={metrics.throughput}
        unit="Mbps"
        originalValue={metrics.originalThroughput}
      />

      {metrics.handoverSuccess && (
        <>
          <MetricItem
            label="Handover Success"
            value={metrics.handoverSuccess}
            unit="%"
          />
          
          <MetricItem
            label="Ping-Pong Events"
            value={metrics.pingPongEvents}
          />
          
          <MetricItem
            label="Signal Stability"
            value={metrics.signalStability}
            unit="%"
          />
        </>
      )}
    </div>
  );
};

export default MetricsPanel; 