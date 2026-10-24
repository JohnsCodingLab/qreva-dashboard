import { useCallback, useMemo, useState } from 'react';

const isEmptyFilterValue = (value) => {
  if (value == null || value === '') return true;
  if (typeof value === 'object') return !value.from && !value.to;
  return false;
};

/**
 * Search, filter, sort and page state for a server-paginated DataTable,
 * flattened into the query params the transactions API expects.
 *
 * All four are applied by the server on purpose. These tables run to well over
 * a hundred pages, so sorting or filtering the ten rows already on screen would
 * look like it worked while describing the wrong dataset entirely.
 *
 * @param {object}  options
 * @param {number}  options.limit             rows per page
 * @param {string}  options.defaultSortField  column the server sorts by initially
 * @param {string}  options.defaultSortOrder  'asc' | 'desc'
 * @param {object}  options.sortFieldMap      grid column field -> API sort field,
 *                                            for columns whose displayed name
 *                                            differs from the stored one
 */
export const useTableControls = ({
  limit = 10,
  defaultSortField = 'createdAt',
  defaultSortOrder = 'desc',
  sortFieldMap = {},
} = {}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sortModel, setSortModel] = useState([{ field: defaultSortField, sort: defaultSortOrder }]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilter = useCallback((selectedFilters) => {
    setFilters(selectedFilters || {});
    setPage(1);
  }, []);

  const handleSortChange = useCallback(
    (model) => {
      // Clicking a header a third time clears the sort and hands back [], which
      // would leave the table in whatever order the server last happened to
      // return. Fall back to the default so the order is always defined.
      setSortModel(model?.length ? model : [{ field: defaultSortField, sort: defaultSortOrder }]);
      setPage(1);
    },
    [defaultSortField, defaultSortOrder],
  );

  const handlePageChange = useCallback((nextPage) => setPage(nextPage), []);

  // sortFieldMap is typically a literal at the call site, so it is read through
  // a stable key rather than depended on directly - otherwise every render
  // would rebuild params and refetch the table.
  const sortFieldMapKey = JSON.stringify(sortFieldMap);

  const params = useMemo(() => {
    const next = { page, limit };

    const trimmedSearch = search.trim();
    if (trimmedSearch) next.search = trimmedSearch;

    const [activeSort] = sortModel;
    if (activeSort?.field) {
      const map = JSON.parse(sortFieldMapKey);
      next.sortBy = map[activeSort.field] || activeSort.field;
      next.sortOrder = activeSort.sort === 'asc' ? 'asc' : 'desc';
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (isEmptyFilterValue(value)) return;
      // A date-range group holds { from, to }, which the API takes as two
      // separate params rather than as the group's own key.
      if (typeof value === 'object') {
        if (value.from) next.from = value.from;
        if (value.to) next.to = value.to;
        return;
      }
      next[key] = value;
    });

    return next;
  }, [page, limit, search, filters, sortModel, sortFieldMapKey]);

  return {
    page,
    search,
    filters,
    sortModel,
    params,
    handleSearch,
    handleFilter,
    handleSortChange,
    handlePageChange,
  };
};

export default useTableControls;
