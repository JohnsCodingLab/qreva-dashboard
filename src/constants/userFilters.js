// Filter groups for the tables backed by GET admin/dashboard/users/all -
// Users, Merchants, Agents, Aggregators and Aggregator Managers.
//
// Values are the ones actually stored on the user document
// (see the backend's user schema), not the labels the table happens to show.
// The transaction tables previously offered a 'Successful' status that was
// only ever a label and matched nothing; the same trap exists here, where the
// status cell renders colours for 'Suspended' and 'Deactivated' that are not
// storable values. Only the four real ones are offered.

export const USER_STATUS_FILTER_GROUP = {
  key: "status",
  label: "Status",
  options: [
    { label: "Active", value: "Active" },
    { label: "Pending", value: "Pending" },
    { label: "Inactive", value: "Inactive" },
    { label: "Blocked", value: "Blocked" },
  ],
};

// Only for the unscoped Users table. The Merchants/Agents/Aggregators pages
// are already pinned to a single type, so offering this there would just let
// an admin select a type that contradicts the page they are on.
export const USER_TYPE_FILTER_GROUP = {
  key: "type",
  label: "Account Type",
  options: ["Individual", "Agent", "Aggregator", "Merchant"].map((value) => ({
    label: value,
    value,
  })),
};

// Held as { from, to }; useTableControls flattens it into the two query params
// the API takes, and a date-only 'to' covers the whole of that day server-side.
export const USER_DATE_RANGE_FILTER_GROUP = {
  key: "dateRange",
  label: "Date Joined",
  type: "dateRange",
};

export const USER_FILTER_GROUPS = [
  USER_STATUS_FILTER_GROUP,
  USER_TYPE_FILTER_GROUP,
  USER_DATE_RANGE_FILTER_GROUP,
];

// For the pages already scoped to one account type.
export const SCOPED_USER_FILTER_GROUPS = [
  USER_STATUS_FILTER_GROUP,
  USER_DATE_RANGE_FILTER_GROUP,
];
