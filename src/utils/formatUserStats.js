export const formatUserStats = (totalResponse, activeResponse, label = 'Users') => {
  const total = totalResponse?.pagination?.total ?? 0;
  const active = activeResponse?.pagination?.total ?? 0;
  const suspended = Math.max(0, total - active);

  return [
    {
      label: `Total ${label}`,
      value: total.toLocaleString('en-US'),
      change: '',
      subtext: `${label} on the platform`,
    },
    {
      label: `Active ${label}`,
      value: active.toLocaleString('en-US'),
      change: '',
      subtext: `Currently active`,
    },
    {
      label: `Suspended ${label}`,
      value: suspended.toLocaleString('en-US'),
      change: '',
      subtext: `Currently suspended`,
    },
    {
      label: 'Activation Rate',
      value: total > 0 ? `${Math.round((active / total) * 100)}%` : '0%',
      change: '',
      subtext: `Active vs total ${label.toLowerCase()}`,
    },
  ];
};
