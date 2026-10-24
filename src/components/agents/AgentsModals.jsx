import AddAgentModal from '@/components/modals/AddAgentModal';
import AgentAddedModal from '@/components/modals/AgentAddedModal';
import ConfirmDialog from '@/components/modals/ConfirmDialogComponent';

const AgentModals = ({ modals, setters, selectedAgent, onAddAgent, onSuspendAgent }) => {
  return (
    <>
      <AddAgentModal
        isOpen={modals.showAddAgentModal}
        onClose={() => setters.setShowAddAgentModal(false)}
        onSubmit={onAddAgent}
      />

      <AgentAddedModal
        isOpen={modals.showAgentAddedModal}
        onClose={() => setters.setShowAgentAddedModal(false)}
      />

      <ConfirmDialog
        isOpen={modals.showSuspendModal}
        onClose={() => setters.setShowSuspendModal(false)}
        onConfirm={onSuspendAgent}
        title="Suspend Agent"
        message={`Are you sure you want to suspend ${selectedAgent?.name}?`}
        confirmText="Yes, suspend"
        confirmStyle="danger"
      />
    </>
  );
};

export default AgentModals;