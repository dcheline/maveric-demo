# Maveric Demo - Network Planning & Optimization Tool

Maveric Demo is an interactive web application for planning, visualizing, and optimizing wireless network deployments. The tool provides comprehensive visualizations and simulations to support Coverage and Capacity Optimization (CCO) and Mobile Radio Optimization (MRO).

## Features

- **Interactive Network Visualization**: View network layouts in different environments (Urban, Rural, Campus, etc.)
- **Digital Twin Simulation**: Simulate network coverage and optimize antenna parameters
- **Mobility Simulation**: Analyze user mobility patterns and handover performance
- **Antenna Configuration**: Fine-tune antenna parameters (power, tilt, azimuth, frequency)
- **Performance Metrics**: Monitor key network metrics in real-time
- **CCO Optimization**: Automatically optimize antenna parameters for best coverage and capacity

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/maveric-demo.git
   cd maveric-demo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is configured for easy deployment to Cloudflare Pages:

1. Push your code to a GitHub/GitLab repository
2. Connect the repository to Cloudflare Pages
3. Select "Vite" as the framework preset
4. Use `npm run build` as the build command and `dist` as the output directory
5. Deploy!

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different views
- `src/services/`: Service modules for simulation and optimization
- `src/assets/`: Static assets like images and icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.
