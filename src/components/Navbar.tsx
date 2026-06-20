import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Twitter, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
  onProfile: () => void;
}

export default function Navbar({ onLogin, onSignup, onProfile }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on the landing page or internal pages
  const isLandingPage = location.pathname === "/";

  const isLinkActive = (path: string) => {
    if (path.includes("tab=purchased")) {
      return location.pathname.startsWith("/dashboard") && location.search.includes("tab=purchased");
    }
    if (path === "/dashboard") {
      return location.pathname.startsWith("/dashboard") && !location.search.includes("tab=purchased");
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-28 py-4 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3" 
          : (!isLandingPage ? "bg-background/40 backdrop-blur-sm py-4" : "bg-transparent")
      )}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-foreground/60 group-hover:border-foreground transition-colors">
          <div className="w-3 h-3 rounded-full border border-foreground/60 group-hover:border-foreground transition-colors" />
        </div>
        <span className="font-bold text-base tracking-tight text-foreground transition-colors">
          DIGITAL<span className="text-[#c9a96e]">FORGE</span>
        </span>
      </Link>

      {/* Nav Links - Center-left style */}
      <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium tracking-tight">
        {[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
          { name: "Contact", path: "/contact" },
          { name: "Tools", path: "/dashboard" },
          { name: "My Tools", path: "/dashboard?tab=purchased" },
        ].map((link, i) => (
          <React.Fragment key={link.name}>
            <Link
              to={link.path}
              className={cn(
                "transition-colors duration-200",
                isLinkActive(link.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
            {i < 4 && (
              <span className="text-foreground/10">•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Side: Auth & Social Icons */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        {!isLandingPage && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        )}

        {/* Auth State */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={onProfile}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => signOut()}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onSignup}
                className="text-[13px] font-bold px-5 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {[
            { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/shubhankarsahu_09/?hl=en" },
            { icon: Twitter, label: "X", href: "#" },
          ].map(({ icon: Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
            >
              <Icon size={14} />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-foreground transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border flex flex-col p-8 gap-6 lg:hidden"
          >
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Tools", path: "/dashboard" },
              { name: "My Tools", path: "/dashboard?tab=purchased" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-lg font-medium border-b border-border pb-2",
                  isLinkActive(link.path) ? "text-foreground" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => {
                    onLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-center py-3 rounded-lg border border-border text-foreground"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onSignup();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-center py-3 rounded-lg font-bold bg-foreground text-background"
                >
                  Sign Up
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}