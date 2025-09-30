import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('renders the welcome heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to Booker');
  });
});
