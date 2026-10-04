import { Routes, Route } from "react-router-dom";
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
import AIPage from "./pages/AIPage";
import AlcoholBeveragePage from "./pages/AlcoholBeveragePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";

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

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <RouteMeta />
      <Navbar />
      <main id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/alcohol-beverage-law" element={<AlcoholBeveragePage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Routes>
      </main>
      <Footer />
    </>
  );
}
