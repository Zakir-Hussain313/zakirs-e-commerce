'use client';

import {
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_EDIT,
  ADMIN_DASHBOARD,
  ADMIN_COUPON_SHOW,
  ADMIN_TRASH,
} from '@/AdminPanelRoutes';
import BreadCrumbs from '@/components/Application/Admin/BreadCrumbs';
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper';
import EditAction from '@/components/Application/Admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_COUPON_COLUMN } from '@/lib/column';
import { columnsConfig } from '@/lib/helperFunction'; // ✅ client-safe helper
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import type { MRT_Row } from 'material-react-table';
import DeleteAction from '@/components/Application/Admin/DeleteAction';

interface Coupon {
  code: string;
  minShoppingAmount : number;
  validity : Date;
  discountPercentage : number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_COUPON_SHOW, label: 'Coupon' },
];

const ShowCoupon: React.FC = () => {
  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig<Coupon>(DT_COUPON_COLUMN);
  }, []);

  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Coupon>
    ) => {
      const actionMenu: JSX.Element[] = [];

      actionMenu.push(
        <EditAction
          key="edit"
          href={ADMIN_COUPON_EDIT(row.original._id)}
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
            <h4 className="font-semibold text-xl uppercase">Coupons</h4>
            <Button className="cursor-pointer">
              <Link
                href={ADMIN_COUPON_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus />
                New Coupon
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey="coupon-data"
            fetchUrl="/api/coupon"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/coupon/export"
            deleteEndpoint="/api/coupon/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=coupon`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCoupon;
