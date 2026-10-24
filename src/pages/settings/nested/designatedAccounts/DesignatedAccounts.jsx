import { useState } from 'react';
import { Plus, Pencil, Trash2, Building2, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  useDesignatedAccountUseCases,
  useDesignatedAccounts,
  useCreateDesignatedAccount,
  useUpdateDesignatedAccount,
  useDeleteDesignatedAccount,
} from '@/store/features/settings/useDesignatedAccounts';
import { toast } from 'sonner';

const CATEGORY_COLORS = {
  POS: 'bg-blue-50 text-blue-700 border-blue-200',
  VAS: 'bg-purple-50 text-purple-700 border-purple-200',
  Transfers: 'bg-green-50 text-green-700 border-green-200',
  Billing: 'bg-amber-50 text-amber-700 border-amber-200',
  KYC: 'bg-rose-50 text-rose-700 border-rose-200',
  Settlement: 'bg-slate-50 text-slate-700 border-slate-200',
  Custom: 'bg-orange-50 text-orange-700 border-orange-200',
};

const USE_CASE_OPTIONS = [
  { value: 'pos_deployment_fee', label: 'POS Deployment Fee' },
  { value: 'pos_transaction_fee', label: 'POS Transaction Fees' },
  { value: 'bill_payments_earnings', label: 'Bill Payments & VAS Earnings' },
  { value: 'transfer_fees_earnings', label: 'Transfer Fee Charges' },
  { value: 'sms_fees_earnings', label: 'SMS Billing Fees' },
  { value: 'kyc_fees_earnings', label: 'KYC Settlement Fees' },
  { value: 'general_settlement', label: 'General Settlement Account' },
  { value: 'custom', label: 'Custom / Other' },
];

const formatBalance = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount ?? 0);

const EMPTY_FORM = {
  name: '',
  accountNumber: '',
  accountName: '',
  bankName: 'Safe Haven MFB',
  bankCode: '999240',
  useCase: '',
  customUseCaseName: '',
  description: '',
  isActive: true,
};

