import { useNavigate } from 'react-router-dom';

const AgentDropdownMenu = ({ dropdown, onClose }) => {
  const navigate = useNavigate();

  if (!dropdown.open) return null;

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: dropdown.y,
        left: dropdown.x,
        zIndex: 9999,
      }}
      className="bg-white rounded-lg shadow-lg border border-[#E8EBED] py-2 w-48"
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={() => handleAction(() => navigate(`/agents/${dropdown.row.id}`))}
        className="w-full px-4 py-2 text-left text-sm font-general text-[#1E1E1E] hover:bg-[#F5F6F7]"
      >
        View Profile Details
      </button>
      <button
        onClick={() => handleAction(() => console.log('Suspend agent:', dropdown.row.id))}
        className="w-full px-4 py-2 text-left text-sm font-general text-[#1E1E1E] hover:bg-[#F5F6F7]"
      >
        Suspend Agent
      </button>
      <button
        onClick={() => handleAction(() => navigate(`/agents/${dropdown.row.id}?tab=transactions`))}
        className="w-full px-4 py-2 text-left text-sm font-general text-[#1E1E1E] hover:bg-[#F5F6F7]"
      >
        View Transaction History
      </button>
    </div>
  );
};

export default AgentDropdownMenu;