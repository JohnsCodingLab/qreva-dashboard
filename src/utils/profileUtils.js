import CustomEye from "@/components/icons/CustomEye";
import CustomShare from "@/components/icons/CustomShare";
import { userTransactionColumns } from "@/pages/users/constants";

export const createTransactionActions = (setSelectedTransaction, setShowDetailsModal, setShowShareModal) => [
  {
    label: 'View Transaction Details',
    type: 'view',
    icon: CustomEye,
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowDetailsModal(true);
    }
  },
  {
    label: 'Download Receipt',
    type: 'share',
    icon: CustomShare,
    onClick: (transaction) => {
      setSelectedTransaction(transaction);
      setShowShareModal(true);
    }
  }
];

export const createUserActions = (userData, setShowSuspendModal, setShowPromoteModal, setPromotionType, setShowActionsMenu, setShowAssignRoleModal) => {
  const actions = [
    {
      label: 'Assign Role',
      onClick: () => {
        setShowActionsMenu(false);
        setShowAssignRoleModal?.(true);
      }
    },
    {
      label: 'Suspend User',
      onClick: () => {
        setShowActionsMenu(false);
        setShowSuspendModal(true);
      }
    }
  ];

  if (userData?.type === 'Individual' || userData?.accountType === 'Personal Account') {
    const promotions = ['Agent', 'Aggregator', 'Agg. Manager'];
    promotions.forEach(type => {
      actions.push({
        label: `Promote To ${type}`,
        onClick: () => {
          setPromotionType(type);
          setShowActionsMenu(false);
          setShowPromoteModal(true);
        }
      });
    });
  }

  return actions;
};

export const getAvailableTabs = (userType) => {
  const tabs = [
    { key: 'profile', label: 'Profile Details' },
    { key: 'transactions', label: 'Transaction History' }
  ];

  if (userType === 'Aggregator') {
    tabs.push({ key: 'agents', label: 'Agents' });
  }

  if (userType === 'Merchant') {
    // One SoftPOS tab with a terminal picker, rather than a fixed "Terminal A"
    // and "Terminal B". Those two were not terminal views at all: nothing ever
    // populated userData.terminalA/terminalB, so both silently fell back to the
    // user's full, unfiltered transaction list and showed identical rows. A
    // merchant also has as many SoftPOS terminals as they have devices, which
    // two hardcoded tabs could never represent.
    tabs.push(
      { key: 'softpos', label: 'SoftPOS' },
      { key: 'physicalPos', label: 'Physical POS' }
    );
  }

  return tabs;
};


export const tabConfig = {
  transactions: {
    title: 'Transactions',
    dataKey: 'transactions',
    columns: userTransactionColumns
  },
  agents: {
    title: 'Agents',
    dataKey: 'agents',
    columns: userTransactionColumns
  },
  softpos: {
    title: 'SoftPOS Transactions',
    dataKey: 'softpos',
    columns: userTransactionColumns
  },
  physicalPos: {
    title: 'Physical POS',
    dataKey: 'physicalPos',
    columns: userTransactionColumns
  }
};