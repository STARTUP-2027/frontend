"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-7xl font-black text-blue-600 mb-3 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">Page Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
