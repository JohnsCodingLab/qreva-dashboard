import React, { useMemo, useState } from 'react';
import DataTable from "@/components/tables/DataTable";
import { ACTIVITY_LOGS_COLUMNS } from './constants';
import { useActivityLogs } from '@/store/features/settings/useActivityLogs';

const splitCamelCase = (str) =>
    str ? String(str).replace(/([A-Z])/g, ' $1').trim() : '-';

const makeOptions = (items) =>
    [...new Set(items.filter(Boolean))]
        .sort((a, b) => splitCamelCase(a).localeCompare(splitCamelCase(b)))
        .map((value) => ({ label: splitCamelCase(value), value }));

const ActivityLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const queryParams = useMemo(
        () => ({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            search: searchQuery || undefined,
            actor: filters.actor || undefined,
            actorRole: filters.actorRole || undefined,
            action: filters.action || undefined,
            resource: filters.resource || undefined,
            ipAddress: filters.ipAddress || undefined,
            deviceType: filters.deviceType || undefined,
            browser: filters.browser || undefined,
            os: filters.os || undefined,
        }),
        [filters, paginationModel.page, paginationModel.pageSize, searchQuery],
    );
    const { data: logsResponse, isLoading } = useActivityLogs(queryParams);

    const logs = logsResponse?.data || [];
    const pagination = logsResponse?.pagination || { page: 1, limit: paginationModel.pageSize, total: 0 };

    const filterGroups = useMemo(() => {
        const actorOptions = (() => {
            const map = new Map();
            logs.forEach((log) => {
                const value = log.actorAdminId || log.actorId || log.actorEmail;
                if (!value) return;
                const label = log.actorName || log.user || log.actorEmail || value;
                if (!map.has(value)) map.set(value, label);
            });
            return [...map.entries()]
                .sort((a, b) => String(a[1]).localeCompare(String(b[1])))
                .map(([value, label]) => ({ label, value }));
        })();

        return [
            { key: 'actor', label: 'Actor', options: actorOptions },
            { key: 'actorRole', label: 'Role', options: makeOptions(logs.map((log) => log.actorRole)) },
            { key: 'resource', label: 'Resource', options: makeOptions(logs.map((log) => log.resource)) },
            { key: 'action', label: 'Action', options: makeOptions(logs.map((log) => log.action)) },
            { key: 'deviceType', label: 'Device', options: makeOptions(logs.map((log) => log.deviceType)) },
            { key: 'browser', label: 'Browser', options: makeOptions(logs.map((log) => log.browser)) },
            { key: 'os', label: 'OS', options: makeOptions(logs.map((log) => log.os)) },
            { key: 'ipAddress', label: 'IP Address', options: makeOptions(logs.map((log) => log.ipAddress)) },
        ].filter((group) => group.type === 'dateRange' || group.options.length > 0);
    }, [logs]);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1E1E1E]">Activity Logs</h1>
                <p className="text-[#808C91] mt-1">View all the full activity logs on the platform</p>
            </div>

            <DataTable
                data={logs}
                columns={ACTIVITY_LOGS_COLUMNS}
                title="Activity Logs"
                showSearch={true}
                onSearch={setSearchQuery}
                onFilter={setFilters}
                filterGroups={filterGroups}
                showCheckbox={false}
                paginationMode="server"
                rowCount={pagination.total || 0}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 76}
                loading={isLoading}
            />
        </div>
    );
};

export default ActivityLogs;

