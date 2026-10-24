import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/tables/DataTable";
import BaseModal from "@/components/modals/BaseModal";
import ConfirmDialog from "@/components/modals/ConfirmDialogComponent";
import AssignRoleToUserModal from "@/components/modals/AssignRoleToUserModal";
import {
  useAdminUsers,
  useInviteAdmin,
  useResendAdminInvite,
  useUpdateAdminStatus,
} from "@/store/features/admin/useAdminUsers";
import {
  useAssignRole,
  useCreateRole,
  usePermissionGroups,
  useRoles,
  useUpdateRole,
} from "@/store/features/settings/useRbac";
import {
  ADMIN_COLUMNS,
  ADMIN_FILTER_GROUPS,
  ADMIN_LEVEL_OPTIONS,
  ADMIN_ROW_ACTIONS,
  GROUP_COLUMNS,
  GROUP_ROW_ACTIONS,
} from "./constants";
import { handleError } from "@/store/utils/handleError";
import { handleSuccess } from "@/store/utils/handleSuccess";
import { useAuth } from "@/hooks/useAuth";

const INITIAL_INVITE_FORM = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  role: "Operation",
};

const INITIAL_GROUP_FORM = {
  roleName: "",
  description: "",
  active: true,
};

const permissionGranted = (permissions, required) => {
  if (!required) return true;
  if (!Array.isArray(permissions) || !permissions.length) return false;

  const denySet = new Set(
    permissions
      .filter((item) => typeof item === "string" && item.startsWith("!"))
      .map((item) => item.slice(1)),
  );

  if (denySet.has(required)) return false;
  if (permissions.includes("*")) return true;

  return permissions.includes(required);
};

