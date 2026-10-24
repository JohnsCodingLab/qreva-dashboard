import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/store/api/auth-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess, successMessages } from '../../utils/handleSuccess';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);
      const statusCode = response?.statusCode;
      if ((statusCode && statusCode >= 400) || !response?.data) {
        const errorMsg = Array.isArray(response?.message)
          ? response.message.join(', ')
          : response?.message || 'Invalid credentials';
        const error = new Error(errorMsg);
        error.response = { data: response, status: statusCode || 401 };
        throw error;
      }
      return response;
    },
    onSuccess: (response) => {
      const dataPayload = response?.data;
      if (!dataPayload?.token || !dataPayload?.admin) {
        return;
      }

      const { token, admin, mustChangePassword } = dataPayload;

      // Store token and user data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('userRole', admin.role);
      localStorage.setItem('userId', admin._id);
      localStorage.setItem('userEmail', admin.emailAddress);
      localStorage.setItem('userName', `${admin.firstName || ''} ${admin.lastName || ''}`.trim());
      localStorage.setItem('mustChangePassword', mustChangePassword);
      localStorage.setItem('userPermissions', JSON.stringify(admin.permissions || []));

      queryClient.invalidateQueries({ queryKey: ['admin'] });
      handleSuccess(response.message || successMessages.LOGIN_SUCCESS);
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

const throwIfErrorStatus = (response, fallbackMessage) => {
  const statusCode = response?.statusCode;
  if (statusCode && statusCode >= 400) {
    const error = new Error(response?.message || fallbackMessage);
    error.response = { data: response, status: statusCode };
    throw error;
  }
  return response;
};

// Step 1 of the escalating brute-force lockout (see login-lockout.util.ts
// on the backend): confirms the one-time code sent after too many wrong
// passwords. Success does NOT complete a login by itself - the account
// simply gets a fresh set of password attempts, so LoginPage sends the
// admin back to the password form to retry, exactly like the mobile app
// does for the same response.
export const useVerifyLoginOwnership = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.verifyLoginOwnership(payload);
      return throwIfErrorStatus(response, 'Verification failed.');
    },
    onSuccess: (response) => {
      handleSuccess(response.message || 'Identity verified. Please sign in again.');
    },
    onError: (error) => {
      handleError(error, 'Verification failed.');
    },
  });
};

export const useResendLoginOwnership = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.resendLoginOwnership(payload);
      return throwIfErrorStatus(response, 'Failed to resend code.');
    },
    onSuccess: (response) => {
      handleSuccess(response.message || 'Code resent.');
    },
    onError: (error) => {
      handleError(error, 'Failed to resend code.');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.forgotPassword(payload);
      return throwIfErrorStatus(response, 'Failed to request password reset.');
    },
    onSuccess: (response) => {
      handleSuccess(response.message || 'OTP sent to your email.');
    },
    onError: (error) => {
      handleError(error, 'Failed to request password reset.');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.resetPassword(payload);
      return throwIfErrorStatus(response, 'Failed to reset password.');
    },
    onSuccess: (response) => {
      handleSuccess(response.message || 'Password reset successfully.');
    },
    onError: (error) => {
      handleError(error, 'Failed to reset password.');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      handleSuccess(successMessages.PASSWORD_CHANGED);
      localStorage.setItem('mustChangePassword', 'false');
    },
    onError: (error) => {
      handleError(error, 'Failed to change password.');
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      handleSuccess('OTP sent to your email.');
    },
    onError: (error) => {
      handleError(error, 'Failed to send OTP.');
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onError: (error) => {
      handleError(error, 'Invalid OTP. Please try again.');
    },
  });
};

export const useChangePin = () => {
  return useMutation({
    mutationFn: authApi.changePin,
    onSuccess: () => {
      handleSuccess('PIN changed successfully.');
    },
    onError: (error) => {
      handleError(error, 'Failed to change PIN.');
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onError: () => {
      // Logout locally even if API call fails
    },
  });
};
