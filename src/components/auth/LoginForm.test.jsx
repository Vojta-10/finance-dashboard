import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginForm from './LoginForm';

const mocks = vi.hoisted(() => {
  return {
    mockPush: vi.fn(),
    mockSignIn: vi.fn(),
  };
});

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: mocks.mockPush }),
  };
});

vi.mock(import('@/lib/supabase/client'), () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: mocks.mockSignIn,
      },
    },
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<LoginForm></LoginForm>);
  });
  it('Smoke test', () => {
    screen.debug();
  });

  describe('Wrong input validations', async () => {
    it('Empty field validations', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /login/i }));
      await screen.findByText('Please enter a valid email address');
      await screen.findByText('Password must be at least 6 characters long');
    });

    it('Wrong credentials submission, correct data in onSubmit', async () => {
      mocks.mockSignIn.mockResolvedValue({ error: true });
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const button = screen.getByRole('button', { name: /login/i });
      await user.type(emailInput, 'vojta@email.cz');
      await user.type(passwordInput, 'Password');
      await user.click(button);
      expect(mocks.mockSignIn).toHaveBeenCalledWith({
        email: 'vojta@email.cz',
        password: 'Password',
      });
      await screen.findByText('Invalid login credentials');
    });
  });

  it('Correct field inputs, submission check for button state', async () => {
    mocks.mockSignIn.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const button = screen.getByRole('button', { name: /login/i });
    await user.type(emailInput, 'vojta@email.cz');
    await user.type(passwordInput, 'Password');
    mocks.mockSignIn.mockImplementation(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ error: null });
        }, 100);
      });
    });
    const clickPromise = user.click(button);
    await expect(await screen.findByText('Logging in...')).toBeInTheDocument();
    await expect(button).toBeDisabled();
    await clickPromise;
  });

  it('Correct field inputs, submission check for redirect', async () => {
    mocks.mockSignIn.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const button = screen.getByRole('button', { name: /login/i });
    await user.type(emailInput, 'vojta@email.cz');
    await user.type(passwordInput, 'Password');
    await user.click(button);
    await expect(mocks.mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('Register form redirect', () => {
    const link = screen.getByText('Register here');
    const url = new URL(link.href).pathname;
    expect(url).toBe('/register');
  });
});
