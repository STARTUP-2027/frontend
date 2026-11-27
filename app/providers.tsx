"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "../src/app/theme";
import { AuthProvider } from "../src/app/context/AuthContext";
import { CourseProvider } from "../src/app/context/CourseContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>{children}</CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
