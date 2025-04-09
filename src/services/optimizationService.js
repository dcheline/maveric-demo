// Constants for optimization parameters
const OPTIMIZATION_CONSTANTS = {
  MIN_POWER: -20, // dBm
  MAX_POWER: 30,  // dBm
  POWER_STEP: 2,  // dBm
  MIN_TILT: -10,  // degrees
  MAX_TILT: 10,   // degrees
  TILT_STEP: 1,   // degrees
  MIN_AZIMUTH: 0, // degrees
  MAX_AZIMUTH: 359, // degrees
  AZIMUTH_STEP: 5, // degrees
};

/**
 * Calculates signal strength based on distance and antenna parameters
 * @param {number} distance - Distance from antenna in meters
 * @param {number} power - Transmit power in dBm
 * @param {number} frequency - Frequency in MHz
 * @returns {number} Signal strength in dBm
 */
const calculateSignalStrength = (distance, power, frequency = 2100) => {
  // Free space path loss model
  const pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(frequency) - 27.55;
  return power - pathLoss;
};

/**
 * Calculates coverage area for an antenna
 * @param {Object} antenna - Antenna parameters
 * @param {number} minSignalStrength - Minimum acceptable signal strength in dBm
 * @returns {number} Coverage radius in meters
 */
const calculateCoverageArea = (antenna, minSignalStrength = -95) => {
  const { power, frequency = 2100 } = antenna;
  
  // Binary search to find the distance where signal strength equals minSignalStrength
  let left = 0;
  let right = 10000; // 10km max radius
  let result = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const signalStrength = calculateSignalStrength(mid, power, frequency);
    
    if (signalStrength >= minSignalStrength) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
};

/**
 * Calculates interference between two antennas
 * @param {Object} antenna1 - First antenna parameters
 * @param {Object} antenna2 - Second antenna parameters
 * @returns {number} Interference level in dB
 */
const calculateInterference = (antenna1, antenna2) => {
  const distance = Math.sqrt(
    Math.pow(antenna1.x - antenna2.x, 2) + 
    Math.pow(antenna1.y - antenna2.y, 2)
  );
  
  const signal1 = calculateSignalStrength(distance, antenna1.power, antenna1.frequency);
  const signal2 = calculateSignalStrength(distance, antenna2.power, antenna2.frequency);
  
  return Math.min(signal1, signal2);
};

/**
 * Optimizes antenna parameters using genetic algorithm
 * @param {Array} antennas - Array of antenna objects
 * @param {Object} constraints - Optimization constraints
 * @returns {Array} Optimized antenna parameters
 */
