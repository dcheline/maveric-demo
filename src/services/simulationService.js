// Constants for simulation parameters
const SIMULATION_CONSTANTS = {
  UPDATE_INTERVAL: 1000, // ms
  MAX_USERS: 1000,
  MIN_SIGNAL_STRENGTH: -95, // dBm
  HANDOVER_THRESHOLD: -85, // dBm
  MAX_HANDOVER_ATTEMPTS: 3,
};

/**
 * Generates random user positions within the simulation area
 * @param {number} width - Width of simulation area in meters
 * @param {number} height - Height of simulation area in meters
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of user objects with position and signal strength
 */
const generateUsers = (width, height, count) => {
  return Array(count).fill().map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    x: Math.random() * width,
    y: Math.random() * height,
    connectedAntenna: null,
    signalStrength: null,
    handoverAttempts: 0,
  }));
};

/**
 * Calculates signal strength for a user from all antennas
 * @param {Object} user - User object with position
 * @param {Array} antennas - Array of antenna objects
 * @returns {Array} Array of signal strengths from each antenna
 */
const calculateUserSignals = (user, antennas) => {
  return antennas.map(antenna => {
    const distance = Math.sqrt(
      Math.pow(user.x - antenna.x, 2) + 
      Math.pow(user.y - antenna.y, 2)
    );
    
    // Free space path loss model
    const pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(antenna.frequency || 2100) - 27.55;
    return {
      antennaId: antenna.id,
      signalStrength: antenna.power - pathLoss,
    };
  });
};

/**
 * Determines the best antenna for a user based on signal strength
 * @param {Array} signals - Array of signal strengths from each antenna
 * @returns {Object} Best antenna signal information
 */
const findBestAntenna = (signals) => {
  return signals.reduce((best, current) => {
    if (!best || current.signalStrength > best.signalStrength) {
      return current;
    }
    return best;
  }, null);
};

/**
 * Updates user connections and performs handovers if necessary
 * @param {Array} users - Array of user objects
 * @param {Array} antennas - Array of antenna objects
 * @returns {Object} Updated simulation state
 */
const updateSimulation = (users, antennas) => {
  const updatedUsers = users.map(user => {
    const signals = calculateUserSignals(user, antennas);
    const bestSignal = findBestAntenna(signals);
    
    // Check if handover is needed
    if (user.connectedAntenna && 
        bestSignal.signalStrength > user.signalStrength + SIMULATION_CONSTANTS.HANDOVER_THRESHOLD &&
        user.handoverAttempts < SIMULATION_CONSTANTS.MAX_HANDOVER_ATTEMPTS) {
      return {
        ...user,
        connectedAntenna: bestSignal.antennaId,
        signalStrength: bestSignal.signalStrength,
        handoverAttempts: user.handoverAttempts + 1,
      };
    }
    
    // New connection
    if (!user.connectedAntenna && bestSignal.signalStrength >= SIMULATION_CONSTANTS.MIN_SIGNAL_STRENGTH) {
      return {
        ...user,
        connectedAntenna: bestSignal.antennaId,
        signalStrength: bestSignal.signalStrength,
        handoverAttempts: 0,
      };
    }
    
    return user;
  });
  
  // Calculate metrics
  const metrics = calculateMetrics(updatedUsers, antennas);
  
  return {
    users: updatedUsers,
    metrics,
  };
};

/**
 * Calculates network performance metrics
 * @param {Array} users - Array of user objects
 * @param {Array} antennas - Array of antenna objects
 * @returns {Object} Network performance metrics
 */
const calculateMetrics = (users, antennas) => {
  const connectedUsers = users.filter(user => user.connectedAntenna);
  const totalUsers = users.length;
  
  // Calculate coverage ratio
  const coverageRatio = connectedUsers.length / totalUsers;
  
  // Calculate average signal strength
  const avgSignalStrength = connectedUsers.reduce((sum, user) => sum + user.signalStrength, 0) / connectedUsers.length;
  
  // Calculate handover success rate
  const handoverAttempts = users.reduce((sum, user) => sum + user.handoverAttempts, 0);
  const successfulHandovers = users.filter(user => 
    user.handoverAttempts > 0 && user.connectedAntenna
  ).length;
  const handoverSuccessRate = handoverAttempts > 0 ? successfulHandovers / handoverAttempts : 1;
  
  // Calculate load distribution
  const loadDistribution = antennas.map(antenna => ({
    antennaId: antenna.id,
    userCount: connectedUsers.filter(user => user.connectedAntenna === antenna.id).length,
  }));
  
  return {
    coverageRatio,
    avgSignalStrength,
    handoverSuccessRate,
    loadDistribution,
    totalUsers,
    connectedUsers: connectedUsers.length,
  };
};

/**
 * Moves users randomly within the simulation area
 * @param {Array} users - Array of user objects
 * @param {number} width - Width of simulation area in meters
 * @param {number} height - Height of simulation area in meters
 * @param {number} maxDistance - Maximum distance a user can move in one step
 * @returns {Array} Updated user positions
 */
const moveUsers = (users, width, height, maxDistance = 10) => {
  return users.map(user => ({
    ...user,
    x: Math.max(0, Math.min(width, user.x + (Math.random() - 0.5) * maxDistance)),
    y: Math.max(0, Math.min(height, user.y + (Math.random() - 0.5) * maxDistance)),
  }));
};

export {
  generateUsers,
  updateSimulation,
  moveUsers,
  calculateMetrics,
  SIMULATION_CONSTANTS,
}; 