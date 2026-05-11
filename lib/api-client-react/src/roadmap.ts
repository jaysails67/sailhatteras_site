import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface ShDevTask {
  id: number;
  title: string;
  description: string;
  architectureNotes: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShDevTaskBody {
  title: string;
  description?: string;
  architectureNotes?: string;
  status?: string;
  priority?: string;
}

export interface UpdateShDevTaskBody {
  title?: string;
  description?: string;
  architectureNotes?: string;
  status?: string;
  priority?: string;
}

export const listShDevTasks = (): Promise<ShDevTask[]> =>
  customFetch<ShDevTask[]>("/api/sh/admin/dev-tasks");

export const createShDevTask = (body: CreateShDevTaskBody): Promise<ShDevTask> =>
  customFetch<ShDevTask>("/api/sh/admin/dev-tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const updateShDevTask = (id: number, body: UpdateShDevTaskBody): Promise<ShDevTask> =>
  customFetch<ShDevTask>(`/api/sh/admin/dev-tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export function useListShDevTasks(): UseQueryResult<ShDevTask[]> {
  return useQuery({
    queryKey: ["sh-dev-tasks"],
    queryFn: listShDevTasks,
  });
}

export function useCreateShDevTask(): UseMutationResult<ShDevTask, unknown, CreateShDevTaskBody> {
  return useMutation({ mutationFn: createShDevTask });
}

export function useUpdateShDevTask(): UseMutationResult<ShDevTask, unknown, { id: number; data: UpdateShDevTaskBody }> {
  return useMutation({ mutationFn: ({ id, data }) => updateShDevTask(id, data) });
}
