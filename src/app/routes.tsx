import { createBrowserRouter } from "react-router";
import LandingPage from "../App";
import { AuthPage } from "./site-pages";
import PricingPage from "./PricingPage";
import CoursesCatalogPage from "./courses/CoursesCatalogPage";
import StudentDashboardPage from "./dashboard/StudentDashboardPage";
import AdminCreatorHub from "./admin/AdminCreatorHub";
import CoursePlayerPage from "./learn/CoursePlayerPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/courses", Component: CoursesCatalogPage },
  { path: "/learn/:courseId", Component: CoursePlayerPage },
  { path: "/dashboard", Component: StudentDashboardPage },
  { path: "/admin", Component: AdminCreatorHub },
  { path: "/creator", Component: AdminCreatorHub },
  { path: "/pricing", Component: PricingPage },
  { path: "/signin", element: <AuthPage mode="signin" /> },
  { path: "/signup", element: <AuthPage mode="signup" /> },
  { path: "*", Component: LandingPage },
]);
