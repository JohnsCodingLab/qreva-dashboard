import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import {
  AffiliateCreatedModal,
  AffiliateSignupsModal,
  CreateAffiliateModal,
} from "@/components/modals/AffiliateModals";
import { affiliateColumns, createAffiliateActions } from "./constants";
import {
  useAffiliateReferrals,
  useAffiliates,
  useBlockAffiliate,
  useCreateAffiliate,
  useUnblockAffiliate,
} from "@/store/features/affiliates/useAffiliates";

/**
 * Affiliates: people recruited to bring personal customers to Qreva.
 *
 * Distinct from the aggregator network, which signs up agents and merchants
 * and earns commission on their transactions. An affiliate's code signs up
 * individuals and earns a point each.
 *
 * They cannot register themselves, so this page is the only way one comes to
 * exist.
 */
const Affiliates = () => {
  const { data, isLoading } = useAffiliates();
  const createAffiliate = useCreateAffiliate();
  const blockAffiliate = useBlockAffiliate();
  const unblockAffiliate = useUnblockAffiliate();

  const [showCreate, setShowCreate] = useState(false);
  const [created, setCreated] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [referralPage, setReferralPage] = useState(1);

  const { data: referralData, isLoading: loadingReferrals } =
    useAffiliateReferrals({
      affiliateId: viewing?.affiliateId,
      page: referralPage,
    });

  const affiliates = useMemo(() => data?.data ?? [], [data]);

  const stats = useMemo(() => {
    const total = affiliates.length;
    const active = affiliates.filter((a) => a.status !== "Blocked").length;
    const points = affiliates.reduce((sum, a) => sum + (a.points ?? 0), 0);
    const signups = affiliates.reduce(
      (sum, a) => sum + (a.totalReferrals ?? 0),
      0,
    );
    return [
      {
        label: "Total Points",
        value: points.toLocaleString("en-US"),
        change: "",
        subtext: "Earned across all affiliates",
      },
      {
        label: "Signups",
        value: signups.toLocaleString("en-US"),
        change: "",
        subtext: "Personal accounts referred",
      },
      {
        label: "Affiliates",
        value: total.toLocaleString("en-US"),
        change: "",
        subtext: `${active} able to refer`,
      },
    ];
  }, [affiliates]);

  // The bare code, for anyone reading it out or typing it into the app.
  // Previously only the link could be copied, so the code had to be
  // selected by hand out of the table.
  const copyCode = async (code) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Referral code copied");
    } catch {
      toast.error("Could not copy — select it by hand");
    }
  };

  const copyLink = async (affiliate) => {
    const link = affiliate.referralLink || "";
    try {
      await navigator.clipboard.writeText(link);
      // The server builds this link. If REFERRAL_BASE_URL is unset on the
      // environment it returns a bare code, and saying so here is far
      // cheaper than someone sharing "AB12CD" and wondering why it is not a
      // link.
      if (!link.startsWith("http")) {
        toast.warning(
          "Copied, but this is a bare code — REFERRAL_BASE_URL is not set on the backend",
        );
        return;
      }
      toast.success("Referral link copied");
    } catch {
      toast.error("Could not copy — select it by hand");
    }
  };

  const submitCreate = async (form) => {
    try {
      const result = await createAffiliate.mutateAsync(form);
      setShowCreate(false);
      setCreated(result?.data ?? null);
      toast.success("Affiliate created");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not create the affiliate",
      );
    }
  };

  const toggleBlock = async (affiliate) => {
    const blocked = affiliate.status === "Blocked";
    try {
      if (blocked) {
        await unblockAffiliate.mutateAsync(affiliate.affiliateId);
        toast.success("Affiliate unblocked");
      } else {
        const reason = window.prompt("Reason for blocking (optional)") ?? "";
        await blockAffiliate.mutateAsync({
          affiliateId: affiliate.affiliateId,
          reason,
        });
        toast.success("Blocked — their code stops working now");
      }
    } catch {
      toast.error("Could not update the affiliate");
    }
  };

  const openSignups = (affiliate) => {
    setReferralPage(1);
    setViewing(affiliate);
  };

  return (
    // Every page supplies its own scroll container and padding; the
    // layout does not. Without this the content sits flush against the
    // sidebar and the window edge.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
        title="Affiliates"
        subtitle="People earning points for personal signups"
        actionButton={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-[#FF5B04] px-4 py-2.5 text-sm font-general font-semibold text-white"
          >
            New affiliate
          </button>
        }
      />

      <DashboardStats stats={stats} route="affiliates" />

      <div className="mt-6">
        <DataTable
          title="Affiliates"
          data={affiliates}
          columns={affiliateColumns(copyLink, copyCode)}
          actions={createAffiliateActions(openSignups, toggleBlock)}
          getRowId={(row) => row.affiliateId}
          loading={isLoading}
          showCheckbox={false}
          showSearch={false}
          // The affiliate and referral-code cells both stack two rows of
          // content, and the grid's 52px default left them pressed together.
          rowHeight={84}
        />
      </div>

      <CreateAffiliateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={submitCreate}
        isSaving={createAffiliate.isPending}
      />

      <AffiliateCreatedModal
        affiliate={created}
        onClose={() => setCreated(null)}
      />

      {viewing && (
        <AffiliateSignupsModal
          affiliate={viewing}
          referrals={referralData?.data ?? []}
          meta={referralData?.meta}
          isLoading={loadingReferrals}
          page={referralPage}
          onPageChange={setReferralPage}
          onClose={() => setViewing(null)}
        />
      )}
      </div>
    </div>
  );
};

export default Affiliates;
