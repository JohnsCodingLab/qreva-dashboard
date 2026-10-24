import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

const inputClass =
  "w-full border border-[#E8EBED] rounded-lg px-3 py-2.5 text-sm font-general outline-none focus:border-[#FF5B04]";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-general font-medium text-[#1E1E1E]">
      {label}
    </span>
    {children}
    {hint && (
      <span className="mt-1 block text-xs font-general text-[#808C91]">
        {hint}
      </span>
    )}
  </label>
);

/**
 * Creating a sponsored banner.
 *
 * The preview is the point of this form. A banner is cropped to 3.2:1 on the
 * phone, so the only reliable way to know whether the artwork survives that
 * is to see it at the shape it will actually be drawn at — before it is live
 * in front of customers.
 */
export const CreatePromotionModal = ({
  isOpen,
  onClose,
  onSubmit,
  onUpload,
  isUploading,
  isSaving,
}) => {
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    altText: "",
    targetUrl: "",
    startsAt: "",
    endsAt: "",
    priority: 0,
  });
  const fileInput = useRef(null);

  if (!isOpen) return null;

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file);
    if (url) setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E] mb-1">
          New promotion
        </h2>
        <p className="text-sm text-[#808C91] font-general mb-5">
          Shown on the mobile dashboard, below quick actions
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <Field
              label="Banner artwork"
              hint="Supply it at roughly 3.2:1 — 1280×400 or similar. Anything taller is cropped top and bottom."
            >
              <div className="rounded-lg border border-dashed border-[#E8EBED] p-4">
                {form.imageUrl ? (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={form.imageUrl}
                        alt="Banner preview"
                        className="w-full object-cover"
                        style={{ aspectRatio: "3.2 / 1" }}
                      />
                    </div>
                    <p className="text-xs font-general text-[#808C91]">
                      Cropped to the shape the app will draw.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="text-sm font-general font-semibold text-[#FF5B04]"
                    >
                      Replace image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex w-full flex-col items-center gap-2 py-6"
                  >
                    <UploadCloud size={22} className="text-[#808C91]" />
                    <span className="text-sm font-general font-medium text-[#1E1E1E]">
                      {isUploading ? "Uploading…" : "Choose an image"}
                    </span>
                  </button>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Campaign name" hint="Internal only — never shown in the app.">
              <input
                required
                value={form.name}
                onChange={setField("name")}
                placeholder="Safe Rider NG — Graduation 2026"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="Alt text"
              hint="Read aloud by screen readers, and shown if the image fails to load."
            >
              <input
                required
                value={form.altText}
                onChange={setField("altText")}
                placeholder="Safe Rider NG Graduation, 6 December 2026"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="Destination link"
              hint="Must be https. Opens outside the app, after a confirmation naming the site."
            >
              <input
                required
                type="url"
                value={form.targetUrl}
                onChange={setField("targetUrl")}
                placeholder="https://saferiderng.com/graduation"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Starts (optional)">
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={setField("startsAt")}
              className={inputClass}
            />
          </Field>
          <Field label="Ends (optional)">
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={setField("endsAt")}
              className={inputClass}
            />
          </Field>

          <Field
            label="Priority"
            hint="Higher wins when more than one campaign is live."
          >
            <input
              type="number"
              value={form.priority}
              onChange={setField("priority")}
              className={inputClass}
            />
          </Field>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E8EBED] px-5 py-2.5 text-sm font-general font-semibold text-[#1E1E1E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading || !form.imageUrl}
              className="rounded-lg bg-[#FF5B04] px-5 py-2.5 text-sm font-general font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Create promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
