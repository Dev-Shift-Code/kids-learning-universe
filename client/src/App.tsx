import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Activity from "./pages/Activity";
import Activities from "./pages/Activities";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Levels from "./pages/Levels";
import ParentDashboard from "./pages/ParentDashboard";
import Profiles from "./pages/Profiles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/library" component={Library} />
      <Route path="/activities/:category" component={Activities} />
      <Route path="/levels/:category" component={Levels} />
      <Route path="/activity/:category" component={Activity} />
      <Route path="/parent" component={ParentDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
