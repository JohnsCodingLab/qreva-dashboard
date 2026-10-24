import { useCallback, useMemo, useState } from 'react';
import DashboardStats from '@/components/base/DashboardStats';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/tables/DataTable';
import ApprovalTabs from '@/components/account-approvals/ApprovalTabs';
import PosRequestModals from '@/components/pos-requests/PosRequestModals';
import {
  usePosRequests,
  usePosRequestMetrics,
  useApprovePosRequest,
  useDeclinePosRequest,
  useRefundPosRequest,
} from '@/store/features/posRequests/usePosRequests';
import {
  posRequestTabs,
  posRequestColumns,
  createPosRequestActions,
  AWAITING_STATUSES,
  formatNaira,
} from './constants';

/**
 * The queue for POS terminal requests.
 *
 * Asking for a terminal used to assign one outright. It no longer does — a
 * paid request waits here until someone approves it — which means without
 * this page merchants are charged and nothing ever reaches them.
 */
const PosRequests = () => {
  const [activeTab, setActiveTab] = useState('AwaitingApproval');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  const [modals, setModals] = useState({
    showDetailsModal: false,
    showApproveModal: false,
    showDeclineModal: false,
    showRefundModal: false,
  });
  const [selected, setSelected] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const setters = useMemo(
    () => ({
      setShowDetailsModal: (v) => setModals((m) => ({ ...m, showDetailsModal: v })),
      setShowApproveModal: (v) => setModals((m) => ({ ...m, showApproveModal: v })),
      setShowDeclineModal: (v) => setModals((m) => ({ ...m, showDeclineModal: v })),
      setShowRefundModal: (v) => setModals((m) => ({ ...m, showRefundModal: v })),
    }),
    [],
  );

  // The Awaiting tab covers two statuses — requests made before the approval
  // step existed sit at Paid — so both are asked for. Filtering in the client
  // instead left the page showing fewer rows than the pagination claimed.
  const statusParam =
    activeTab === 'AwaitingApproval'
      ? AWAITING_STATUSES.join(',')
      : activeTab === 'all'
        ? undefined
        : activeTab;

  const { data: response, isLoading } = usePosRequests({
    status: statusParam,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const { data: metricsResponse } = usePosRequestMetrics();
  const metrics = metricsResponse?.data;

  const approve = useApprovePosRequest();
  const decline = useDeclinePosRequest();
  const refund = useRefundPosRequest();

  const requests = response?.data?.requests || [];

  // From the metrics endpoint, not the page. Counting the rows in hand gave
  // the size of the current page, so a backlog of thirty showed as "25".
  const awaitingCount = metrics?.awaitingApproval ?? 0;

  const stats = useMemo(
    () => [
      {
        label: 'Awaiting Approval',
        value: (metrics?.awaitingApproval ?? 0).toLocaleString(),
        change: '',
        subtext: `${(metrics?.terminalsAwaiting ?? 0).toLocaleString()} terminal(s) to assign`,
      },
      {
        // The one worth watching: money taken for hardware nobody has handed
        // out. Backorders are accepted, so this is a liability, not a queue.
        label: 'Value Awaiting',
        value: formatNaira(metrics?.amountAwaiting),
        change: '',
        subtext: 'held against unapproved requests',
      },
      {
        label: 'Approved',
        value: (metrics?.approved ?? 0).toLocaleString(),
        change: '',
        subtext: `${(metrics?.delivered ?? 0).toLocaleString()} delivered`,
      },
      {
        label: 'Declined',
        value: (metrics?.declined ?? 0).toLocaleString(),
        change: '',
        subtext: 'refund separately if not yet done',
      },
    ],
    [metrics],
  );

  const openModal = useCallback(
    (key, row) => {
      setSelected(row);
      setDeclineReason('');
      setRefundReason('');
      setModals((m) => ({ ...m, [key]: true }));
    },
    [],
  );

  const handleApprove = useCallback(() => {
    if (approve.isPending || !selected?._id) return;
    approve.mutate(
      { id: selected._id },
      { onSettled: () => setters.setShowApproveModal(false) },
    );
  }, [approve, selected, setters]);

  const handleDecline = useCallback(() => {
    if (decline.isPending || !selected?._id) return;
    decline.mutate(
      { id: selected._id, reason: declineReason },
      { onSettled: () => setters.setShowDeclineModal(false) },
    );
  }, [decline, selected, declineReason, setters]);

  const handleRefund = useCallback(() => {
    if (refund.isPending || !selected?._id) return;
    refund.mutate(
      { id: selected._id, reason: refundReason },
      { onSettled: () => setters.setShowRefundModal(false) },
    );
  }, [refund, selected, refundReason, setters]);

  const tableActions = useMemo(
    () =>
      createPosRequestActions(
        (row) => openModal('showDetailsModal', row),
        (row) => openModal('showApproveModal', row),
        (row) => openModal('showDeclineModal', row),
        (row) => openModal('showRefundModal', row),
      ),
    [openModal],
  );

  const tabCounts = { AwaitingApproval: awaitingCount };

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6 pb-16 min-h-full">
        <PageHeader
          title="POS Requests"
          subtitle="Approve or decline merchant requests for hardware terminals"
          showTimeFilter={false}
        />

        <DashboardStats stats={stats} />

        <ApprovalTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setPaginationModel((p) => ({ ...p, page: 0 }));
          }}
          tabs={posRequestTabs}
          tabCounts={tabCounts}
        />

        <DataTable
          data={requests}
          title="POS Requests"
          columns={posRequestColumns}
          actions={tableActions}
          loading={isLoading}
          showCheckbox={false}
          // The merchant cell carries two lines, business above person, and
          // the grid's 52px default leaves them nothing: cells here already
          // spend 12px on margin and 12px on padding at each edge, so the
          // text was pressed together. 84px gives the two lines their own
          // room. Set here rather than in DataTable so every other table
          // keeps the height it was designed around.
          rowHeight={84}
          paginationMode="server"
          rowCount={response?.data?.pagination?.total || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <PosRequestModals
        modals={modals}
        setters={setters}
        selected={selected}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        onApprove={handleApprove}
        onDecline={handleDecline}
        onRefund={handleRefund}
        isApproving={approve.isPending}
        isDeclining={decline.isPending}
        isRefunding={refund.isPending}
      />
    </div>
  );
};

export default PosRequests;
