'use client';

import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/AdminPanelRoutes';
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs';
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { columnsConfig } from '@/lib/helperFunction';
import React, { useCallback, useMemo } from 'react';
import type { MRT_Row } from 'material-react-table';
import DeleteAction from '@/components/Application/Admin/DeleteAction';
import { DT_CUSTOMERS_COLUMN } from '@/lib/column';

interface Customers {
  name : string;
  avatar : string;
  email : string,
  phone : string;
  isEmailVerified : boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Customers' },
];

const ShowCustomers: React.FC = () => {
  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig<Customers>(DT_CUSTOMERS_COLUMN);
  }, []);

  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Customers>
    ) => {
      const actionMenu: JSX.Element[] = [];

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
            <h4 className="font-semibold text-xl uppercase">Customers</h4>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey="customers-data"
            fetchUrl="/api/customers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomers;