const optimizeAntennas = (antennas, constraints = {}) => {
  const {
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    minSignalStrength = -95,
    maxInterference = -85,
  } = constraints;

  // Initialize population with random parameters
  const population = Array(populationSize).fill().map(() => 
    antennas.map(antenna => ({
      ...antenna,
      power: Math.floor(Math.random() * (OPTIMIZATION_CONSTANTS.MAX_POWER - OPTIMIZATION_CONSTANTS.MIN_POWER) / OPTIMIZATION_CONSTANTS.POWER_STEP) * OPTIMIZATION_CONSTANTS.POWER_STEP + OPTIMIZATION_CONSTANTS.MIN_POWER,
      tilt: Math.floor(Math.random() * (OPTIMIZATION_CONSTANTS.MAX_TILT - OPTIMIZATION_CONSTANTS.MIN_TILT) / OPTIMIZATION_CONSTANTS.TILT_STEP) * OPTIMIZATION_CONSTANTS.TILT_STEP + OPTIMIZATION_CONSTANTS.MIN_TILT,
      azimuth: Math.floor(Math.random() * (OPTIMIZATION_CONSTANTS.MAX_AZIMUTH - OPTIMIZATION_CONSTANTS.MIN_AZIMUTH) / OPTIMIZATION_CONSTANTS.AZIMUTH_STEP) * OPTIMIZATION_CONSTANTS.AZIMUTH_STEP + OPTIMIZATION_CONSTANTS.MIN_AZIMUTH,
    }))
  );

  // Fitness function
  const calculateFitness = (solution) => {
    let coverage = 0;
    let interference = 0;
    
    solution.forEach(antenna => {
      const radius = calculateCoverageArea(antenna, minSignalStrength);
      coverage += Math.PI * radius * radius;
      
      solution.forEach(other => {
        if (antenna !== other) {
          interference += calculateInterference(antenna, other);
        }
      });
    });
    
    return coverage - Math.abs(interference);
  };

  // Evolution loop
  for (let generation = 0; generation < generations; generation++) {
    // Sort population by fitness
    population.sort((a, b) => calculateFitness(b) - calculateFitness(a));
    
    // Create new population
    const newPopulation = [];
    for (let i = 0; i < populationSize; i += 2) {
      const parent1 = population[i];
      const parent2 = population[i + 1] || population[0];
      
      // Crossover
      const child1 = parent1.map((antenna, j) => ({
        ...antenna,
        power: Math.random() < 0.5 ? parent1[j].power : parent2[j].power,
        tilt: Math.random() < 0.5 ? parent1[j].tilt : parent2[j].tilt,
        azimuth: Math.random() < 0.5 ? parent1[j].azimuth : parent2[j].azimuth,
      }));
      
      const child2 = parent2.map((antenna, j) => ({
        ...antenna,
        power: Math.random() < 0.5 ? parent1[j].power : parent2[j].power,
        tilt: Math.random() < 0.5 ? parent1[j].tilt : parent2[j].tilt,
        azimuth: Math.random() < 0.5 ? parent1[j].azimuth : parent2[j].azimuth,
      }));
      
      // Mutation
      if (Math.random() < mutationRate) {
        child1.forEach(antenna => {
          antenna.power += (Math.random() - 0.5) * OPTIMIZATION_CONSTANTS.POWER_STEP;
          antenna.tilt += (Math.random() - 0.5) * OPTIMIZATION_CONSTANTS.TILT_STEP;
          antenna.azimuth += (Math.random() - 0.5) * OPTIMIZATION_CONSTANTS.AZIMUTH_STEP;
          
          // Clamp values
          antenna.power = Math.max(OPTIMIZATION_CONSTANTS.MIN_POWER, Math.min(OPTIMIZATION_CONSTANTS.MAX_POWER, antenna.power));
          antenna.tilt = Math.max(OPTIMIZATION_CONSTANTS.MIN_TILT, Math.min(OPTIMIZATION_CONSTANTS.MAX_TILT, antenna.tilt));
          antenna.azimuth = Math.max(OPTIMIZATION_CONSTANTS.MIN_AZIMUTH, Math.min(OPTIMIZATION_CONSTANTS.MAX_AZIMUTH, antenna.azimuth));
        });
      }
      
      newPopulation.push(child1, child2);
    }
    
    // Replace old population
    population.splice(0, populationSize, ...newPopulation.slice(0, populationSize));
  }
  
  // Return best solution
  return population[0];
};

/**
 * Simulates CCO (Coverage and Capacity Optimization) process
 * @param {Array} antennas - Array of antenna objects
 * @param {Object} area - Area dimensions {width, height}
 * @param {Object} options - Optimization options
 * @returns {Object} Optimization results
 */
const simulateCCO = (antennas, area, options = {}) => {
  const {
    iterations = 50,
    populationSize = 20,
    mutationRate = 0.1,
    crossoverRate = 0.8,
  } = options;

  // Create initial population
  const population = Array(populationSize).fill().map(() => 
    antennas.map(antenna => ({
      power: Math.random() * (OPTIMIZATION_CONSTANTS.MAX_POWER - OPTIMIZATION_CONSTANTS.MIN_POWER) + OPTIMIZATION_CONSTANTS.MIN_POWER,
      tilt: Math.random() * (OPTIMIZATION_CONSTANTS.MAX_TILT - OPTIMIZATION_CONSTANTS.MIN_TILT) + OPTIMIZATION_CONSTANTS.MIN_TILT,
      azimuth: Math.random() * (OPTIMIZATION_CONSTANTS.MAX_AZIMUTH - OPTIMIZATION_CONSTANTS.MIN_AZIMUTH) + OPTIMIZATION_CONSTANTS.MIN_AZIMUTH,
    }))
  );

  let bestSolution = null;
  let bestFitness = -Infinity;

  // Run genetic algorithm
  for (let i = 0; i < iterations; i++) {
    const fitnesses = population.map(solution => 
      calculateFitness(solution)
    );

    // Update best solution
    const maxFitnessIndex = fitnesses.indexOf(Math.max(...fitnesses));
    if (fitnesses[maxFitnessIndex] > bestFitness) {
      bestFitness = fitnesses[maxFitnessIndex];
      bestSolution = population[maxFitnessIndex];
    }

    // Create new population
    const newPopulation = [];
    while (newPopulation.length < populationSize) {
      const parent1 = selectParent(population, fitnesses);
      const parent2 = selectParent(population, fitnesses);
      
      if (Math.random() < crossoverRate) {
        const [child1, child2] = crossover(parent1, parent2);
        newPopulation.push(mutate(child1, mutationRate));
        newPopulation.push(mutate(child2, mutationRate));
      } else {
        newPopulation.push(mutate(parent1, mutationRate));
        newPopulation.push(mutate(parent2, mutationRate));
      }
    }

    population.length = 0;
    population.push(...newPopulation);
  }

  return {
    optimizedAntennas: bestSolution.map((params, index) => ({
      ...antennas[index],
      ...params,
    })),
    fitness: bestFitness,
    iterations,
  };
};

