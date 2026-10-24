import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import {
  useReverseContribution,
  useSavingsContributions,
} from "@/store/features/smartSavings/useSmartSavings";
import {
  contributionColumns,
  formatDate,
  money,
  StatusPill,
} from "./constants";
import CustomEye from "@/components/icons/CustomEye";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "Pending", label: "Awaiting confirmation" },
  { value: "Disputed", label: "Queried" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Reversed", label: "Reversed" },
];

/**
 * Every passbook entry in the scheme.
 *
 * The one destructive action available here is reversing a confirmed entry,
 * which takes money off a member's record. It carries its own permission, it
 * demands a reason, and the member is told — because an entry quietly
 * disappearing from a passbook is the single thing most likely to destroy a
 * saver's trust in the scheme.
 */
const SmartSavingsEntries = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(params.get("status") || "Pending");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");

  const { data, isLoading } = useSavingsContributions({
    status: status || undefined,
    month: month || undefined,
    page,
    limit: 25,
  });

  const reverse = useReverseContribution();

  const entries = useMemo(() => data?.data?.entries ?? [], [data]);
  const pagination = data?.data?.pagination;

  const stats = useMemo(() => {
    const total = entries.reduce((sum, row) => sum + (row.amount || 0), 0);
    const fees = entries.reduce(
      (sum, row) => sum + (row.managementFee || 0),
      0,
    );
    const offline = entries.filter((row) => row.capturedOffline).length;
    return [
      {
        label: "Entries Shown",
        value: String(pagination?.total ?? entries.length),
        change: "",
        subtext:
          STATUS_TABS.find((tab) => tab.value === status)?.label || "All",
      },
      {
        label: "Value On Page",
        value: money(total),
        change: "",
        subtext: `${entries.length} entries`,
      },
      {
        label: "Fees On Page",
        value: money(fees, true),
        change: "",
        subtext: "Management fee taken",
      },
      {
        label: "Captured Offline",
        value: String(offline),
        change: "",
        subtext: "Recorded with no signal, synced later",
      },
    ];
  }, [entries, pagination, status]);

  const months = useMemo(() => {
    const keys = [];
    const cursor = new Date();
    cursor.setDate(1);
    for (let index = 0; index < 12; index += 1) {
      keys.push(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
      );
      cursor.setMonth(cursor.getMonth() - 1);
    }
    return keys;
  }, []);

  const actions = [
    {
      label: "View entry",
      icon: CustomEye,
      onClick: (row) => {
        setSelected(row);
        setReason("");
      },
    },
  ];

  const handleReverse = async () => {
    if (!reason.trim()) {
      toast.error("A reversal needs a reason — the member is told");
      return;
    }
    try {
      await reverse.mutateAsync({
        contributionId: selected.contributionId,
        reason: reason.trim(),
      });
      toast.success("Entry reversed and the member notified");
      setSelected(null);
      setReason("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not reverse this entry",
      );
    }
  };

  return (
    // Every page supplies its own scroll container and padding; the layout does
    // not. Without this the content sits flush against the sidebar and the
    // window edge — matching Affiliates and Promotions.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Savings entries"
          subtitle="Every contribution recorded across the scheme"
          hidden
        />

        <DashboardStats stats={stats} />

        <div className="mt-6 mb-4 flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                status === tab.value
                  ? "bg-[#084059] text-white"
                  : "bg-[#F1F3F4] text-[#808C91] hover:bg-[#E4E7EC]"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <select
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
            className="ml-auto h-9 rounded-full border border-[#E4E7EC] px-3 text-sm"
          >
            <option value="">All months</option>
            {months.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          title="Passbook entries"
          data={entries}
          columns={contributionColumns}
          actions={actions}
          loading={isLoading}
          getRowId={(row) => row.contributionId}
          showCheckbox={false}
          paginationMode="server"
          rowCount={pagination?.total ?? 0}
          onPageChange={(next) => setPage(next)}
        />

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[rgba(8,64,89,0.5)]"
            />
            <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-urbanist text-lg font-bold">
                    {selected.savingsType === "Item"
                      ? `${selected.item?.quantity ?? 0} ${selected.item?.unit || "item"}(s)`
                      : money(selected.amount)}
                  </h2>
                  <p className="text-sm text-[#808C91]">
                    {selected.member
                      ? `${selected.member.firstName} ${selected.member.lastName} · ${selected.member.memberNo}`
                      : selected.memberId}
                  </p>
                </div>
                <StatusPill
                  tone={
                    selected.status === "Confirmed"
                      ? "success"
                      : selected.status === "Pending"
                        ? "warning"
                        : "danger"
                  }
                >
                  {selected.status}
                </StatusPill>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl bg-[#F8FAFB] p-4">
                <Detail label="Plan" value={selected.plan?.name || "—"} />
                <Detail
                  label="Entry date"
                  value={formatDate(selected.entryDate)}
                />
                <Detail
                  label="Recorded by"
                  value={selected.recordedByName || selected.recordedByType}
                />
                <Detail
                  label="Management fee"
                  value={
                    selected.managementFee > 0
                      ? money(selected.managementFee, true)
                      : "None"
                  }
                />
                <Detail
                  label="Serial in month"
                  value={String(selected.serialNo)}
                />
                <Detail
                  label="Captured offline"
                  value={selected.capturedOffline ? "Yes" : "No"}
                />
              </div>

              {selected.note && (
                <div className="mb-4">
                  <p className="text-xs text-[#808C91]">Note</p>
                  <p className="text-sm">{selected.note}</p>
                </div>
              )}

              {selected.photos?.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-[#808C91]">
                    Photographs — the receipt for goods handed over
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selected.photos.map((photo) => (
                      <a
                        key={photo}
                        href={photo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo}
                          alt="Saved goods"
                          loading="lazy"
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.disputeReason && (
                <div className="mb-4 rounded-xl bg-[#FCECEC] p-4">
                  <p className="text-sm font-bold text-[#9E2D2D]">
                    The member has queried this
                  </p>
                  <p className="mt-1 text-sm">{selected.disputeReason}</p>
                  <p className="mt-1 text-xs text-[#808C91]">
                    Raised {formatDate(selected.disputedAt)}
                  </p>
                </div>
              )}

              {["Confirmed", "Disputed"].includes(selected.status) && (
                <div className="rounded-xl border border-[#FCECEC] bg-[#FEF2F2] p-4">
                  <p className="text-sm font-bold text-[#9E2D2D]">
                    Reverse this entry
                  </p>
                  <p className="mt-1 mb-3 text-xs text-[#808C91]">
                    Takes the amount back off the member's balance and tells
                    them why. Use only where the entry should never have been
                    made.
                  </p>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Why is this being reversed?"
                    className="mb-3 w-full rounded-xl border border-[#E4E7EC] p-3 text-sm focus:border-[#FF5B04] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={reverse.isPending || !reason.trim()}
                    onClick={handleReverse}
                    className="h-10 w-full rounded-full bg-[#DF3F40] text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {reverse.isPending ? "Reversing…" : "Reverse entry"}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-4 h-11 w-full rounded-full border border-[#E4E7EC] text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#808C91]">{label}</p>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export default SmartSavingsEntries;
