'use client';

import {
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_EDIT,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_TRASH,
} from '@/AdminPanelRoutes';
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs';
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper';
import EditAction from '@/components/Application/Admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_PRODUCT_COLUMN } from '@/lib/column';
import { columnsConfig } from '@/lib/helperFunction'; // ✅ client-safe helper
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import type { MRT_Row } from 'material-react-table';
import DeleteAction from '@/components/Application/Admin/DeleteAction';

// Define your Product type (adjust fields to match your API/DB)
interface Product {
  _id: string;
  name: string;
  category : string;
  mrp : number;
  sellingPrice : number;
  discountPercentage : number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Product' },
];

const ShowProduct: React.FC = () => {
  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig<Product>(DT_PRODUCT_COLUMN);
  }, []);

  // ✅ fix: use correct param typing
  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Product>
    ) => {
      const actionMenu: JSX.Element[] = [];

      actionMenu.push(
        <EditAction
          key="edit"
          href={ADMIN_PRODUCT_EDIT(row.original._id)}
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
            <h4 className="font-semibold text-xl uppercase">PRODUCTS</h4>
            <Button className="cursor-pointer">
              <Link
                href={ADMIN_PRODUCT_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus />
                New Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey="product-data"
            fetchUrl="/api/product"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/product/export"
            deleteEndpoint="/api/product/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowProduct;
