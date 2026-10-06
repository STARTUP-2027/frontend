import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <RouterProvider router={router} />
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
