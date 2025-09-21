'use client';

import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/AdminPanelRoutes';
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs';
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper';
import EditAction from '@/components/Application/Admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_CATEGORY_COLUMN } from '@/lib/column';
import { columnsConfig } from '@/lib/helperFunction'; // ✅ client-safe helper
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import type { MRT_Row } from 'material-react-table';
import DeleteAction from '@/components/Application/Admin/DeleteAction';

// Define your Category type (adjust fields to match your API/DB)
interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
];

const ShowCategory: React.FC = () => {
  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig<Category>(DT_CATEGORY_COLUMN);
  }, []);

  // ✅ fix: use correct param typing
  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Category>
    ) => {
      const actionMenu: JSX.Element[] = [];

      actionMenu.push(
        <EditAction
          key="edit"
          href={ADMIN_CATEGORY_EDIT(row.original._id)}
        />
      );

      actionMenu.push(
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />
      );

      return actionMenu;
    },
    []
  );

  return (
    <div>
      <BreadCrumbs breadcrumbData={breadcrumbData} />
      <Card className="rounded-lg shadow-sm ">
        <CardHeader className="px-5 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">Category</h4>
            <Button className="cursor-pointer">
              <Link
                href={ADMIN_CATEGORY_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus />
                New Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategory;
