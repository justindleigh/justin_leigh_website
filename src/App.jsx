import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Navbar from "./components/Navbar";
import RouteMeta from "./components/RouteMeta";
import Hero from "./components/Hero";
import PracticeAreas from "./components/PracticeAreas";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ArticlesTeaser from "./components/ArticlesTeaser";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import AlcoholBeveragePage from "./pages/AlcoholBeveragePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import EvergreenPage from "./pages/EvergreenPage";

function HomePage() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <About />
      <WhyChoose />
      <ArticlesTeaser />
      <Contact />
    </>
  );
}

// The law firm's chrome. It used to sit outside <Routes> and therefore rendered
// on every route, which would have wrapped the Evergreen trade name in the law
// firm's header, footer and theme. It is a layout route now so a page can opt
// out by being routed outside it. Nothing about these routes changed.
function FirmLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <RouteMeta />
      <Routes>
        <Route element={<FirmLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/alcohol-beverage-law" element={<AlcoholBeveragePage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Route>

        {/* Separate trade name: its own header, footer, fonts and palette. */}
        <Route path="/evergreen-legal-ai" element={<EvergreenPage />} />

        {/* /ai was the firm-branded version of this page. vercel.json 301s it,
            which covers direct hits and crawlers; this catches in-app links. */}
        <Route path="/ai" element={<Navigate to="/evergreen-legal-ai" replace />} />
      </Routes>
    </>
  );
}
