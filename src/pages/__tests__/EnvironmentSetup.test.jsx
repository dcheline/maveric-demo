// EnvironmentSetup.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import EnvironmentSetup from '../EnvironmentSetup';

test('renders environment options', () => {
  render(<EnvironmentSetup />);
  expect(screen.getByText('Urban')).toBeInTheDocument();
  expect(screen.getByText('Rural')).toBeInTheDocument();
  expect(screen.getByText('Campus')).toBeInTheDocument();
  expect(screen.getByText('Both')).toBeInTheDocument();
});

test('Continue button is disabled when no environment is selected', () => {
  render(<EnvironmentSetup />);
  const continueButton = screen.getByText('Continue to Simulation');
  expect(continueButton).toBeDisabled();
});

test('Selecting an environment enables Continue button', () => {
  render(<EnvironmentSetup />);
  const urbanOption = screen.getByText('Urban').closest('div');
  fireEvent.click(urbanOption);
  const continueButton = screen.getByText('Continue to Simulation');
  expect(continueButton).not.toBeDisabled();
}); 