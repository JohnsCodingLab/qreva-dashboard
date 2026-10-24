import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const WelcomeModal = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show once per session to avoid annoying the user on every refresh
    if (user && !sessionStorage.getItem('hasSeenWelcomeModal')) {
      setIsOpen(true);
      sessionStorage.setItem('hasSeenWelcomeModal', 'true');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const name = user.username || user.email?.split('@')[0] || 'User';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-3xl">
          👋
        </div>
        <h2 className="text-2xl font-urbanist font-bold text-[#1E1E1E] mb-2">
          Welcome back,
        </h2>
        <p className="text-qreva-orange font-bold font-urbanist mb-6 text-xl">
          {name}!
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 bg-qreva-orange text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-qreva-orange"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
