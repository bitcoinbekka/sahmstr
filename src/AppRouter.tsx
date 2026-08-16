import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { StagingMode } from "./components/StagingMode";

// Index and NotFound load eagerly — Index is the landing page, NotFound is tiny.
// Every other page is code-split into its own chunk (React.lazy), so the initial
// download is small and reliable. A single 3.5 MB bundle was failing to transfer
// from the CDN mid-stream; splitting keeps each file small enough to arrive.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Recipes = lazy(() => import("./pages/Recipes"));
const NewRecipe = lazy(() => import("./pages/NewRecipe"));
const Vlogs = lazy(() => import("./pages/Vlogs"));
const Circle = lazy(() => import("./pages/Circle"));
const Pantry = lazy(() => import("./pages/Pantry"));
const Live = lazy(() => import("./pages/Live"));
const Tips = lazy(() => import("./pages/Tips"));
const HomeEcModule = lazy(() => import("./pages/HomeEcModule"));
const ContributeUnit = lazy(() => import("./pages/ContributeUnit"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const Wardrobe = lazy(() => import("./pages/Wardrobe"));
const NIP19Page = lazy(() =>
  import("./pages/NIP19Page").then((m) => ({ default: m.NIP19Page })),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <StagingMode />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={<NewRecipe />} />
        <Route path="/vlogs" element={<Vlogs />} />
        <Route path="/circle" element={<Circle />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/live" element={<Live />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/:moduleId" element={<HomeEcModule />} />
        <Route path="/contribute" element={<ContributeUnit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/guidelines" element={<Guidelines />} />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;