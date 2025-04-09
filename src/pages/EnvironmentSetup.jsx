import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnvironmentCard from '../components/common/EnvironmentCard';
import Button from '../components/common/Button';

const EnvironmentSetup = () => {
  const navigate = useNavigate();
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);

  const environments = [
    {
      id: 'urban',
      name: 'Urban',
      image: '/images/urban-environment.jpg',
      description: 'Dense city environment with high-rise buildings',
    },
    {
      id: 'rural',
      name: 'Rural',
      image: '/images/rural-environment.jpg',
      description: 'Open countryside with scattered buildings',
    },
    {
      id: 'campus',
      name: 'Campus',
      image: '/images/campus-environment.jpg',
      description: 'University campus with mixed building density',
    },
  ];

  const handleContinue = () => {
    if (selectedEnvironment) {
      navigate('/digital-twin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Select Environment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {environments.map((env) => (
            <EnvironmentCard
              key={env.id}
              name={env.name}
              image={env.image}
              selected={selectedEnvironment === env.id}
              onClick={() => setSelectedEnvironment(env.id)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedEnvironment}
            size="lg"
          >
            Continue to Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSetup; 