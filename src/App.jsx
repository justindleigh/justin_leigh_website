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
import BookPage from "./pages/BookPage";
import AlcoholBeveragePage from "./pages/AlcoholBeveragePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import EvergreenPage from "./pages/EvergreenPage";
import SignPage from "./pages/SignPage";
import NotFound from "./pages/NotFound";

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
          <Route path="/book" element={<BookPage />} />
          <Route path="/alcohol-beverage-law" element={<AlcoholBeveragePage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />

          {/* Catch-all. Without it an unmatched path rendered an empty #root on
              a black body: a blank screen, no message, and HTTP 200. Inside the
              layout so a lost visitor keeps the nav and footer. */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Separate trade name: its own header, footer, fonts and palette. */}
        <Route path="/evergreen-legal-ai" element={<EvergreenPage />} />

        {/* Engagement agreement signing. Outside FirmLayout on purpose: someone
            reading an agreement they are about to sign should not be one click
            from the blog. The token is the credential; the page holds no table
            access of its own. */}
        <Route path="/sign/:token" element={<SignPage />} />

        {/* /ai was the firm-branded version of this page. vercel.json 301s it,
            which covers direct hits and crawlers; this catches in-app links. */}
        <Route path="/ai" element={<Navigate to="/evergreen-legal-ai" replace />} />
      </Routes>
    </>
  );
}
