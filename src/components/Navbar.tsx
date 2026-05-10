import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Linkedin, Twitter, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
  onProfile: () => void;
}

export default function Navbar({ onLogin, onSignup, onProfile }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isInternalPage = location.pathname.startsWith("/dashboard") || location.search.includes("tab=");

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
          ? (isInternalPage ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-3" : "bg-black/60 backdrop-blur-md border-b border-white/5 py-3") 
          : "bg-transparent"
      )}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className={cn(
          "relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors",
          isInternalPage ? "border-black/60 group-hover:border-black" : "border-foreground/60 group-hover:border-foreground"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full border transition-colors",
            isInternalPage ? "border-black/60 group-hover:border-black" : "border-foreground/60 group-hover:border-foreground"
          )} />
        </div>
        <span className={cn(
          "font-bold text-base tracking-tight transition-colors",
          isInternalPage ? "text-black" : "text-foreground"
        )}>
          DigitalForge
        </span>
      </Link>

      {/* Nav Links - Center-left style */}
      <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium tracking-tight">
        {[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/#about" },
          { name: "Course", path: "/dashboard" },
          { name: "Purchased Course", path: "/dashboard?tab=purchased" },
        ].map((link, i) => (
          <React.Fragment key={link.name}>
            <Link
              to={link.path}
              className={cn(
                "transition-colors duration-200",
                isInternalPage ? "text-black/60 hover:text-black" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
            {i < 3 && (
              <span className={cn(
                "transition-colors",
                isInternalPage ? "text-black/10" : "text-muted-foreground/30"
              )}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Side: Auth & Social Icons */}
      <div className="flex items-center gap-4">
        {/* Auth State */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={onProfile}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  isInternalPage ? "text-black/60 hover:text-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Profile
              </button>
              <button
                onClick={() => signOut()}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  isInternalPage ? "text-black/60 hover:text-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  isInternalPage ? "text-black/60 hover:text-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Log In
              </button>
              <button
                onClick={onSignup}
                className={cn(
                  "text-[13px] font-bold px-5 py-1.5 rounded-full transition-all active:scale-95",
                  isInternalPage ? "bg-black text-white hover:bg-black/90" : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                SIGN UP
              </button>
            </>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {[
            { icon: Instagram, label: "Instagram" },
            { icon: Linkedin, label: "LinkedIn" },
            { icon: Twitter, label: "Twitter" },
          ].map(({ icon: Icon, label }) => (
            <motion.a
              key={label}
              href="#"
              aria-label={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                isInternalPage 
                  ? "bg-black/5 text-black/40 hover:bg-black/10 hover:text-black" 
                  : "liquid-glass text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={14} />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 transition-colors",
            isInternalPage ? "text-black" : "text-foreground"
          )}
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
            className={cn(
              "absolute top-full left-0 right-0 backdrop-blur-xl border-b flex flex-col p-8 gap-6 lg:hidden",
              isInternalPage 
                ? "bg-white/95 border-black/5" 
                : "bg-black/95 border-white/10"
            )}
          >
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/#about" },
              { name: "Course", path: "/dashboard" },
              { name: "Purchased Course", path: "/dashboard?tab=purchased" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-lg font-medium border-b pb-2",
                  isInternalPage ? "text-black border-black/5" : "text-foreground border-white/5"
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
                  className={cn(
                    "text-center py-3 rounded-lg border",
                    isInternalPage ? "border-black/10 text-black" : "border-white/10 text-foreground"
                  )}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onSignup();
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-center py-3 rounded-lg font-bold",
                    isInternalPage ? "bg-black text-white" : "bg-white text-black"
                  )}
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