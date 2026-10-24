import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/tables/DataTable";
import DashboardStats from "@/components/base/DashboardStats";
import { CreatePromotionModal } from "@/components/modals/PromotionModals";
import { promotionColumns, createPromotionActions } from "./constants";
import {
  useCreatePromotion,
  useDeletePromotion,
  usePromotions,
  useUpdatePromotion,
  useUploadPromotionImage,
} from "@/store/features/promotions/usePromotions";

/**
 * Sponsored banners on the mobile dashboard.
 *
 * The control that matters here is Pause. A banner is the only thing in the
 * app that sends a customer to a site Qreva does not run, so taking one down
 * has to be immediate — one action, effective on the next dashboard load.
 * Delete is for tidying up afterwards.
 */
const Promotions = () => {
  const { data, isLoading } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();
  const uploadImage = useUploadPromotionImage();

  const [showCreate, setShowCreate] = useState(false);

  const promotions = useMemo(() => data?.data ?? [], [data]);

  const stats = useMemo(() => {
    const live = promotions.filter((p) => p.active).length;
    const impressions = promotions.reduce(
      (sum, p) => sum + (p.impressions ?? 0),
      0,
    );
    const clicks = promotions.reduce((sum, p) => sum + (p.clicks ?? 0), 0);
    const rate = impressions > 0 ? Math.round((clicks / impressions) * 100) : 0;
    return [
      {
        label: "Impressions",
        value: impressions.toLocaleString("en-US"),
        change: "",
        subtext: "Times a banner was shown",
      },
      {
        label: "Taps",
        value: clicks.toLocaleString("en-US"),
        change: "",
        subtext: `${rate}% of impressions`,
      },
      {
        label: "Live campaigns",
        value: live.toLocaleString("en-US"),
        change: "",
        subtext: `${promotions.length} in total`,
      },
    ];
  }, [promotions]);

  const upload = async (file) => {
    try {
      const result = await uploadImage.mutateAsync(file);
      const url = result?.data?.imageUrl;
      if (!url) throw new Error("No URL returned");
      toast.success("Artwork uploaded");
      return url;
    } catch (error) {
      // The server distinguishes a file it refused (too large, wrong format)
      // from credentials it does not have, and this used to throw all of it
      // away and blame Cloudinary's configuration every time — so an image
      // that was simply too big sent people looking at env vars.
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not upload the artwork",
      );
      return null;
    }
  };

  const submitCreate = async (form) => {
    try {
      await createPromotion.mutateAsync({
        ...form,
        priority: Number(form.priority) || 0,
        // Empty strings fail the date validation; the fields are optional and
        // "no date" means "no bound".
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      });
      setShowCreate(false);
      toast.success("Promotion created");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not create the promotion",
      );
    }
  };

  const toggleActive = async (promotion) => {
    try {
      await updatePromotion.mutateAsync({
        id: promotion._id,
        updates: { active: !promotion.active },
      });
      toast.success(
        promotion.active
          ? "Paused — it disappears on the next dashboard load"
          : "Live",
      );
    } catch {
      toast.error("Could not update the promotion");
    }
  };

  const remove = async (promotion) => {
    if (!window.confirm(`Delete "${promotion.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deletePromotion.mutateAsync(promotion._id);
      toast.success("Promotion deleted");
    } catch {
      toast.error("Could not delete the promotion");
    }
  };

  return (
    // Every page supplies its own scroll container and padding; the
    // layout does not. Without this the content sits flush against the
    // sidebar and the window edge.
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6">
        <PageHeader
        title="Promotions"
        subtitle="Sponsored banners on the mobile dashboard"
        actionButton={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-[#FF5B04] px-4 py-2.5 text-sm font-general font-semibold text-white"
          >
            New promotion
          </button>
        }
      />

      <DashboardStats stats={stats} route="promotions" />

      <div className="mt-6">
        <DataTable
          title="Campaigns"
          data={promotions}
          columns={promotionColumns}
          actions={createPromotionActions(toggleActive, remove)}
          getRowId={(row) => row._id}
          loading={isLoading}
          showCheckbox={false}
          showSearch={false}
          // 64 still crowded the two-line campaign cell beside a 40px
          // banner; matches the other tables that stack content.
          rowHeight={84}
        />
      </div>

      <CreatePromotionModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={submitCreate}
        onUpload={upload}
        isUploading={uploadImage.isPending}
        isSaving={createPromotion.isPending}
      />
      </div>
    </div>
  );
};

export default Promotions;
