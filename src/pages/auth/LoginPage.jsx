import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import {
  useLogin,
  useForgotPassword,
  useResetPassword,
  useVerifyLoginOwnership,
  useResendLoginOwnership,
} from '../../store/features/auth/useAuth';
import { handleError } from '@/store/utils/handleError';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  twoFactorSchema,
  ownershipOtpSchema,
} from './schema';
import { getInputBorderColor, getFloatingLabelClasses } from './utils/inputHelpers';
import { inputStyles, buttonStyles, iconButtonStyles } from './utils/inputStyles';

const ForgotPasswordEmailForm = ({ onSent, onCancel }) => {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });
  const email = watch('email');

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword.mutateAsync({ emailAddress: data.email });
      onSent({ email: data.email, temporaryId: response?.data?.temporaryId });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-[#808C91] font-general">
        Enter the email address linked to your admin account and we'll send you a one-time code to reset your password.
      </p>
      <div className="relative">
        <input
          type="email"
          id="forgotEmail"
          {...register('email')}
          disabled={forgotPassword.isPending}
          className={`${inputStyles.base} ${getInputBorderColor(errors.email, touchedFields.email, email)}`}
          placeholder=" "
        />
        <label htmlFor="forgotEmail" className={getFloatingLabelClasses(email)}>
          Email Address
        </label>
        {errors.email && touchedFields.email && (
          <p className="text-xs text-qreva-orange mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || forgotPassword.isPending}
        className={buttonStyles.primary(isValid, forgotPassword.isPending)}
      >
        {forgotPassword.isPending ? 'Sending code...' : 'Send Reset Code'}
      </Button>

      <button
        type="button"
        onClick={onCancel}
        disabled={forgotPassword.isPending}
        className={`${buttonStyles.link} w-full text-center`}
      >
        Back to login
      </button>
    </form>
  );
};

const ResetPasswordForm = ({ email, temporaryId, onSuccess, onCancel, onResend }) => {
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onTouched',
  });
  const otp = watch('otp');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {
    try {
      await resetPassword.mutateAsync({
        temporaryId,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      onSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-[#808C91] font-general">
        We sent a code to <span className="font-semibold text-[#1E1E1E]">{email}</span>. Enter it below with your new password.
      </p>

      <div className="relative">
        <input
          type="text"
          id="otp"
          {...register('otp')}
          disabled={resetPassword.isPending}
          className={`${inputStyles.base} ${getInputBorderColor(errors.otp, touchedFields.otp, otp)}`}
          placeholder=" "
        />
        <label htmlFor="otp" className={getFloatingLabelClasses(otp)}>
          Enter OTP
        </label>
        {errors.otp && touchedFields.otp && (
          <p className="text-xs text-qreva-orange mt-1">{errors.otp.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="newPassword"
          {...register('newPassword')}
          disabled={resetPassword.isPending}
          className={`${inputStyles.withIcon} ${getInputBorderColor(errors.newPassword, touchedFields.newPassword, newPassword)}`}
          placeholder=" "
        />
        <label htmlFor="newPassword" className={getFloatingLabelClasses(newPassword)}>
          New Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={resetPassword.isPending}
          className={iconButtonStyles}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.newPassword && touchedFields.newPassword && (
          <p className="text-xs text-qreva-orange mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          {...register('confirmPassword')}
          disabled={resetPassword.isPending}
          className={`${inputStyles.base} ${getInputBorderColor(errors.confirmPassword, touchedFields.confirmPassword, confirmPassword)}`}
          placeholder=" "
        />
        <label htmlFor="confirmPassword" className={getFloatingLabelClasses(confirmPassword)}>
          Confirm New Password
        </label>
        {errors.confirmPassword && touchedFields.confirmPassword && (
          <p className="text-xs text-qreva-orange mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || resetPassword.isPending}
        className={buttonStyles.primary(isValid, resetPassword.isPending)}
      >
        {resetPassword.isPending ? 'Resetting password...' : 'Reset Password'}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onResend}
          disabled={resetPassword.isPending}
          className={buttonStyles.link}
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={resetPassword.isPending}
          className={buttonStyles.link}
        >
          Back to login
        </button>
      </div>
    </form>
  );
};

// Step in the escalating brute-force lockout (login-lockout.util.ts on the
// backend), NOT the same as opt-in admin 2FA below: shown after too many
// wrong passwords, on either the admin or the aggregator/aggregator_manager
// portal login. Verifying the code doesn't complete a login itself - it
// just clears the lockout so the account gets a fresh set of password
// attempts, so success sends the person back to the password form, same as
// the mobile app's equivalent screen.
const OwnershipVerifyForm = ({ challengeId, otpChannels, onVerified, onCancel }) => {
  const verifyOwnership = useVerifyLoginOwnership();
  const resendOwnership = useResendLoginOwnership();
  const [activeChallengeId, setActiveChallengeId] = useState(challengeId);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(ownershipOtpSchema),
    mode: 'onTouched',
  });
  const otp = watch('otp');

  const channelLabels = { email: 'email', sms: 'phone', push: 'push notification' };
  const channelsText = (otpChannels && otpChannels.length ? otpChannels : ['email', 'sms', 'push'])
    .map((c) => channelLabels[c] || c)
    .join(', ');

  const onSubmit = async (data) => {
    try {
      await verifyOwnership.mutateAsync({ challengeId: activeChallengeId, otp: data.otp.trim() });
      onVerified();
    } catch {
      // useVerifyLoginOwnership's onError already showed a toast.
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOwnership.mutateAsync({ challengeId: activeChallengeId });
      const nextChallengeId = response?.data?.challengeId;
      if (nextChallengeId) setActiveChallengeId(nextChallengeId);
    } catch {
      // useResendLoginOwnership's onError already showed a toast.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-[#808C91] font-general">
        Too many failed attempts. Enter the one-time code we sent to your {channelsText} to continue.
      </p>

      <div className="relative">
        <input
          type="text"
          id="ownershipOtp"
          {...register('otp')}
          disabled={verifyOwnership.isPending}
          className={`${inputStyles.base} ${getInputBorderColor(errors.otp, touchedFields.otp, otp)}`}
          placeholder=" "
        />
        <label htmlFor="ownershipOtp" className={getFloatingLabelClasses(otp)}>
          Enter OTP
        </label>
        {errors.otp && touchedFields.otp && (
          <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || verifyOwnership.isPending}
        className={buttonStyles.primary(isValid, verifyOwnership.isPending)}
      >
        {verifyOwnership.isPending ? 'Verifying...' : 'Verify'}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendOwnership.isPending || verifyOwnership.isPending}
          className={buttonStyles.link}
        >
          {resendOwnership.isPending ? 'Resending...' : 'Resend code'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={verifyOwnership.isPending}
          className={buttonStyles.link}
        >
          Back to login
        </button>
      </div>
    </form>
  );
};

// Opt-in admin 2FA (authenticator app, set up from the admin's own security
// settings - see Admin2faService). Shown when a login attempt for an
// account with 2FA enabled answers with requiresTwoFactor and no token yet;
// resubmits the SAME credentials plus the code, since AdminService.login
// only issues a token once both check out. Accepts a live 6-digit code or
// one of the single-use backup codes generated at setup.
const TwoFactorForm = ({ credentials, onSuccess, onCancel }) => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(twoFactorSchema),
    mode: 'onTouched',
  });
  const code = watch('code');

  const onSubmit = async (data) => {
    try {
      const response = await login.mutateAsync({
        ...credentials,
        twoFactorCode: data.code.trim(),
      });
      const dataPayload = response?.data;
      if (dataPayload?.token && dataPayload?.admin) {
        onSuccess(dataPayload);
      }
      // An incorrect code answers with a 401 and requiresTwoFactor still
      // true - useLogin's onError already toasted it, so the form just
      // stays put for another try.
    } catch {
      // useLogin's onError already showed a toast.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-[#808C91] font-general">
        Enter the 6-digit code from your authenticator app, or one of your backup codes.
      </p>

      <div className="relative">
        <input
          type="text"
          id="twoFactorCode"
          autoComplete="one-time-code"
          {...register('code')}
          disabled={login.isPending}
          className={`${inputStyles.base} ${getInputBorderColor(errors.code, touchedFields.code, code)}`}
          placeholder=" "
        />
        <label htmlFor="twoFactorCode" className={getFloatingLabelClasses(code)}>
          Authentication code
        </label>
        {errors.code && touchedFields.code && (
          <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || login.isPending}
        className={buttonStyles.primary(isValid, login.isPending)}
      >
        {login.isPending ? 'Verifying...' : 'Verify'}
      </Button>

      <button
        type="button"
        onClick={onCancel}
        disabled={login.isPending}
        className={`${buttonStyles.link} w-full text-center`}
      >
        Back to login
      </button>
    </form>
  );
};

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  // 'login' | 'forgot-email' | 'forgot-reset' | 'two-factor' | 'ownership-verify'
  const [mode, setMode] = useState('login');
  const [resetContext, setResetContext] = useState(null);
  // Credentials held between the first login attempt and a follow-up
  // step (2FA code, or a retry after ownership verification) - never
  // written anywhere but component state.
  const [pendingCredentials, setPendingCredentials] = useState(null);
  const [ownershipChallenge, setOwnershipChallenge] = useState(null);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      loginAs: 'admin',
    },
  });

  const email = watch('email');
  const password = watch('password');
  const loginAs = watch('loginAs');

  // Shared by the initial password submit and TwoFactorForm's follow-up
  // submit - both end with the same successful { token, admin } payload.
  const completeLogin = (dataPayload) => {
    const { token, admin, mustChangePassword } = dataPayload;
    onLogin({
      username: `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
      email: admin.emailAddress,
      role: admin.role,
      token: token,
      userId: admin._id,
      permissions: admin.permissions || [],
      mustChangePassword: mustChangePassword,
      status: admin.status,
    });
  };

  const onSubmit = async (data) => {
    const credentials = {
      emailAddress: data.email,
      password: data.password,
      loginAs: data.loginAs,
    };

    try {
      const response = await login.mutateAsync(credentials);
      const dataPayload = response?.data;

      // Opt-in admin 2FA - the password checked out, but a code from the
      // authenticator app is still needed before a token is issued.
      if (dataPayload?.requiresTwoFactor) {
        setPendingCredentials(credentials);
        setMode('two-factor');
        return;
      }

      // Brute-force lockout escalation - 3 wrong passwords in a row.
      // Ownership must be re-proven with a one-time code before this
      // account gets another password attempt.
      if (dataPayload?.requiresOwnershipVerification) {
        setOwnershipChallenge({
          challengeId: dataPayload.challengeId,
          otpChannels: dataPayload.otpChannels,
        });
        setMode('ownership-verify');
        return;
      }

      if (!dataPayload?.token || !dataPayload?.admin) {
        throw new Error(response?.message || 'Login failed. Invalid response received.');
      }

      completeLogin(dataPayload);
    } catch (error) {
      console.log('Login attempt failed:', error);
      handleError(error);
    }
  };

  const handleTwoFactorCancel = () => {
    setPendingCredentials(null);
    setMode('login');
  };

  const handleOwnershipCancel = () => {
    setOwnershipChallenge(null);
    setMode('login');
  };

  // Verifying the ownership OTP clears the lockout but does not itself log
  // the person in - see AuthService/AdminService.confirmLoginOwnershipOtp
  // on the backend. Send them back to the password form to retry.
  const handleOwnershipVerified = () => {
    setOwnershipChallenge(null);
    setMode('login');
  };

  const handleForgotPassword = () => {
    setMode('forgot-email');
  };

  const handleForgotPasswordSent = (context) => {
    setResetContext(context);
    setMode('forgot-reset');
  };

  const handleResetSuccess = () => {
    setResetContext(null);
    setMode('login');
  };

  const handleCancelReset = () => {
    setResetContext(null);
    setMode('login');
  };

  const headerCopy = {
    login: {
      title: 'Sign in with your registered email',
      subtitle: 'Use your registered email to sign in to your dashboard',
    },
    'forgot-email': {
      title: 'Reset your password',
      subtitle: "We'll email you a one-time code to verify it's you",
    },
    'forgot-reset': {
      title: 'Enter your new password',
      subtitle: 'Check your inbox for the reset code',
    },
    'two-factor': {
      title: 'Two-factor verification',
      subtitle: 'Confirm it\'s you with your authenticator app',
    },
    'ownership-verify': {
      title: 'Verify your identity',
      subtitle: 'Too many failed attempts - confirm ownership to continue',
    },
  }[mode];

  return (
    <div className="min-h-screen bg-[#F7FAFA] flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex w-full max-w-[220px] items-center justify-center gap-2">
        <div className="h-10 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </div>
        <span className="font-urbanist text-[32px] font-medium text-[#084059] sm:text-[36px]">Qreva</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-urbanist font-bold leading-[120%] tracking-tight text-[#1E1E1E]">
            {headerCopy.title}
          </CardTitle>
          <p className="text-sm text-center text-[#808C91] font-general leading-[145%]">
            {headerCopy.subtitle}
          </p>
        </CardHeader>

        <CardContent>
          {mode === 'forgot-email' && (
            <ForgotPasswordEmailForm onSent={handleForgotPasswordSent} onCancel={handleCancelReset} />
          )}

          {mode === 'forgot-reset' && (
            <ResetPasswordForm
              email={resetContext?.email}
              temporaryId={resetContext?.temporaryId}
              onSuccess={handleResetSuccess}
              onCancel={handleCancelReset}
              onResend={() => setMode('forgot-email')}
            />
          )}

          {mode === 'two-factor' && (
            <TwoFactorForm
              credentials={pendingCredentials}
              onSuccess={completeLogin}
              onCancel={handleTwoFactorCancel}
            />
          )}

          {mode === 'ownership-verify' && (
            <OwnershipVerifyForm
              challengeId={ownershipChallenge?.challengeId}
              otpChannels={ownershipChallenge?.otpChannels}
              onVerified={handleOwnershipVerified}
              onCancel={handleOwnershipCancel}
            />
          )}

          {mode === 'login' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <select
                id="loginAs"
                {...register('loginAs')}
                disabled={login.isPending}
                className={`${inputStyles.base} ${getInputBorderColor(
                  errors.loginAs,
                  touchedFields.loginAs,
                  loginAs
                )}`}
              >
                <option value="admin">Login as Super Admin / Operations</option>
                <option value="regional_manager">Login as Regional Manager</option>
                <option value="state_manager">Login as State Manager</option>
                <option value="aggregator">Login as Aggregator</option>
                <option value="aggregator_manager">Login as Aggregator Manager</option>
              </select>
              {errors.loginAs && touchedFields.loginAs && (
                <p className="text-xs text-qreva-orange mt-1">{errors.loginAs.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                {...register('email')}
                disabled={login.isPending}
                className={`${inputStyles.base} ${getInputBorderColor(
                  errors.email,
                  touchedFields.email,
                  email
                )}`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={getFloatingLabelClasses(email)}
              >
                Email Address
              </label>
              {errors.email && touchedFields.email && (
                <p className="text-xs text-qreva-orange mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                disabled={login.isPending}
                className={`${inputStyles.withIcon} ${getInputBorderColor(
                  errors.password,
                  touchedFields.password,
                  password
                )}`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={getFloatingLabelClasses(password)}
              >
                Enter your password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={login.isPending}
                className={iconButtonStyles}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && touchedFields.password && (
                <p className="text-xs text-qreva-orange mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={login.isPending}
                className={buttonStyles.link}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={!isValid || login.isPending}
              className={buttonStyles.primary(isValid, login.isPending)}
            >
              {login.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

