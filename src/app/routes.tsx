import { createBrowserRouter } from "react-router";
import LandingPage from "../App";
import { AuthPage, DetailPage, SalesPage } from "./site-pages";
import AnalyticsPage from "./products/AnalyticsPage";
import AIAutomationsPage from "./products/AIAutomationsPage";
import IntegrationsPage from "./products/IntegrationsPage";
import SecurityPage from "./products/SecurityPage";
import SalesSolutionPage from "./solutions/SalesSolutionPage";
import OperationsSolutionPage from "./solutions/OperationsSolutionPage";
import ProductEngineeringSolutionPage from "./solutions/ProductEngineeringSolutionPage";
import EnterpriseSolutionPage from "./solutions/EnterpriseSolutionPage";
import StartupsSolutionPage from "./solutions/StartupsSolutionPage";
import GrowingTeamsSolutionPage from "./solutions/GrowingTeamsSolutionPage";
import PricingPage from "./PricingPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/signin", element: <AuthPage mode="signin" /> },
  { path: "/signup", element: <AuthPage mode="signup" /> },
  { path: "/talk-to-sales", Component: SalesPage },
  { path: "/product/analytics", Component: AnalyticsPage },
  { path: "/product/ai-automations", Component: AIAutomationsPage },
  { path: "/product/integrations", Component: IntegrationsPage },
  { path: "/product/security", Component: SecurityPage },
  { path: "/product/:slug", Component: DetailPage },
  { path: "/solutions/sales", Component: SalesSolutionPage },
  { path: "/solutions/operations", Component: OperationsSolutionPage },
  { path: "/solutions/product-engineering", Component: ProductEngineeringSolutionPage },
  { path: "/solutions/enterprise", Component: EnterpriseSolutionPage },
  { path: "/solutions/startups", Component: StartupsSolutionPage },
  { path: "/solutions/growing-teams", Component: GrowingTeamsSolutionPage },
  { path: "/solutions/:slug", Component: DetailPage },
  { path: "/customers", Component: DetailPage },
  { path: "/pricing", Component: PricingPage },
  { path: "*", Component: LandingPage },
]);



