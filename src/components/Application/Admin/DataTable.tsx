'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import type {
    ColumnFiltersState,
    SortingState,
    PaginationState,
    RowSelectionState,
} from '@tanstack/react-table';
import { IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import useDeleteMutation from '@/hooks/useDeleteMutations';
import { ButtonLoading } from '../ButtonLoading';
import { showToast } from '@/lib/showToast';
import { download, generateCsv, mkConfig } from 'export-to-csv';

// ----- types -----
export interface DataTableProps<TData extends { _id: string }> {
    queryKey: string;
    fetchUrl: string;
    columnsConfig: MRT_ColumnDef<TData>[];
    initialPageSize?: number;
    exportEndpoint: string;
    deleteEndpoint: string;
    deleteType: 'PD' | 'SD' | 'RSD';
    trashView: string;
    createAction: (
        deleteType: string,
        handleDelete: (ids: string[], deleteType: string) => void,
        row: any,
    ) => React.ReactNode;
}

// ----- component -----
const DataTable = <TData extends { _id: string }>({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction,
}: DataTableProps<TData>) => {
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [exportLoading, setExportLoading] = useState(false);

    const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);

    const handleDelete = (ids: string[], type: string) => {
        const confirmed =
            type === 'PD'
                ? confirm('Are you sure you want to delete the media permanently?')
                : confirm('Are you sure you want to move data into trash?');

        if (confirmed) {
            deleteMutation.mutate({ ids, deleteType: type });
            setRowSelection({});
        }
    };

    const handleExport = async (selectedRows: any[]) => {
        setExportLoading(true);
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'csv-data',
            });

            let csv: string;

            if (Object.keys(rowSelection).length > 0) {
                const rowData = selectedRows.map((row) => row.original);
                csv = generateCsv(csvConfig)(rowData);
            } else {
                const { data: response } = await axios.get(exportEndpoint);
                if (!response.success) {
                    throw new Error(response.message);
                }
                const rowData = response.data;
                csv = generateCsv(csvConfig)(rowData);
            }

            download(csvConfig)(csv);
        } catch (error: any) {
            console.error(error);
            showToast('error', error.message);
        } finally {
            setExportLoading(false);
        }
    };

    const {
        data: { data = [], meta } = {} as { data: TData[]; meta?: { totalRowCount: number } },
        isError,
        isRefetching,
        isLoading,
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, sorting, pagination }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
            url.searchParams.set('size', `${pagination.pageSize}`);
            url.searchParams.set('filter', JSON.stringify(columnFilters ?? []));
            url.searchParams.set('globalFilter', globalFilter ?? '');
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
            url.searchParams.set('deleteType', deleteType); // ✅ fixed

            const { data: response } = await axios.get(url.href);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    //init table
    const table = useMaterialReactTable<TData>({
        columns: columnsConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,

        enableGlobalFilter: true,
        positionGlobalFilter: 'left',

        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection,
        },

        getRowId: (originalRow) => originalRow._id,

        // ✅ Restored Actions column
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) =>
            createAction(deleteType, handleDelete, row),

        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {deleteType !== 'PD' && (
                    <Tooltip title="Recycle Bin">
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                )}

                {deleteType === 'SD' && (
                    <Tooltip title="Delete All">
                        <IconButton
                            disabled={!table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()}
                            onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {deleteType === 'PD' && (
                    <>
                        <Tooltip title="Restore Data">
                            <IconButton
                                disabled={!table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()}
                                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}
                            >
                                <RestoreFromTrashIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Permanently">
                            <IconButton
                                disabled={!table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()}
                                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </>
        ),

        renderTopToolbarCustomActions: ({ table }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* 📤 Export button */}
                <Tooltip title="Export CSV">
                    <span>
                        <ButtonLoading
                            type="button"
                            text={
                                <>
                                    <SaveAltIcon /> Export
                                </>
                            }
                            loading={exportLoading}
                            onClick={() => handleExport(table.getSelectedRowModel().rows)}
                            className="cursor-pointer"
                        />
                    </span>
                </Tooltip>
            </div>
        ),
    });

    return <MaterialReactTable table={table} />;
};

export default DataTable;
