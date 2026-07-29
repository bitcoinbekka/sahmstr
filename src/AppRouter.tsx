import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import NewRecipe from "./pages/NewRecipe";
import Vlogs from "./pages/Vlogs";
import Circle from "./pages/Circle";
import Live from "./pages/Live";
import Tips from "./pages/Tips";
import HomeEcModule from "./pages/HomeEcModule";
import ContributeUnit from "./pages/ContributeUnit";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Guidelines from "./pages/Guidelines";
import Wardrobe from "./pages/Wardrobe";
import { NIP19Page } from "./pages/NIP19Page";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={<NewRecipe />} />
        <Route path="/vlogs" element={<Vlogs />} />
        <Route path="/circle" element={<Circle />} />
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