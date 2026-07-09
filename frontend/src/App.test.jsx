import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@stellar/freighter-api', () => ({
  getAddress: vi.fn(),
  getNetwork: vi.fn(),
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  signAuthEntry: vi.fn(),
  signMessage: vi.fn(),
  signTransaction: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    init: vi.fn(),
    getAddress: vi.fn(),
    signTransaction: vi.fn(),
    authModal: vi.fn(),
  },
  Networks: { TESTNET: 'Test SDF Network ; September 2015' },
}));

vi.mock('@creit.tech/stellar-wallets-kit/modules/freighter', () => ({
  FreighterModule: vi.fn(),
  FREIGHTER_ID: 'freighter',
}));

const App = (await import('./App')).default;

describe('Tip Jar App', () => {
  it('renders the Tip Jar heading', () => {
    render(<App />);
    expect(screen.getByText('Tip Jar')).toBeTruthy();
  });

  it('renders the Connect Wallet button when not connected', () => {
    render(<App />);
    expect(screen.getByText('Connect Wallet')).toBeTruthy();
  });

  it('renders the Send Tip button', () => {
    render(<App />);
    expect(screen.getByText('Send Tip')).toBeTruthy();
  });

  it('renders the amount input with default value', () => {
    render(<App />);
    const input = screen.getByDisplayValue('10');
    expect(input).toBeTruthy();
  });

  it('renders the Refresh Total button', () => {
    render(<App />);
    expect(screen.getByText('Refresh Total')).toBeTruthy();
  });
});