import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult, QueryKey } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface ShVessel {
  id: number;
  name: string;
  description: string;
  capacity: number;
  priceCents: number;
  priceDisplay: string;
  pricingModel: string;
  imageUrl?: string | null;
  sortOrder: number;
}

export const getShTripVesselsUrl = (slug: string) =>
  `/api/sh/trips/${encodeURIComponent(slug)}/vessels`;

export const getShTripVessels = async (
  slug: string,
  options?: RequestInit,
): Promise<ShVessel[]> =>
  customFetch<ShVessel[]>(getShTripVesselsUrl(slug), {
    ...options,
    method: "GET",
  });

export const getShTripVesselsQueryKey = (slug: string) =>
  [`/api/sh/trips/${slug}/vessels`] as const;

export function useShTripVessels<TData = ShVessel[]>(
  slug: string | undefined,
  options?: {
    query?: UseQueryOptions<ShVessel[], unknown, TData>;
  },
): UseQueryResult<TData, unknown> & { queryKey: QueryKey } {
  const queryKey =
    options?.query?.queryKey ?? getShTripVesselsQueryKey(slug ?? "");

  const result = useQuery({
    queryKey,
    queryFn: ({ signal }) => getShTripVessels(slug!, { signal }),
    enabled: !!slug,
    ...options?.query,
  }) as UseQueryResult<TData, unknown> & { queryKey: QueryKey };

  result.queryKey = queryKey;
  return result;
}
