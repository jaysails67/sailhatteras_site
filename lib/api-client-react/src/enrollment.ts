import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface ShEnrollmentRequest {
  tripSlug: string;
  bookingDate: Date;
  passengers: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  vesselId?: number;
  vesselName?: string;
}

export interface ShEnrollmentResponse {
  bookingId: number;
  message: string;
}

export const createShEnrollment = async (
  body: ShEnrollmentRequest,
  options?: RequestInit,
): Promise<ShEnrollmentResponse> =>
  customFetch<ShEnrollmentResponse>("/api/sh/enroll", {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export function useCreateShEnrollment<TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ShEnrollmentResponse,
    TError,
    { data: ShEnrollmentRequest },
    TContext
  >,
): UseMutationResult<
  ShEnrollmentResponse,
  TError,
  { data: ShEnrollmentRequest },
  TContext
> {
  return useMutation({
    mutationFn: ({ data }) => createShEnrollment(data),
    ...options,
  });
}
