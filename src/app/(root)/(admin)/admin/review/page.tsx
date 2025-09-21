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
import { DT_REVIEWS_COLUMN } from '@/lib/column';

interface Reviews {
  product : string;
  user : string;
  title : string,
  rating : number;
  review : string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Reviews' },
];

const ShowReviews: React.FC = () => {
  // ✅ properly typed columns
  const columns = useMemo(() => {
    return columnsConfig<Reviews>(DT_REVIEWS_COLUMN);
  }, []);

  const action = useCallback(
    (
      deleteType: string,
      handleDelete: (ids: string[], deleteType: string) => void,
      row: MRT_Row<Reviews>
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
            <h4 className="font-semibold text-xl uppercase">Reviews</h4>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <DataTableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowReviews;
