"use client";

import NextLink from "next/link";
import { useRouter, useSearchParams as useNextSearchParams, useParams as useNextParams, usePathname } from "next/navigation";
import React, { ComponentProps } from "react";

export function RouterProvider({ children }: any) {
  return <>{children}</>;
}

export function createBrowserRouter(routes: any) {
  return routes;
}

export function Link({ to, href, children, className, onClick, ...props }: any) {
  const target = to || href || "#";
  return (
    <NextLink href={target} className={className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") {
        window.history.go(to);
      }
    } else {
      router.push(to);
    }
  };
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (updater: any) => {
    const current = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);
    const next = typeof updater === "function" ? updater(current) : updater;
    const query = new URLSearchParams(next).toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  // Safe fallback if searchParams is null during static export
  const safeSearchParams = searchParams || new URLSearchParams();

  return [safeSearchParams, setSearchParams] as const;
}

export function useParams<T extends Record<string, any> = Record<string, string>>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const searchParams = useNextSearchParams();
  return {
    pathname,
    search: searchParams && searchParams.toString() ? `?${searchParams.toString()}` : "",
    hash: typeof window !== "undefined" ? window.location.hash : "",
  };
}
