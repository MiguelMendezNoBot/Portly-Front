import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Stepper } from '../Stepper';

describe('Stepper', () => {
  it('muestra el paso activo', () => {
    render(<Stepper currentStep={2} totalSteps={3} />);
    expect(screen.getByText('PASO 2')).toBeInTheDocument();
  });
});