function AccountFormModal({ open, onClose, initial, isEdit }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const create = useCreateDesignatedAccount();
  const update = useUpdateDesignatedAccount();

  const isLoading = create.isPending || update.isPending;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.accountNumber.match(/^\d{10}$/)) e.accountNumber = 'Must be exactly 10 digits';
    if (!form.accountName.trim()) e.accountName = 'Account name is required';
    if (!form.useCase) e.useCase = 'Use case is required';
    if (form.useCase === 'custom' && !form.customUseCaseName.trim())
      e.customUseCaseName = 'Please provide a custom label';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const payload = {
      name: form.name.trim(),
      accountNumber: form.accountNumber.trim(),
      accountName: form.accountName.trim(),
      bankName: form.bankName || 'Safe Haven MFB',
      bankCode: form.bankCode || '999240',
      useCase: form.useCase,
      customUseCaseName: form.customUseCaseName?.trim() || undefined,
      description: form.description?.trim() || undefined,
      isActive: form.isActive,
    };

    if (isEdit) {
      update.mutate({ id: initial._id, ...payload }, {
        onSuccess: () => { toast.success('Designated account updated'); onClose(); },
        onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
      });
    } else {
      create.mutate(payload, {
        onSuccess: () => { toast.success('Designated account created'); onClose(); },
        onError: (err) => toast.error(err?.response?.data?.message || 'Create failed'),
      });
    }
  };

  if (!open) return null;

  const field = (id, label, required) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-[#4A5568] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EBED]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5B04]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#FF5B04]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1E1E1E]">
                {isEdit ? 'Edit Designated Account' : 'New Designated Account'}
              </h2>
              <p className="text-xs text-[#808C91] mt-0.5">
                {isEdit ? 'Update account routing details' : 'Add a new account for a specific revenue flow'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <X className="w-4 h-4 text-[#808C91]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#4A5568] mb-1">
                Label / Internal Name <span className="text-red-500">*</span>
              </label>
              <input
                id="da-name"
                className={`w-full h-10 px-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] ${errors.name ? 'border-red-400' : 'border-[#E8EBED]'}`}
                placeholder="e.g. POS Settlement – Main"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                id="da-account-number"
                maxLength={10}
                className={`w-full h-10 px-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] ${errors.accountNumber ? 'border-red-400' : 'border-[#E8EBED]'}`}
                placeholder="0119596391"
                value={form.accountNumber}
                onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))}
              />
              {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">
                Bank Name
              </label>
              <input
                id="da-bank-name"
                className="w-full h-10 px-3 text-sm border border-[#E8EBED] rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04]"
                placeholder="Safe Haven MFB"
                value={form.bankName}
                onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#4A5568] mb-1">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                id="da-account-name"
                className={`w-full h-10 px-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] ${errors.accountName ? 'border-red-400' : 'border-[#E8EBED]'}`}
                placeholder="QREVA SYSTEMS LIMITED/POS SETTLEMENT"
                value={form.accountName}
                onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
              />
              {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#4A5568] mb-1">
                Use Case <span className="text-red-500">*</span>
              </label>
              <select
                id="da-use-case"
                className={`w-full h-10 px-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] bg-white ${errors.useCase ? 'border-red-400' : 'border-[#E8EBED]'}`}
                value={form.useCase}
                onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))}
              >
                <option value="">Select use case...</option>
                {USE_CASE_OPTIONS.map(uc => (
                  <option key={uc.value} value={uc.value}>{uc.label}</option>
                ))}
              </select>
              {errors.useCase && <p className="text-xs text-red-500 mt-1">{errors.useCase}</p>}
            </div>

            {form.useCase === 'custom' && (
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#4A5568] mb-1">
                  Custom Use Case Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="da-custom-name"
                  className={`w-full h-10 px-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] ${errors.customUseCaseName ? 'border-red-400' : 'border-[#E8EBED]'}`}
                  placeholder="Describe what this account is for"
                  value={form.customUseCaseName}
                  onChange={e => setForm(f => ({ ...f, customUseCaseName: e.target.value }))}
                />
                {errors.customUseCaseName && <p className="text-xs text-red-500 mt-1">{errors.customUseCaseName}</p>}
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#4A5568] mb-1">Description</label>
              <textarea
                id="da-description"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#E8EBED] rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B04]/30 focus:border-[#FF5B04] resize-none"
                placeholder="Optional note about this account..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <button
                type="button"
                id="da-active-toggle"
                role="switch"
                aria-checked={form.isActive}
                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-[#FF5B04]' : 'bg-[#D1D5DB]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#4A5568]">Account is active</span>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-[#E8EBED] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 text-sm font-medium text-[#4A5568] bg-[#F5F5F5] rounded-lg hover:bg-[#E8EBED] transition-colors"
          >
            Cancel
          </button>
          <button
            id="da-submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="h-10 px-6 text-sm font-semibold text-white bg-[#FF5B04] rounded-lg hover:bg-[#E54F03] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, account, onClose }) {
  const del = useDeleteDesignatedAccount();
  const handleDelete = () => {
    del.mutate(account._id, {
      onSuccess: () => { toast.success('Designated account removed'); onClose(); },
      onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
    });
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-[#1E1E1E] mb-1">Remove Designated Account?</h3>
        <p className="text-sm text-[#808C91] mb-6">
          <strong>{account?.name}</strong> ({account?.accountNumber}) will be removed. Existing transactions are unaffected.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[#E8EBED] text-sm font-medium text-[#4A5568] hover:bg-[#F5F5F5]">
            Cancel
          </button>
          <button
            id="da-confirm-delete"
            disabled={del.isPending}
            onClick={handleDelete}
            className="flex-1 h-10 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {del.isPending && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

const DesignatedAccounts = () => {
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignatedAccountUseCases();
  const { data: accounts = [], isLoading: loadingAccounts } = useDesignatedAccounts();

  const [modal, setModal] = useState(null); // { type: 'create'|'edit'|'delete', account? }
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (cat) => setExpandedCategories(e => ({ ...e, [cat]: !e[cat] }));

  const categories = useCases.reduce((acc, uc) => {
    if (!acc[uc.category]) acc[uc.category] = [];
    acc[uc.category].push(uc);
    return acc;
  }, {});

  const accountsByUseCase = accounts.reduce((acc, a) => {
    if (!acc[a.useCase]) acc[a.useCase] = [];
    acc[a.useCase].push(a);
    return acc;
  }, {});

  const isLoading = loadingUseCases || loadingAccounts;

  return (
    <div className="mx-auto max-w-[1600px] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Designated Accounts</h1>
          <p className="mt-1 text-sm text-[#808C91] max-w-xl">
            Manage where different platform revenue streams are routed — POS fees, transfer charges, VAS earnings, and more.
            Accounts defined here replace hardcoded values and take effect immediately.
          </p>
        </div>
        <button
          id="da-add-btn"
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#FF5B04] text-white text-sm font-semibold hover:bg-[#E54F03] transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-[#F5F5F5] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(categories).map(([category, ucList]) => {
            const isExpanded = expandedCategories[category] !== false;
            const totalConfigured = ucList.filter(uc => uc.configuredAccount).length;
            const catColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.Custom;

            return (
              <div key={category} className="rounded-xl border border-[#E8EBED] bg-white overflow-hidden">
                {/* Category header */}
                <button
                  id={`da-cat-${category.toLowerCase()}`}
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catColor}`}>
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-[#1E1E1E]">
                      {ucList.length} use case{ucList.length !== 1 ? 's' : ''}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${totalConfigured === ucList.length ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {totalConfigured}/{ucList.length} configured
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[#808C91]" /> : <ChevronRight className="w-4 h-4 text-[#808C91]" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-[#E8EBED] divide-y divide-[#F0F0F0]">
                    {ucList.map((uc) => {
                      const linked = accountsByUseCase[uc.key] || [];
                      const active = linked.filter(a => a.isActive);

                      return (
                        <div key={uc.key} className="px-5 py-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-[#1E1E1E]">{uc.label}</span>
                                {active.length > 0 ? (
                                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                                    <CheckCircle2 className="w-3 h-3" /> Configured
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                    <AlertCircle className="w-3 h-3" /> Using default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#808C91] mt-0.5">{uc.description}</p>
                              {uc.configuredAccount && (
                                <div className="mt-2 flex items-center gap-3 text-xs text-[#4A5568]">
                                  <span className="font-mono bg-[#F5F5F5] px-2 py-0.5 rounded">
                                    {uc.configuredAccount.accountNumber}
                                  </span>
                                  <span className="truncate">{uc.configuredAccount.accountName}</span>
                                </div>
                              )}
                              {!uc.configuredAccount && uc.defaultAccountNumber && (
                                <div className="mt-2 flex items-center gap-3 text-xs text-[#808C91]">
                                  <span className="font-mono bg-[#F5F5F5] px-2 py-0.5 rounded">{uc.defaultAccountNumber}</span>
                                  <span className="truncate text-[#808C91]/70">{uc.defaultAccountName} (default)</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              {/* Active accounts for this use case */}
                              {active.map(acc => (
                                <div key={acc._id} className="flex items-center gap-2">
                                  <div className="text-right hidden md:block">
                                    <p className="text-xs font-medium text-[#1E1E1E]">{formatBalance(acc.balance)}</p>
                                    <p className="text-[10px] text-[#808C91]">available</p>
                                  </div>
                                  <button
                                    id={`da-edit-${acc._id}`}
                                    onClick={() => setModal({ type: 'edit', account: acc })}
                                    className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-[#E8EBED] flex items-center justify-center transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-[#4A5568]" />
                                  </button>
                                  <button
                                    id={`da-delete-${acc._id}`}
                                    onClick={() => setModal({ type: 'delete', account: acc })}
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              ))}
                              {active.length === 0 && (
                                <button
                                  id={`da-configure-${uc.key}`}
                                  onClick={() => setModal({
                                    type: 'create',
                                    defaults: {
                                      ...EMPTY_FORM,
                                      useCase: uc.key,
                                      name: uc.label,
                                      accountNumber: uc.defaultAccountNumber || '',
                                      accountName: uc.defaultAccountName || '',
                                      description: uc.description,
                                    }
                                  })}
                                  className="h-8 px-3 text-xs font-medium text-[#FF5B04] border border-[#FF5B04]/30 rounded-lg hover:bg-[#FF5B04]/5 transition-colors whitespace-nowrap"
                                >
                                  Configure
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <AccountFormModal
          open
          isEdit={modal.type === 'edit'}
          initial={modal.type === 'edit' ? modal.account : (modal.defaults || EMPTY_FORM)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteConfirmModal
          open
          account={modal.account}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default DesignatedAccounts;
