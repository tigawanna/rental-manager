import { useDebouncedValue } from "@/hooks/use-debouncer";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useTransition, useState, useEffect } from "react";
import { SearchParamKeysForRoute, ValidRoutes } from "./router-types";

interface UseTSRSearchQueryProps<T extends ValidRoutes> {
  from: T; // Route path like "/dashboard/payments"
  query_param?: SearchParamKeysForRoute<T>; // defaults to "sq"
  default_value?: string;
  debounce_delay?: number; // defaults to 2000ms
}

/**
 * Generic search query hook for any route
 *
 * Requirements:
 * - The route must have the query param defined in validateSearch (defaults to "sq")
 * - Pass the `from` route path when using the hook
 *
 * @example
 * const { debouncedValue, isDebouncing, keyword, setKeyword } = useSearchQuery({
 *   from: "/dashboard/payments",
 *   query_param: "sq"
 * })
 */
export function useTSRSearchQuery<T extends ValidRoutes>(opts: UseTSRSearchQueryProps<T>) {
  const queryParam = opts.query_param || "sq";
  const debounceDelay = opts.debounce_delay || 2000;

  // Use the provided route context (cast to any to bypass strict type checking)
  const search = useSearch({ from: opts.from as any }) as Record<string, any>;
  const navigate = useNavigate({ from: opts.from as any });
  const [_, startTransition] = useTransition();

  // Get the query param value from search object (handles any param name)
  const paramValue = search[queryParam as keyof typeof search] as string | undefined;

  const [keyword, setKeyword] = useState(paramValue ?? opts.default_value ?? "");
  const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, debounceDelay);

  useEffect(() => {
    if (paramValue !== debouncedValue) {
      startTransition(() => {
        navigate({
          // @ts-expect-error : Dynamic query param
          search: (prev) => ({
            ...prev,
            [queryParam]: debouncedValue,
          }),
          viewTransition: false,
        });
      });
    }
  }, [debouncedValue, paramValue, queryParam, navigate, startTransition]);

  return { debouncedValue, isDebouncing, keyword, setKeyword };
}
