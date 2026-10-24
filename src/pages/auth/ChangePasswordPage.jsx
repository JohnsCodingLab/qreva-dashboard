import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { useChangePassword } from '../../store/features/auth/useAuth';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';
import { changePasswordSchema } from './schema';
import { getInputBorderColor, getFloatingLabelClasses } from './utils/inputHelpers';
import { inputStyles, buttonStyles, iconButtonStyles } from './utils/inputStyles';

const ChangePasswordPage = ({ onSuccess }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const changePassword = useChangePassword();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onTouched',
  });

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Check if user is forced to change password
  const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';

  const onSubmit = async (data) => {
    try {
      const response = await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Update localStorage
      localStorage.setItem('mustChangePassword', 'false');
      
      // Show success message
      if (response?.message) {
        handleSuccess(response.message);
      } else {
        handleSuccess('Password changed successfully');
      }

      // Reset form
      reset();

      // Navigate or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        //navigate('/dashboard');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    if (!mustChangePassword) {
      navigate('/dashboard');
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-qreva-orange' };
    if (strength <= 4) return { strength: 2, label: 'Medium', color: 'bg-qreva-orange' };
    return { strength: 3, label: 'Strong', color: 'bg-qreva-blue' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-orange-100 rounded-full">
              <Shield className="w-8 h-8 text-qreva-orange" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-urbanist font-bold leading-[120%] tracking-tight text-[#1E1E1E]">
            Change Your Password
          </CardTitle>
          <p className="text-sm text-center text-[#808C91] font-general leading-[145%]">
            {mustChangePassword 
              ? 'For security reasons, you must change your password before continuing'
              : 'Create a strong password to keep your account secure'
            }
          </p>
        </CardHeader>

        <CardContent>
          {mustChangePassword && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-qreva-orange shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">
                You must change your password to continue using your account.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                {...register('currentPassword')}
                disabled={changePassword.isPending}
                className={`${inputStyles.withIcon} ${getInputBorderColor(
                  errors.currentPassword,
                  touchedFields.currentPassword,
                  currentPassword
                )}`}
                placeholder=" "
              />
              <label
                htmlFor="currentPassword"
                className={getFloatingLabelClasses(currentPassword)}
              >
                Current Password
              </label>
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={changePassword.isPending}
                className={iconButtonStyles}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.currentPassword && touchedFields.currentPassword && (
                <p className="text-xs text-qreva-orange mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                {...register('newPassword')}
                disabled={changePassword.isPending}
                className={`${inputStyles.withIcon} ${getInputBorderColor(
                  errors.newPassword,
                  touchedFields.newPassword,
                  newPassword
                )}`}
                placeholder=" "
              />
              <label
                htmlFor="newPassword"
                className={getFloatingLabelClasses(newPassword)}
              >
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={changePassword.isPending}
                className={iconButtonStyles}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.newPassword && touchedFields.newPassword && (
                <p className="text-xs text-qreva-orange mt-1">{errors.newPassword.message}</p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && !errors.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-qreva-navy">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                disabled={changePassword.isPending}
                className={`${inputStyles.withIcon} ${getInputBorderColor(
                  errors.confirmPassword,
                  touchedFields.confirmPassword,
                  confirmPassword
                )}`}
                placeholder=" "
              />
              <label
                htmlFor="confirmPassword"
                className={getFloatingLabelClasses(confirmPassword)}
              >
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={changePassword.isPending}
                className={iconButtonStyles}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && touchedFields.confirmPassword && (
                <p className="text-xs text-qreva-orange mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-qreva-ash p-3 rounded-lg">
              <p className="text-xs font-semibold text-qreva-navy mb-2">Password Requirements:</p>
              <ul className="text-xs text-qreva-navy space-y-1">
                <li className="flex items-center gap-2">
                  <span className={newPassword?.length >= 8 ? 'text-qreva-blue' : 'text-gray-400'}>
                    {newPassword?.length >= 8 ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[A-Z]/.test(newPassword) ? 'text-qreva-blue' : 'text-gray-400'}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[a-z]/.test(newPassword) ? 'text-qreva-blue' : 'text-gray-400'}>
                    {/[a-z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/\d/.test(newPassword) ? 'text-qreva-blue' : 'text-gray-400'}>
                    {/\d/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One number
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[@$!%*?&#]/.test(newPassword) ? 'text-qreva-blue' : 'text-gray-400'}>
                    {/[@$!%*?&#]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One special character (@$!%*?&#)
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {!mustChangePassword && (
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={changePassword.isPending}
                  className="flex-1 h-12 text-base font-semibold bg-gray-200 hover:bg-gray-300 text-qreva-navy"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!isValid || changePassword.isPending}
                className={`${mustChangePassword ? 'w-full' : 'flex-1'} ${buttonStyles.primary(isValid, changePassword.isPending)}`}
              >
                {changePassword.isPending ? (
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
                    Changing Password...
                  </span>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;