/**
 * Simulates MRO (Mobile Radio Optimization) process
 * @param {Array} antennas - Array of antenna objects
 * @param {Array} users - Array of user objects
 * @param {Object} area - Area dimensions {width, height}
 * @param {Object} options - Simulation options
 * @returns {Object} Simulation results
 */
const simulateMRO = (antennas, users, area, options = {}) => {
  const {
    duration = 60, // seconds
    updateInterval = 1000, // ms
  } = options;

  const results = {
    metrics: [],
    handovers: [],
    coverage: [],
  };

  let currentUsers = [...users];
  let timeElapsed = 0;

  const interval = setInterval(() => {
    // Move users
    currentUsers = currentUsers.map(user => ({
      ...user,
      x: Math.max(0, Math.min(area.width, user.x + (Math.random() - 0.5) * 10)),
      y: Math.max(0, Math.min(area.height, user.y + (Math.random() - 0.5) * 10)),
    }));

    // Update simulation state
    const updatedUsers = currentUsers.map(user => {
      const signals = antennas.map(antenna => {
        const distance = Math.sqrt(
          Math.pow(user.x - antenna.x, 2) + 
          Math.pow(user.y - antenna.y, 2)
        );
        const pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(antenna.frequency || 2100) - 27.55;
        return {
          antennaId: antenna.id,
          signalStrength: antenna.power - pathLoss,
        };
      });

      const bestSignal = signals.reduce((best, current) => {
        if (!best || current.signalStrength > best.signalStrength) {
          return current;
        }
        return best;
      }, null);

      return {
        ...user,
        connectedAntenna: bestSignal?.antennaId || null,
        signalStrength: bestSignal?.signalStrength || null,
        handoverAttempts: user.connectedAntenna !== bestSignal?.antennaId ? 
          (user.handoverAttempts || 0) + 1 : 0,
      };
    });

    // Calculate metrics
    const connectedUsers = updatedUsers.filter(user => user.connectedAntenna);
    const metrics = {
      coverageRatio: connectedUsers.length / updatedUsers.length,
      avgSignalStrength: connectedUsers.reduce((sum, user) => sum + user.signalStrength, 0) / connectedUsers.length,
      handoverSuccessRate: updatedUsers.filter(user => 
        user.handoverAttempts > 0 && user.connectedAntenna
      ).length / updatedUsers.filter(user => user.handoverAttempts > 0).length || 1,
    };

    // Record metrics
    results.metrics.push({
      timestamp: timeElapsed,
      ...metrics,
    });

    // Record handovers
    const handovers = updatedUsers.filter(user => 
      user.handoverAttempts > 0
    ).map(user => ({
      userId: user.id,
      fromAntenna: user.connectedAntenna,
      timestamp: timeElapsed,
    }));
    results.handovers.push(...handovers);

    // Update current state
    currentUsers = updatedUsers;
    timeElapsed += updateInterval / 1000;

    // Check if simulation should end
    if (timeElapsed >= duration) {
      clearInterval(interval);
    }
  }, updateInterval);

  return results;
};

export {
  optimizeAntennas,
  calculateSignalStrength,
  calculateCoverageArea,
  calculateInterference,
  simulateCCO,
  simulateMRO,
  OPTIMIZATION_CONSTANTS,
}; 