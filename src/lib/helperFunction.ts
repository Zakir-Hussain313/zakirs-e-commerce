
import { NextResponse } from "next/server";
import type { JWTPayload } from "jose";
import type { MRT_ColumnDef } from "material-react-table";

/**
 * Generic API response shape
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

/**
 * Helper to return JSON API responses
 */
export const response = <T = unknown>(
  success: boolean,
  statusCode: number,
  message: string,
  data?: T
) => {
  return NextResponse.json<ApiResponse<T>>({
    success,
    statusCode,
    message,
    data,
  });
};

/**
 * Extended error type for MongoDB or generic errors
 */
export interface CustomError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

/**
 * Catch & format errors consistently
 */
export const catchError = (error: CustomError, customMessage?: string) => {
  // Handle MongoDB duplicate key error
  if (error.code === 11000 && error.keyPattern) {
    const keys = Object.keys(error.keyPattern).join(", ");
    error.message = `Duplicate fields: ${keys}. These fields must be unique.`;
  }

  if (process.env.NODE_ENV === "development") {
    return response(
      false,
      error.code || 500,
      error.message || "An error occurred",
      { error }
    );
  } else {
    return response(
      false,
      error.code || 500,
      customMessage || "Internal server error"
    );
  }
};

/**
 * Generate 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Auth check result type
 */
export interface AuthResult {
  isAuth: boolean;
  userId?: string;
  error?: unknown;
}

/**
 * Custom JWT Payload type
 */
export interface CustomJWTPayload extends JWTPayload {
  id: string;
  role: string;
}

/**
 * Column Config Helper for Material React Table
 */
export const columnsConfig = <T extends Record<string, unknown>>(
  columns: MRT_ColumnDef<T, any>[],
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
): MRT_ColumnDef<T, any>[] => {
  const newColumns = [...columns];

  if (isCreatedAt) {
    newColumns.push({
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue as string).toLocaleString(),
    });
  }

  if (isUpdatedAt) {
    newColumns.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue as string).toLocaleString(),
    });
  }

  if (isDeletedAt) {
    newColumns.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue as string).toLocaleString(),
    });
  }

  return newColumns;
};
