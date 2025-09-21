'use client';

import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from '@/AdminPanelRoutes';
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs';
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIENT_COLUMN, DT_REVIEWS_COLUMN } from '@/lib/column';
import { columnsConfig } from '@/lib/helperFunction';
import React, { useCallback, useMemo } from 'react';
import type { MRT_Row } from 'material-react-table';
import DeleteAction from '@/components/Application/Admin/DeleteAction';
import { useSearchParams } from 'next/navigation';

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
  { href: ADMIN_TRASH, label: 'Trash' },
];

const TRASH_CONFIG = {
  category: {
    title: 'Category Trash',
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: '/api/category',
    deleteUrl: '/api/category/delete',
    exportUrl: '/api/category/export'
  },
  product: {
    title: 'Product Trash',
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: '/api/product',
    deleteUrl: '/api/product/delete',
    exportUrl: '/api/product/export'
  },
  varient: {
    title: 'Product Varient Trash',
    columns: DT_PRODUCT_VARIENT_COLUMN,
    fetchUrl: '/api/varient',
    deleteUrl: '/api/varient/delete',
    exportUrl: '/api/varient/export'
  },
  coupon: {
    title: 'Coupon Trash',
    columns: DT_COUPON_COLUMN,
    fetchUrl: '/api/coupon',
    deleteUrl: '/api/coupon/delete',
    exportUrl: '/api/coupon/export'
  },
  customers: {
    title: 'Customers Trash',
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl: '/api/customers',
    deleteUrl: '/api/customers/delete',
    exportUrl: '/api/customers/export'
  },
    review: {
    title: 'Reviews Trash',
    columns: DT_REVIEWS_COLUMN,
    fetchUrl: '/api/review',
    deleteUrl: '/api/review/delete',
    exportUrl: '/api/review/export'
  }
}

const Trash: React.FC = () => {

  const searchParams = useSearchParams();
  const trashOf = searchParams.get('trashof');

  const config = TRASH_CONFIG[trashOf];


  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig(config.columns, false, false, true);
  }, []);

  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Category>
    ) => {
      return [
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />
      ]

    },
    []
  );

  return (
    <div>
      <BreadCrumbs breadcrumbData={breadcrumbData} />
      <Card className="rounded-lg shadow-sm ">
        <CardHeader className="px-5 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">{config.title}</h4>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Trash;
