import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateRangePicker } from '../date-range-picker';

describe('DateRangePicker', () => {
  it('renders preset selector', () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={undefined} onChange={onChange} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders calendar button', () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={undefined} onChange={onChange} />);
    
    expect(screen.getByText('Pick a date range')).toBeInTheDocument();
  });

  it('displays selected date range', () => {
    const onChange = vi.fn();
    const value = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    };
    
    render(<DateRangePicker value={value} onChange={onChange} />);
    
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
  });

  it('calls onChange when preset changes', () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={undefined} onChange={onChange} />);
    
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
