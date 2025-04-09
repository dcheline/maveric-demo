import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SimulationSetup from './SimulationSetup';
import DigitalTwinVisualization from './pages/DigitalTwinVisualization';
import MROSimulation from './pages/MROSimulation';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SimulationSetup />} />
          <Route path="/digital-twin" element={<DigitalTwinVisualization />} />
          <Route path="/mro-simulation" element={<MROSimulation />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
