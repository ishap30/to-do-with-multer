import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders todo app heading and add button', async () => {
  render(<App />);
  expect(screen.getByText(/todo app/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
});
