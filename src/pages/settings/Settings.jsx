import React, { useState } from "react";
import { LogOut } from "lucide-react";
import SettingsCard from "@/components/settings/SettingsCard";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import ActionSuccessModal from "@/components/modals/ActionSuccessModal";
import LogoutConfirmationModal from "@/components/modals/LogoutConfirmationModal";
import { Button } from "@/components/ui/button";
import { settingsData } from "./data";
import { SETTINGS_VISUALS } from "./constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useChangePassword,
  useLogout,
} from "@/store/features/auth/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // API hooks
  const changePassword = useChangePassword();
  const logoutMutation = useLogout();

  // Change Password Flow States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isPasswordSuccessOpen, setIsPasswordSuccessOpen] = useState(false);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Map IDs to specific actions
  const handleItemClick = (id) => {
    switch (id) {
      case "profile":
        navigate("/settings/profile");
        break;
      case "password":
        setIsChangePasswordOpen(true);
        break;
      case "tier":
        navigate("/settings/tier");
        break;
      case "agency":
        navigate("/settings/agent-category");
        break;
      case "rbac":
        navigate("/settings/rbac");
        break;
      case "commission":
        navigate("/settings/commission-management");
        break;
      case "contract":
        navigate("/settings/contracts");
        break;
      case "partnerApi":
        navigate("/settings/partner-api");
        break;
      case "logs":
        navigate("/settings/activity-logs");
        break;
      case 'twoFactor':
        navigate('/settings/2fa');
        break;
      case 'designatedAccounts':
        navigate('/settings/designated-accounts');
        break;
      default:
        break;
    }
  };

  const handleChangePasswordSubmit = (passwords) => {
    changePassword.mutate(passwords, {
      onSuccess: () => {
        setIsChangePasswordOpen(false);
        setIsPasswordSuccessOpen(true);
      },
    });
  };

  const handleLogoutConfirm = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setIsLogoutModalOpen(false);
        logout();
      },
    });
  };

  const visibleSettingsItems = settingsData.filter((item) => {
    if (item.id === "contract") {
      return user?.role === "SuperAdmin" || user?.role === "Operation";
    }
    if (item.id === "logs") {
      return user?.role === "SuperAdmin";
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Settings</h1>
          <p className="text-[#808C91] mt-1">
            View and edit all your system settings
          </p>
        </div>

        <Button
          variant="outline"
          className="bg-[#FFF5F2] border-[#FFE6DE] text-[#FF5B04] hover:bg-[#FFE6DE] gap-2 w-full md:w-auto"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          Log Out
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleSettingsItems.map((item) => {
          const visual = SETTINGS_VISUALS[item.id];
          return (
            <SettingsCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={visual.icon}
              iconColor={visual.color}
              iconBgColor={visual.bgColor}
              onClick={() => handleItemClick(item.id)}
            />
          );
        })}
      </div>

      {/* Change Password Flow Modals */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePasswordSubmit}
      />

      <ActionSuccessModal
        isOpen={isPasswordSuccessOpen}
        onClose={() => setIsPasswordSuccessOpen(false)}
        title="Password Changed"
        message="You have successfully changed your password and can now use it to login subsequently"
      />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Settings;