const toAdminRow = (admin) => {
  const rolePermissionName = admin?.rolePermissionName || null;
  return {
    ...admin,
    id: admin._id,
    fullName: `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
    rolePermissionName,
  };
};

const mapPermissionsToForm = (permissionGroups = [], rolePermissions = {}) => {
  const next = {};
  permissionGroups.forEach((group) => {
    (group.permissions || []).forEach((permissionCode) => {
      next[permissionCode] = Boolean(rolePermissions?.[permissionCode]);
    });
  });
  return next;
};

const buildRolePermissionsPayload = (selectedPermissions = {}) => {
  const payload = {};
  Object.entries(selectedPermissions).forEach(([key, value]) => {
    payload[key] = Boolean(value);
  });
  return payload;
};

const RBAC = () => {
  const { user } = useAuth();

  const runtimePermissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canInviteAdmin = permissionGranted(runtimePermissions, "adminUsers.invite") || user?.role === "SuperAdmin";
  const canManageAdminStatus = permissionGranted(runtimePermissions, "adminUsers.status.manage") || user?.role === "SuperAdmin";
  const canResendInvite = permissionGranted(runtimePermissions, "adminUsers.resendInvite") || user?.role === "SuperAdmin";
  const canAssignGroup = permissionGranted(runtimePermissions, "rbac.assign") || user?.role === "SuperAdmin";
  const canManageGroups = permissionGranted(runtimePermissions, "rbac.roles.manage") || user?.role === "SuperAdmin";

  const [activeTab, setActiveTab] = useState("members");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [groupPage, setGroupPage] = useState(1);
  const [groupLimit, setGroupLimit] = useState(10);
  const [groupSearch, setGroupSearch] = useState("");
  const [groupStatusFilter, setGroupStatusFilter] = useState("");

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(INITIAL_INVITE_FORM);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [resendTarget, setResendTarget] = useState(null);

  const [assignTargetAdmin, setAssignTargetAdmin] = useState(null);
  const [selectedAssignRoleId, setSelectedAssignRoleId] = useState("");

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [assignGroupToUserTarget, setAssignGroupToUserTarget] = useState(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupMode, setGroupMode] = useState("create");
  const [groupForm, setGroupForm] = useState(INITIAL_GROUP_FORM);
  const [groupPermissionsForm, setGroupPermissionsForm] = useState({});

  const { data: adminsResponse, isLoading: adminsLoading } = useAdminUsers({
    page,
    limit,
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });

  const { data: rolesResponse, isLoading: rolesLoading } = useRoles({
    page: groupPage,
    limit: groupLimit,
    search: groupSearch || undefined,
    active: groupStatusFilter || undefined,
  });
  const { data: assignableRolesResponse } = useRoles(
    { page: 1, limit: 200, active: "true" },
    { enabled: !!assignTargetAdmin },
  );

  const { data: permissionGroupsResponse, isLoading: permissionGroupsLoading } = usePermissionGroups({
    enabled: activeTab === "groups" || isGroupModalOpen,
  });

  const inviteAdminMutation = useInviteAdmin();
  const updateAdminStatusMutation = useUpdateAdminStatus();
  const resendAdminInviteMutation = useResendAdminInvite();
  const assignRoleMutation = useAssignRole();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const permissionGroups = useMemo(() => permissionGroupsResponse?.data || [], [permissionGroupsResponse]);

  const admins = useMemo(() => {
    const rows = adminsResponse?.data || [];
    return rows.map(toAdminRow);
  }, [adminsResponse]);

  const roles = useMemo(() => {
    const data = rolesResponse?.data || [];

    const detectEnabledRoleSections = (permissions = {}) => {
      const sections = [];
      permissionGroups.forEach((group) => {
        const groupPermissions = group.permissions || [];
        if (!groupPermissions.length) return;
        const allEnabled = groupPermissions.every((permissionCode) => Boolean(permissions?.[permissionCode]));
        if (allEnabled) {
          sections.push(group.label);
        }
      });
      return sections;
    };

    return data.map((role) => {
      const enabledPermissions = Object.entries(role.permissions || {})
        .filter(([, value]) => Boolean(value))
        .map(([permissionCode]) => permissionCode);
      const permissionCount = enabledPermissions.length;
      const enabledSections = detectEnabledRoleSections(role.permissions || {});
      const permissionsPreview = enabledPermissions.slice(0, 4).join(", ");

      return {
        ...role,
        id: role._id,
        permissionCount,
        roleSections: enabledSections.join(", "),
        permissionsPreview:
          enabledPermissions.length > 4
            ? `${permissionsPreview} +${enabledPermissions.length - 4} more`
            : permissionsPreview,
      };
    });
  }, [rolesResponse, permissionGroups]);
  const assignableRoles = useMemo(() => assignableRolesResponse?.data || [], [assignableRolesResponse]);

  const pagination = useMemo(() => {
    const source = adminsResponse?.pagination || {};
    return {
      page: source.page || page,
      limit: source.limit || limit,
      total: source.total || 0,
      totalPages: source.totalPages || 1,
    };
  }, [adminsResponse, page, limit]);

  const rolePagination = useMemo(() => {
    const source = rolesResponse?.pagination || {};
    return {
      page: source.page || groupPage,
      limit: source.limit || groupLimit,
      total: source.total || 0,
      totalPages: source.totalPages || 1,
    };
  }, [rolesResponse, groupPage, groupLimit]);

  const resetInviteForm = () => {
    setInviteForm(INITIAL_INVITE_FORM);
  };

  const resetGroupForm = () => {
    setGroupForm(INITIAL_GROUP_FORM);
    setGroupPermissionsForm({});
  };

  const openCreateGroupModal = () => {
    setGroupMode("create");
    resetGroupForm();

    const emptyPermissions = {};
    permissionGroups.forEach((group) => {
      (group.permissions || []).forEach((permissionCode) => {
        emptyPermissions[permissionCode] = false;
      });
    });
    setGroupPermissionsForm(emptyPermissions);
    setIsGroupModalOpen(true);
  };

  const openEditGroupModal = (group) => {
    setGroupMode("edit");
    setSelectedGroup(group);
    setGroupForm({
      roleName: group.roleName || "",
      description: group.description || "",
      active: group.active !== false,
    });
    setGroupPermissionsForm(mapPermissionsToForm(permissionGroups, group.permissions || {}));
    setIsGroupModalOpen(true);
  };

  const openViewGroupModal = (group) => {
    setGroupMode("view");
    setSelectedGroup(group);
    setGroupForm({
      roleName: group.roleName || "",
      description: group.description || "",
      active: group.active !== false,
    });
    setGroupPermissionsForm(mapPermissionsToForm(permissionGroups, group.permissions || {}));
    setIsGroupModalOpen(true);
  };

  const handleInviteInputChange = (event) => {
    const { name, value } = event.target;
    setInviteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInvite = (event) => {
    event.preventDefault();

    if (!inviteForm.firstName.trim() || !inviteForm.lastName.trim() || !inviteForm.emailAddress.trim()) {
      handleError(new Error("First name, last name, and email are required."));
      return;
    }

    inviteAdminMutation.mutate(
      {
        ...inviteForm,
        firstName: inviteForm.firstName.trim(),
        lastName: inviteForm.lastName.trim(),
        emailAddress: inviteForm.emailAddress.trim().toLowerCase(),
      },
      {
        onSuccess: (response) => {
          handleSuccess(response?.message || "Admin invite sent successfully");
          setIsInviteModalOpen(false);
          resetInviteForm();
        },
        onError: (error) => {
          handleError(error, "Failed to send admin invite.");
        },
      },
    );
  };

  const handleConfirmStatusToggle = () => {
    if (!statusTarget?._id) {
      setStatusTarget(null);
      return;
    }

    const nextStatus = statusTarget.status === "Active" ? "Inactive" : "Active";
    updateAdminStatusMutation.mutate(
      {
        adminId: statusTarget._id,
        status: nextStatus,
      },
      {
        onSuccess: (response) => {
          handleSuccess(response?.message || "Admin status updated successfully");
          setStatusTarget(null);
        },
        onError: (error) => {
          handleError(error, "Unable to update admin status.");
          setStatusTarget(null);
        },
      },
    );
  };

  const handleConfirmResendInvite = () => {
    if (!resendTarget?._id) {
      setResendTarget(null);
      return;
    }

    resendAdminInviteMutation.mutate(resendTarget._id, {
      onSuccess: (response) => {
        handleSuccess(response?.message || "Admin invite resent successfully");
        setResendTarget(null);
      },
      onError: (error) => {
        handleError(error, "Unable to resend admin invite.");
        setResendTarget(null);
      },
    });
  };

  const handleAssignGroupToAdmin = (roleId) => {
    if (!assignTargetAdmin?._id) return;

    assignRoleMutation.mutate(
      {
        userId: assignTargetAdmin._id,
        roleId,
      },
      {
        onSuccess: (response) => {
          handleSuccess(response?.message || "Permission group assigned successfully");
          setAssignTargetAdmin(null);
          setSelectedAssignRoleId("");
        },
        onError: (error) => {
          handleError(error, "Unable to assign permission group.");
        },
      },
    );
  };

  const handleAssignGroupToUserFromGroup = (userId) => {
    if (!assignGroupToUserTarget?._id) return;

    assignRoleMutation.mutate(
      {
        userId,
        roleId: assignGroupToUserTarget._id,
      },
      {
        onSuccess: (response) => {
          handleSuccess(response?.message || "Permission group assigned successfully");
          setAssignGroupToUserTarget(null);
        },
        onError: (error) => {
          handleError(error, "Unable to assign permission group.");
        },
      },
    );
  };

  const handleGroupPermissionToggle = (permissionCode, checked) => {
    setGroupPermissionsForm((prev) => ({
      ...prev,
      [permissionCode]: checked,
    }));
  };

  const handleActivatePermissionRole = (permissions = []) => {
    if (!Array.isArray(permissions) || !permissions.length) return;
    setGroupPermissionsForm((prev) => {
      const next = { ...prev };
      permissions.forEach((permissionCode) => {
        next[permissionCode] = true;
      });
      return next;
    });
  };

  const handleGroupSubmit = (event) => {
    event.preventDefault();

    if (!groupForm.roleName.trim()) {
      handleError(new Error("Group name is required."));
      return;
    }

    const payload = {
      roleName: groupForm.roleName.trim(),
      description: groupForm.description?.trim() || undefined,
      active: groupForm.active,
      permissions: buildRolePermissionsPayload(groupPermissionsForm),
    };

    if (groupMode === "create") {
      createRoleMutation.mutate(payload, {
        onSuccess: (response) => {
          handleSuccess(response?.message || "Group created successfully");
          setIsGroupModalOpen(false);
          resetGroupForm();
        },
        onError: (error) => handleError(error, "Unable to create group."),
      });
      return;
    }

    if (groupMode === "edit" && selectedGroup?._id) {
      updateRoleMutation.mutate(
        {
          rolePermissionId: selectedGroup._id,
          ...payload,
        },
        {
          onSuccess: (response) => {
            handleSuccess(response?.message || "Group updated successfully");
            setIsGroupModalOpen(false);
            resetGroupForm();
          },
          onError: (error) => handleError(error, "Unable to update group."),
        },
      );
    }
  };

  const handleMemberAction = (actionKey, row) => {
    if (!row) return;

    if (actionKey === "view") {
      setSelectedAdmin(row);
      return;
    }

    if (actionKey === "resendInvite") {
      if (!canResendInvite) {
        handleError(new Error("You do not have permission to resend invites."));
        return;
      }
      setResendTarget(row);
      return;
    }

    if (actionKey === "toggleStatus") {
      if (!canManageAdminStatus) {
        handleError(new Error("You do not have permission to suspend or activate admins."));
        return;
      }
      setStatusTarget(row);
      return;
    }

    if (actionKey === "assignGroup") {
      if (!canAssignGroup) {
        handleError(new Error("You do not have permission to assign groups."));
        return;
      }
      setAssignTargetAdmin(row);
      setSelectedAssignRoleId(row?.rolePermissionId || "");
    }
  };

  const handleGroupAction = (actionKey, row) => {
    if (!row) return;

    if (actionKey === "viewGroup") {
      openViewGroupModal(row);
      return;
    }

    if (actionKey === "editGroup") {
      if (!canManageGroups) {
        handleError(new Error("You do not have permission to edit groups."));
        return;
      }
      openEditGroupModal(row);
      return;
    }

    if (actionKey === "assignGroupToMember") {
      if (!canAssignGroup) {
        handleError(new Error("You do not have permission to assign groups."));
        return;
      }
      setAssignGroupToUserTarget(row);
    }
  };

  const memberActions = useMemo(() => {
    const actions = [
      {
        label: "View Details",
        icon: ADMIN_ROW_ACTIONS.find((item) => item.key === "view")?.icon,
        onClick: (row) => handleMemberAction("view", row),
      },
    ];

    if (canResendInvite) {
      actions.push({
        label: "Resend Invite",
        icon: ADMIN_ROW_ACTIONS.find((item) => item.key === "resendInvite")?.icon,
        onClick: (row) => handleMemberAction("resendInvite", row),
      });
    }

    if (canManageAdminStatus) {
      actions.push({
        label: "Suspend / Activate",
        icon: ADMIN_ROW_ACTIONS.find((item) => item.key === "toggleStatus")?.icon,
        onClick: (row) => handleMemberAction("toggleStatus", row),
      });
    }

    if (canAssignGroup) {
      actions.push({
        label: "Assign Group",
        icon: ADMIN_ROW_ACTIONS.find((item) => item.key === "assignGroup")?.icon,
        onClick: (row) => handleMemberAction("assignGroup", row),
      });
    }

    return actions;
  }, [canAssignGroup, canManageAdminStatus, canResendInvite]);

  const groupActions = useMemo(() => {
    const actions = [
      {
        label: "View Details",
        icon: GROUP_ROW_ACTIONS.find((item) => item.key === "viewGroup")?.icon,
        onClick: (row) => handleGroupAction("viewGroup", row),
      },
    ];

    if (canManageGroups) {
      actions.push({
        label: "Edit Group",
        icon: GROUP_ROW_ACTIONS.find((item) => item.key === "editGroup")?.icon,
        onClick: (row) => handleGroupAction("editGroup", row),
      });
    }

    if (canAssignGroup) {
      actions.push({
        label: "Assign to Member",
        icon: GROUP_ROW_ACTIONS.find((item) => item.key === "assignGroupToMember")?.icon,
        onClick: (row) => handleGroupAction("assignGroupToMember", row),
      });
    }

    return actions;
  }, [canAssignGroup, canManageGroups]);

  const handleMemberFilter = (filters = {}) => {
    setPage(1);
    setRoleFilter(filters.role || "");
    setStatusFilter(filters.status || "");
  };

  const handleGroupFilter = (filters = {}) => {
    setGroupPage(1);
    setGroupStatusFilter(filters.active || "");
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Admin Management</h1>
          <p className="text-[#808C91] mt-1">
            Manage admin members, permission groups, and assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "groups" && canManageGroups && (
            <Button
              className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
              onClick={openCreateGroupModal}
            >
              Create Group
            </Button>
          )}

          {activeTab === "members" && canInviteAdmin && (
            <Button
              className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
              onClick={() => {
                resetInviteForm();
                setIsInviteModalOpen(true);
              }}
            >
              Add Admin
            </Button>
          )}
        </div>
      </div>

      <div className="inline-flex items-center rounded-lg border border-[#E8EBED] bg-white p-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "members"
              ? "bg-[#FFF4EE] text-[#FF5B04]"
              : "text-[#667085] hover:text-[#FF5B04]"
          }`}
        >
          Members
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "groups"
              ? "bg-[#FFF4EE] text-[#FF5B04]"
              : "text-[#667085] hover:text-[#FF5B04]"
          }`}
        >
          Groups & Permissions
        </button>
      </div>

      {activeTab === "members" ? (
        <DataTable
          data={admins}
          columns={ADMIN_COLUMNS}
          title="Admin Members"
          actions={memberActions}
          showSearch
          showCheckbox={false}
          loading={adminsLoading}
          onSearch={(value) => {
            setSearch(value || "");
            setPage(1);
          }}
          onFilter={handleMemberFilter}
          filterGroups={ADMIN_FILTER_GROUPS}
          pagination={pagination}
          onPageChange={setPage}
          pageSize={limit}
          onPaginationModelChange={(model) => {
            setPage((model.page || 0) + 1);
            if (model.pageSize && model.pageSize !== limit) {
              setLimit(model.pageSize);
              setPage(1);
            }
          }}
        />
      ) : (
        <DataTable
          data={roles}
          columns={GROUP_COLUMNS}
          title="Permission Groups"
          actions={groupActions}
          showSearch
          showCheckbox={false}
          loading={rolesLoading}
          onSearch={(value) => {
            setGroupSearch(value || "");
            setGroupPage(1);
          }}
          onFilter={handleGroupFilter}
          filterGroups={[
            {
              key: "active",
              label: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ],
            },
          ]}
          pagination={rolePagination}
          onPageChange={setGroupPage}
          pageSize={groupLimit}
          onPaginationModelChange={(model) => {
            setGroupPage((model.page || 0) + 1);
            if (model.pageSize && model.pageSize !== groupLimit) {
              setGroupLimit(model.pageSize);
              setGroupPage(1);
            }
          }}
        />
      )}

      <BaseModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Add Admin"
        maxWidth="max-w-xl"
      >
        <form className="space-y-4" onSubmit={handleSubmitInvite}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">First Name</span>
              <input
                type="text"
                name="firstName"
                value={inviteForm.firstName}
                onChange={handleInviteInputChange}
                className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF]"
                placeholder="First name"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Last Name</span>
              <input
                type="text"
                name="lastName"
                value={inviteForm.lastName}
                onChange={handleInviteInputChange}
                className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF]"
                placeholder="Last name"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#344054]">Email Address</span>
            <input
              type="email"
              name="emailAddress"
              value={inviteForm.emailAddress}
              onChange={handleInviteInputChange}
              className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF]"
              placeholder="admin@qreva.com"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#344054]">Admin Level</span>
            <select
              name="role"
              value={inviteForm.role}
              onChange={handleInviteInputChange}
              className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF]"
            >
              {ADMIN_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
              disabled={inviteAdminMutation.isPending}
            >
              {inviteAdminMutation.isPending ? "Sending Invite..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </BaseModal>

      <BaseModal
        isOpen={!!selectedAdmin}
        onClose={() => setSelectedAdmin(null)}
        title="Admin Details"
        maxWidth="max-w-lg"
      >
        {selectedAdmin && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[#667085]">Name</p>
                <p className="font-semibold text-[#1D2939]">{selectedAdmin.fullName}</p>
              </div>
              <div>
                <p className="text-[#667085]">Admin Level</p>
                <p className="font-semibold text-[#1D2939]">{selectedAdmin.role}</p>
              </div>
              <div>
                <p className="text-[#667085]">Permission Group</p>
                <p className="font-semibold text-[#1D2939]">{selectedAdmin.rolePermissionName || "Default Group"}</p>
              </div>
              <div>
                <p className="text-[#667085]">Invite Status</p>
                <p className="font-semibold text-[#1D2939]">{selectedAdmin.inviteStatus || "-"}</p>
              </div>
              <div>
                <p className="text-[#667085]">Account Status</p>
                <p className="font-semibold text-[#1D2939]">{selectedAdmin.status || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-[#667085]">Email Address</p>
              <p className="font-semibold text-[#1D2939]">{selectedAdmin.emailAddress || "-"}</p>
            </div>
          </div>
        )}
      </BaseModal>

      <BaseModal
        isOpen={!!assignTargetAdmin}
        onClose={() => {
          setAssignTargetAdmin(null);
          setSelectedAssignRoleId("");
        }}
        title="Assign Permission Group"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-[#F8FAFC] border border-[#E4E7EC] p-3 text-sm">
            <p className="text-[#667085]">Admin</p>
            <p className="font-semibold text-[#1D2939]">
              {assignTargetAdmin?.fullName || "-"}
            </p>
            <p className="text-xs text-[#667085]">{assignTargetAdmin?.emailAddress || "-"}</p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#344054]">Permission Group</span>
            <select
              className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF]"
              value={selectedAssignRoleId}
              onChange={(event) => setSelectedAssignRoleId(event.target.value)}
            >
              <option value="">Select group...</option>
              {assignableRoles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end">
            <Button
              className="bg-[#FF5B04] hover:bg-[#E54F03] text-white mr-2"
              disabled={!selectedAssignRoleId || assignRoleMutation.isPending}
              onClick={() => handleAssignGroupToAdmin(selectedAssignRoleId)}
            >
              {assignRoleMutation.isPending ? "Assigning..." : "Assign Group"}
            </Button>
            <Button
              variant="outline"
              className="border-[#E4E7EC]"
              onClick={() => {
                setAssignTargetAdmin(null);
                setSelectedAssignRoleId("");
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title={groupMode === "create" ? "Create Group" : groupMode === "edit" ? "Edit Group" : "View Group"}
        maxWidth="max-w-3xl"
      >
        <form className="space-y-5" onSubmit={handleGroupSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Group Name</span>
              <input
                type="text"
                value={groupForm.roleName}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, roleName: event.target.value }))}
                readOnly={groupMode === "view"}
                className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF] read-only:bg-[#F8FAFC]"
                placeholder="e.g. Compliance"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Status</span>
              <select
                value={groupForm.active ? "active" : "inactive"}
                disabled={groupMode === "view"}
                onChange={(event) =>
                  setGroupForm((prev) => ({
                    ...prev,
                    active: event.target.value === "active",
                  }))
                }
                className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF] disabled:bg-[#F8FAFC]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#344054]">Description</span>
            <input
              type="text"
              value={groupForm.description}
              onChange={(event) => setGroupForm((prev) => ({ ...prev, description: event.target.value }))}
              readOnly={groupMode === "view"}
              className="border border-[#D0D5DD] rounded-md px-3 py-2 text-sm outline-none focus:border-[#84C4CF] read-only:bg-[#F8FAFC]"
              placeholder="What this group can do"
            />
          </label>

          <div className="border border-[#E4E7EC] rounded-lg p-4 space-y-3 max-h-[380px] overflow-auto">
            <h3 className="text-sm font-semibold text-[#1D2939]">Permissions</h3>

            {permissionGroupsLoading ? (
              <p className="text-sm text-[#667085]">Loading permissions...</p>
            ) : (
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.key} className="border border-[#F0F2F5] rounded-lg p-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                          {group.label}
                        </p>
                        <p className="text-xs text-[#98A2B3]">
                          Role permissions: {(group.permissions || []).length}
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-xs text-[#344054]">
                        <input
                          type="radio"
                          name={`activate-role-${group.key}`}
                          checked={(group.permissions || []).every((permissionCode) => Boolean(groupPermissionsForm[permissionCode]))}
                          disabled={groupMode === "view"}
                          onChange={() => handleActivatePermissionRole(group.permissions || [])}
                        />
                        <span>Activate this role (select all)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(group.permissions || []).map((permissionCode) => (
                        <label key={permissionCode} className="inline-flex items-center gap-2 text-sm text-[#344054]">
                          <input
                            type="checkbox"
                            checked={Boolean(groupPermissionsForm[permissionCode])}
                            disabled={groupMode === "view"}
                            onChange={(event) =>
                              handleGroupPermissionToggle(permissionCode, event.target.checked)
                            }
                            className="h-4 w-4 rounded border-[#D0D5DD]"
                          />
                          <span>{permissionCode}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#E4E7EC]"
              onClick={() => setIsGroupModalOpen(false)}
            >
              {groupMode === "view" ? "Close" : "Cancel"}
            </Button>

            {groupMode !== "view" && (
              <Button
                type="submit"
                className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
                disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
              >
                {createRoleMutation.isPending || updateRoleMutation.isPending
                  ? "Saving..."
                  : groupMode === "create"
                    ? "Create Group"
                    : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </BaseModal>

      <AssignRoleToUserModal
        isOpen={!!assignGroupToUserTarget}
        onClose={() => setAssignGroupToUserTarget(null)}
        role={assignGroupToUserTarget}
        isSubmitting={assignRoleMutation.isPending}
        onAssign={handleAssignGroupToUserFromGroup}
      />

      <ConfirmDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={`${statusTarget?.status === "Active" ? "Suspend" : "Activate"} Admin`}
        message={`Are you sure you want to ${statusTarget?.status === "Active" ? "suspend" : "activate"} ${statusTarget?.fullName || "this admin"}?`}
        confirmText={
          updateAdminStatusMutation.isPending
            ? "Processing..."
            : statusTarget?.status === "Active"
              ? "Suspend"
              : "Activate"
        }
        confirmStyle={statusTarget?.status === "Active" ? "danger" : "primary"}
      />

      <ConfirmDialog
        isOpen={!!resendTarget}
        onClose={() => setResendTarget(null)}
        onConfirm={handleConfirmResendInvite}
        title="Resend Invite"
        message={`Resend admin invite to ${resendTarget?.emailAddress || "this user"}?`}
        confirmText={resendAdminInviteMutation.isPending ? "Sending..." : "Resend Invite"}
        confirmStyle="primary"
      />
    </div>
  );
};

export default RBAC;

