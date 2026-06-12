import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterForm from './RegisterForm';
import userEvent from '@testing-library/user-event';
// import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => {
  return {
    mockPush: vi.fn(),
    mockSignUp: vi.fn(),
  };
});

vi.mock(import('next/navigation'), () => {
  return {
    useRouter: () => ({ push: mocks.mockPush }),
  };
});

vi.mock(import('@/lib/supabase/client'), () => {
  return {
    supabase: {
      auth: {
        signUp: mocks.mockSignUp,
      },
    },
  };
});

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<RegisterForm></RegisterForm>);
  });

  it('smoke test', () => {
    screen.debug();
  });

  describe('Wrong input validations', async () => {
    it('Empty input, validation check', async () => {
      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: /register/i });
      await user.click(button);
      await screen.findByText('Username must be at least 3 characters long');
      await screen.findByText('Please enter a valid email address');
      await screen.findByText('Password must be at least 6 characters long');
    });

    it('Passwords do not match, validation check', async () => {
      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: /register/i });
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      await user.type(passwordInput, 'Password');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(button);
      await screen.findByText('Passwords do not match');
    });
  });

  it('Correct inputs, succesful register', async () => {
    mocks.mockSignUp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /register/i });
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    await user.type(usernameInput, 'vojtisek123');
    await user.type(emailInput, 'vojta@email.com');
    await user.type(passwordInput, 'Password');
    await user.type(confirmPasswordInput, 'Password');
    await user.click(button);
    await expect(mocks.mockSignUp).toHaveBeenCalledWith({
      email: 'vojta@email.com',
      password: 'Password',
      options: {
        data: {
          username: 'vojtisek123',
        },
      },
    });
    await expect(mocks.mockSignUp).toHaveBeenCalledTimes(1);
    await expect(mocks.mockPush).toHaveBeenCalledWith('/dashboard');
    await expect(mocks.mockPush).toHaveBeenCalledTimes(1);
  });

  it('Correct inputs, error occurs', async () => {
    mocks.mockSignUp.mockResolvedValue({
      error: {
        message: 'Something went wrong',
      },
    });
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /register/i });
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    await user.type(usernameInput, 'vojtisek123');
    await user.type(emailInput, 'vojta@email.com');
    await user.type(passwordInput, 'Password');
    await user.type(confirmPasswordInput, 'Password');
    await user.click(button);
    await expect(mocks.mockSignUp).toHaveBeenCalledWith({
      email: 'vojta@email.com',
      password: 'Password',
      options: {
        data: {
          username: 'vojtisek123',
        },
      },
    });
    await expect(mocks.mockSignUp).toHaveBeenCalledTimes(1);
    await screen.findByText('Something went wrong');
  });

  it('Login form redirect', async () => {
    const link = screen.getByText('Login here');
    const url = new URL(link.href).pathname;
    await expect(url).toBe('/login');
  });
});
