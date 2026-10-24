export const useProfileActions = (id, onSuspend, onPromote) => {
  const handleSuspend = () => {
    console.log('Suspend:', id);
    onSuspend?.();
  };

  const handlePromote = (type) => {
    console.log('Promote to:', type);
    onPromote?.(type);
  };

  return { handleSuspend, handlePromote };
};