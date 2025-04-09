import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import EnvironmentSetup from './pages/EnvironmentSetup';
import DigitalTwinVisualization from './pages/DigitalTwinVisualization';
import MROSimulation from './pages/MROSimulation';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<EnvironmentSetup />} />
          <Route path="/digital-twin" element={<DigitalTwinVisualization />} />
          <Route path="/mro-simulation" element={<MROSimulation />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
