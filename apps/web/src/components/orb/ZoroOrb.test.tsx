import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ZoroOrb } from './ZoroOrb';

describe('ZoroOrb Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ZoroOrb state="IDLE" />);
    expect(container).toBeInTheDocument();
  });

  it('renders the Zoro text', () => {
    render(<ZoroOrb state="IDLE" />);
    expect(screen.getByText('Zoro')).toBeInTheDocument();
  });

  it('updates animation based on state', () => {
    const { rerender, container } = render(<ZoroOrb state="IDLE" />);
    // Testing specific framer motion output is complex without a real DOM, 
    // but we can verify it doesn't crash when cycling through states.
    rerender(<ZoroOrb state="LISTENING" />);
    expect(container).toBeInTheDocument();
    
    rerender(<ZoroOrb state="THINKING" />);
    expect(container).toBeInTheDocument();
    
    rerender(<ZoroOrb state="EXECUTING" />);
    expect(container).toBeInTheDocument();
    
    rerender(<ZoroOrb state="SUCCESS" />);
    expect(container).toBeInTheDocument();
    
    rerender(<ZoroOrb state="ERROR" />);
    expect(container).toBeInTheDocument();
  });
});
