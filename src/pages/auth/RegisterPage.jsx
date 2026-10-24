import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFA] flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex w-full max-w-[220px] items-center justify-center gap-2">
        <div className="h-10 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </div>
        <span className="font-urbanist text-[32px] font-medium text-[#084059] sm:text-[36px]">Qreva</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg border border-[#E8EBED] shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={22} className="text-[#FF5B04]" />
          <h1 className="text-2xl font-urbanist font-bold text-[#1E1E1E]">
            Invite-Only Access
          </h1>
        </div>

        <p className="text-sm text-[#505C61] font-general leading-relaxed mb-4">
          Aggregator and Aggregator Manager access is invite-only by Admin. Registration through referral links is disabled.
        </p>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#FFF4EE] border border-[#FFCCB1] mb-5">
          <Mail size={18} className="text-[#FF5B04] mt-0.5 shrink-0" />
          <p className="text-xs text-[#B54103] font-general leading-relaxed">
            If you have been invited, login with your existing Agent email and password, then select the correct login channel.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full h-12 rounded-lg bg-[#FF5B04] text-white font-general font-semibold hover:bg-[#E54F03] transition-colors"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;

