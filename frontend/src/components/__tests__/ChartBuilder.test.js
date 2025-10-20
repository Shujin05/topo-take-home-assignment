import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChartBuilder from '../ChartBuilder'
import { getRawData, getChartData } from '../../api/apiService';
import { message } from 'antd';

jest.mock('../api/apiService', () => ({
  getRawData: jest.fn(),
  getChartData: jest.fn(),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
  },
}));

const setup = () => {
  const onResult = jest.fn();
  const utils = render(<ChartBuilder onResult={onResult} />);
  const form = utils.container.querySelector('form');
  return { ...utils, onResult, form };
};

describe('ChartBuilder Component', () => {
  beforeEach(() => {
    getRawData.mockClear();
    getChartData.mockClear();
    message.error.mockClear();
  });

  it('renders chart builder form', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }, { coffee_type: 'Latte', count: 45 }]);

    const { form } = setup();

    expect(screen.getByLabelText(/Chart type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/X axis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Y axis/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Bar/i));
    await waitFor(() => expect(form).toHaveFormValues({ chartType: 'bar' }));
  });

  it('fetches and sets columns when component mounts', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }, { coffee_type: 'Latte', count: 45 }]);

    setup();

    await waitFor(() => {
      expect(getRawData).toHaveBeenCalled();
      expect(screen.getByText('Mocha')).toBeInTheDocument();
      expect(screen.getByText('Latte')).toBeInTheDocument();
    });
  });

  it('validates the form and shows error when required fields are missing', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }]);

    setup();

    fireEvent.click(screen.getByText(/Generate Chart/i));

    await waitFor(() => {
      expect(screen.getByText(/Please select X column/)).toBeInTheDocument();
    });
  });

  it('calls getChartData on chart generation', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }]);
    getChartData.mockResolvedValue({ data: [{ coffee_type: 'Mocha', count: 35 }] });

    const { onResult } = setup();

    fireEvent.change(screen.getByLabelText(/X axis/i), { target: { value: 'coffee_type' } });
    fireEvent.change(screen.getByLabelText(/Y axis/i), { target: { value: 'count' } });

    fireEvent.click(screen.getByText(/Generate Chart/i));

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ params: expect.any(Object) })));
    expect(getChartData).toHaveBeenCalled();
  });

  it('shows an error message when getChartData fails', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }]);
    getChartData.mockRejectedValue(new Error('Failed to fetch data'));

    setup();

    fireEvent.click(screen.getByText(/Generate Chart/i));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to fetch chart data. Please try a different configuration.');
    });
  });

  it('supports undo functionality', async () => {
    getRawData.mockResolvedValue([{ coffee_type: 'Mocha', count: 35 }]);
    getChartData.mockResolvedValue({ data: [{ coffee_type: 'Mocha', count: 35 }] });

    const { form } = setup();

    fireEvent.change(screen.getByLabelText(/X axis/i), { target: { value: 'coffee_type' } });
    fireEvent.change(screen.getByLabelText(/Y axis/i), { target: { value: 'count' } });

    fireEvent.click(screen.getByText(/Generate Chart/i));

    fireEvent.click(screen.getByText(/Undo/i));

    await waitFor(() => expect(form).toHaveFormValues({ x: 'coffee_type', y: 'count' }));
  });
});
