'use client';

import { ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataTable, { DataTableProps } from './DataTable';
import { useTheme } from 'next-themes';
import { darkTheme, lightTheme } from '@/lib/materialTheme';

export type DataTableWrapperProps<TData extends { _id: string }> = DataTableProps<TData>;

const DataTableWrapper = <TData extends { _id: string }>({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}: DataTableWrapperProps<TData>) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <DataTable<TData>
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  );
};

export default DataTableWrapper;
