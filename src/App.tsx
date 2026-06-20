import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SearchSection from "./components/SearchSection";
import MissionSection from "./components/MissionSection";
import SolutionSection from "./components/SolutionSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import AuroraAuth from "./components/AuroraAuth";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FrameWeaver from "./pages/FrameWeaver";
import { useAuth } from "./hooks/useAuth";
import ProfileModal from "./components/ProfileModal";


function LandingPage({ openLogin, openSignup }: any) {
  return (
    <main>
      <HeroSection onLogin={openLogin} onSignup={openSignup} />
      <SearchSection />
      <MissionSection />
      <SolutionSection />
      <CtaSection onAuthRequired={openLogin} />
    </main>
  );
}

function App() {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'update-password'>('signup');

  useEffect(() => {
    // Handle password recovery redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('update-password');
        setIsAuthModalOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openLogin = () => {
    setAuthView('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthView('signup');
    setIsAuthModalOpen(true);
  };

  const openProfile = () => {
    setIsProfileModalOpen(true);
  };

  if (loading) return null;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar 
          onLogin={openLogin} 
          onSignup={openSignup} 
          onProfile={openProfile}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage openLogin={openLogin} openSignup={openSignup} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/dashboard/:category" 
            element={
              user ? <Dashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/about" 
            element={<About />} 
          />
          <Route 
            path="/contact" 
            element={<Contact />} 
          />
          <Route 
            path="/tools/frameweaver" 
            element={
              user ? <FrameWeaver /> : <Navigate to="/" replace />
            } 
          />
        </Routes>

        <Footer />

        <AnimatePresence>
          {isAuthModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
            >
              <AuroraAuth 
                onClose={() => setIsAuthModalOpen(false)} 
                initialView={authView}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          user={user}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
